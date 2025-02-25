const bcrypt = require("bcrypt");
const { UserOTP } = require("../../../schemas/otpSchema.js");
const { sendMail } = require("../../../utilities/mailutility.js");
const { UsersData } = require("../../../schemas/userShema.js");
// const { sendVerificationEmail } = require("./verifyEmailController");

const createOTP = async (req, res) => {
  try {
    const { email, isResend = false } = req.body;
    console.log("otpEmail========>>>>>>>>>>>>>>>>>>>>>>>>>>>>", email);

    if (!email) {
      res.status(400).json({ status: "fail", message: "Email is required!" });
      return;
    }

    //  for check already sent or not
    // const existingUser = await UsersData.findOne({ email });

    // if (existingUser) {
    //   return res.status(400).json({
    //     status: "Fail",
    //     message: "User already registered. Please log in.",
    //   });
    // }

    const oldOTP = await UserOTP.findOne({
      email,
      createdAt: { $gte: Date.now() - 2 * 60 * 1000 },
    });

    if (!isResend && oldOTP) {
      res.status(403).json({
        status: "Fail",
        message: `OTP already sent to this mail! ${email}.`,
      });
      return;
    }

    // Create OTP

    const OTPValue = Math.floor(Math.random() * 8999 + 1000);

    const [isMailsent, errorMessage] = await sendMail({
      email: email,
      subject: "Square Foundation OTP Verification",
      text: `Your OTP is ${OTPValue}`,
      html: `
    <h2>Your OTP is ${OTPValue}</h2> `,
    });

    if (!isMailsent) {
      res.status(500).json({
        message: errorMessage,
      });
    }

    // Hash OTP

    const salt = await bcrypt.genSalt(10);
    const hashedOtp = await bcrypt.hash("" + OTPValue, salt);

    await UserOTP.create({
      email,
      otp: hashedOtp,
    });

    res.status(201).json({
      message: "OTP Sent",
    });
  } catch (err) {
    console.log("Internal Server Error", err, err.message);
  }
};

module.exports = { createOTP };
