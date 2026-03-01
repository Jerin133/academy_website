import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  questionNumber: { type: Number, required: true },
  questionType: {
    type: String,
    enum: ["MCQ", "MSQ"],
    required: true
  },
  questionText: { type: String, required: true },
  options: {
    type: [String],
    validate: v => v.length >= 2
  },
  answers: {
    type: [String],
    validate: v => v.length >= 1
  }
});

const unitTestSchema = new mongoose.Schema({
  subject: { type: String, required: true },
  topicNumber: { type: Number, required: true },
  questions: [questionSchema] // ✅ USE THE SCHEMA
});

const UnitTest = mongoose.model("UnitTest", unitTestSchema);

export default UnitTest;