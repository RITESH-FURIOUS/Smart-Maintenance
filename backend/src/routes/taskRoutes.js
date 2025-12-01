const express = require("express");
const Task = require("../models/Task");
const Device = require("../models/Device");
const { auth, requireRole } = require("../middleware/auth");

const router = express.Router();

// Get tasks
// Admin -> all tasks
// Technician -> only assigned to them
router.get("/", auth, async (req, res) => {
  try {
    const filter = {};
    if (req.user.role === "technician") {
      filter.assignedTo = req.user.id;
    }
    const tasks = await Task.find(filter)
      .populate("device")
      .populate("assignedTo", "name email")
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    console.error("Get tasks error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Create task (admin only)
router.post("/", auth, requireRole("admin"), async (req, res) => {
  try {
    const { title, description, deviceId, assignedToId, priority, dueDate } = req.body;
    if (!title || !deviceId) {
      return res.status(400).json({ error: "title and deviceId are required" });
    }
    const device = await Device.findById(deviceId);
    if (!device) return res.status(400).json({ error: "Invalid deviceId" });

    const task = await Task.create({
      title,
      description,
      device: deviceId,
      assignedTo: assignedToId || null,
      priority: priority || "medium",
      dueDate: dueDate || null,
      createdBy: req.user.id
    });

    const populated = await task.populate([
      { path: "device" },
      { path: "assignedTo", select: "name email" },
      { path: "createdBy", select: "name email" }
    ]);
    res.status(201).json(populated);
  } catch (err) {
    console.error("Create task error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Update task (admin: everything, technician: status only for their tasks)
router.put("/:id", auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ error: "Task not found" });

    if (req.user.role === "technician") {
      if (String(task.assignedTo) !== String(req.user.id)) {
        return res.status(403).json({ error: "You can only update your own tasks" });
      }
      if (req.body.status) {
        task.status = req.body.status;
      }
    } else if (req.user.role === "admin") {
      if (req.body.title !== undefined) task.title = req.body.title;
      if (req.body.description !== undefined) task.description = req.body.description;
      if (req.body.priority !== undefined) task.priority = req.body.priority;
      if (req.body.status !== undefined) task.status = req.body.status;
      if (req.body.assignedToId !== undefined) task.assignedTo = req.body.assignedToId || null;
      if (req.body.dueDate !== undefined) task.dueDate = req.body.dueDate || null;
    }

    await task.save();
    const populated = await task.populate([
      { path: "device" },
      { path: "assignedTo", select: "name email" },
      { path: "createdBy", select: "name email" }
    ]);
    res.json(populated);
  } catch (err) {
    console.error("Update task error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Delete task (admin only)
router.delete("/:id", auth, requireRole("admin"), async (req, res) => {
  try {
    const deleted = await Task.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Task not found" });
    res.json({ success: true });
  } catch (err) {
    console.error("Delete task error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
