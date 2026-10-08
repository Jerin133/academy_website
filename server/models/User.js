import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ["student", "admin"], default: "student" },
  isApproved: { type: Boolean, default: false },
  activeSessionId: { type: String, default: "" },
  resetPasswordToken: { type: String, default: "" },
  resetPasswordExpires: { type: Date }
}, { timestamps: true });

export default mongoose.model("User", userSchema);
