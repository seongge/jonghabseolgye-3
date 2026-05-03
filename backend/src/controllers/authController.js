const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const { OAuth2Client } = require("google-auth-library");
const User = require("../models/User");

// 스키마를 수정하지 않기 위해 인증번호는 DB가 아니라 서버 메모리에 임시 저장합니다.
// 서버를 재시작하면 발급된 인증번호는 초기화됩니다.
const registerVerificationStore = new Map();
const VERIFICATION_EXPIRES_MS = 5 * 60 * 1000;
const RESEND_COOLDOWN_MS = 60 * 1000;
const MAX_VERIFY_ATTEMPTS = 5;

const normalizeEmail = (email) => String(email || "").trim().toLowerCase();

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const createToken = (user) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET 환경변수가 설정되어 있지 않습니다.");
  }

  return jwt.sign(
    {
      user_id: user._id,
      email: user.email,
      nickname: user.nickname,
      role: user.role,
      major: user.major,
      grade: user.grade,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
};

const createMailTransporter = () => {
  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = process.env.SMTP_PORT;
  const smtpUser = process.env.SMTP_USER || process.env.EMAIL_USER;
  const smtpPass = process.env.SMTP_PASS || process.env.EMAIL_APP_PASSWORD || process.env.EMAIL_PASS;

  if (smtpHost && smtpPort && smtpUser && smtpPass) {
    return nodemailer.createTransport({
      host: smtpHost,
      port: Number(smtpPort),
      secure: Number(smtpPort) === 465,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });
  }

  if (smtpUser && smtpPass) {
    return nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });
  }

  throw new Error("이메일 발송 환경변수가 설정되어 있지 않습니다.");
};

