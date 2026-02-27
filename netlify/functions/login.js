const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const connectDB = require("./db");
const { User } = require("./models");

exports.handler = async (event) => {
  await connectDB();
  const { email, password } = JSON.parse(event.body);

  const user = await User.findOne({ email });
  if (!user)
    return { statusCode: 400, body: "User not found" };

  const valid = await bcrypt.compare(password, user.password);
  if (!valid)
    return { statusCode: 400, body: "Invalid credentials" };

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

  return {
    statusCode: 200,
    body: JSON.stringify({ token })
  };
};