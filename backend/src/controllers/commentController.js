const mongoose = require("mongoose");
const Comment = require("../models/Comment");
const Post = require("../models/Post");
const User = require("../models/User");
const Alarm = require("../models/Alarm");

// 게시글 접근 권한 확인 함수
const checkPostAccess = (post, user) => {
  if (post.board_type === "major" && post.target_major !== user.major) {
    return false;
  }

  return true;
};

const COMMENT_ALARM_BODY = "작성하신 게시글에 새로운 댓글이 달렸습니다.";

const createCommentAlarm = async (post, comment, commentWriterId) => {
  if (!post || !comment || !commentWriterId) return;

  const postWriterId = post.user_id?.toString();
  const writerId = commentWriterId.toString();

  // 본인 게시글에 본인이 댓글을 작성한 경우에는 알림을 보내지 않음
  if (!postWriterId || postWriterId === writerId) return;

  // 알림은 학생 유저에게만 생성
  const targetUser = await User.findOne({
    _id: post.user_id,
    $or: [{ role: "student" }, { role: { $exists: false } }],
  })
    .select("_id")
    .lean();

  if (!targetUser) return;

  await Alarm.updateOne(
    {
      user_id: targetUser._id,
      alarm_type: "comment",
      comment_id: comment._id,
    },
    {
      $setOnInsert: {
        user_id: targetUser._id,
        alarm_type: "comment",
        notice_id: null,
        comment_id: comment._id,
        post_id: post._id,
        alarm_body: COMMENT_ALARM_BODY,
        created_at: new Date(),
      },
    },
    { upsert: true }
  );
};

// 댓글 작성
const createComment = async (req, res) => {
  try {
    const { postId } = req.params;
    const { content } = req.body;

    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({
        success: false,
        message: "유효하지 않은 게시글 ID입니다.",
      });
    }

    if (!content) {
      return res.status(400).json({
        success: false,
        message: "댓글 내용을 입력해주세요.",
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
        message: "해당 게시글에 댓글을 작성할 권한이 없습니다.",
      });
    }

    const comment = await Comment.create({
      post_id: postId,
      user_id: req.user.user_id,
      content,
    });

    post.comment_count += 1;
    await post.save();

    await createCommentAlarm(post, comment, req.user.user_id);

    const populatedComment = await Comment.findById(comment._id).populate(
      "user_id",
      "nickname major grade"
    );

    return res.status(201).json({
      success: true,
      message: "댓글이 성공적으로 작성되었습니다.",
      data: populatedComment,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "댓글 작성 중 오류가 발생했습니다.",
      error: error.message,
    });
  }
};

// 댓글 목록 조회
const getCommentsByPost = async (req, res) => {
  try {
    const { postId } = req.params;

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
        message: "해당 게시글의 댓글을 조회할 권한이 없습니다.",
      });
    }

    const comments = await Comment.find({ post_id: postId })
      .populate("user_id", "nickname major grade")
      .sort({ created_at: 1 });

    return res.status(200).json({
      success: true,
      message: "댓글 목록 조회 성공",
      count: comments.length,
      data: comments,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "댓글 목록 조회 중 오류가 발생했습니다.",
      error: error.message,
    });
  }
};

// 내가 작성한 댓글 조회
const getMyComments = async (req, res) => {
  try {
    const userId = req.user.user_id;

    const comments = await Comment.find({ user_id: userId })
      .populate("user_id", "nickname major grade")
      .populate({
        path: "post_id",
        match: {
          $or: [
            { board_type: "free" },
            { board_type: "major", target_major: req.user.major },
          ],
        },
        populate: {
          path: "user_id",
          select: "nickname major grade",
        },
      })
      .sort({ created_at: -1 });

    const filteredComments = comments
      .filter((comment) => comment.post_id)
      .map((comment) => ({
        ...comment.toObject(),
        is_mine: true,
      }));

    return res.status(200).json({
      success: true,
      message: "내가 작성한 댓글 목록 조회 성공",
      count: filteredComments.length,
      data: filteredComments,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "내가 작성한 댓글 조회 중 오류가 발생했습니다.",
      error: error.message,
    });
  }
};


// 댓글 수정
const updateComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { content } = req.body;

    if (!mongoose.Types.ObjectId.isValid(commentId)) {
      return res.status(400).json({
        success: false,
        message: "유효하지 않은 댓글 ID입니다.",
      });
    }

    if (!content) {
      return res.status(400).json({
        success: false,
        message: "수정할 댓글 내용을 입력해주세요.",
      });
    }

    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "댓글을 찾을 수 없습니다.",
      });
    }

    if (comment.user_id.toString() !== req.user.user_id.toString()) {
      return res.status(403).json({
        success: false,
        message: "본인이 작성한 댓글만 수정할 수 있습니다.",
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
        message: "해당 댓글을 수정할 권한이 없습니다.",
      });
    }

    comment.content = content;
    await comment.save();

    const updatedComment = await Comment.findById(commentId).populate(
      "user_id",
      "nickname major grade"
    );

    return res.status(200).json({
      success: true,
      message: "댓글이 성공적으로 수정되었습니다.",
      data: updatedComment,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "댓글 수정 중 오류가 발생했습니다.",
      error: error.message,
    });
  }
};

// 댓글 삭제
const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;

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

    if (comment.user_id.toString() !== req.user.user_id.toString()) {
      return res.status(403).json({
        success: false,
        message: "본인이 작성한 댓글만 삭제할 수 있습니다.",
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
        message: "해당 댓글을 삭제할 권한이 없습니다.",
      });
    }

    await Comment.findByIdAndDelete(commentId);

    if (post.comment_count > 0) {
      post.comment_count -= 1;
      await post.save();
    }

    return res.status(200).json({
      success: true,
      message: "댓글이 성공적으로 삭제되었습니다.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "댓글 삭제 중 오류가 발생했습니다.",
      error: error.message,
    });
  }
};

module.exports = {
  createComment,
  getCommentsByPost,
  getMyComments,
  updateComment,
  deleteComment,
};
