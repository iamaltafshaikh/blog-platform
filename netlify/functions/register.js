require("dotenv").config();
const bcrypt = require("bcryptjs");
const connectDB = require("./db");
const { User } = require("./models");

exports.handler = async (event) => {
  try {
    await connectDB();

    const { email, password } = JSON.parse(event.body);

    // 🔥 Check if user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: "User already exists with this email"
        })
      };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      email,
      password: hashedPassword
    });

    return {
      statusCode: 201,
      body: JSON.stringify({
        message: "User registered successfully"
      })
    };

  } catch (err) {
    console.error("REGISTER ERROR:", err);

    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Server error"
      })
    };
  }
};