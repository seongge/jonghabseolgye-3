const mongoose = require("mongoose");
const Post = require("../models/Post");
const PostLike = require("../models/PostLike");

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


// 내가 작성한 게시글 조회
const getMyPosts = async (req, res) => {
  try {
    const userId = req.user.user_id;

    const posts = await Post.find({ user_id: userId })
      .populate("user_id", "nickname major grade")
      .sort({ created_at: -1 });

    return res.status(200).json({
      success: true,
      message: "내가 작성한 게시글 목록 조회 성공",
      count: posts.length,
      data: posts.map((post) => ({
        ...post.toObject(),
        is_mine: true,
      })),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "내가 작성한 게시글 조회 중 오류가 발생했습니다.",
      error: error.message,
    });
  }
};

// 내가 좋아요 표시한 게시글 조회
const getLikedPosts = async (req, res) => {
  try {
    const userId = req.user.user_id;

    const likedItems = await PostLike.find({ user_id: userId })
      .populate({
        path: "post_id",
        match: {
          $or: [
            { board_type: "free" },
            { board_type: "major", target_major: req.user.major }
          ]
        },
        populate: {
          path: "user_id",
          select: "nickname major grade"
        }
      })
      .sort({ created_at: -1 });

    const posts = likedItems
      .filter((item) => item.post_id)
      .map((item) => {
        const post = item.post_id.toObject();
        return {
          ...post,
          is_liked: true,
          liked_at: item.created_at
        };
      });

    return res.status(200).json({
      success: true,
      message: "좋아요 표시한 게시글 목록 조회 성공",
      count: posts.length,
      data: posts
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "좋아요 표시한 게시글 조회 중 오류가 발생했습니다.",
      error: error.message
    });
  }
};

// 게시글 상세 조회
const getPostById = async (req, res) => {
  try {
    const { postId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({
        success: false,
        message: "유효하지 않은 게시글 ID입니다."
      });
    }

    const post = await Post.findById(postId).populate(
      "user_id",
      "nickname major grade"
    );

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "게시글을 찾을 수 없습니다."
      });
    }

    // 전공 게시판 글은 같은 전공 사용자만 조회 가능
    if (post.board_type === "major" && post.target_major !== req.user.major) {
      return res.status(403).json({
        success: false,
        message: "해당 전공 게시판 글을 조회할 권한이 없습니다."
      });
    }

    return res.status(200).json({
      success: true,
      message: "게시글 상세 조회 성공",
      data: post
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "게시글 상세 조회 중 오류가 발생했습니다.",
      error: error.message
    });
  }
};

// 게시글 수정
const updatePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { title, content, grade_filter } = req.body;

    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({
        success: false,
        message: "유효하지 않은 게시글 ID입니다."
      });
    }

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "게시글을 찾을 수 없습니다."
      });
    }

    // 작성자 본인만 수정 가능
    if (post.user_id.toString() !== req.user.user_id.toString()) {
      return res.status(403).json({
        success: false,
        message: "본인이 작성한 게시글만 수정할 수 있습니다."
      });
    }

    if (title !== undefined) {
      post.title = title;
    }

    if (content !== undefined) {
      post.content = content;
    }

    if (grade_filter !== undefined) {
      if (!Array.isArray(grade_filter) || grade_filter.length === 0) {
        return res.status(400).json({
          success: false,
          message: "grade_filter는 비어 있지 않은 배열이어야 합니다."
        });
      }

      post.grade_filter = grade_filter;
    }

    await post.save();

    const updatedPost = await Post.findById(postId).populate(
      "user_id",
      "nickname major grade"
    );

    return res.status(200).json({
      success: true,
      message: "게시글이 성공적으로 수정되었습니다.",
      data: updatedPost
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "게시글 수정 중 오류가 발생했습니다.",
      error: error.message
    });
  }
};

// 게시글 삭제
const deletePost = async (req, res) => {
  try {
    const { postId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({
        success: false,
        message: "유효하지 않은 게시글 ID입니다."
      });
    }

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "게시글을 찾을 수 없습니다."
      });
    }

    // 작성자 본인만 삭제 가능
    if (post.user_id.toString() !== req.user.user_id.toString()) {
      return res.status(403).json({
        success: false,
        message: "본인이 작성한 게시글만 삭제할 수 있습니다."
      });
    }

    await Post.findByIdAndDelete(postId);

    return res.status(200).json({
      success: true,
      message: "게시글이 성공적으로 삭제되었습니다."
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "게시글 삭제 중 오류가 발생했습니다.",
      error: error.message
    });
  }
};

module.exports = {
  createPost,
  getPosts,
  getMyPosts,
  getLikedPosts,
  getPostById,
  updatePost,
  deletePost
};