import mongoose from "mongoose";

const lessonSchema = new mongoose.Schema({
  subject: { type: String, required: true },
  topicNumber: { type: Number, required: true },
  title: { type: String, required: true },
  youtubeLink: { type: String, required: true }
}, { timestamps: true });

export default mongoose.model("Lesson", lessonSchema);
