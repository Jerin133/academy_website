import express from "express";
const router = express.Router();
import multer from "multer";
import Material from "../models/Material.js";
import fs from "fs";

// Multer Config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/materials");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });

// 🔹 Upload Material
router.post("/upload", upload.single("file"), async (req, res) => {
  const { subject } = req.body;

  try {
    const newMaterial = new Material({
      subject,
      fileName: req.file.originalname,
      filePath: req.file.path
    });

    await newMaterial.save();

    res.json({ message: "Material uploaded successfully" });
  } catch (err) {
    res.status(500).json({ error: "Upload failed" });
  }
});

// 🔹 Get All Materials (Admin)
router.get("/all", async (req, res) => {
  const materials = await Material.find().sort({ uploadedAt: -1 });
  res.json(materials);
});

// 🔹 Get Materials By Subject
router.get("/:subject", async (req, res) => {
  const { subject } = req.params;

  const materials = await Material.find({ subject });

  res.json(materials);
});

// 🔹 Download Material
router.get("/download/:id", async (req, res) => {
  try {
    const material = await Material.findById(req.params.id);

    if (!material) {
      return res.status(404).json({ error: "File not found" });
    }

    res.download(material.filePath, material.fileName);

  } catch (err) {
    res.status(500).json({ error: "Download failed" });
  }
});

// 🔹 Delete Material
router.delete("/:id", async (req, res) => {
  try {
    const material = await Material.findById(req.params.id);

    if (!material) {
      return res.status(404).json({ error: "Material not found" });
    }

    // Delete file from uploads folder
    if (fs.existsSync(material.filePath)) {
      fs.unlinkSync(material.filePath);
    }

    // Delete from MongoDB
    await Material.findByIdAndDelete(req.params.id);

    res.json({ message: "Material deleted successfully" });

  } catch (err) {
    res.status(500).json({ error: "Delete failed" });
  }
});

export default router;