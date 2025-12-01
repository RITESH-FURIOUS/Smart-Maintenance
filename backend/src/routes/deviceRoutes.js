const express = require("express");
const Device = require("../models/Device");
const { auth, requireRole } = require("../middleware/auth");

const router = express.Router();

// Get all devices
router.get("/", auth, async (req, res) => {
  try {
    const devices = await Device.find().sort({ createdAt: -1 });
    res.json(devices);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Create device (admin only)
router.post("/", auth, requireRole("admin"), async (req, res) => {
  try {
    const { name, location, type, status } = req.body;
    if (!name || !location || !type) {
      return res.status(400).json({ error: "name, location, type are required" });
    }
    const device = await Device.create({ name, location, type, status });
    res.status(201).json(device);
  } catch (err) {
    console.error("Create device error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Update device (admin only)
router.put("/:id", auth, requireRole("admin"), async (req, res) => {
  try {
    const updated = await Device.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: "Device not found" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Delete device (admin only)
router.delete("/:id", auth, requireRole("admin"), async (req, res) => {
  try {
    const deleted = await Device.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Device not found" });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Seed sample devices (admin only)
router.post("/seed", auth, requireRole("admin"), async (req, res) => {
  try {
    await Device.deleteMany({});
    const devices = await Device.insertMany([
      {
        name: "Lobby Main Light",
        location: "Building A - Lobby",
        type: "Lighting",
        status: "online"
      },
      {
        name: "Conference Room AC",
        location: "Building A - 3rd Floor",
        type: "HVAC",
        status: "maintenance"
      },
      {
        name: "Parking Sensor P1",
        location: "Basement Parking",
        type: "Sensor",
        status: "online"
      }
    ]);
    res.json({ message: "Seed devices created", count: devices.length });
  } catch (err) {
    console.error("Seed devices error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
