import bcrypt from "bcrypt"; 

import { signAccessToken, signRefreshToken, verifyToken } from "../utils/jwt.js";
import { randomId } from "../libs/secureRandom.js";
import Account from "../model/account.js";
import TutorProfile from "../model/tutor.js";
import StudentProfile from "../model/students.js";
import refreshtoken from "../model/refreshtoken.js";

const { REFRESH_EXPIRES, COOKIE_DOMAIN, NODE_ENV } = process.env;

function setRefreshCookie(res, token) {
  const maxAgeMs =
    (REFRESH_EXPIRES?.endsWith("d") ? parseInt(REFRESH_EXPIRES) : 30) *
    24 * 60 * 60 * 1000;
  res.cookie("rt", token, {
    httpOnly: true,
    secure: NODE_ENV === "production",
    sameSite: "lax",
    domain: COOKIE_DOMAIN || undefined,
    path: "/", // ← Sửa thành "/" để có thể gửi đến tất cả routes
    maxAge: maxAgeMs
  });
}

function clearRefreshCookie(res) {
  res.clearCookie("rt", {
    httpOnly: true,
    secure: NODE_ENV === "production",
    sameSite: "lax",
    domain: COOKIE_DOMAIN || undefined,
    path: "/" // ← Sửa thành "/"
  });
}

const authController = {
  // ─────────────────────────────────────────────
  async csrfMethod(req, res) {
    const token = randomId();
    res.cookie("csrf", token, {
      httpOnly: false,
      secure: NODE_ENV === "production",
      sameSite: "lax",
      domain: COOKIE_DOMAIN || undefined,
      path: "/",
      maxAge: 24 * 60 * 60 * 1000
    });
    return res.json({ csrfToken: token });
  },

  // ─────────────────────────────────────────────
 async signupMethod(req, res) {
  try {
    const { email, password, role } = req.body || {};
    
    // Validate input
    if (!email || !password || !role) {
      return res.status(400).json({ message: "Email, password and role are required" });
    }
    
    if (!["TUTOR", "STUDENT"].includes(role)) {
      return res.status(400).json({ message: "Role must be TUTOR or STUDENT" });
    }

    // Check if email already exists
    const exists = await Account.findOne({ email });
    if (exists) {
      return res.status(409).json({ message: "Email already exists" });
    }

    // Hash password and create account
    const hash = await bcrypt.hash(password, 12);
    const user = await Account.create({ 
      email: email.toLowerCase().trim(), 
      password: hash, 
      role 
    });

    // Create profile based on role
    if (role === "TUTOR") {
      await TutorProfile.create({ 
        accountId: user._id, 
        fullName: "", 
        subjectSpecialty: [] 
      });
    } else {
      await StudentProfile.create({ 
        accountId: user._id, 
        fullName: "" 
      });
    }

    return res.status(201).json({ 
      message: "Account created successfully",
      user: { id: user._id, email: user.email, role: user.role }
    });
  } catch (error) {
    console.error("Signup error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
},

  // ─────────────────────────────────────────────
  async loginMethod(req, res) {
    const { email, password } = req.body || {};
    if (!email || !password)
      return res.status(400).json({ message: "Missing credentials" });

    const user = await Account.findOne({ email, isActive: true });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });

    const payload = { sub: String(user._id), email: user.email, role: user.role };
    const accessToken = signAccessToken(payload);

    const jti = randomId();
    const refreshToken = signRefreshToken({ ...payload, jti });
    const rtHash = await bcrypt.hash(refreshToken, 12);
    const { exp } = verifyToken(refreshToken);
    await refreshtoken.create({
      userId: user._id,
      jti,
      tokenHash: rtHash,
      expiresAt: new Date(exp * 1000)
    });
    setRefreshCookie(res, refreshToken);

    return res.json({
      accessToken,
      account: { id: user._id, email: user.email, role: user.role }
    });
  },

  // ─────────────────────────────────────────────
  async refreshMethod(req, res) {
    const token = req.cookies?.rt;
    if (!token) return res.status(401).json({ message: "Missing refresh token" });

    let decoded;
    try {
      decoded = verifyToken(token);
    } catch {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    const record = await refreshtoken.findOne({ jti: decoded.jti, userId: decoded.sub });
    if (!record || record.revoked)
      return res.status(401).json({ message: "Refresh revoked" });

    const match = await bcrypt.compare(token, record.tokenHash);
    if (!match) return res.status(401).json({ message: "Refresh mismatch" });

    record.revoked = true;
    await record.save();

    const payload = { sub: decoded.sub, email: decoded.email, role: decoded.role };
    const accessToken = signAccessToken(payload);

    const newJti = randomId();
    const newRt = signRefreshToken({ ...payload, jti: newJti });
    const { exp } = verifyToken(newRt);
    await refreshtoken.create({
      userId: decoded.sub,
      jti: newJti,
      tokenHash: await bcrypt.hash(newRt, 12),
      expiresAt: new Date(exp * 1000)
    });
    setRefreshCookie(res, newRt);

    return res.json({ accessToken });
  },

  // ─────────────────────────────────────────────
  async logoutMethod(req, res) {
    const token = req.cookies?.rt;
    if (token) {
      try {
        const { jti, sub } = verifyToken(token);
        await refreshtoken.updateOne({ jti, userId: sub }, { $set: { revoked: true } });
      } catch {}
    }
    clearRefreshCookie(res);
    return res.json({ message: "Logged out" });
  },

  // ─────────────────────────────────────────────
  async meMethod(req, res) {
    return res.json({
      user: { id: req.user.sub, email: req.user.email, role: req.user.role }
    });
  }
};

export default authController;
