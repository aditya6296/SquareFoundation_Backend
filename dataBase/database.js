const mongoose = require("mongoose");

const DBUrl = process.env.MONGO_DB_URL;
const dbPassword = process.env.dbPass;

const pass = DBUrl.replace("<db_password>", dbPassword);
console.log(pass);
mongoose
  .connect(pass, {
    dbName: process.env.MONGO_DB_DATABASE_NAME,
  })

  .then(() => {
    console.log("Database connected Successfully ✅✅");
  })
  .catch((err) => {
    console.log("DataBase connected Failed ❌", err);
  });
