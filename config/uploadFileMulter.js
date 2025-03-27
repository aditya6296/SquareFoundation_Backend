const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./upload");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      `${Date.now()}-${Math.floor(Math.random() * 100)}-${file.originalname}`
    );
  },
});

// ✅ Fix: Allow multiple named fields
const upload = multer({ storage: storage }).fields([
  { name: "photo", maxCount: 1 },
  { name: "identityProof", maxCount: 1 },
  { name: "academicTranscript", maxCount: 1 },
  { name: "personalStatement", maxCount: 1 },
]);

// module.exports = multer({ storage: storage });
module.exports = upload; // ✅ Correct export
