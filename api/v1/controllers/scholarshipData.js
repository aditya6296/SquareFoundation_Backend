const { Scholarship } = require("../../../schemas/scholarship");

const scholarshipData = async (req, res) => {
  try {
    const { body } = req;
    const { scholarshipId, title, description, startDate, endDate, details } =
      body;
    console.log(scholarshipId, title, description, startDate, endDate, details);
    console.log("Received Data:", req.body);
    console.log("Before Save:", scholarshipId);
    const resultData = await Scholarship.create({
      scholarshipId,
      title,
      description,
      startDate,
      endDate,
      details,
    });
    console.log("resultData --> ", resultData);
    res.status(200).json({
      status: "success",
      message: "sholarship created successfully !",
    });
  } catch (err) {
    console.log(err, err.message);
    res.status(500).json({
      status: "error",
      message:
        err.message || "An error occurred while creating the scholarship",
    });
  }
};

const getScholarshipData = async (req, res) => {
  try {
    const scholarshipList = await Scholarship.find();

    // Check if there are any records
    if (scholarshipList.length === 0) {
      return res.status(404).json({
        status: "Fail",
        message: "No scholarships found!",
      });
    }
    res.status(200).json({
      status: "success",
      message: "Scholarships fetched successfully!",
      data: scholarshipList,
    });
  } catch (err) {
    console.log(err, err.message);
    res.status(500).json({
      status: "error",
      message: err.message || "An error occurred while getting the scholarship",
    });
  }
};

const scholarshipViewDetailData = async (req, res) => {
  try {
    console.log("req.body :", req.body);
    const bodyData = req.body; // Array of details data

    // const [] destructure an array
    // Step 1: Validate the body data is an array
    if (!Array.isArray(bodyData)) {
      return res.status(400).json({
        status: "fail",
        message: "Invalid data format! Expected an array of details.",
      });
    }

    // Step 2: Loop through the body data to process each item
    const { scholarshipId, details } = bodyData[0]; // Assuming only one scholarshipId in the body

    if (!scholarshipId || !details || !Array.isArray(details)) {
      return res.status(400).json({
        status: "fail",
        message:
          "Invalid data! Please provide valid scholarshipId and details array.",
      });
    }

    // Step 3: Create the viewDetails document with multiple headings under the same scholarshipId
    const data = await Scholarship.create({
      scholarshipId, // Link to the scholarship
      details, // Array of details (heading + details)
    });

    console.log("View Detail Created:", data);

    res.status(200).json({
      status: "success",
      message: "View Details created successfully!",
    });
  } catch (err) {
    console.log(err, err.message);
    res.status(500).json({
      status: "error",
      message:
        err.message ||
        "An error occurred while creating the sholarshipViewDetailData",
    });
  }
};

const getScholarshipViewDetailData = async (req, res) => {
  try {
    // const { id } = req.params; // Get the scholarship id from URL params

    // Step 1: Fetch the scholarship by ID
    // const scholarship = await ScholarshipModel.findOne({ id });

    // if (!scholarship) {
    //   return res.status(404).json({
    //     status: "fail",
    //     message: "Scholarship not found.",
    //   });
    // }
    // console.log("get >>>>>>>>>>");

    // // Step 2: Fetch all details associated with this scholarship using scholarshipId
    // const details = await viewDetailsData.find({ scholarshipId: id });

    // // Step 3: Return both the scholarship and its details
    // res.status(200).json({
    //   status: "success",
    //   scholarship,
    //   details,
    // });

    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        status: "fail",
        message: "Scholarship ID is required!",
      });
    }

    console.log("Fetching details for scholarship ID:", id);

    const scholarship = await Scholarship.findOne({ id: id });
    console.log("Scholarship found:", scholarship);

    if (!scholarship) {
      return res.status(404).json({
        status: "fail",
        message: "Scholarship not found.",
      });
    }

    const details = await Scholarship.find({ scholarshipId: id });
    console.log("details found:", details);

    res.status(200).json({
      status: "success",
      scholarship,
      details,
    });
  } catch (err) {
    console.log(err, err.message);
    res.status(500).json({
      status: "error",
      message:
        err.message ||
        "An error occurred while geting the sholarshipViewDetailData",
    });
  }
};

module.exports = {
  scholarshipData,
  getScholarshipData,
  scholarshipViewDetailData,
  getScholarshipViewDetailData,
};
