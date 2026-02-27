import { useState } from "react";

function BlogForm({ onSubmit, onCancel }) {
  const [form, setForm] = useState({
    title: "",
    content: ""
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
    setForm({ title: "", content: "" });
  };

  return (
    <form className="blog-form" onSubmit={handleSubmit}>

      <input
        type="text"
        placeholder="Blog Title"
        value={form.title}
        onChange={(e) =>
          setForm({ ...form, title: e.target.value })
        }
        required
      />

      <textarea
        placeholder="Write your content..."
        value={form.content}
        onChange={(e) =>
          setForm({ ...form, content: e.target.value })
        }
        required
      />

      <div className="modal-buttons">
        <button
          type="button"
          className="cancel-btn"
          onClick={onCancel}
        >
          Cancel
        </button>

        <button type="submit">
          Publish
        </button>
      </div>

    </form>
  );
}

export default BlogForm;