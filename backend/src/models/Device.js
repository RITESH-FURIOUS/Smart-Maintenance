const mongoose = require("mongoose");

const deviceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    location: { type: String, required: true },
    type: { type: String, required: true }, // e.g., Light, AC, Sensor
    status: {
      type: String,
      enum: ["online", "offline", "maintenance"],
      default: "online"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Device", deviceSchema);
