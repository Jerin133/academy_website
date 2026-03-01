import mongoose from "mongoose";

const testSchema = new mongoose.Schema({
    subject: { type: String, required: true },
    title: { type: String, required: true },
    timeLimit: { type: Number, default: 30 },
    questions: [
        {
            question: { type: String, required: true },
            type: { type: String, enum: ["mcq", "msq"], default: "mcq" },
            options: [{ type: String, required: true }],
            correctAnswers: [{ type: Number, required: true }] // Important: store index of correct answers
        }
    ]
}, { timestamps: true });

export default mongoose.model("Test", testSchema);
