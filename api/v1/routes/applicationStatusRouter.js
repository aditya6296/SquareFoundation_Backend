const express = require("express");
const { applicationStatus } = require("../controllers/applicationStatus");

const applicationStatusRouter = express.Router();

applicationStatusRouter.get("/", applicationStatus);

module.exports = { applicationStatusRouter };
