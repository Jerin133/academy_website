import express from "express";
import UnitTest from "../models/UnitTest.js";

const router = express.Router();

// Save Unit Test
router.post("/add", async (req, res) => {
  const { subject, topicNumber, questions } = req.body;

  try {
    const existingTest = await UnitTest.findOne({
      subject,
      topicNumber
    });

    if (existingTest) {

      // 🔥 Get current number of questions
      const currentLength = existingTest.questions.length;

      // 🔥 Auto-adjust question numbers
      const updatedQuestions = questions.map((q, index) => ({
        ...q,
        questionNumber: currentLength + index + 1
      }));

      existingTest.questions.push(...updatedQuestions);

      await existingTest.save();

      return res.json({
        message: "Questions appended successfully!"
      });
    }

    // 🆕 Create new test if not exists
    const newQuestions = questions.map((q, index) => ({
      ...q,
      questionNumber: index + 1
    }));

    const newTest = new UnitTest({
      subject,
      topicNumber,
      questions: newQuestions
    });

    await newTest.save();

    res.json({
      message: "Unit test created successfully!"
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

// Get by subject + topic
router.get("/:subject/:topic", async (req, res) => {
  try {
    const test = await UnitTest.findOne({
      subject: req.params.subject,
      topicNumber: req.params.topic
    });

    res.json(test);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;