const bcrypt = require("bcrypt");
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

module.exports = {
  register
};