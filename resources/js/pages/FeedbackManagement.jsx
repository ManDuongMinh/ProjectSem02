import "../../css/UserManagement.css";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

export default function FeedbackManagement() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(5);
  const [statusMap, setStatusMap] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/feedback");
      setFeedbacks(res.data);

      const map = {};
      res.data.forEach((f) => {
        map[f.FeedbackID] = f.FStatus || "Waiting";
      });
      setStatusMap(map);
    } catch (err) {
      console.error("Error fetching feedback:", err);
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
    const oldStatus = feedbacks.find((f) => f.FeedbackID === id).FStatus;

    if (newStatus === oldStatus) {
      setMessage("No changes to save.");
      setTimeout(() => setMessage(""), 2500);
      return;
    }

    if (!window.confirm(`Change feedback ${id} status from ${oldStatus} to ${newStatus}?`)) {
      setStatusMap((prev) => ({ ...prev, [id]: oldStatus }));
      return;
    }

    try {
      await axios.put(`http://127.0.0.1:8000/api/feedback/${id}`, { FStatus: newStatus });
      setFeedbacks((prev) =>
        prev.map((f) => (f.FeedbackID === id ? { ...f, FStatus: newStatus } : f))
      );
      setMessage("Feedback updated successfully!");
    } catch (err) {
      console.error("Error updating feedback:", err);
      setMessage("Update failed.");
    } finally {
      setTimeout(() => setMessage(""), 2500);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this feedback?")) return;
    try {
      await axios.delete(`http://127.0.0.1:8000/api/feedback/${id}`);
      setFeedbacks((prev) => prev.filter((f) => f.FeedbackID !== id));
      setMessage("Feedback deleted successfully!");
    } catch (err) {
      console.error("Error deleting feedback:", err);
      setMessage("Delete failed.");
    } finally {
      setTimeout(() => setMessage(""), 2500);
    }
  };

  const indexOfLast = currentPage * rowsPerPage;
  const indexOfFirst = indexOfLast - rowsPerPage;
  const currentFeedbacks = feedbacks.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(feedbacks.length / rowsPerPage);

  if (loading) return <p style={{ textAlign: "center" }}>Loading feedback...</p>;

  return (
    <div className="container">
      <div className="row" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1>Admin • Feedback Management</h1>
        <button onClick={handleLogout} className="btn btn-del">Logout</button>
      </div>
      {message && <p style={{ color: "lightgreen" }}>{message}</p>}

      <table>
        <thead>
          <tr>
            <th>Feedback ID</th>
            <th>Account ID</th>
            <th>Content</th>
            <th>Created At</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {currentFeedbacks.map((f) => (
            <tr key={f.FeedbackID}>
              <td>{f.FeedbackID}</td>
              <td>{f.AccountID}</td>
              <td>{f.Content}</td>
              <td>{f.CreatedAt}</td>
              <td>
                <select
                  value={statusMap[f.FeedbackID] || "Waiting"}
                  onChange={(e) => handleStatusChange(f.FeedbackID, e.target.value)}
                >
                  <option>Processed</option>
                  <option>Waiting</option>
                </select>
              </td>
              <td>
                <div className="action-buttons">
                  <button
                    className="btn btn-save"
                    onClick={() => handleSave(f.FeedbackID)}
                    disabled={statusMap[f.FeedbackID] === f.FStatus}
                  >
                    Save
                  </button>
                  <button className="btn btn-del" onClick={() => handleDelete(f.FeedbackID)}>Delete</button>
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
        <Link to="/admin/courses" className="btn-ghost">Go to Course Management</Link>
        <Link to="/admin/reports" className="btn-ghost">Go to Report Management</Link>
      </div>
    </div>
  );
}
