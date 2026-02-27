const mongoose = require("mongoose");

let conn = null;

const connectDB = async () => {
  if (conn) return conn;

  conn = await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  console.log("MongoDB Connected");
  return conn;
};

module.exports = connectDB; 