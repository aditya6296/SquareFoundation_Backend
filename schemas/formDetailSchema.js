const mongoose = require("mongoose");

const formData = mongoose.Schema(
  {
    application: [
      {
        userId: { type: String, required: true },
        applicationId: { type: String, required: true },

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
          identificationId: {
            type: String,
            enum: ["Aadhaar", "PAN", "Voter ID", "Passport", "Driving License"],
            required: true, // Ensures a document is uploaded
          },
          documentUrl: {
            type: String, // This will store the file URL or path
            // required: true, // Ensures a document is uploaded
            trim: true, // Removes unnecessary spaces
          },
        },
      },
    ],
  },
  { timestamps: true }
);

const FormDetails = mongoose.model("Details", formData);

module.exports = { FormDetails };
