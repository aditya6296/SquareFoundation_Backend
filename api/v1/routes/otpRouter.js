const express = require("express");
const { createOTP } = require("../controllers/otpController");

const otpRouter = express.Router();

otpRouter.post("/", createOTP);

module.exports = { otpRouter };
