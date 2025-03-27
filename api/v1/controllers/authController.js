const bcrypt = require("bcrypt");
const { UserOTP } = require("../../../schemas/otpSchema");
const { UsersData } = require("../../../schemas/userShema");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {
  try {
    console.log("Hello body how are you");
    const { body } = req;
    const { email, password, otp: userOtp } = body;

    if (!email || !password || !userOtp) {
      res.status(400).json({
        status: "Fail",
        message: "Name, email, password and otp are required",
      });
      return;
    }

    const result = await UserOTP.findOne({
      email,
      createdAt: { $gte: Date.now() - 1 * 60 * 1000 },
    }).sort("-createdAt");

    const { otp: dbOtp } = result || {};

    if (!dbOtp) {
      res.status(401).json({
        status: "Fail",
        message: "OTP is expired! Resesnd OTP",
      });
      return;
    }

    // bcrypt

    const isOtpCorrect = await bcrypt.compare(userOtp, dbOtp);
    if (!isOtpCorrect) {
      res.status(401).json({
        status: "Fail",
        message: "Invalid email or OTP",
      });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await UsersData.create({
      email,
      password: hashedPassword,
    });

    console.log(result, "result");
    res.status(201).json({
      status: "Sucsess",
      message: "User create Successfully",
      data: result,
    });
  } catch (err) {
    res.status(500).json({
      status: "Fail",
      message: "Internal Server Error",
    });
    console.log(err.message);
  }
};

const loginUser = async (req, res) => {
  const { email, password: userPassword } = req.body;
  const user = await UsersData.findOne({ email }).select("email password _id");
  console.log("user", user);
  if (!user) {
    res.status(401).json({
      status: "Fail",
      message: "Email is not registered! Please signUp.",
    });
    return;
  }

  // password match
  const { password: hashedPassword, _id } = user;
  const isPasswordCorrect = await bcrypt.compare(userPassword, hashedPassword);

  if (!isPasswordCorrect) {
    res.status(400).json({
      status: "Fail",
      message: "Email or password is incorrect.",
    });
    return;
  }

  const token = jwt.sign({ email, userID: _id }, process.env.JWT_SECRET_KEY, {
    expiresIn: 48 * 60 * 60,
  });

  res.cookie("token", token, {
    // secure: false, // false for local development
    // sameSite: "None",
    httpOnly: true,
    maxAge: 12 * 60 * 60 * 1000, // expires in 12 hours (12 * 60 * 60 * 1000 ms)
    // maxAge: 9000000, // expires in 15 min
  });

  res.status(200).json({
    status: "Success",
    message: "Done!",
    data: {
      user: {
        email,
        userID: _id,
      },
    },
  });
};

// logout

const logoutUser = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "None",
    secure: true,
  });
  res.status(200).json({
    status: "success",
    message: "Logout Successfully",
  });
};

// email verify when send forgot

const reVerifyEmail = async (req, res) => {
  try {
    const { body } = req;
    const { email } = body;
    console.log("check email >>>>", email);

    const user = await UsersData.findOne({ email });
    if (user) {
      res.send({ exists: true });
    } else {
      res.send({
        exists: false,
      });
    }
  } catch (err) {
    res.status(400).json({
      status: "Fail",
      message: "Unauthorized, Internal server Error",
    });
  }
};

const forgotPassword = async (req, res) => {
  const { body } = req;
  const { email, password, otp: userOtp } = body;
  console.log("forgot email, pass, otp -->", email, password, userOtp);

  try {
    if (!email || !password || !userOtp) {
      res.status(400).json({
        status: "Fail",
        message: "Name, email, password and otp are required",
      });
      return;
    }

    const result = await UserOTP.findOne({
      email,
      createdAt: { $gte: new Date(Date.now()) - 2 * 60 * 1000 },
    }).sort("-createdAt");

    if (!result || !result.otp) {
      res.status(401).json({
        status: "Fail",
        message: "OTP is expired! Resesnd OTP",
      });
      return;
    }

    // bcrypt

    const isOtpCorrect = await bcrypt.compare(userOtp, result.otp);
    if (!isOtpCorrect) {
      res.status(401).json({
        status: "Fail",
        message: "Invalid email or OTP",
      });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Update user password
    const updatedUser = await UsersData.findOneAndUpdate(
      { email },
      { $set: { password: hashedPassword } }, // Update only the password field
      { new: true, upsert: false } // Return updated document // do not create a user if not found
    );

    if (!updatedUser) {
      return res.status(404).json({
        status: "Fail",
        message: "User not found",
      });
    }

    console.log(result, "result");
    res.status(200).json({
      status: "Success",
      message: "Password updated successfully",
      data: result,
    });
  } catch (err) {
    res.status(500).json({
      status: "Fail",
      message: "Internal Server Error",
    });
    console.log(err.message);
  }
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  reVerifyEmail,
  forgotPassword,
};
