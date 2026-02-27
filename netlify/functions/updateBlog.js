const jwt = require("jsonwebtoken");
const connectDB = require("./db");
const { Blog } = require("./models");

exports.handler = async (event) => {
  try {
    await connectDB();

    const authHeader = event.headers.authorization;
    const token = authHeader?.split(" ")[1];

    if (!token) {
      return {
        statusCode: 401,
        body: JSON.stringify({ message: "Unauthorized" })
      };
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const { blogId, title, content } = JSON.parse(event.body);

    const blog = await Blog.findById(blogId);

    if (!blog) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "Blog not found" })
      };
    }

    if (blog.userId.toString() !== decoded.id) {
      return {
        statusCode: 403,
        body: JSON.stringify({ message: "Not allowed" })
      };
    }

    blog.title = title;
    blog.content = content;
    await blog.save();

    return {
      statusCode: 200,
      body: JSON.stringify(blog)
    };

  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Error updating blog" })
    };
  }
};