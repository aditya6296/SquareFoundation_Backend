// scripts/createAdmin.js

const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
require("dotenv").config();
const { Admin } = require("../schemas/adminSchema");

const email = "admin@squarefoundation.org";
const plainPassword = "Admin@123";

// ⬇️ DB connection setup (clean & secure)
const DBUrl = process.env.MONGO_DB_URL;
const dbPassword = process.env.dbPass;
const dbName = process.env.MONGO_DB_DATABASE_NAME;

const fullMongoURL = DBUrl.replace("<db_password>", dbPassword);

async function createAdmin() {
  try {
    await mongoose.connect(fullMongoURL, {
      dbName: dbName,
    });

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      console.log("⚠️ Admin with this email already exists.");
      return mongoose.connection.close();
    }

    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    const admin = new Admin({
      email,
      password: hashedPassword,
      accessLevel: "superadmin",
    });

    await admin.save();
    console.log("✅ Superadmin created successfully!");
  } catch (err) {
    console.error("❌ Error creating admin:", err.message);
  } finally {
    mongoose.connection.close();
  }
}

createAdmin();
