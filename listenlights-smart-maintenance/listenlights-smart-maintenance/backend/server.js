const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv");

dotenv.config();

const authRoutes = require("./src/routes/authRoutes");
const deviceRoutes = require("./src/routes/deviceRoutes");
const taskRoutes = require("./src/routes/taskRoutes");

const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

// Health check
app.get("/", (req, res) => {
  res.json({ message: "Listenlights Smart Maintenance API running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/devices", deviceRoutes);
app.use("/api/tasks", taskRoutes);

const PORT = process.env.PORT || 4000;
const MONGO_URI =
  process.env.MONGO_URI || "mongodb://127.0.0.1:27017/listenlights_smart_maintenance";

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Backend API running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  });
