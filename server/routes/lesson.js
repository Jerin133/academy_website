import express from "express";
import Lesson from "../models/Lesson.js";

const router = express.Router();

// Add Lesson (Admin)
router.post("/add", async (req, res) => {
  try {
    const lesson = await Lesson.create(req.body);
    res.json(lesson);
  } catch (err) {
    res.status(500).json(err.message);
  }
});

// Get All Lessons (Students)
router.get("/", async (req, res) => {
  try {
    const lessons = await Lesson.find().sort({ topicNumber: 1 });
    res.json(lessons);
  } catch (err) {
    res.status(500).json(err.message);
  }
});

export default router;
