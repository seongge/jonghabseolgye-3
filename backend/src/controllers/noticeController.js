const {
  syncNoticesToDB,
  syncSchoolNoticesToDB,
  syncSchoolCategoryToDB,
  syncDepartmentNoticesToDB,
  syncSingleDepartmentToDB,
  getNotices,
  getSyncTargets,
} = require("../services/noticeService");

function sendSuccess(res, message, data) {
  res.status(200).json({
    success: true,
    message,
    data,
  });
}

function sendError(res, message, error) {
  res.status(500).json({
    success: false,
    message,
    error: error.message,
  });
}

async function syncNotices(req, res) {
  try {
    const result = await syncNoticesToDB();
    sendSuccess(res, "전체 공지 크롤링 및 DB 저장이 완료되었습니다.", result);
  } catch (error) {
    sendError(res, "전체 공지 크롤링 및 DB 저장 중 오류가 발생했습니다.", error);
  }
}

async function syncSchoolNotices(req, res) {
  try {
    const { category } = req.query;
    const result = category
      ? await syncSchoolCategoryToDB(category)
      : await syncSchoolNoticesToDB();

    const message = category
      ? "학교 카테고리별 공지 크롤링 및 DB 저장이 완료되었습니다."
      : "학교 공지 크롤링 및 DB 저장이 완료되었습니다.";

    sendSuccess(res, message, result);
  } catch (error) {
    sendError(res, "학교 공지 크롤링 및 DB 저장 중 오류가 발생했습니다.", error);
  }
}

async function syncSchoolCategory(req, res) {
  try {
    const result = await syncSchoolCategoryToDB(req.params.categoryKey);
    sendSuccess(res, "학교 카테고리별 공지 크롤링 및 DB 저장이 완료되었습니다.", result);
  } catch (error) {
    sendError(res, "학교 카테고리별 공지 크롤링 및 DB 저장 중 오류가 발생했습니다.", error);
  }
}

async function syncDepartmentNotices(req, res) {
  try {
    const { department } = req.query;
    const result = department
      ? await syncSingleDepartmentToDB(department)
      : await syncDepartmentNoticesToDB();

    const message = department
      ? "특정 학과 공지 크롤링 및 DB 저장이 완료되었습니다."
      : "학과 공지 크롤링 및 DB 저장이 완료되었습니다.";

    sendSuccess(res, message, result);
  } catch (error) {
    sendError(res, "학과 공지 크롤링 및 DB 저장 중 오류가 발생했습니다.", error);
  }
}

async function syncSingleDepartment(req, res) {
  try {
    const result = await syncSingleDepartmentToDB(req.params.departmentKey);
    sendSuccess(res, "특정 학과 공지 크롤링 및 DB 저장이 완료되었습니다.", result);
  } catch (error) {
    sendError(res, "특정 학과 공지 크롤링 및 DB 저장 중 오류가 발생했습니다.", error);
  }
}

async function listNotices(req, res) {
  try {
    const result = await getNotices(req.query);
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    sendError(res, "공지 조회 중 오류가 발생했습니다.", error);
  }
}

function listSyncTargets(req, res) {
  res.status(200).json({
    success: true,
    data: getSyncTargets(),
  });
}

module.exports = {
  syncNotices,
  syncSchoolNotices,
  syncSchoolCategory,
  syncDepartmentNotices,
  syncSingleDepartment,
  listNotices,
  listSyncTargets,
};
