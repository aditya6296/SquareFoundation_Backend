const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },

    password: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const UsersData = mongoose.model("SquareUserDBs", userSchema);

module.exports = { UsersData };
