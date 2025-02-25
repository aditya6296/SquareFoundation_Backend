const mongoose = require("mongoose");

const otpSchema = mongoose.Schema(
  {
    otp: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const UserOTP = mongoose.model("Userotps", otpSchema);

module.exports = { UserOTP };
