const { FormDetails } = require("../../../schemas/formDetailSchema");
const { Scholarship } = require("../../../schemas/scholarship");

const DetailsData = async (req, res) => {
  const userID = req.user.userID; // Get userID from token
  console.log("userID ..: ", userID);
  const { id: applicationId } = req.params;
  console.log("scholarshipId .. ⭐:", applicationId);

  try {
    if (!userID || !applicationId) {
      return res
        .status(400)
        .json({ exists: false, message: "Invalid userID or applicationId" });
    }

    const existingApplication = await FormDetails.findOne({
      "application.userId": userID,
      "application.applicationId": applicationId,
    });
    console.log("existingApplication", existingApplication);
    if (existingApplication) {
      return res.status(200).json({
        status: "Exists",
        message: "You have already applied for this scholarship.",
        data: existingApplication, // Send the existing application data
      });
    } else {
      return res
        .status(404)
        .json({ exists: false, message: "Application details not found" });
    }

    // const matchedApplication = scholarship.application.find(
    //   (app) => app.userId === userID && app.applicationId === id
    // );

    // if (!matchedApplication) {
    //   return res
    //     .status(404)
    //     .json({ exists: false, message: "Application details not found" });
    // }

    // res.json({
    //   exists: true,
    //   message: "Scholarship found",
    //   data: matchedApplication,
    // });
  } catch (error) {
    console.error("Error checking scholarship:", error);
    res.status(500).json({ exists: false, message: "Server error" });
  }
};

const showDetailsData = () => {
  console.log("ShowData");
};

module.exports = { DetailsData, showDetailsData };
