import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL; // ví dụ: http://127.0.0.1:8000/api

  // Lấy email lưu sẵn
  useEffect(() => {
    const saved = localStorage.getItem("elms-email");
    if (saved) {
      setEmail(saved);
      setRemember(true);
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // validate cơ bản
    if (!/^\S+@\S+\.\S+$/.test(email) || pwd.length < 6) {
      setError("Please enter a valid email and password (≥ 6).");
      return;
    }

    if (remember) localStorage.setItem("elms-email", email);
    else localStorage.removeItem("elms-email");

    try {
      const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password: pwd }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Invalid credentials");

      if (data.user) {
        // ✅ lưu user vào localStorage
        localStorage.setItem("user", JSON.stringify(data.user));

        setSuccess("Login successful! Redirecting…");

        // ✅ điều hướng theo role
        setTimeout(() => {
          if (data.user.ARole === "Admin") navigate("/admin/users");
          else if (data.user.ARole === "Instructor") navigate("/teacher");
          else navigate("/student");
        }, 1000);
      } else {
        setError("Account not found. Please register first.");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="register-wrapper">
      <div className="card">
        <h1>Sign in</h1>
        <form onSubmit={handleLogin}>
          <div>
            <label>Email</label>
            <input
              className="input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>
          <div>
            <label>Password</label>
            <input
              className="input"
              type="password"
              value={pwd}
              onChange={(e) => setPwd(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>
          <div>
            <label>
              <input
                type="checkbox"
                checked={remember}
                onChange={() => setRemember(!remember)}
              />{" "}
              Remember me
            </label>
          </div>

          {error && <p className="error">{error}</p>}
          {success && <p className="success">{success}</p>}

          <button type="submit" className="btn btn-primary">
            Continue
          </button>
        </form>

        <div className="footer">
          Don’t have an account? <Link to="/register">Register</Link>
        </div>
      </div>
    </div>
  );
}
