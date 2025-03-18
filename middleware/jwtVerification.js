const Jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  console.log("🔍 Request Headers:", req.headers);
  const { cookies } = req;
  console.log(" cookies", cookies);
  console.log("🔍 Cookies in Request:", req.cookies); 

  // if (!req.cookies || !req.cookies.token) {
  //   return res.status(401).json({
  //     status: "Fail",
  //     message: "Please login, token not found",
  //   });
  // }

  const token = req.cookies?.token;
  console.log("🛑 Extracted Token:", token);
  // const { token } = cookies || {};
  // console.log("token", token);

  if (!token) {
    res.status(401).json({
      status: "Fail",
      message: "Please login token not verify",
    });
  } else {
    Jwt.verify(token, process.env.JWT_SECRET_KEY, (err, userData) => {
      if (err) {
        res.status(401).json({
          status: "Fail",
          message: "Please login Invalid token",
        });
        return;
      }
      console.log("userData Token Data:", userData);

      if (!userData.userID) {
        return res.status(401).json({
          status: "Fail",
          message: "Unauthorized: Token missing required user data.",
        });
      }

      req.user = userData; // Save userID in request
      next();
    });
  }
};

module.exports = { verifyToken };
