const connectDB = require("./db");
const { Blog } = require("./models");

exports.handler = async () => {
  try {
    await connectDB();

    // 🔥 Get ALL blogs sorted newest first
    const blogs = await Blog.find().sort({ createdAt: -1 });

    return {
      statusCode: 200,
      body: JSON.stringify(blogs)
    };

  } catch (err) {
    console.error("GET BLOGS ERROR:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Error fetching blogs" })
    };
  }
};