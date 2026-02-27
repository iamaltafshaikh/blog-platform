import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import BlogForm from "./components/BlogForm";
import BlogList from "./components/BlogList";
import Login from "./components/Login";
import Register from "./components/Register";
import API from "./api";
import "./App.css";

function App() {
  const [token, setToken] = useState(
    () => localStorage.getItem("token")
  );

  const [blogs, setBlogs] = useState([]);
  const [showRegister, setShowRegister] = useState(false);
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState(null);
  const [editingBlog, setEditingBlog] = useState(null);

  // 🔥 Decode current user
  const currentUserId = token
    ? jwtDecode(token).id
    : null;

  // 🌙 Dark mode
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.body.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  // 📥 Fetch all blogs (public)
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await API.get("/getBlogs");
        setBlogs(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchBlogs();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  const showToast = (message, error = false) => {
    setToast({ message, error });
    setTimeout(() => setToast(null), 3000);
  };

  // 🗑 Delete blog
  const handleDelete = async (blogId) => {
    try {
      await API.post("/deleteBlog", { blogId });

      setBlogs((prev) =>
        prev.filter((blog) => blog._id !== blogId)
      );

      showToast("Blog deleted");
    } catch (err) {
      showToast("Delete failed", true);
    }
  };

  // ✏ Edit blog
  const handleEdit = (blog) => {
    setEditingBlog(blog);
    setShowModal(true);
  };

  // 🔐 Login/Register screen
  if (!token) {
    return (
      <div className="auth-wrapper">
        {showRegister ? (
          <Register setShowRegister={setShowRegister} />
        ) : (
          <Login
            setToken={setToken}
            setShowRegister={setShowRegister}
          />
        )}
      </div>
    );
  }

  return (
    <div className="dashboard">

      <aside className="sidebar">
        <h2>Blog Admin</h2>

        <button
          onClick={() => {
            setEditingBlog(null);
            setShowModal(true);
          }}
        >
          + New Blog
        </button>

        <button onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? "Light Mode ☀️" : "Dark Mode 🌙"}
        </button>

        <button onClick={handleLogout}>
          Logout
        </button>
      </aside>

      <main className="main-content">
        <div className="header">
          <h1>Blogs</h1>
        </div>

        {blogs.length === 0 ? (
          <div className="empty-state">
            <h3>No blogs yet</h3>
            <p>Create your first blog post</p>
          </div>
        ) : (
          <BlogList
            blogs={blogs}
            currentUserId={currentUserId}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </main>

      {/* 🧾 Modal for Create / Edit */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>
              {editingBlog ? "Edit Blog" : "Create Blog"}
            </h2>

            <BlogForm
              initialValues={editingBlog}
              onSubmit={async (formData) => {
                try {
                  if (editingBlog) {
                    const res = await API.post("/updateBlog", {
                      blogId: editingBlog._id,
                      ...formData
                    });

                    setBlogs((prev) =>
                      prev.map((b) =>
                        b._id === editingBlog._id
                          ? res.data
                          : b
                      )
                    );

                    showToast("Blog updated");
                  } else {
                    const res = await API.post(
                      "/createBlog",
                      formData
                    );

                    setBlogs((prev) => [
                      res.data,
                      ...prev
                    ]);

                    showToast("Blog created");
                  }

                  setShowModal(false);
                  setEditingBlog(null);

                } catch (err) {
                  showToast("Operation failed", true);
                }
              }}
              onCancel={() => {
                setEditingBlog(null);
                setShowModal(false);
              }}
            />
          </div>
        </div>
      )}

      {/* 🔔 Toast */}
      {toast && (
        <div className={`toast ${toast.error ? "error" : ""}`}>
          {toast.message}
        </div>
      )}

    </div>
  );
}

export default App;