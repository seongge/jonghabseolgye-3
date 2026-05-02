const Notice = require("../models/Notice");
const { createNoticeAlarms } = require("./alarmService");
const {
  crawlAllNotices,
  crawlSchoolNotices,
  crawlSchoolCategory,
  crawlDepartmentNotices,
  crawlAllDepartmentNotices,
  SCHOOL_CATEGORY_CONFIGS,
  DEPARTMENT_CONFIGS,
} = require("../crawlers/noticeCrawler");

async function upsertNotice(notice) {
  if (!notice || !notice.source_url || !notice.content) {
    return { status: "skipped", notice: null };
  }

  const existing = await Notice.findOne({ source_url: notice.source_url }).lean();

  if (existing) {
    await Notice.updateOne(
      { source_url: notice.source_url },
      {
        $set: {
          notice_scope: notice.notice_scope,
          department: notice.department,
          category: notice.category,
          title: notice.title,
          content: notice.content,
          source_site: notice.source_site,
          published_at: notice.published_at,
          updated_at: new Date(),
        },
      }
    );

    return { status: "updated", notice: existing };
  }

  const createdNotice = await Notice.create(notice);
  return { status: "created", notice: createdNotice };
}

async function saveNoticesToDB(notices = []) {
  let createdCount = 0;
  let updatedCount = 0;
  let skippedCount = 0;
  let alarmTargetUserCount = 0;
  let alarmCreatedCount = 0;

  for (const notice of notices) {
    const { status, notice: savedNotice } = await upsertNotice(notice);

    if (status === "created") {
      createdCount += 1;

      const alarmResult = await createNoticeAlarms(savedNotice);
      alarmTargetUserCount += alarmResult.targetUserCount;
      alarmCreatedCount += alarmResult.createdAlarmCount;
    }

    if (status === "updated") updatedCount += 1;
    if (status === "skipped") skippedCount += 1;
  }

  return {
    skippedCount,
    createdCount,
    updatedCount,
    alarmTargetUserCount,
    alarmCreatedCount,
    totalCrawled: notices.length,
  };
}

async function syncNoticesToDB() {
  const crawled = await crawlAllNotices();
  const saved = await saveNoticesToDB(crawled.allNotices);

  return {
    ...saved,
    schoolTotalCount: crawled.schoolNotices.length,
    schoolCategoryCounts: crawled.schoolCategoryCounts,
    departmentTotalCount: crawled.departmentNotices.length,
    departmentCounts: crawled.departmentCounts,
    departmentErrors: crawled.departmentErrors,
    computerDeptCount: crawled.computerDeptNotices.length,
  };
}

async function syncSchoolNoticesToDB() {
  const crawled = await crawlSchoolNotices();
  const saved = await saveNoticesToDB(crawled.notices);

  return {
    ...saved,
    schoolTotalCount: crawled.notices.length,
    schoolCategoryCounts: crawled.categoryCounts,
  };
}

async function syncSchoolCategoryToDB(categoryKeyOrName) {
  const crawled = await crawlSchoolCategory(categoryKeyOrName);
  const saved = await saveNoticesToDB(crawled.notices);

  return {
    ...saved,
    key: crawled.key,
    category: crawled.category,
    schoolCategoryCount: crawled.notices.length,
  };
}

async function syncDepartmentNoticesToDB() {
  const crawled = await crawlAllDepartmentNotices();
  const saved = await saveNoticesToDB(crawled.notices);

  return {
    ...saved,
    departmentTotalCount: crawled.notices.length,
    departmentCounts: crawled.departmentCounts,
    departmentErrors: crawled.errors,
  };
}

async function syncSingleDepartmentToDB(departmentKeyOrName) {
  const crawled = await crawlDepartmentNotices(departmentKeyOrName);
  const saved = await saveNoticesToDB(crawled.notices);

  return {
    ...saved,
    key: crawled.key,
    department: crawled.department,
    departmentCount: crawled.notices.length,
  };
}

function buildNoticeFilter(query = {}) {
  const filter = {};

  if (query.notice_scope) filter.notice_scope = query.notice_scope;
  if (query.department) filter.department = query.department;
  if (query.category) filter.category = query.category;

  if (query.source) {
    const source = String(query.source).trim();
    if (["school", "학교"].includes(source)) {
      filter.notice_scope = "school";
    } else if (["department", "학과"].includes(source)) {
      filter.notice_scope = "department";
    } else {
      filter.department = source;
    }
  }

  if (query.keyword) {
    const keyword = String(query.keyword).trim();
    if (keyword) {
      const regex = new RegExp(keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
      filter.$or = [{ title: regex }, { content: regex }];
    }
  }

  return filter;
}

function buildSortOption(sort = "latest") {
  if (sort === "oldest") return { published_at: 1, updated_at: 1 };
  return { published_at: -1, updated_at: -1 };
}

async function getNotices(query = {}) {
  const filter = buildNoticeFilter(query);

  const page = Math.max(Number(query.page) || 1, 1);
  const limit = Math.min(Math.max(Number(query.limit) || 20, 1), 100);
  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    Notice.find(filter)
      .sort(buildSortOption(query.sort))
      .skip(skip)
      .limit(limit)
      .lean(),
    Notice.countDocuments(filter),
  ]);

  return {
    page,
    limit,
    total,
    items,
  };
}

function getSyncTargets() {
  return {
    schoolCategories: SCHOOL_CATEGORY_CONFIGS.map(({ key, category }) => ({ key, category })),
    departments: DEPARTMENT_CONFIGS.map(({ key, department, homepageUrl }) => ({ key, department, homepageUrl })),
  };
}

module.exports = {
  syncNoticesToDB,
  syncSchoolNoticesToDB,
  syncSchoolCategoryToDB,
  syncDepartmentNoticesToDB,
  syncSingleDepartmentToDB,
  getNotices,
  getSyncTargets,
};
