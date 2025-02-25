require("dotenv").config();
const PORT = process.env.PORT || 2200;
const cors = require("cors");
const express = require("express");
require("../dataBase/database.js");
// const cookieParser = require("cookie-parser");

const authRouter = require("../api/v1/routes/authRouter.js");
// const authVerify = require("../api/v1/routes/authVerifyRouter.js");
const { otpRouter } = require("../api/v1/routes/otpRouter.js");
const { formDB } = require("../api/v1/routes/fromDB.js");
const cookieParser = require("cookie-parser");
const { verifyToken } = require("../middleware/jwtVerification.js");
const app = express();

app.use(
  cors({
    origin: [process.env.FRONTEND_URL, "http://localhost:5173"],
    credentials: true,
    methods: "GET, POST, PUT, PATCH, DELETE",
    allowedHeaders: "Content-Type, Authorization",
  })
);
// app.use(
//   cors({
//     origin: "*",
//     credentials: true,
//     methods: "GET, POST, PUT, PATCH, DELETE",
//     allowedHeaders: "Content-Type, Authorization",
//   })
// );
app.use(express.json());
app.use(cookieParser());
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/auth/otp", otpRouter);
app.use("/api/v1/submit-form", formDB);
app.use(verifyToken);
// For checking authorization
app.get("/api/v1/isAuthenticated", (req, res) => {
  res.send({
    status: "success",
    isAuthenticated: true,
  });
});

// app.use("/api/v1/auth/verify", authVerify);

app.listen(2200, (req, res) => {
  console.log(`Server is running on ${PORT}`);
});
