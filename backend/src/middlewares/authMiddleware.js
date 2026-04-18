const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "인증 토큰이 없습니다."
      });
    }

    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authorization 형식이 올바르지 않습니다."
      });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.user_id).select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "유효하지 않은 사용자입니다."
      });
    }

    req.user = {
      user_id: user._id,
      email: user.email,
      nickname: user.nickname,
      grade: user.grade,
      major: user.major,
      student_number: user.student_number,
      role: user.role
    };

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "토큰이 유효하지 않습니다.",
      error: error.message
    });
  }
};

module.exports = authMiddleware;