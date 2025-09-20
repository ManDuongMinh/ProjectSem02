// src/pages/ReportManagement.jsx
import "../../css/UserManagement.css"; // tái sử dụng CSS table, btn
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function ReportManagement() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(5);
  const [statusMap, setStatusMap] = useState({});

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      // Backend Laravel cần tạo API /api/reports
      const res = await axios.get("http://127.0.0.1:8000/api/reports");
      setReports(res.data);

      const map = {};
      res.data.forEach((r) => {
        map[r.ReportID] = r.RStatus || "Pending";
      });
      setStatusMap(map);
    } catch (err) {
      console.error("Error fetching reports:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (id, value) => {
    setStatusMap((prev) => ({ ...prev, [id]: value }));
  };

  const handleSave = async (id) => {
    const newStatus = statusMap[id];
    const oldStatus = reports.find((r) => r.ReportID === id).RStatus;

    if (newStatus === oldStatus) {
      setMessage("No changes to save.");
      setTimeout(() => setMessage(""), 2500);
      return;
    }

    if (!window.confirm(`Change report ${id} status from ${oldStatus} to ${newStatus}?`)) {
      setStatusMap((prev) => ({ ...prev, [id]: oldStatus }));
      return;
    }

    try {
      await axios.put(`http://127.0.0.1:8000/api/reports/${id}`, {
        RStatus: newStatus,
      });

      setReports((prev) =>
        prev.map((r) => (r.ReportID === id ? { ...r, RStatus: newStatus } : r))
      );
      setMessage("Report updated successfully!");
    } catch (err) {
      console.error("Error updating report:", err);
      setMessage("Update failed.");
    } finally {
      setTimeout(() => setMessage(""), 2500);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this report?")) return;
    try {
      await axios.delete(`http://127.0.0.1:8000/api/reports/${id}`);
      setReports((prev) => prev.filter((r) => r.ReportID !== id));
      setMessage("Report deleted successfully!");
    } catch (err) {
      console.error("Error deleting report:", err);
      setMessage("Delete failed.");
    } finally {
      setTimeout(() => setMessage(""), 2500);
    }
  };

  const indexOfLast = currentPage * rowsPerPage;
  const indexOfFirst = indexOfLast - rowsPerPage;
  const currentReports = reports.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(reports.length / rowsPerPage);

  if (loading) return <p style={{ textAlign: "center" }}>Loading reports...</p>;

  return (
    <div className="container">
      <h1>Admin • Report Management</h1>
      {message && <p style={{ color: "lightgreen" }}>{message}</p>}

      <table>
        <thead>
          <tr>
            <th>Report ID</th>
            <th>Account ID</th>
            <th>Course ID</th>
            <th>Content</th>
            <th>Mark</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {currentReports.map((r) => (
            <tr key={r.ReportID}>
              <td>{r.ReportID}</td>
              <td>{r.AccountID}</td>
              <td>{r.CourseID}</td>
              <td>{r.Content}</td>
              <td>{r.Mark}</td>
              <td>
                <select
                  value={statusMap[r.ReportID] || "Pending"}
                  onChange={(e) => handleStatusChange(r.ReportID, e.target.value)}
                >
                  <option>Passed</option>
                  <option>Pending</option>
                  <option>Failed</option>
                </select>
              </td>
              <td>
                <div className="action-buttons">
                  <button
                    className="btn btn-save"
                    onClick={() => handleSave(r.ReportID)}
                    disabled={statusMap[r.ReportID] === r.RStatus}
                  >
                    Save
                  </button>
                  <button
                    className="btn btn-del"
                    onClick={() => handleDelete(r.ReportID)}
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="row">
        <button
          className="btn-ghost"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((p) => p - 1)}
        >
          Prev
        </button>

        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            className={`btn-ghost ${currentPage === i + 1 ? "active" : ""}`}
            onClick={() => setCurrentPage(i + 1)}
          >
            {i + 1}
          </button>
        ))}

        <button
          className="btn-ghost"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((p) => p + 1)}
        >
          Next
        </button>
      </div>

      <div className="row">
        <Link to="/admin" className="btn-ghost">
          Back to HomePage
        </Link>
        <Link to="/admin/users" className="btn-ghost">
          Go to User Management
        </Link>
        <Link to="/admin/courses" className="btn-ghost">
          Go to Course Management
        </Link>
        <Link to="/admin/feedback" className="btn-ghost">
          Go to Feedback Management
        </Link>
      </div>
    </div>
  );
}
