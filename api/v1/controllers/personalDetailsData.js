const cloudinary = require("../../../config/cloudnary");
const { fileModel } = require("../../../schemas/fileSchema");
const { FormDetails } = require("../../../schemas/formDetailSchema");
const fsPromises = require("fs/promises");

const personalDetailsData = async (req, res) => {
  try {
    const userID = req.user.userID; // Get userID from token

    const { body } = req;

    const { scholarshipId: applicationId, ...formPersonalData } = req.body;

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
    const { scholarshipId: applicationId, ...formAcademicData } = req.body;

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

const createFileDocumentInMongoDB = async (req, res) => {
  try {
    const userID = req.user.userID;
    if (!userID)
      return { error: "Unauthorized: User ID not found", status: 401 };

    const { id: applicationId } = req.params;
    const files = req.files;
    if (!files) return { error: "No file uploaded", status: 400 };

    const fileData = {};
    Object.keys(files).forEach((key) => {
      fileData[key] = files[key].map((file) => ({
        originalFileName: file.originalname || "",
        fileName: file.filename || "",
        filePath: file.path || "",
        fileSize: file.size || 0,
        fileType: file.mimetype || "",
        metaData: {
          uploadTime: new Date(),
          multerPath: file.path || "",
        },
      }));
    });

    const existApplication = await FormDetails.findOne({
      "application.userId": userID,
      "application.applicationId": applicationId,
    });

    if (existApplication) {
      const updatedDocumentApplication = await FormDetails.findOneAndUpdate(
        {
          "application.userId": userID,
          "application.applicationId": applicationId,
        },
        { $set: { "application.$.uploadDocuments": fileData } },
        { new: true }
      );
      return { status: 200, data: updatedDocumentApplication };
    } else {
      const createFile = await FormDetails.create({
        application: [
          {
            userId: userID,
            applicationId,
            uploadDocuments: fileData,
          },
        ],
      });

      return { status: 201, data: createFile };
    }
  } catch (err) {
    console.log(err);
    return { error: "Internal Server Error", status: 500 };
  }
};

const uploadFileToCloudinary = async (
  file,
  documentType,
  userID,
  applicationId
) => {
  console.log("Hello cloudinary");
  console.log("file at uploadfilecloudnary :", Object.keys(file));

  try {
    const filePath = file.filePath;
    if (!filePath) throw new Error("File path not found!");

    const result = await cloudinary.uploader.upload(filePath, {
      folder: "upload",
      timeout: 60000,
    });

    console.log("✅ Uploaded to Cloudinary:", result.secure_url);

    const updateResult = await FormDetails.findOneAndUpdate(
      {
        application: {
          $elemMatch: {
            userId: userID,
            applicationId: applicationId,
          },
        },
      },
      {
        $set: {
          [`application.$[app].uploadDocuments.${documentType}.$[doc].metaData.cloudinaryUrl`]:
            result.secure_url,
        },
      },
      {
        arrayFilters: [
          {
            "app.userId": userID,
            "app.applicationId": applicationId,
          },
          {
            "doc.filePath": filePath,
          },
        ],
        new: true,
      }
    );

    console.log("✅ MongoDB updated:", updateResult ? "Success" : "Failed");

    return true;
  } catch (err) {
    console.log("❌ Error in uploadFileToCloudinary:", err.message);
    return false;
  }
};

// const deleteFileFromServer = async (file) => {
//   try {
//     const filePath =
//       file.uploadDocuments.photo?.filePath || file.metaData.multerPath;
//     if (!filePath) return;
//     await fsPromises.rm(filePath);
//     console.log("File deleted from server ✅");
//   } catch (err) {
//     console.log("---------------------------------");
//     console.log("❌❌❌❌ File Deletion from Server Failed ❌❌❌❌");
//     console.log(err);
//     console.log("---------------------------------");
//     return false;
//   }
// };

const createFile = async (req, res) => {
  try {
    const documentCreated = await createFileDocumentInMongoDB(req, res);

    if (!documentCreated || !documentCreated.data) {
      return res
        .status(500)
        .json({ status: "Fail", message: "No document created" });
    }

    const { userID } = req.user;
    const { id: applicationId } = req.params;
    const uploadDocuments = documentCreated.data.application[0].uploadDocuments;

    const documentKeys = [
      "photo",
      "identityProof",
      "academicTranscript",
      "personalStatement",
    ];

    for (const key of documentKeys) {
      if (uploadDocuments[key] && uploadDocuments[key].length > 0) {
        for (const file of uploadDocuments[key]) {
          if (file.filePath) {
            await uploadFileToCloudinary(file, key, userID, applicationId);
          }
        }
      }
    }

    return res.status(201).json({
      status: "Success",
      message: "File uploaded successfully",
      data: documentCreated,
    });
  } catch (err) {
    console.log("Error in createFile:", err);
    return res
      .status(500)
      .json({ status: "fail", message: "Internal Server Error" });
  }
};

const reviewData = async (req, res) => {
  try {
    const userID = req.user.userID;
    if (!userID) {
      return res.status(401).json({
        status: "Fail",
        message: "Unauthorized: User ID not found",
      });
    }

    const { id: applicationId } = req.params;
    console.log("applicationId in review api -> :", applicationId);

    const filledData = await FormDetails.findOne({
      "application.userId": userID,
      "application.applicationId": applicationId,
    });
    console.log("filledData", filledData);
    if (filledData) {
      return res.status(200).json({
        status: "success",
        message: "Review data send successfully",
        data: filledData, // Send the existing application data
      });
    } else {
      return res
        .status(404)
        .json({ exists: false, message: "Application details not found" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: "fail",
      message: "Internal Server Error",
    });
  }
};

module.exports = {
  personalDetailsData,
  showPersonalDetail,
  academicDetailsData,
  createFile,
  reviewData,
};
