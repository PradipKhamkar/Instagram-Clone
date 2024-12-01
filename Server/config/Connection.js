const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    mongoose.set("strictQuery", true);
    console.log('env',process.env.DB_URL)
    await mongoose.connect(process.env.DB_URL);
    console.log("App Is Connected To Database Successfully...!!");
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = connectDB;
