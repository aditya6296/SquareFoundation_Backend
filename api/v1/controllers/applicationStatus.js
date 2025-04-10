const { FormDetails } = require("../../../schemas/formDetailSchema");
const { Scholarship } = require("../../../schemas/scholarship");

const applicationStatus = async (req, res) => {
  try {
    const userID = req.user.userID;

    // Fetch all applications of the user
    const scholarshipApplied = await FormDetails.find({
      "application.userId": userID,
    });

    if (!scholarshipApplied || scholarshipApplied.length === 0) {
      return res.status(404).json({
        message: "No scholarship applications found for this user",
        AppliedData: [],
      });
    }

    // Extract all applied scholarship IDs
    const scholarshipIds = scholarshipApplied.flatMap((doc) =>
      doc.application.map((app) => app.applicationId)
    );

    console.log("scholarshipIds :", scholarshipIds);

    // Fetch scholarship details for these IDs
    const scholarships = await Scholarship.find({
      scholarshipId: { $in: scholarshipIds },
    });

    const scholarshipMap = {};
    scholarships.forEach((scholarship) => {
      scholarshipMap[scholarship.scholarshipId] = scholarship.title;
    });

    const updatedApplications = scholarshipApplied.map((doc) => ({
      _id: doc._id,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
      application: doc.application.map((app) => ({
        ...app.toObject(),
        scholarshipTitle:
          scholarshipMap[app.applicationId] || "Title Not Found",
      })),
    }));

    res.status(200).json({
      message: "Application status Data sent successfully",
      AppliedData: updatedApplications,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

module.exports = { applicationStatus };
