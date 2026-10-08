import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import nodemailer from "nodemailer";
import User from "../models/User.js";

const router = express.Router();

// Helper to create Nodemailer transporter
const createTransporter = () => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    return null;
  }
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

// REGISTER
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  const existing = await User.findOne({ email });
  if (existing) return res.status(400).json("User already exists");

  const hashed = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashed,
    role: "student",
    isApproved: false
  });

  res.json({ message: "Registered successfully. Account is pending admin approval." });
});

// LOGIN
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json("User not found");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json("Invalid credentials");

  if (user.role === "student" && !user.isApproved) {
    return res.status(403).json("Your account is pending admin approval. Please wait for administrator approval.");
  }

  // Generate unique active session ID for single-device login constraint
  const sessionId = crypto.randomUUID();
  user.activeSessionId = sessionId;
  await user.save();

  const token = jwt.sign(
    { id: user._id, role: user.role, sessionId },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  res.json({ token, user });
});

// ADMIN LOGIN
router.post("/admin-login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user || user.role !== "admin") {
    return res.status(403).json("Not authorized as admin");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json("Invalid credentials");

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  res.json({ token, user });
});

// GET CURRENT USER
router.get("/me", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json("No token provided");
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");
    if (!user) return res.status(404).json("User not found");

    if (user.role === "student") {
      if (!user.isApproved) {
        return res.status(403).json("Your account is pending admin approval");
      }
      if (decoded.sessionId && user.activeSessionId && decoded.sessionId !== user.activeSessionId) {
        return res.status(401).json("LOGGED_IN_ELSEWHERE: Your account was logged in on another device.");
      }
    }

    res.json(user);
  } catch (err) {
    res.status(401).json("Invalid or expired token");
  }
});

// FORGOT PASSWORD - Generate 6-Digit Reset OTP Code & Send Email via Gmail
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json("Email address is required.");

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json("No account registered with this email address.");

    // Generate 6-digit OTP code
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetPasswordToken = resetCode;
    user.resetPasswordExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 mins expiry
    await user.save();

    const transporter = createTransporter();
    if (transporter) {
      await transporter.sendMail({
        from: `"Chemistry Academy" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Your Password Reset Verification Code - Chemistry Academy",
        html: `
          <div style="font-family: Arial, sans-serif; padding: 24px; max-width: 480px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff;">
            <h2 style="color: #4f46e5; margin-top: 0;">Password Reset Code</h2>
            <p style="color: #334155; font-size: 15px;">Hello <b>${user.name || 'Student'}</b>,</p>
            <p style="color: #475569; font-size: 14px; line-height: 1.5;">You requested to reset your account password. Please enter the following 6-digit verification code to complete the process:</p>
            <div style="background: linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%); padding: 18px; font-size: 28px; font-weight: 800; letter-spacing: 6px; text-align: center; color: #ffffff; border-radius: 12px; margin: 24px 0;">
              ${resetCode}
            </div>
            <p style="color: #64748b; font-size: 13px; line-height: 1.4;">This verification code is valid for <b>15 minutes</b>. If you did not request a password reset, please ignore this email.</p>
          </div>
        `
      });
      return res.json({ message: "Verification code sent successfully to your Gmail account!" });
    } else {
      console.log(`[SMTP Config Missing] Reset Code for ${email} is: ${resetCode}`);
      return res.status(400).json("Email credentials (EMAIL_USER and EMAIL_PASS) are not configured in server/.env file yet. Please set your Gmail & App Password.");
    }
  } catch (err) {
    console.error("Forgot password email error:", err);
    res.status(500).json("Failed to send email: " + (err.message || "SMTP error"));
  }
});

// RESET PASSWORD - Verify Code Typed by User & Change Password in DB
router.post("/reset-password", async (req, res) => {
  try {
    const { email, resetCode, newPassword } = req.body;

    if (!email || !resetCode || !newPassword) {
      return res.status(400).json("Email, reset code, and new password are required.");
    }

    if (newPassword.length < 6) {
      return res.status(400).json("Password must be at least 6 characters long.");
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json("User not found.");

    if (
      !user.resetPasswordToken ||
      user.resetPasswordToken !== resetCode.trim() ||
      !user.resetPasswordExpires ||
      new Date(user.resetPasswordExpires).getTime() < Date.now()
    ) {
      return res.status(400).json("Invalid or expired reset code. Please check your email and try again.");
    }

    // Hash new password and save to DB
    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    user.resetPasswordToken = "";
    user.resetPasswordExpires = null;
    user.activeSessionId = ""; // Revoke active session so user signs in with new password
    await user.save();

    res.json({ message: "Password updated successfully in database! You can now log in." });
  } catch (err) {
    res.status(500).json("Failed to reset password.");
  }
});

// GET ALL STUDENTS (ADMIN ONLY)
router.get("/students", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json("No token provided");
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "admin") {
      return res.status(403).json("Not authorized as admin");
    }

    const students = await User.find({ role: { $ne: "admin" } }).select("-password").sort({ createdAt: -1 });
    res.json(students);
  } catch (err) {
    res.status(401).json("Invalid token");
  }
});

// TOGGLE / UPDATE STUDENT APPROVAL STATUS (ADMIN ONLY)
router.put("/students/:id/status", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json("No token provided");
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "admin") {
      return res.status(403).json("Not authorized as admin");
    }

    const { isApproved } = req.body;
    const student = await User.findByIdAndUpdate(
      req.params.id,
      { isApproved: Boolean(isApproved) },
      { new: true }
    ).select("-password");

    if (!student) return res.status(404).json("Student not found");

    res.json(student);
  } catch (err) {
    res.status(500).json("Error updating student approval status");
  }
});

export default router;
