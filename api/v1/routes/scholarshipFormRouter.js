const express = require("express");
const {
  DetailsData,
  showDetailsData,
} = require("../controllers/formDetailController");

const scholarshipFormRouter = express.Router();

scholarshipFormRouter.get("/check/:id", DetailsData);
scholarshipFormRouter.get("/check-details", showDetailsData);

module.exports = { scholarshipFormRouter };
