const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },

    password: {
      type: String,
      required: true,
    },
    // role: {
    //   type: String,
    //   enum: ["user", "admin"],
    //   default: "user", // All new users will be regular users by default
    // },
  },
  {
    timestamps: true,
  }
);

const UsersData = mongoose.model("SquareUserDBs", userSchema);

module.exports = { UsersData };
