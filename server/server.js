// server/server.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import lessonRoutes from "./routes/lesson.js";
import unitTestRoutes from "./routes/unitTestRoutes.js";
import materialRoutes from "./routes/materialRoutes.js";
import onlineClassRoutes from "./routes/onlineClassRoutes.js";
import statsRoutes from "./routes/statsRoutes.js";
import testsRoutes from "./routes/tests.js";

dotenv.config();

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true
}));
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/lessons", lessonRoutes);
app.use("/api/unit-tests", unitTestRoutes);
app.use("/api/materials", materialRoutes);
app.use("/api/online-classes", onlineClassRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api/tests", testsRoutes);

// Serve static files
app.use("/uploads", express.static("uploads"));

app.get("/", (req, res) => {
  res.send("Academic Platform API Running...");
});

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");
    app.listen(PORT, () =>
      console.log(`Server running on port ${PORT}`)
    );
  })
  .catch(err => console.log(err));
