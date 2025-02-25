const { SquareFormData } = require("../../../schemas/formSchema");

const userFormData = async (req, res) => {
  try {
    const { formData } = req.body;
    console.log("body formDAta ------>", formData);

    const result = await SquareFormData.create({
      ...formData,
    });

    console.log("result---][][][", result);
    res.status(201).json({
      status: "Sucsess",
      message: "User create Successfully",
      data: result,
    });
  } catch (err) {
    res.status(500).json({
      status: "Fail",
      message: "Internal Server Error",
    });
    console.log(err.message);
  }
};

module.exports = { userFormData };
