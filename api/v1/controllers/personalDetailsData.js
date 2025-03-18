const { FormDetails } = require("../../../schemas/formDetailSchema");

const personalDetailsData = async (req, res) => {
  try {
    const userID = req.user.userID; // Get userID from token
    console.log("req.user ...---: ", req.user);
    console.log("req.userID ...---: ", req.user.userID);
    const { body } = req;
    console.log("personal - body data: ", body);
    const { scholarshipId: applicationId, ...formPersonalData } = req.body;
    console.log("applicationId ... : ", applicationId);
    console.log("formPersonalData---", formPersonalData);

    const existApplication = await FormDetails.findOne({
      "application.userId": userID,
      "application.applicationId": applicationId,
    });
    console.log("scholarship", existApplication);

    // $set updates only a specific field inside an existing document.
    // $push adds an element to an existing array inside a document.

    if (existApplication) {
      const updatedApplication = await FormDetails.findOneAndUpdate(
        {
          "application.userId": userID,
          "application.applicationId": applicationId,
        },
        { $set: { "application.$.personalDetails": formPersonalData } }, // Replace personal details
        { new: true } // Return updated document
      );

      return res.status(200).json({
        status: "Updated",
        message: "Your application details have been updated.",
        data: updatedApplication,
      });
    } else {
      const newApplication = await FormDetails.create({
        application: [
          {
            userId: userID,
            applicationId,
            personalDetails: formPersonalData, // Add personal details inside application array
          },
        ],
      });

      console.log("userID .. :", userID);

      console.log("result --><<<<>>>>>", newApplication);

      res.status(201).json({
        status: "success",
        message: "Personal Detail Created Successfully",
        data: newApplication,
      });
    }
  } catch (err) {
    res.status(500).json({
      status: "Fail",
      message: "Internal Server Error",
    });
    console.log(err.message);
  }
};

const showPersonalDetail = async (req, res) => {
  try {
    const userID = req.user.userID;
    const { scholarshipID } = req.params; // Get scholarshipID from URL
    const personalDetails = await FormDetails.findOne({
      userID,
      scholarshipID,
    });

    console.log("userID .. :", userID);

    if (!personalDetails) {
      return res.status(404).json({ status: "Fail", message: "No data found" });
    }

    res.status(200).json({
      status: "success",
      data: personalDetails,
    });
  } catch (err) {
    res.status(500).json({
      status: "Fail",
      message: "Internal Server Error",
    });
    console.log(err.message);
  }
};

const academicDetailsData = async (req, res) => {
  try {
    const userID = req.user.userID; // Get userID from token
    if (!userID) {
      return res.status(401).json({
        status: "Fail",
        message: "Unauthorized: User ID not found",
      });
    }
    const { body } = req;
    console.log("Academic - body data: ", body);
    const { scholarshipId: applicationId, ...formAcademicData } = req.body;
    console.log("applicationId ... : ", applicationId);
    console.log("formPersonalData---", formAcademicData);

    const existApplication = await FormDetails.findOne({
      "application.userId": userID,
      "application.applicationId": applicationId,
    });
    console.log("existApplication at academicDetailsData : ", existApplication);

    if (existApplication) {
      const updatedApplication = await FormDetails.findOneAndUpdate(
        {
          "application.userId": userID,
          "application.applicationId": applicationId,
        },
        { $set: { "application.$.academicInformation": formAcademicData } }, // Replace personal details
        { new: true } // Return updated document
      );
      console.log("updatedApplication send to frontend :", updatedApplication);

      return res.status(200).json({
        status: "Updated",
        message: "Your application details have been updated.",
        data: updatedApplication,
      });
    } else {
      const newApplication = await FormDetails.create({
        application: [
          {
            userId: userID,
            applicationId,
            academicInformation: formAcademicData, // Add academicInformation details inside application array
          },
        ],
      });

      console.log(" Academic result -->>>>> :", newApplication);

      res.status(201).json({
        status: "success",
        message: "Academic Detail Created Successfully",
        data: newApplication,
      });
    }
  } catch (err) {
    res.status(500).json({
      status: "Fail",
      message: "Internal Server Error",
    });
    console.log(err.message);
  }
};

// const filesData = async (req, res) => {
//   try {
//     const userID = req.user.userID; // Get userID from token
//     if (!userID) {
//       return res.status(401).json({
//         status: "Fail",
//         message: "Unauthorized: User ID not found",
//       });
//     }
//     const { id: applicationId } = req.params; // Application ID from the URL
//     if (!req.file) {
//       return res.status(400).json({ message: "No file uploaded" });
//     }

//     // Find the application by applicationId
//     const application = await FormDetails.findOne({
//       "application.applicationId": applicationId,
//     });

//     if (!application) {
//       return res.status(404).json({ message: "Application not found" });
//     }

//     // Update the uploadDocuments field in the nested array
//     application.application.forEach((app) => {
//       if (app.applicationId === applicationId) {
//         app.uploadDocuments.documentUrl = req.file.path; // Save file path
//       }
//     });

//     await application.save();

//     res.status(201).json({
//       message: "File uploaded successfully",
//       documentUrl: req.file.path,
//     });
//   } catch (error) {
//     console.error("File upload error:", error);
//     res.status(500).json({ message: "File upload failed" });
//   }
// };

module.exports = {
  personalDetailsData,
  showPersonalDetail,
  academicDetailsData,
  // filesData,
};
