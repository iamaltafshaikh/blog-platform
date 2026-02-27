import { useState } from "react";
import API from "../api";

function Register({ setShowRegister }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async () => {
  try {
    const res = await API.post("/register", form);

    setMessage(res.data.message);
    setError("");

    setTimeout(() => {
      setShowRegister(false);
    }, 1500);

  } catch (err) {
    if (err.response?.data?.message) {
      setError(err.response.data.message);
    } else {
      setError("Registration failed");
    }
  }
};

  return (
    <div className="login-container">
      <h2>Register</h2>

      <input
        type="email"
        placeholder="Email"
        onChange={(e) =>
          setForm({ ...form, email: e.target.value })
        }
      />

      <input
        type="password"
        placeholder="Password"
        onChange={(e) =>
          setForm({ ...form, password: e.target.value })
        }
      />

      <button onClick={handleRegister}>Register</button>

      {message && <p style={{ color: "lightgreen" }}>{message}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <p style={{ marginTop: "15px" }}>
        Already have an account?{" "}
        <span
          style={{ color: "blue", cursor: "pointer" }}
          onClick={() => setShowRegister(false)}
        >
          Login here
        </span>
      </p>
    </div>
  );
}

export default Register;