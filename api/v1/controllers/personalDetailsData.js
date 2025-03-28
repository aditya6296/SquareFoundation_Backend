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
    if (!userID) {
      // return res.status(401).json({
      //   status: "Fail",
      //   message: "Unauthorized: User ID not found",
      // });
      return { error: "Unauthorized: User ID not found", status: 401 };
    }

    const { id: applicationId } = req.params;
    console.log("applicationId in fles api -> :", applicationId);

    const files = req.files;
    console.log("files at upload api -> :", files);
    if (!req.files) {
      //
      return { error: "No file uploaded", status: 400 };
    }

    const fileData = {};
    Object.keys(files).forEach((key) => {
      fileData[key] = {
        originalFileName: files[key][0].originalname || "",
        fileName: files[key][0].filename || "",
        filePath: files[key][0].path || "",
        fileSize: files[key][0].size || 0,
        fileType: files[key][0].mimetype || "",
        metaData: {
          uploadTime: new Date(),
          multerPath: files[key][0].path || "", // Local storage path
        },
      };
    });

    console.log("Files at filrData ➡️😊:", files);

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
        // { $set: { "application.$.uploadDocuments.photo": [fileData] } }, // Replace personal details
        { $set: { "application.$.uploadDocuments": fileData } },
        { new: true } // Return updated document
      );

      return { status: 200, data: updatedDocumentApplication };
    } else {
      // $set updates only a specific field inside an existing document.
      // $push adds an element to an existing array inside a document.

      const createFile = await FormDetails.create({
        application: [
          {
            userId: userID,
            applicationId,
            uploadDocuments: fileData,
          },
        ],
      });

      return res.status(201).json({
        status: "success",
        message: "Document upload successfully",
        data: {
          file: createFile,
        },
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      status: "fail",
      message: "Internal Server Error",
    });
  }
};

const uploadFileToCloudinary = async (file) => {
  console.log("Hello cloudinary");
  console.log("file at uploadfilecloudnary :", Object.keys(file));

  try {
    const filePath = file.filePath;

    console.log(
      "file path at uploadfilecloudnary at file path :",
      file.filePath
    );
    if (!filePath) throw new Error("File path not found!");

    console.log("console cloudinary =>", cloudinary);

    const result = await cloudinary.uploader.upload(filePath, {
      folder: "upload",
      timeout: 60000,
    });

    console.log("result at uploadFileToCloudinary :", result);

    try {
      await FormDetails.findOneAndUpdate(
        {
          "application.uploadDocuments.photo.filePath": filePath, // Find the specific file entry
        },
        {
          $set: {
            "application.$.uploadDocuments.photo.$.metaData.cloudinaryUrl":
              result.secure_url || result.url,
          },
        }
      );

      return true;
    } catch (err) {
      console.log("---------------------------------");
      console.log("❌❌❌❌ File UPDATE Error ❌❌❌❌");
      console.log(err);
      console.log("---------------------------------");
      return false;
    }
  } catch (err) {
    console.log("---------------------------------");
    console.log("❌❌❌❌ Cloudinary Error ❌❌❌❌");
    console.log(err);
    console.log("---------------------------------");
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
    console.log(
      "documentCreated data :",
      documentCreated.data.application[0].uploadDocuments
    );

    if (!documentCreated || !documentCreated.data) {
      console.log("❌ No document created, skipping Cloudinary upload.");
      return res
        .status(500)
        .json({ status: "Fail", message: "No document created" });
    }

    const uploadDocuments = documentCreated.data.application[0].uploadDocuments;
    if (!uploadDocuments) {
      console.log("❌ No documents found to upload.");
      return res
        .status(400)
        .json({ status: "Fail", message: "No documents uploaded" });
    }

    const documentKeys = [
      "photo",
      "identityProof",
      "academicTranscript",
      "personalStatement",
    ];

    for (let i = 0; i < documentKeys.length; i++) {
      const key = documentKeys[i];

      if (uploadDocuments[key] && uploadDocuments[key].length > 0) {
        for (const file of uploadDocuments[key]) {
          if (file.filePath) {
            console.log(`📤 Uploading file: &{file.filePath}`);

            const isFileUploadedToCloudinary = await uploadFileToCloudinary(
              file
            );

            if (isFileUploadedToCloudinary) {
              console.log(`✅ Successfully uploaded: ${file.filePath}`);
            } else {
              console.log(`❌ Failed to upload: ${file.filePath}`);
            }
          } else {
            console.log(`❌ Missing filePath for ${key}`);
          }
        }
      } else {
        console.log(`⚠️ No files found for ${key}`);
      }
    }

    return res.status(201).json({
      status: "Success",
      message: "File uploaded successfully",
      data: documentCreated,
    });
  } catch (err) {
    console.log("------------------------");
    console.log(err);
    console.log("------------------------");
    return res.status(500).json({
      status: "fail",
      message: "Internal Server Error",
    });
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
