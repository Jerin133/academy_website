import express from "express";
import UnitTest from "../models/UnitTest.js";

const router = express.Router();

// Save Unit Test
router.post("/add", async (req, res) => {
  const { subject, topicNumber, questions } = req.body;

  try {
    const existingTest = await UnitTest.findOne({
      subject: new RegExp(`^${subject.trim()}$`, "i"),
      topicNumber
    });

    if (existingTest) {
      return res.status(400).json({
        error: "A unit test for this topic already exists. Please use the Edit button below to modify it!"
      });
    }

    // 🆕 Create new test if not exists
    const newQuestions = questions.map((q, index) => ({
      ...q,
      questionNumber: index + 1
    }));

    const newTest = new UnitTest({
      subject: subject.trim(),
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
      subject: new RegExp(`^${req.params.subject.trim()}$`, "i"),
      topicNumber: req.params.topic
    });

    res.json(test);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}); // End Get by subject + topic

// Get all unit tests
router.get("/", async (req, res) => {
  try {
    const tests = await UnitTest.find().sort({ createdAt: -1 });
    res.json(tests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a unit test
router.put("/update/:id", async (req, res) => {
  const { subject, topicNumber, questions } = req.body;

  try {
    // Re-assign correct question numbers just in case
    const updatedQuestions = questions.map((q, index) => ({
      ...q,
      questionNumber: index + 1
    }));

    const updatedTest = await UnitTest.findByIdAndUpdate(
      req.params.id,
      { subject, topicNumber, questions: updatedQuestions },
      { new: true }
    );

    if (!updatedTest) return res.status(404).json({ error: "Test not found" });
    res.json({ message: "Unit test updated successfully!", test: updatedTest });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a unit test
router.delete("/delete/:id", async (req, res) => {
  try {
    const deletedTest = await UnitTest.findByIdAndDelete(req.params.id);
    if (!deletedTest) return res.status(404).json({ error: "Test not found" });
    res.json({ message: "Unit test deleted successfully!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;