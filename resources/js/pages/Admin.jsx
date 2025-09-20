import React from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function Admin() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post("http://127.0.0.1:8000/api/logout", {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/login");
    }
  };

  return (
    <div className="container" style={{ textAlign: "center", marginTop: "40px" }}>
      {/* Header */}
      <div
        className="row"
        style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}
      >
        <h1>Admin Dashboard</h1>
        <button onClick={handleLogout} className="btn btn-del">Logout</button>
      </div>

      {/* Navigation cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "20px",
          marginTop: "30px"
        }}
      >
        <Link to="/admin/users" className="btn btn-primary">👥 Manage Users</Link>
        <Link to="/admin/courses" className="btn btn-primary">📚 Manage Courses</Link>
        <Link to="/admin/reports" className="btn btn-primary">📊 Manage Reports</Link>
        <Link to="/admin/feedback" className="btn btn-primary">💬 Manage Feedback</Link>
      </div>

      {/* Footer */}
      <p style={{ marginTop: "40px", color: "gray" }}>
        Welcome to the admin dashboard. Choose a section above to manage the system.
      </p>
    </div>
  );
}
