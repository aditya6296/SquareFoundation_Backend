const nodemailer = require("nodemailer");

const gmailTransporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: "shainakango251@gmail.com",
    pass: "qccgealcgydbrggk",
    // user: process.env.EMAIL_USER,
    // pass: process.env.EMAIL_PASS,
  },
});

module.exports = { gmailTransporter };
