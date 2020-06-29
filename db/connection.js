// Dependencies
const mongoose = require("mongoose");

// Get the connection string
// const uri = "mongodb://localhost/taskify-boards";
const uri = process.env.MONGO_URI;

// Connection function
const connectToDB = async () => {
  try {
    const connection = await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    });

    console.log(`MongoDB Connected @ ${connection.connection.host}`);
  } catch (ex) {
    console.log(ex);
    process.exit(1);
  }
};

// Export
module.exports = connectToDB;
