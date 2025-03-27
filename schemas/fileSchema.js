const mongoose = require("mongoose");

const fileSchma = mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
    },
    scholarshipId: {
      type: mongoose.Schema.Types.ObjectId,
      type: String,
      required: true,
    },
    fileName: {
      type: String,
      // required: true,
    },
    filePath: {
      type: String,
      // required: true,
    },
    fileType: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const fileModel = mongoose.model("files", fileSchma);

module.exports = { fileModel };
