function BlogCard({ blog, setBlogs, setEditingBlog }) {

const handleDelete = async () => {
  if (!window.confirm("Are you sure you want to delete this blog?")) return;

  try {
    await API.delete(`/deleteBlog?id=${blog._id}`);
    setBlogs((prev) => prev.filter((b) => b._id !== blog._id));
  } catch (err) {
    console.error(err);
  }
};
  return (
    <div className="blog-card">
      <h3>{blog.title}</h3>
      <p><strong>{blog.author}</strong> | {blog.date}</p>
      <p>{blog.content}</p>

      <div className="card-buttons">
        <button onClick={() => setEditingBlog(blog)}>Edit</button>
        <button onClick={handleDelete}>Delete</button>
      </div>
    </div>
  );
}

export default BlogCard;