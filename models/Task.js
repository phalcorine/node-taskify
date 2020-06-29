const mongoose = require("mongoose");

// Create schema
const schema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: "public",
      enum: ["private", "public"],
    },
    isCompleted: {
      type: Boolean,
      required: true,
      default: false,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

// Create model
const Task = mongoose.model("Task", schema);

// Export
module.exports = Task;
