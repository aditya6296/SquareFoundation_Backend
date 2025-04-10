const mongoose = require("mongoose");

const metaDataSchema = new mongoose.Schema({
  uploadTime: { type: Date, default: Date.now },
  multerPath: { type: String },
  cloudinaryUrl: { type: String },
});

const formData = mongoose.Schema(
  {
    application: [
      {
        userId: { type: String, required: true },
        applicationId: { type: String, required: true },

        status: {
          type: String,
          enum: ["pending", "approved", "rejected"],
          default: "pending",
        },

        personalDetails: {
          name: { type: String },
          email: { type: String },
          phoneNumber: { type: String },
          DOB: { type: Date },
          gender: { type: String },
          materialStatus: { type: String },
        },
        academicInformation: {
          collegeName: { type: String },
          educationLevel: { type: String },
          fieldOfStudy: { type: String },
          GPA: { type: String },
          yearOfStudy: { type: String },
          passOutYear: { type: String },
          reason: { type: String },
        },

        uploadDocuments: {
          photo: [
            {
              originalFileName: { type: String },
              fileName: { type: String },
              filePath: { type: String },
              fileSize: { type: Number },
              fileType: {
                type: String,
                required: true,
                enum: [
                  "image/jpeg",
                  "image/png",
                  "image/jpg",
                  "application/pdf",
                ],
              },
              metaData: metaDataSchema,
            },
          ],
          identityProof: [
            {
              identificationId: {
                type: String,
                required: true,
                enum: [
                  "Aadhaar",
                  "PAN",
                  "Voter ID",
                  "Passport",
                  "Driving License",
                ],
              },
              fileName: { type: String },
              filePath: { type: String, required: true }, // Stores uploaded ID proof
              fileSize: { type: Number },
              fileType: {
                type: String,
                required: true,
                enum: ["image/jpeg", "image/png", "application/pdf"],
              },
              metaData: metaDataSchema,
            },
          ],
          academicTranscript: [
            {
              fileName: { type: String },
              filePath: { type: String, required: true }, // Stores academic transcript
              fileSize: { type: Number },
              fileType: {
                type: String,
                required: true,
                enum: ["application/pdf", "image/jpeg", "image/png"],
              },
              metaData: {
                uploadTime: { type: Date, default: Date.now }, // Timestamp of file upload
                multerPath: { type: String }, // Local storage path
                cloudinaryUrl: { type: String }, // ✅ Cloudinary URL added
              },
            },
          ],
          personalStatement: [
            {
              fileName: { type: String },
              filePath: { type: String, required: true }, // Stores personal statement document
              fileSize: { type: Number },
              fileType: {
                type: String,
                required: true,
                enum: [
                  "application/pdf",
                  "application/msword",
                  "image/jpeg",
                  "image/png",
                ],
              },
              metaData: metaDataSchema,
            },
          ],
        },
      },
    ],
  },
  { timestamps: true }
);

const FormDetails = mongoose.model("Details", formData);

module.exports = { FormDetails };
