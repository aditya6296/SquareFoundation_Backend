const express = require("express");
const upload = require("../../../middleware/uploadMiddleware");
const {
  personalDetailsData,
  showPersonalDetail,
  academicDetailsData,
  filesData,
} = require("../controllers/personalDetailsData");

const formRouter = express.Router();

formRouter.post("/personal-details/:id", personalDetailsData);
formRouter.get("/personal-details", showPersonalDetail);
formRouter.post("/academic-details/:id", academicDetailsData);
// formRouter.post("/upload", filesData);
// formRouter.post("/upload/:id", upload.single("file"), filesData);

module.exports = { formRouter };
