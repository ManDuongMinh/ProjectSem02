import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function Login() {
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const res = await axios.post("http://127.0.0.1:8000/api/login", {
        email,
        password: pwd,
      });

      // API Laravel trả về user + token
      const user = res.data.user;
      const token = res.data.token;

      if (!user) {
        setError("Invalid login information.");
        return;
      }

      // lưu token vào localStorage
      if (remember) {
        localStorage.setItem("token", token);
      }

      localStorage.setItem("user", JSON.stringify(user));
      setSuccess("Login successful!");

      // điều hướng theo role
      if (user.ARole === "Admin") {
        navigate("/admin/users");
      } else if (user.ARole === "Instructor") {
        navigate("/instructor/dashboard");
      } else {
        navigate("/learner/dashboard");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed.");
    }
  };

  return (
    <div className="login-wrapper">
      <div className="card">
        <h1>Login</h1>
        <form onSubmit={handleLogin}>
          <div>
            <label>Email</label>
            <input
              type="email"
              className="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label>Password</label>
            <input
              type="password"
              className="input"
              value={pwd}
              onChange={(e) => setPwd(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <div className="row">
            <label>
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
              />
              Remember me
            </label>
          </div>

          {error && <p className="error">{error}</p>}
          {success && <p className="success">{success}</p>}

          <button type="submit" className="btn btn-primary">
            Login
          </button>
        </form>

        <div className="footer">
          Don’t have an account? <Link to="/register">Register</Link>
        </div>
      </div>
    </div>
  );
}
