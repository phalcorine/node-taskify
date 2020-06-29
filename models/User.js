const mongoose = require("mongoose");

// Create schema
const schema = new mongoose.Schema(
  {
    googleId: {
      type: String,
      required: true,
    },
    displayName: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    imageUri: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

// Create model
const User = mongoose.model("User", schema);

// Export
module.exports = User;
