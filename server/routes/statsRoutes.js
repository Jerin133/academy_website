import express from "express";
import User from "../models/User.js";
import Lesson from "../models/Lesson.js";
import UnitTest from "../models/UnitTest.js";
import Material from "../models/Material.js";
import OnlineClass from "../models/OnlineClass.js";

const router = express.Router();

// 🔹 Get General Admin Progress (Overall Stats)
router.get("/admin", async (req, res) => {
    try {
        const studentsCount = await User.countDocuments({ role: "student" });
        const lessonsCount = await Lesson.countDocuments();
        const unitTestsCount = await UnitTest.countDocuments();
        const mockDbCount = 2; // Hardcoded mock exams for now as it doesn't seem to have a model yet. Adjust if there's a MockTest model.

        // For "mock exams" count, assuming we will add it when mock test backend is implemented.
        res.json({
            activeStudents: studentsCount,
            totalLessons: lessonsCount,
            unitTests: unitTestsCount,
            mockExams: mockDbCount
        });
    } catch (error) {
        res.status(500).json({ message: "Error fetching admin stats", error });
    }
});

// 🔹 Get Student Progress (Mock implementation for a single student profile based on overall metrics)
// In a full implementation, you would track individual Student progress based on their ID from a token.
router.get("/student", async (req, res) => {
    try {
        // Basic mock logic:
        // Course progress = (completed lessons / total lessons) * 100
        // But since we don't track *individual* completed lessons yet in the schema, we'll return
        // some static-ish data combined with real totals to make it look dynamic until user progress tracking is built.

        const lessonsCount = await Lesson.countDocuments();

        // These would normally be queried from a UserProgress model
        const mockCompletedLessons = Math.min(12, lessonsCount); // Ensure it's not more than total
        const progressPercent = lessonsCount > 0 ? Math.round((mockCompletedLessons / lessonsCount) * 100) : 0;

        res.json({
            courseProgress: progressPercent,
            lessonsCompleted: mockCompletedLessons,
            mockTestsTaken: 3, // Needs MockTest tracking in DB
            studyHours: 24,    // Needs active time tracking in DB
            overallScore: 85   // Needs Score tracking in DB
        });
    } catch (error) {
        res.status(500).json({ message: "Error fetching student stats", error });
    }
});

export default router;
