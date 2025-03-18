const mongoose = require("mongoose");

const scholarshipSchema = new mongoose.Schema(
  {
    scholarshipId: {
      type: String,
      required: true,
      unique: true,
    },
    title: { type: String, required: true },
    description: { type: String },
    startDate: { type: Date },
    endDate: { type: Date },
    details: [
      {
        heading: { type: String },
        details: { type: [String] },
      },
    ],
  },
  { timestamps: true }
);

const Scholarship = mongoose.model("ScholarshipList", scholarshipSchema);

module.exports = { Scholarship };
