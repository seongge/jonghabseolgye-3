const mongoose = require("mongoose");
const Notice = require("../models/Notice");

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

module.exports = {
  getSchoolNotices,
  getDepartmentNotices,
  getNoticeById,
};