const jwt = require("jsonwebtoken");
const connectDB = require("./db");
const { Blog, User } = require("./models");

exports.handler = async (event) => {
  try {
    await connectDB();

    const authHeader = event.headers.authorization;
    const token = authHeader?.split(" ")[1];

    if (!token) {
      return {
        statusCode: 401,
        body: JSON.stringify({ message: "No token provided" })
      };
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const { title, content } = JSON.parse(event.body);

    const user = await User.findById(decoded.id);

    const blog = await Blog.create({
      title,
      content,
      userId: decoded.id,
      author: user.email
    });

    return {
      statusCode: 200,
      body: JSON.stringify(blog)
    };

  } catch (err) {
    console.error("CREATE BLOG ERROR:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Error creating blog" })
    };
  }
};