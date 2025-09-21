import "../../css/UserManagement.css";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

export default function UserManagement() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(5);
  const [roleMap, setRoleMap] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/users", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      setAccounts(res.data);

      const map = {};
      res.data.forEach((a) => {
        map[a.AccountID] = a.ARole || "Learner";
      });
      setRoleMap(map);
    } catch (err) {
      console.error("Error fetching accounts:", err);
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

  const handleRoleChange = (id, value) => {
    setRoleMap((prev) => ({ ...prev, [id]: value }));
  };

  const handleSave = async (id) => {
    const newRole = roleMap[id];
    const oldRole = accounts.find((a) => a.AccountID === id).ARole;

    if (newRole === oldRole) {
      setMessage("No changes to save.");
      setTimeout(() => setMessage(""), 2500);
      return;
    }

    if (
      !window.confirm(
        `Are you sure you want to change the role of account ${id} from ${oldRole} to ${newRole}?`
      )
    ) {
      setRoleMap((prev) => ({ ...prev, [id]: oldRole }));
      return;
    }

    try {
      await axios.put(`http://127.0.0.1:8000/api/users/${id}`, { ARole: newRole });
      setAccounts((prev) =>
        prev.map((a) => (a.AccountID === id ? { ...a, ARole: newRole } : a))
      );
      setMessage("Account updated successfully!");
    } catch (err) {
      console.error("Error updating account:", err);
      setMessage("Update failed.");
    } finally {
      setTimeout(() => setMessage(""), 2500);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this account?")) return;
    try {
      await axios.delete(`http://127.0.0.1:8000/api/users/${id}`);
      setAccounts((prev) => prev.filter((a) => a.AccountID !== id));
      setMessage("Account deleted successfully!");
    } catch (err) {
      console.error("Error deleting account:", err);
      setMessage("Delete failed.");
    } finally {
      setTimeout(() => setMessage(""), 2500);
    }
  };

  const indexOfLast = currentPage * rowsPerPage;
  const indexOfFirst = indexOfLast - rowsPerPage;
  const currentAccounts = accounts.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(accounts.length / rowsPerPage);

  if (loading) return <p style={{ textAlign: "center" }}>Loading accounts...</p>;

  return (
    <div className="container">
      <div className="row" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1>Admin • User Management</h1>
        <button onClick={handleLogout} className="btn btn-del">Logout</button>
      </div>
      {message && <p style={{ color: "lightgreen" }}>{message}</p>}

      <table>
        <thead>
          <tr>
            <th>Full Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {currentAccounts.map((a) => (
            <tr key={a.AccountID}>
              <td>{a.AName}</td>
              <td>{a.Email}</td>
              <td>
                <select
                  value={roleMap[a.AccountID] || "Learner"}
                  onChange={(e) => handleRoleChange(a.AccountID, e.target.value)}
                >
                  <option>Admin</option>
                  <option>Instructor</option>
                  <option>Learner</option>
                </select>
              </td>
              <td>
                <div className="action-buttons">
                  <button
                    className="btn btn-save"
                    onClick={() => handleSave(a.AccountID)}
                    disabled={roleMap[a.AccountID] === a.ARole}
                  >
                    Save
                  </button>
                  <button
                    className="btn btn-del"
                    onClick={() => handleDelete(a.AccountID)}
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

      {/* Links */}
      <div className="row">
        <Link to="/admin" className="btn-ghost">Back to HomePage</Link>
        <Link to="/admin/courses" className="btn-ghost">Go to Course Management</Link>
        <Link to="/admin/reports" className="btn-ghost">Go to Report Management</Link>
        <Link to="/admin/feedback" className="btn-ghost">Go to Feedback Management</Link>
      </div>
    </div>
  );
}
