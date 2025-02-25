// const { gmailTransporter } = require("../../../config/nodemailer.js");
// const { UsersData } = require("../../../schemas/userShema.js");
// const jwt = require("jsonwebtoken");
// const sendVerificationEmail = async (req, res) => {
//   const { email } = req.body;

//   if (!email) {
//     return res.status(400).json({ message: "Email is required" });
//   }

//   //create otp

//   const OTPValue = Math.floor(Math.random() * 8999 + 1000);

//   // Generate token

//   // const token = jwt.sign({ email }, "Ashdiiddhjkhdkhbgngugog", {
//   //   algorithm: "HS256",
//   // });

//   console.log("Token....---->", token);

//   // Create verification URL

//   // const verificationUrl = `http://localhost:2200/api/v1/auth/verify-email/${token}`;

//   console.log(email, "email===>");
//   const mailOptions = {
//     from: '"Square Foundation Email Verification" <Square Foundation@real.email>', // process.env.EMAIL,
//     to: email,
//     subject: "Verification Email",
//     text: `Click the link to verify your email:`,
//     html: `<h1>Click on the <a href="#">Verify Your Email</a> link below to verify your email</h1>`,
//   };

//   // if (!text && !html) {
//   //   console.log("Either text and html required");
//   //   return [true, "Invalid data for email"];
//   // }

//   try {
//     await gmailTransporter.sendMail(mailOptions);
//     UsersData.create({ email }, token); // token not crated in database

//     res.status(200).json({
//       status: "Success",
//       message: "Verification email sent successfully",
//     });
//   } catch (err) {
//     console.log("Server error", err.message);
//   }
// };

// module.exports = { sendVerificationEmail };
