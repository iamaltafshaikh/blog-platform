function BlogList({ blogs, currentUserId, onEdit, onDelete }) {

  if (!blogs || blogs.length === 0) return null;

  return (
    <div className="blog-grid">
      {blogs.map((blog) => (
        <div key={blog._id} className="blog-card">

          <h3>{blog.title}</h3>

          <p style={{ fontSize: "12px", opacity: 0.7 }}>
            By {blog.author}
          </p>

          <p>{blog.content}</p>

          {blog.userId === currentUserId && (
            <div className="card-actions">
              <button onClick={() => onEdit(blog)}>Edit</button>
              <button onClick={() => onDelete(blog._id)}>
                Delete
              </button>
            </div>
          )}

        </div>
      ))}
    </div>
  );
}

export default BlogList;