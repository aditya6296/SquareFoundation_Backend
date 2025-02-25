const mongoose = require("mongoose");

const DBUrl = process.env.MOGO_DB_URL;

let pass = DBUrl.replace("password", process.env.dbPass);
console.log(pass);
mongoose
  .connect(pass, {
    name: process.env.MONGO_DB_DATABASE_NAME,
  })

  .then(() => {
    console.log("Database connected Successfully ✅✅");
  })
  .catch((err) => {
    console.log("DataBase connected Failed ❌", err);
  });
