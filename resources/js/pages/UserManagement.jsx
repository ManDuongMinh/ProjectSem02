import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${API_URL}/users`);
      setUsers(res.data);
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (id, role) => {
    try {
      await axios.put(`${API_URL}/users/${id}`, { role });
      setMessage("User updated successfully!");
      fetchUsers();
    } catch (err) {
      console.error("Error updating user:", err);
      setMessage("Update failed.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      await axios.delete(`${API_URL}/users/${id}`);
      setMessage("User deleted successfully!");
      fetchUsers();
    } catch (err) {
      console.error("Error deleting user:", err);
      setMessage("Delete failed.");
    }
  };

  if (loading) return <p>Loading users...</p>;

  return (
    <div className="card">
      <h1>Admin • User Management</h1>
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
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>
                <select
                  value={u.role || "Student"}
                  onChange={(e) => handleSave(u.id, e.target.value)}
                >
                  <option>Student</option>
                  <option>Teacher</option>
                  <option>Admin</option>
                </select>
              </td>
              <td>
                <button className="btn btn-del" onClick={() => handleDelete(u.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="row">
        <Link to="/admin" className="btn-ghost">Back to Dashboard</Link>
      </div>
    </div>
  );
}
