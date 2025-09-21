import "../../css/UserManagement.css"; // dùng lại CSS container, table, btn...
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

export default function CourseManagement() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(5);
  const [statusMap, setStatusMap] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/courses");
      setCourses(res.data);

      const map = {};
      res.data.forEach((c) => {
        map[c.CourseID] = c.CStatus || "Inactive";
      });
      setStatusMap(map);
    } catch (err) {
      console.error("Error fetching courses:", err);
    } finally {
      setLoading(false);
    }
  };

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

  const handleStatusChange = (id, value) => {
    setStatusMap((prev) => ({ ...prev, [id]: value }));
  };

  const handleSave = async (id) => {
    const newStatus = statusMap[id];
    const oldStatus = courses.find((c) => c.CourseID === id).CStatus;

    if (newStatus === oldStatus) {
      setMessage("No changes to save.");
      setTimeout(() => setMessage(""), 2500);
      return;
    }

    if (!window.confirm(`Change course ${id} status from ${oldStatus} to ${newStatus}?`)) {
      setStatusMap((prev) => ({ ...prev, [id]: oldStatus }));
      return;
    }

    try {
  await axios.put(
    `http://127.0.0.1:8000/api/courses/${id}`,
    { CStatus: newStatus },
    { headers: { "Content-Type": "application/json" } }
  );

  setCourses((prev) =>
    prev.map((c) =>
      c.CourseID === id ? { ...c, CStatus: newStatus } : c
    )
  );
  setMessage("Course updated successfully!");
} catch (err) {
  console.error("Error updating course:", err);
  setMessage("Update failed.");
}
 finally {
      setTimeout(() => setMessage(""), 2500);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;
    try {
      await axios.delete(`http://127.0.0.1:8000/api/courses/${id}`);
      setCourses((prev) => prev.filter((c) => c.CourseID !== id));
      setMessage("Course deleted successfully!");
    } catch (err) {
      console.error("Error deleting course:", err);
      setMessage("Delete failed.");
    } finally {
      setTimeout(() => setMessage(""), 2500);
    }
  };

  const indexOfLast = currentPage * rowsPerPage;
  const indexOfFirst = indexOfLast - rowsPerPage;
  const currentCourses = courses.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(courses.length / rowsPerPage);

  if (loading) return <p style={{ textAlign: "center" }}>Loading courses...</p>;

  return (
    <div className="container">
      <div className="row" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1>Admin • Course Management</h1>
        <button onClick={handleLogout} className="btn btn-del">Logout</button>
      </div>
      <Link to="/admin/courses/new" className="btn btn-primary">Add New Course</Link>
      {message && <p style={{ color: "lightgreen" }}>{message}</p>}

      <table>
        <thead>
          <tr>
            <th>Course ID</th>
            <th>Name</th>
            <th>Description</th>
            <th>Start Date</th>
            <th>Creator</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {currentCourses.map((c) => (
            <tr key={c.CourseID}>
              <td>{c.CourseID}</td>
              <td>{c.CName}</td>
              <td>{c.CDescription}</td>
              <td>{c.StartDate}</td>
              <td>{c.CreatorID}</td>
              <td>
                <select
                  value={statusMap[c.CourseID] || "Inactive"}
                  onChange={(e) => handleStatusChange(c.CourseID, e.target.value)}
                >
                  <option>Active</option>
                  <option>Inactive</option>
                </select>
              </td>
              <td>
                <div className="action-buttons">
                  <button
                    className="btn btn-save"
                    onClick={() => handleSave(c.CourseID)}
                    disabled={statusMap[c.CourseID] === c.CStatus}
                  >
                    Save
                  </button>
                  <button className="btn btn-del" onClick={() => handleDelete(c.CourseID)}>Delete</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="row">
        <button className="btn-ghost" disabled={currentPage === 1} onClick={() => setCurrentPage((p) => p - 1)}>Prev</button>
        {Array.from({ length: totalPages }, (_, i) => (
          <button key={i + 1} className={`btn-ghost ${currentPage === i + 1 ? "active" : ""}`} onClick={() => setCurrentPage(i + 1)}>
            {i + 1}
          </button>
        ))}
        <button className="btn-ghost" disabled={currentPage === totalPages} onClick={() => setCurrentPage((p) => p + 1)}>Next</button>
      </div>

      {/* Links */}
      <div className="row">
        <Link to="/admin" className="btn-ghost">Back to HomePage</Link>
        <Link to="/admin/users" className="btn-ghost">Go to User Management</Link>
        <Link to="/admin/reports" className="btn-ghost">Go to Report Management</Link>
        <Link to="/admin/feedback" className="btn-ghost">Go to Feedback Management</Link>
      </div>
    </div>
  );
}
