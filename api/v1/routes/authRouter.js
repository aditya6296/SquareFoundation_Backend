const express = require("express");
const {
  registerUser,
  loginUser,
  logoutUser,
  reVerifyEmail,
  forgotPassword,
} = require("../controllers/authController.js");
const authRouter = express.Router();

authRouter.post("/signup", registerUser);
authRouter.post("/login", loginUser);
authRouter.post("/logout", logoutUser);
authRouter.post("/check-email", reVerifyEmail);
authRouter.put("/forgot-password", forgotPassword);

module.exports = authRouter;
