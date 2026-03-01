import express from "express";
import Test from "../models/Test.js";
import TestAttempt from "../models/TestAttempt.js";
import { verifyAdmin, verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// 🔹 1. Create Test (Admin only)
router.post("/add", verifyAdmin, async (req, res) => {
    try {
        const test = await Test.create(req.body);
        res.json(test);
    } catch (err) {
        res.status(500).json(err.message);
    }
});

// 🔹 Update Test (Admin only)
router.put("/update/:id", verifyAdmin, async (req, res) => {
    try {
        const updatedTest = await Test.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedTest);
    } catch (err) {
        res.status(500).json(err.message);
    }
});

// 🔹 Delete Test (Admin only)
router.delete("/delete/:id", verifyAdmin, async (req, res) => {
    try {
        await Test.findByIdAndDelete(req.params.id);
        res.json({ message: "Test deleted successfully" });
    } catch (err) {
        res.status(500).json(err.message);
    }
});

// 🔹 2. Get ALL Tests (IMPORTANT for frontend)
router.get("/", async (req, res) => {
    try {
        const tests = await Test.find();
        res.json(tests);
    } catch (err) {
        res.status(500).json(err.message);
    }
});

// 🔹 Get User Test History
router.get("/history", verifyToken, async (req, res) => {
    try {
        const attempts = await TestAttempt.find({ userId: req.user.id }).populate("testId", "title subject");
        res.json(attempts);
    } catch (err) {
        res.status(500).json(err.message);
    }
});

// 🔹 3. Get Single Test (MUST come before :subject)
router.get("/single/:id", async (req, res) => {
    try {
        const test = await Test.findById(req.params.id);
        res.json(test);
    } catch (err) {
        res.status(500).json(err.message);
    }
});

// 🔹 4. Get Tests by Subject (keep this LAST)
router.get("/:subject", async (req, res) => {
    try {
        const tests = await Test.find({ subject: req.params.subject });
        res.json(tests);
    } catch (err) {
        res.status(500).json(err.message);
    }
});

// 🔹 5. Submit Test (calculate score)
router.post("/submit", verifyToken, async (req, res) => {
    try {
        const { testId, answers } = req.body;

        const test = await Test.findById(testId);

        let score = 0;

        test.questions.forEach((q, index) => {
            const userAns = answers[index] || [];

            const correct =
                userAns.length === q.correctAnswers.length &&
                userAns.every(a => q.correctAnswers.includes(a));

            if (correct) score++;
        });

        const attempt = await TestAttempt.create({
            userId: req.user.id,
            testId: test._id,
            score,
            total: test.questions.length
        });

        res.json({
            score,
            total: test.questions.length,
            correctAnswers: test.questions.map(q => q.correctAnswers),
            attemptId: attempt._id
        });

    } catch (err) {
        res.status(500).json(err.message);
    }
});

export default router;
