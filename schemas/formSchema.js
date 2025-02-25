const mongoose = require("mongoose");

const applicantSchema = mongoose.Schema({
  fullName: { type: String },
  email: { type: String },
  phone: { type: String },
  dateOfBirth: { type: Date },
  institution: { type: String },
  educationLevel: { type: String },
  fieldOfStudy: { type: String },
  gpa: { type: Number },
  reason: { type: String },
  documents: {
    photo: { type: String }, // Store file paths or URLs
    identityProof: { type: String },
    transcripts: { type: String },
    personalStatement: { type: String },
    // personalStatement: { type: String, required: true },
  },
  declaration: { type: Boolean },
  submittedAt: { type: Date, default: Date.now },
});

const SquareFormData = mongoose.model("SquareFormData", applicantSchema);

module.exports = { SquareFormData };
