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

const allowedOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:5173",
  "https://www.dr-senthilkumar-chemistry-academy.com",
  "https://dr-senthilkumar-chemistry-academy.com",
  "https://dr-senthilkumar-academy.vercel.app"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
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
