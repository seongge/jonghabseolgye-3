const mongoose = require("mongoose");
const Notice = require("../models/Notice");
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

// 학교 공지 목록 조회
const getSchoolNotices = async (req, res) => {
  try {
    const { category, keyword, page = 1, limit = 20 } = req.query;

    const filter = {
      notice_scope: "school",
    };

    if (category) {
      filter.category = category;
    }

    if (keyword) {
      filter.$or = [
        { title: { $regex: keyword, $options: "i" } },
        { content: { $regex: keyword, $options: "i" } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);

    const notices = await Notice.find(filter)
      .sort({ published_at: -1 })
      .skip(skip)
      .limit(Number(limit));

    return res.status(200).json({
      success: true,
      message: "학교 공지 목록 조회 성공",
      page: Number(page),
      limit: Number(limit),
      count: notices.length,
      data: notices,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "학교 공지 목록 조회 중 오류가 발생했습니다.",
      error: error.message,
    });
  }
};

// 내 학과 공지 목록 조회
const getDepartmentNotices = async (req, res) => {
  try {
    const { category, keyword, page = 1, limit = 20 } = req.query;

    if (!req.user.major) {
      return res.status(400).json({
        success: false,
        message: "사용자 전공 정보가 없습니다.",
      });
    }

    const filter = {
      notice_scope: "department",
      department: req.user.major,
    };

    if (category) {
      filter.category = category;
    }

    if (keyword) {
      filter.$or = [
        { title: { $regex: keyword, $options: "i" } },
        { content: { $regex: keyword, $options: "i" } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);

    const notices = await Notice.find(filter)
      .sort({ published_at: -1 })
      .skip(skip)
      .limit(Number(limit));

    return res.status(200).json({
      success: true,
      message: "학과 공지 목록 조회 성공",
      department: req.user.major,
      page: Number(page),
      limit: Number(limit),
      count: notices.length,
      data: notices,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "학과 공지 목록 조회 중 오류가 발생했습니다.",
      error: error.message,
    });
  }
};

// 공지 상세 조회
const getNoticeById = async (req, res) => {
  try {
    const { noticeId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(noticeId)) {
      return res.status(400).json({
        success: false,
        message: "유효하지 않은 공지 ID입니다.",
      });
    }

    const notice = await Notice.findById(noticeId);

    if (!notice) {
      return res.status(404).json({
        success: false,
        message: "공지를 찾을 수 없습니다.",
      });
    }

    if (
      notice.notice_scope === "department" &&
      notice.department !== req.user.major
    ) {
      return res.status(403).json({
        success: false,
        message: "해당 학과 공지를 조회할 권한이 없습니다.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "공지 상세 조회 성공",
      data: notice,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "공지 상세 조회 중 오류가 발생했습니다.",
      error: error.message,
    });
  }
};

// 검색/필터 기반 전체 공지 조회
const listNotices = async (req, res) => {
  try {
    const result = await getNotices(req.query);
    return res.status(200).json({
      success: true,
      message: "공지 목록 조회 성공",
      data: result,
    });
  } catch (error) {
    return sendError(res, "공지 조회 중 오류가 발생했습니다.", error);
  }
};

// 전체 크롤링: 학교 공지 + 모든 학과 공지
const syncNotices = async (req, res) => {
  try {
    const result = await syncNoticesToDB();
    return sendSuccess(res, "전체 공지 크롤링 및 DB 저장이 완료되었습니다.", result);
  } catch (error) {
    return sendError(res, "전체 공지 크롤링 및 DB 저장 중 오류가 발생했습니다.", error);
  }
};

const syncSchoolNotices = async (req, res) => {
  try {
    const { category } = req.query;
    const result = category
      ? await syncSchoolCategoryToDB(category)
      : await syncSchoolNoticesToDB();

    const message = category
      ? "학교 카테고리별 공지 크롤링 및 DB 저장이 완료되었습니다."
      : "학교 공지 크롤링 및 DB 저장이 완료되었습니다.";

    return sendSuccess(res, message, result);
  } catch (error) {
    return sendError(res, "학교 공지 크롤링 및 DB 저장 중 오류가 발생했습니다.", error);
  }
};

const syncSchoolCategory = async (req, res) => {
  try {
    const result = await syncSchoolCategoryToDB(req.params.categoryKey);
    return sendSuccess(res, "학교 카테고리별 공지 크롤링 및 DB 저장이 완료되었습니다.", result);
  } catch (error) {
    return sendError(res, "학교 카테고리별 공지 크롤링 및 DB 저장 중 오류가 발생했습니다.", error);
  }
};

const syncDepartmentNotices = async (req, res) => {
  try {
    const { department } = req.query;
    const result = department
      ? await syncSingleDepartmentToDB(department)
      : await syncDepartmentNoticesToDB();

    const message = department
      ? "특정 학과 공지 크롤링 및 DB 저장이 완료되었습니다."
      : "학과 공지 크롤링 및 DB 저장이 완료되었습니다.";

    return sendSuccess(res, message, result);
  } catch (error) {
    return sendError(res, "학과 공지 크롤링 및 DB 저장 중 오류가 발생했습니다.", error);
  }
};

const syncSingleDepartment = async (req, res) => {
  try {
    const result = await syncSingleDepartmentToDB(req.params.departmentKey);
    return sendSuccess(res, "특정 학과 공지 크롤링 및 DB 저장이 완료되었습니다.", result);
  } catch (error) {
    return sendError(res, "특정 학과 공지 크롤링 및 DB 저장 중 오류가 발생했습니다.", error);
  }
};

const listSyncTargets = (req, res) => {
  return res.status(200).json({
    success: true,
    data: getSyncTargets(),
  });
};

module.exports = {
  getSchoolNotices,
  getDepartmentNotices,
  getNoticeById,
  listNotices,
  syncNotices,
  syncSchoolNotices,
  syncSchoolCategory,
  syncDepartmentNotices,
  syncSingleDepartment,
  listSyncTargets,
};
