const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { auth } = require("../middleware/auth");

const router = express.Router();

// Register (for demo; in real app this would be admin only)
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: "name, email and password are required" });
    }
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ error: "User with this email already exists" });
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      passwordHash,
      role: role === "admin" ? "admin" : "technician"
    });
    res.status(201).json({ id: user._id, name: user.name, email: user.email, role: user.role });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "email and password are required" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const payload = { id: user._id, role: user.role, name: user.name };
    const token = jwt.sign(payload, process.env.JWT_SECRET || "supersecretjwtkeychange", {
      expiresIn: "8h"
    });
    res.json({ token, user: payload });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Get current user
router.get("/me", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-passwordHash");
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Simple seed route to create sample admin and technician
router.post("/seed", async (req, res) => {
  try {
    const existing = await User.findOne({ email: "admin@listenlights.com" });
    if (existing) {
      return res.json({ message: "Seed users already exist" });
    }
    const adminPass = await bcrypt.hash("admin123", 10);
    const techPass = await bcrypt.hash("tech123", 10);

    const admin = await User.create({
      name: "Admin User",
      email: "admin@listenlights.com",
      passwordHash: adminPass,
      role: "admin"
    });

    const tech = await User.create({
      name: "Technician One",
      email: "tech@listenlights.com",
      passwordHash: techPass,
      role: "technician"
    });

    res.json({
      message: "Seed users created",
      admin: { email: admin.email, password: "admin123" },
      technician: { email: tech.email, password: "tech123" }
    });
  } catch (err) {
    console.error("Seed error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
