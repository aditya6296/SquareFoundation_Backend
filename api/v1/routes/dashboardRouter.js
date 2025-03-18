const express = require("express");
const {
  scholarshipData,
  getScholarshipData,
  scholarshipViewDetailData,
  getScholarshipViewDetailData,
} = require("../controllers/scholarshipData");

const dashboardRouter = express.Router();

dashboardRouter.post("/scholarship-data", scholarshipData);
dashboardRouter.post(
  "/scholarship-data/view-details",
  scholarshipViewDetailData
);
dashboardRouter.get("/scholarship-data", getScholarshipData);
dashboardRouter.get(
  "/scholarship-data/view-details/:id",
  getScholarshipViewDetailData
);

module.exports = { dashboardRouter };
