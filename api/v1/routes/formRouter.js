const express = require("express");
const {
  personalDetailsData,
  showPersonalDetail,
  academicDetailsData,
  filesData,
  reviewData,
  createFile,
} = require("../controllers/personalDetailsData");
const uploadFileMulter = require("../../../config/uploadFileMulter");

const formRouter = express.Router();

formRouter.post("/personal-details/:id", personalDetailsData);
formRouter.get("/personal-details", showPersonalDetail);
formRouter.post("/academic-details/:id", academicDetailsData);

formRouter.post("/upload/:id", uploadFileMulter, createFile);
formRouter.get("/review/:id", reviewData);

module.exports = { formRouter };
