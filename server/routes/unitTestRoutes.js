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