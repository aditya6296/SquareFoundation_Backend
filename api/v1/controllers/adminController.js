const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Admin } = require("../../../schemas/adminSchema");
const { FormDetails } = require("../../../schemas/formDetailSchema");
const { sendMail } = require("../../../utilities/mailutility");
const { Scholarship } = require("../../../schemas/scholarship");

const adminLogin = async (req, res) => {
  const { email, password } = req.body;
  console.log(email, " ", password);

  try {
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res
        .status(401)
        .json({ success: false, message: "Admin not found" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    // Generate token
    const token = jwt.sign(
      { id: admin._id, role: "admin", accessLevel: admin.accessLevel },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "24h" }
    );

    res.cookie("token", token, {
      secure: false, // for deployement
      sameSite: "Lax",
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // expires in 24 hours (24 * 60 * 60 * 1000 ms)
    });

    res
      .status(200)
      .json({ success: true, token, accessLevel: admin.accessLevel });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const adminLogout = (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      sameSite: "None",
      secure: false,
    });

    return res
      .status(200)
      .json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Server error during logout" });
  }
};

const applications = async (req, res) => {
  try {
    const applicationsData = await FormDetails.find();
    res.status(200).json({
      status: "success",
      message: "applicatiin Data sent Successfully",
      data: applicationsData,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch applications" });
  }
};

const approveApplication = async (req, res) => {
  console.log("params req :", req.params.id);
  try {
    const { userId } = req.body;
    const { id: applicationId } = req.params;
    console.log("applicationId is :", applicationId);
    const updatedApplication = await FormDetails.findOneAndUpdate(
      {
        "application.userId": userId,
        "application.applicationId": applicationId,
      },
      { $set: { "application.$[elem].status": "approved" } },
      {
        new: true,
        arrayFilters: [
          { "elem.userId": userId, "elem.applicationId": applicationId },
        ],
      }
    );
    if (!updatedApplication) {
      return res.status(404).json({ message: "Application not found" });
    }
    // console.log("updatedApplication is : >>>", updatedApplication);

    res.status(200).json({
      message: "Application approved successfully",
      data: updatedApplication,
    });

    const userRecord = await FormDetails.findOne({
      "application.userId": userId,
      "application.applicationId": applicationId,
    });

    const targetApp = userRecord.application.find(
      (app) => app.userId === userId && app.applicationId === applicationId
    );

    const scholarshipId = targetApp.applicationId;
    const userName = targetApp.personalDetails.name;
    const userEmail = targetApp.personalDetails.email;

    // send mail

    const findData = await Scholarship.findOne({ scholarshipId });

    console.log("findData is :", findData);
    const scholarshipTitle = findData.title;

    if (!findData) {
      return res.status(404).json({
        success: false,
        message: "Scholarship not found with the provided ID",
      });
    }

    const [isMailsent, errorMessage] = await sendMail({
      email: userEmail,
      subject: "🎓 Square Foundation Scholarship - Application Approved",
      text: `Your scholarship application for ${scholarshipTitle} is approved.`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; border-radius: 10px; padding: 20px; background-color: #f9f9f9;">
          <h2 style="color: #2e7d32;">🎉 Congratulations!</h2>
          <p style="font-size: 16px; color: #333;"><p>Hello <strong>${userName}</strong>,</p>
          <p style="font-size: 16px; color: #333;">
            We're excited to inform you that your application for the <strong>${scholarshipTitle}</strong> scholarship has been <span style="color: green; font-weight: bold;">approved</span>.
          </p>
          <p style="font-size: 16px; color: #333;">
            Our team will contact you soon with further details. If you have any questions, feel free to reach out.
          </p>
          <hr style="margin: 20px 0;">
          <p style="font-size: 14px; color: #777;">
            Thanks for being a part of the Square Foundation initiative.<br>
            — The Square Foundation Team
          </p>
        </div>
      `,
    });

    if (!isMailsent) {
      return res.status(500).json({
        message: errorMessage,
      });
    }
  } catch (err) {
    console.log("Error approving application:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const rejectApplication = async (req, res) => {
  try {
    const { userId } = req.body;
    const { id: applicationId } = req.params;

    const updatedApplication = await FormDetails.findOneAndUpdate(
      {
        "application.userId": userId,
        "application.applicationId": applicationId,
      },
      { $set: { "application.$[elem].status": "rejected" } },
      {
        new: true,
        arrayFilters: [
          { "elem.userId": userId, "elem.applicationId": applicationId },
        ],
      }
    );
    if (!updatedApplication) {
      return res.status(404).json({ message: "Application not found" });
    }
    console.log("updatedApplication", updatedApplication);

    res.status(200).json({
      message: "Application rejected !",
      data: updatedApplication,
    });

    const userRecord = await FormDetails.findOne({
      "application.userId": userId,
      "application.applicationId": applicationId,
    });

    const targetApp = userRecord.application.find(
      (app) => app.userId === userId && app.applicationId === applicationId
    );

    const scholarshipId = targetApp.applicationId;
    const userName = targetApp.personalDetails.name;
    const userEmail = targetApp.personalDetails.email;

    // send mail

    const findData = await Scholarship.findOne({ scholarshipId });

    console.log("findData is :", findData);
    const scholarshipTitle = findData.title;

    if (!findData) {
      return res.status(404).json({
        success: false,
        message: "Scholarship not found with the provided ID",
      });
    }

    // send mail

    const [isMailsent, errorMessage] = await sendMail({
      email: userEmail,
      subject: "🎓 Square Foundation Scholarship - Application Update",
      text: `Your scholarship application for ${scholarshipTitle} was not approved.`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; border-radius: 10px; padding: 20px; background-color: #fffafc;">
          <h2 style="color: #c62828;">We Regret to Inform You</h2>
          <p style="font-size: 16px; color: #333;">Hello <strong>${userName}</strong>,</p>
          <p style="font-size: 16px; color: #333;">
            Thank you for applying to the <strong>${scholarshipTitle}</strong> scholarship. After careful review, we regret to inform you that your application has not been approved at this time.
          </p>
          <p style="font-size: 16px; color: #333;">
            We encourage you to apply again in the future and explore other opportunities we may offer.
          </p>
          <hr style="margin: 20px 0;">
          <p style="font-size: 14px; color: #777;">
            Wishing you the best in your academic journey.<br>
            — The Square Foundation Team
          </p>
        </div>
      `,
    });

    if (!isMailsent) {
      return res.status(500).json({
        message: errorMessage,
      });
    }
  } catch (err) {
    console.log("Error rejecting application : ", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const approvedApplication = async (req, res) => {
  try {
    const approvedApps = await FormDetails.find({ status: "approved" });

    const allDocs = await FormDetails.find();

    let approvedApplications = [];

    // Extract only approved applications from each document
    allDocs.forEach((doc) => {
      const approved = doc.application.filter(
        (app) => app.status === "approved"
      );

      approved.forEach((app) => {
        approvedApplications.push({
          _id: doc._id,
          ...app,
        });
      });
    });

    console.log("approvedApps :", approvedApplications);
    res.status(200).json({
      status: "success",
      message: "Approved Data sent Successfully",
      data: approvedApplications,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching approved applications." });
  }
};

module.exports = {
  adminLogin,
  adminLogout,
  applications,
  approveApplication,
  rejectApplication,
  approvedApplication,
};