const sendVerificationMail = async (email, code) => {
  const transporter = createMailTransporter();
  const fromEmail = process.env.EMAIL_FROM || process.env.EMAIL_USER || process.env.SMTP_USER;

  await transporter.sendMail({
    from: fromEmail,
    to: email,
    subject: "[종합설계] 회원가입 이메일 인증번호",
    text: `회원가입 인증번호는 ${code} 입니다. 인증번호는 5분 후 만료됩니다.`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>회원가입 이메일 인증번호</h2>
        <p>아래 인증번호를 회원가입 화면에 입력해주세요.</p>
        <div style="font-size: 28px; font-weight: bold; letter-spacing: 4px; margin: 16px 0;">
          ${code}
        </div>
        <p>인증번호는 5분 후 만료됩니다.</p>
      </div>
    `,
  });
};

const sendRegisterVerificationCode = async (req, res) => {
  try {
    const email = normalizeEmail(req.body.email);

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "이메일을 입력해주세요.",
      });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "이메일 형식이 올바르지 않습니다.",
      });
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(409).json({
        success: false,
        message: "이미 사용 중인 이메일입니다.",
      });
    }

    const previousVerification = registerVerificationStore.get(email);
    if (previousVerification && Date.now() - previousVerification.createdAt < RESEND_COOLDOWN_MS) {
      return res.status(429).json({
        success: false,
        message: "인증번호는 1분 후 다시 요청할 수 있습니다.",
      });
    }

    const code = crypto.randomInt(100000, 1000000).toString();
    const codeHash = await bcrypt.hash(code, 10);

    await sendVerificationMail(email, code);

    registerVerificationStore.set(email, {
      codeHash,
      expiresAt: Date.now() + VERIFICATION_EXPIRES_MS,
      createdAt: Date.now(),
      attempts: 0,
    });

    return res.status(200).json({
      success: true,
      message: "인증번호가 이메일로 전송되었습니다. 5분 안에 입력해주세요.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "인증번호 발송 중 오류가 발생했습니다.",
      error: error.message,
    });
  }
};

const verifyRegisterCode = async (email, code) => {
  const verification = registerVerificationStore.get(email);

  if (!verification) {
    return {
      success: false,
      status: 400,
      message: "인증번호를 먼저 요청해주세요.",
    };
  }

  if (Date.now() > verification.expiresAt) {
    registerVerificationStore.delete(email);
    return {
      success: false,
      status: 400,
      message: "인증번호가 만료되었습니다. 다시 요청해주세요.",
    };
  }

  if (verification.attempts >= MAX_VERIFY_ATTEMPTS) {
    registerVerificationStore.delete(email);
    return {
      success: false,
      status: 429,
      message: "인증번호 입력 횟수를 초과했습니다. 다시 요청해주세요.",
    };
  }

  const isCodeMatch = await bcrypt.compare(String(code || "").trim(), verification.codeHash);

  if (!isCodeMatch) {
    verification.attempts += 1;
    registerVerificationStore.set(email, verification);

    return {
      success: false,
      status: 400,
      message: "인증번호가 올바르지 않습니다.",
    };
  }

  return {
    success: true,
  };
};

const register = async (req, res) => {
  try {
    const email = normalizeEmail(req.body.email);
    const { password, nickname, grade, major, student_number } = req.body;
    const verificationCode = req.body.verificationCode || req.body.code;

    if (!email || !password || !nickname || !grade || !major || !student_number || !verificationCode) {
      return res.status(400).json({
        success: false,
        message: "모든 필드와 이메일 인증번호를 입력해주세요.",
      });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "이메일 형식이 올바르지 않습니다.",
      });
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(409).json({
        success: false,
        message: "이미 사용 중인 이메일입니다.",
      });
    }

    const existingStudentNumber = await User.findOne({ student_number });
    if (existingStudentNumber) {
      return res.status(409).json({
        success: false,
        message: "이미 등록된 학번입니다.",
      });
    }

    const verificationResult = await verifyRegisterCode(email, verificationCode);
    if (!verificationResult.success) {
      return res.status(verificationResult.status).json({
        success: false,
        message: verificationResult.message,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      email,
      password: hashedPassword,
      nickname,
      grade,
      major,
      student_number,
    });

    registerVerificationStore.delete(email);

    return res.status(201).json({
      success: true,
      message: "이메일 인증이 완료되어 회원가입이 완료되었습니다.",
      data: {
        id: user._id,
        email: user.email,
        nickname: user.nickname,
        grade: user.grade,
        major: user.major,
        student_number: user.student_number,
        role: user.role,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "회원가입 중 오류가 발생했습니다.",
      error: error.message,
    });
  }
};

const login = async (req, res) => {
  try {
    const email = normalizeEmail(req.body.email);
    const { password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "이메일과 비밀번호를 입력해주세요.",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "이메일 또는 비밀번호가 올바르지 않습니다.",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "이메일 또는 비밀번호가 올바르지 않습니다.",
      });
    }

    const token = createToken(user);

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
        role: user.role,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "로그인 중 오류가 발생했습니다.",
      error: error.message,
    });
  }
};

const googleLogin = async (req, res) => {
  try {
    const idToken = req.body.idToken || req.body.credential;

    if (!idToken) {
      return res.status(400).json({
        success: false,
        message: "Google ID 토큰이 필요합니다.",
      });
    }

    if (!process.env.GOOGLE_CLIENT_ID) {
      return res.status(500).json({
        success: false,
        message: "GOOGLE_CLIENT_ID 환경변수가 설정되어 있지 않습니다.",
      });
    }

    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const email = normalizeEmail(payload?.email);
    const emailVerified = payload?.email_verified;

    if (!email || !emailVerified) {
      return res.status(401).json({
        success: false,
        message: "인증되지 않은 Google 이메일입니다.",
      });
    }

    // 스키마를 수정하지 않기 위해 Google 신규 회원가입은 만들지 않고,
    // 기존 회원가입된 이메일과 Google 이메일이 일치하는 경우에만 로그인 처리합니다.
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "해당 Google 이메일로 가입된 계정이 없습니다. 먼저 일반 회원가입을 진행해주세요.",
      });
    }

    const token = createToken(user);

    return res.status(200).json({
      success: true,
      message: "Google 로그인 성공",
      token,
      data: {
        id: user._id,
        email: user.email,
        nickname: user.nickname,
        grade: user.grade,
        major: user.major,
        student_number: user.student_number,
        role: user.role,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Google 로그인 중 오류가 발생했습니다.",
      error: error.message,
    });
  }
};

const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.user_id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "사용자를 찾을 수 없습니다.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "내 정보 조회 성공",
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "내 정보 조회 중 오류가 발생했습니다.",
      error: error.message,
    });
  }
};

module.exports = {
  register,
  login,
  googleLogin,
  sendRegisterVerificationCode,
  getMe,
};
