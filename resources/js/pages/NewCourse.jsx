// src/pages/NewCourse.jsx
import "../../css/NewCourse.css";
import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

export default function NewCourse() {
  const [CName, setCName] = useState("");
  const [CDescription, setCDescription] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://127.0.0.1:8000/api/courses", {
        CName,
        CDescription,
      });
      setMessage("✅ Course added successfully!");
      setTimeout(() => {
        navigate("/admin/courses");
      }, 1200);
    } catch (err) {
      console.error("Error adding course:", err.response?.data || err.message);
      setMessage("❌ Add failed!");
    }
  };

  return (
    <div className="form-container">
      <div className="form-glass">
        <h1>Add New Course</h1>
        {message && (
          <p
            className={`message ${
              message.includes("✅") ? "success" : "error"
            }`}
          >
            {message}
          </p>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Course Name</label>
            <input
              type="text"
              value={CName}
              onChange={(e) => setCName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea
              rows="4"
              value={CDescription}
              onChange={(e) => setCDescription(e.target.value)}
            />
          </div>

          <div className="btn-group">
            <button type="submit" className="btn btn-primary">
              Save
            </button>
            <Link to="/admin/courses" className="btn-ghost">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
