const mongoose = require("mongoose");
const Post = require("../models/Post");
const Comment = require("../models/Comment");
const PostLike = require("../models/PostLike");
const CommentLike = require("../models/CommentLike");

const checkPostAccess = (post, user) => {
  if (post.board_type === "major" && post.target_major !== user.major) {
    return false;
  }

  return true;
};

// 게시글 좋아요 토글
const togglePostLike = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user.user_id;

    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({
        success: false,
        message: "유효하지 않은 게시글 ID입니다.",
      });
    }

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "게시글을 찾을 수 없습니다.",
      });
    }

    if (!checkPostAccess(post, req.user)) {
      return res.status(403).json({
        success: false,
        message: "해당 게시글에 좋아요를 누를 권한이 없습니다.",
      });
    }

    const existingLike = await PostLike.findOne({
      post_id: postId,
      user_id: userId,
    });

    if (existingLike) {
      await PostLike.findByIdAndDelete(existingLike._id);

      if (post.like_count > 0) {
        post.like_count -= 1;
      }

      await post.save();

      return res.status(200).json({
        success: true,
        message: "게시글 좋아요가 취소되었습니다.",
        liked: false,
        like_count: post.like_count,
      });
    }

    await PostLike.create({
      post_id: postId,
      user_id: userId,
    });

    post.like_count += 1;
    await post.save();

    return res.status(201).json({
      success: true,
      message: "게시글 좋아요가 추가되었습니다.",
      liked: true,
      like_count: post.like_count,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "게시글 좋아요 처리 중 오류가 발생했습니다.",
      error: error.message,
    });
  }
};

// 댓글 좋아요 토글
const toggleCommentLike = async (req, res) => {
  try {
    const { commentId } = req.params;
    const userId = req.user.user_id;

    if (!mongoose.Types.ObjectId.isValid(commentId)) {
      return res.status(400).json({
        success: false,
        message: "유효하지 않은 댓글 ID입니다.",
      });
    }

    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "댓글을 찾을 수 없습니다.",
      });
    }

    const post = await Post.findById(comment.post_id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "댓글이 작성된 게시글을 찾을 수 없습니다.",
      });
    }

    if (!checkPostAccess(post, req.user)) {
      return res.status(403).json({
        success: false,
        message: "해당 댓글에 좋아요를 누를 권한이 없습니다.",
      });
    }

    const existingLike = await CommentLike.findOne({
      comment_id: commentId,
      user_id: userId,
    });

    if (existingLike) {
      await CommentLike.findByIdAndDelete(existingLike._id);

      if (comment.like_count > 0) {
        comment.like_count -= 1;
      }

      await comment.save();

      return res.status(200).json({
        success: true,
        message: "댓글 좋아요가 취소되었습니다.",
        liked: false,
        like_count: comment.like_count,
      });
    }

    await CommentLike.create({
      comment_id: commentId,
      user_id: userId,
    });

    comment.like_count += 1;
    await comment.save();

    return res.status(201).json({
      success: true,
      message: "댓글 좋아요가 추가되었습니다.",
      liked: true,
      like_count: comment.like_count,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "댓글 좋아요 처리 중 오류가 발생했습니다.",
      error: error.message,
    });
  }
};

module.exports = {
  togglePostLike,
  toggleCommentLike,
};