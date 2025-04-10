const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    name: {
      type: String,
    },

    role: {
      type: String,
      default: "admin", // All entries here are admin type
    },

    accessLevel: {
      type: String,
      enum: ["superadmin", "moderator", "editor"],
      default: "superadmin", // Or change as needed
    },
  },
  {
    timestamps: true,
  }
);

const Admin = mongoose.model("AdminCollection", adminSchema);

module.exports = { Admin };
