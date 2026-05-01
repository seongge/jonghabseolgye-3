const express = require("express");
const {
  syncNotices,
  syncSchoolNotices,
  syncSchoolCategory,
  syncDepartmentNotices,
  syncSingleDepartment,
  listNotices,
  listSyncTargets,
} = require("../controllers/noticeController");

const router = express.Router();

router.get("/", listNotices);
router.get("/sync-targets", listSyncTargets);

// 전체 크롤링 API 유지: 학교 공지 + 모든 학과 공지
router.post("/sync", syncNotices);

// 학교 공지 단독/카테고리별 크롤링
// POST /api/notices/sync/school
// POST /api/notices/sync/school?category=일반
router.post("/sync/school", syncSchoolNotices);
router.post("/sync/school/:categoryKey", syncSchoolCategory);

// 학과 공지 단독/학과별 크롤링
// POST /api/notices/sync/department
// POST /api/notices/sync/department?department=컴퓨터공학과
router.post("/sync/department", syncDepartmentNotices);
router.post("/sync/departments", syncDepartmentNotices);
router.post("/sync/departments/:departmentKey", syncSingleDepartment);

module.exports = router;
