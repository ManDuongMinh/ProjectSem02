import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../../css/login.css"; // Đường dẫn tuỳ thư mục bạn

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://127.0.0.1:8000/api/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      if (res.data.user.ARole === "Admin") {
        navigate("/admin");
      } else {
        setMessage("❌ You are not authorized to access Admin area!");
        navigate("/");
      }
    } catch (err) {
      console.error(err);
      setMessage("❌ Login failed! Please check your email and password.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        {/* Logo / Title */}
        <h1 className="login-title">E-Learning Admin Login</h1>
        <p className="login-subtitle">Sign in to manage courses and users</p>

        {/* Error message */}
        {message && <p className="login-message">{message}</p>}

        {/* Form */}
        <form onSubmit={handleLogin} className="login-form">
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="form-input"
            />
          </div>

          <button type="submit" className="btn btn-primary login-btn">
            Login
          </button>
        </form>

        {/* Extra links */}
        <div className="login-links">
          <a href="/register">Create an account</a> | 
          <a href="/forgot-password"> Forgot password?</a>
        </div>
      </div>
    </div>
  );
}
