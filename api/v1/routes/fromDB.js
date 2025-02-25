const express = require("express");
const { userFormData } = require("../controllers/userFormDataController");

const formDB = express.Router();

formDB.post("/", userFormData);

module.exports = { formDB };
