const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const register = async (req, res) => {
  try {
    const { email, password, nickname, grade, major, student_number } = req.body;

    if (!email || !password || !nickname || !grade || !major || !student_number) {
      return res.status(400).json({
        success: false,
        message: "모든 필드를 입력해주세요."
      });
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(409).json({
        success: false,
        message: "이미 사용 중인 이메일입니다."
      });
    }

    const existingStudentNumber = await User.findOne({ student_number });
    if (existingStudentNumber) {
      return res.status(409).json({
        success: false,
        message: "이미 등록된 학번입니다."
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      email,
      password: hashedPassword,
      nickname,
      grade,
      major,
      student_number
    });

    return res.status(201).json({
      success: true,
      message: "회원가입이 완료되었습니다.",
      data: {
        id: user._id,
        email: user.email,
        nickname: user.nickname,
        grade: user.grade,
        major: user.major,
        student_number: user.student_number,
        role: user.role
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "회원가입 중 오류가 발생했습니다.",
      error: error.message
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "이메일과 비밀번호를 입력해주세요."
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "이메일 또는 비밀번호가 올바르지 않습니다."
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "이메일 또는 비밀번호가 올바르지 않습니다."
      });
    }

    const token = jwt.sign(
      {
        user_id: user._id,
        email: user.email,
        nickname: user.nickname,
        role: user.role,
        major: user.major,
        grade: user.grade
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.status(200).json({
      success: true,
      message: "로그인 성공",
      token,
      data: {
        id: user._id,
        email: user.email,
        nickname: user.nickname,
        grade: user.grade,
        major: user.major,
        student_number: user.student_number,
        role: user.role
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "로그인 중 오류가 발생했습니다.",
      error: error.message
    });
  }
};

const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.user_id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "사용자를 찾을 수 없습니다."
      });
    }

    return res.status(200).json({
      success: true,
      message: "내 정보 조회 성공",
      data: user
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "내 정보 조회 중 오류가 발생했습니다.",
      error: error.message
    });
  }
};

module.exports = {
  register,
  login,
  getMe
};