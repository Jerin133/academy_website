import express from "express";
import OnlineClass from "../models/OnlineClass.js";

const router = express.Router();

// 🔹 Schedule Class
router.post("/add", async (req, res) => {
  try {
    const { subject, date, time, meetingLink } = req.body;

    const newClass = new OnlineClass({
      subject,
      date,
      time,
      meetingLink
    });

    await newClass.save();

    res.json({ message: "Class Scheduled Successfully" });

  } catch (err) {
    res.status(500).json({ error: "Failed to schedule class" });
  }
});

// 🔹 Get All Classes
router.get("/", async (req, res) => {
  const classes = await OnlineClass.find().sort({ createdAt: -1 });
  res.json(classes);
});

// 🔹 Postpone Class
router.put("/postpone/:id", async (req, res) => {
  await OnlineClass.findByIdAndUpdate(req.params.id, {
    status: "Postponed"
  });

  res.json({ message: "Class Postponed" });
});

export default router;