const Jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  console.log("token cookies req", req);
  const { cookies } = req;
  console.log(" cookies", cookies);
  const { token } = cookies || {};
  console.log("token", token);

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
      next();
    });
  }
};

module.exports = { verifyToken };
