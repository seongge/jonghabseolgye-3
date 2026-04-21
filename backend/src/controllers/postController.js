const Post = require("../models/Post");

// 게시글 작성
const createPost = async (req, res) => {
  try {
    const { board_type, title, content, grade_filter } = req.body;

    if (!board_type || !title || !content) {
      return res.status(400).json({
        success: false,
        message: "board_type, title, content는 필수입니다."
      });
    }

    if (!["free", "major"].includes(board_type)) {
      return res.status(400).json({
        success: false,
        message: "board_type은 free 또는 major만 가능합니다."
      });
    }

    let target_major = null;

    if (board_type === "major") {
      target_major = req.user.major;

      if (!target_major) {
        return res.status(400).json({
          success: false,
          message: "전공 정보가 없는 사용자는 전공 게시판 글을 작성할 수 없습니다."
        });
      }
    }

    const newPost = await Post.create({
      board_type,
      target_major,
      grade_filter:
        Array.isArray(grade_filter) && grade_filter.length > 0
          ? grade_filter
          : [1, 2, 3, 4],
      title,
      content,
      user_id: req.user.user_id
    });

    return res.status(201).json({
      success: true,
      message: "게시글이 성공적으로 작성되었습니다.",
      data: newPost
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "게시글 작성 중 오류가 발생했습니다.",
      error: error.message
    });
  }
};

// 게시글 목록 조회
const getPosts = async (req, res) => {
  try {
    const { board_type, grade } = req.query;

    if (!board_type) {
      return res.status(400).json({
        success: false,
        message: "board_type 쿼리 파라미터가 필요합니다."
      });
    }

    if (!["free", "major"].includes(board_type)) {
      return res.status(400).json({
        success: false,
        message: "board_type은 free 또는 major만 가능합니다."
      });
    }

    const filter = { board_type };

    if (board_type === "major") {
      filter.target_major = req.user.major;
    }

    if (grade) {
      filter.grade_filter = Number(grade);
    }

    const posts = await Post.find(filter)
      .populate("user_id", "nickname major grade")
      .sort({ created_at: -1 });

    return res.status(200).json({
      success: true,
      message: "게시글 목록 조회 성공",
      count: posts.length,
      data: posts
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "게시글 목록 조회 중 오류가 발생했습니다.",
      error: error.message
    });
  }
};

module.exports = {
  createPost,
  getPosts
};