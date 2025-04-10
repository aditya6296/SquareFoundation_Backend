const express = require("express");
const {
  adminLogin,
  adminLogout,
  applications,
  approveApplication,
  rejectApplication,
  approvedApplication,
} = require("../controllers/adminController");

const adminRoutes = express.Router();

adminRoutes.post("/login", adminLogin);
adminRoutes.post("/logOut", adminLogout);
adminRoutes.get("/dashboard/applications", applications);
adminRoutes.patch("/dashboard/applications/:id/approve", approveApplication);
adminRoutes.patch("/dashboard/applications/:id/reject", rejectApplication);
adminRoutes.get("/dashboard/approved/applications", approvedApplication);

// adminRoutes.patch("/dashboard/applications/:id/reject", applications);

module.exports = adminRoutes;
