require("dotenv").config();
const PORT = process.env.PORT || 2200;
const cors = require("cors");
const express = require("express");
const multer = require("multer");
const upload = multer();
// const session = require("express-session");
require("../dataBase/database.js");
const cookieParser = require("cookie-parser");
// const cookieParser = require("cookie-parser");

// const authVerify = require("../api/v1/routes/authVerifyRouter.js");
const authRouter = require("../api/v1/routes/authRouter.js");
const { otpRouter } = require("../api/v1/routes/otpRouter.js");
const { formDB } = require("../api/v1/routes/fromDB.js");
const { verifyToken } = require("../middleware/jwtVerification.js");
const { formRouter } = require("../api/v1/routes/formRouter.js");
const { dashboardRouter } = require("../api/v1/routes/dashboardRouter.js");
const {
  scholarshipFormRouter,
} = require("../api/v1/routes/scholarshipFormRouter.js");
const app = express();

app.use(
  cors({
    origin: [
      "https://square-foundation-frontend.vercel.app",
      "http://localhost:5173",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    exposedHeaders: ["set-cookie"],
  })
);

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true })); // ✅ For form submissions

// app.use(
//   session({
//     secret: process.env.JWT_SECRET_KEY, // Used to sign the session ID cookie
//     resave: false, // Don't save session if it hasn't changed
//     saveUninitialized: false, // Don't create a session if nothing is stored
//     cookie: { secure: false, httpOnly: true }, // Configure session cookie
//   })
// );

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/auth/otp", otpRouter);

// app.use("/api/v1/submit-form", formDB);
app.use("/api/v1/dashboard", dashboardRouter);

app.use(verifyToken); // verify token
app.use("/api/v1/application-form", scholarshipFormRouter);
app.use("/api/v1/application-form", formRouter);
// For checking authorization
app.get("/api/v1/isAuthenticated", (req, res) => {
  const userEmail = req.user.email;
  console.log("userEmail is authenticate !", userEmail);
  // if (req.session && req.session.user) {
  //   // changes
  //   return res.status(200).json({
  //     status: "success",
  //     isAuthenticated: true,
  //     email: req.session.user.email, // Sending user email
  //   });
  // }
  return res.status(200).json({
    status: "success",
    isAuthenticated: true,
    email: userEmail, // Sending user email
  });
});

// app.use("/api/v1/auth/verify", authVerify);

app.listen(2200, (req, res) => {
  console.log(`Server is running on ${PORT}`);
});
