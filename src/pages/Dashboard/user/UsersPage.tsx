"use client"

import React, { useState, useEffect } from "react";
import DashboardLayout from "../../../components/dashboard/DashboardLayout";
import axiosInstance from "../../../api/axiosInstance";
import { useAuth } from "../../../context/AuthContext";
import '../../../styles/Contributions-page.css';
import { toast } from "react-toastify";
import '../../../styles/loader.css';

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const [selectedUser, setSelectedUser] = useState(null);
  const [editFormData, setEditFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    role: "",
  });

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const response = await axiosInstance.get("/users", {
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": token,
          },
        });
        const sortedUsers = response.data.sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setUsers(sortedUsers);
        setError(null);
      } catch (err) {
        setError("Failed to fetch users: " + (err.response?.data?.message || err.message));
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleDelete = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        const token = localStorage.getItem("token");
        await axiosInstance.delete(`/users/${userId}`, {
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": token,
          },
        });
        setUsers(users.filter((u) => u._id !== userId));
        toast.success("User deleted successfully");
      } catch (err) {
        setError("Failed to delete user: " + (err.response?.data?.message || err.message));
        console.error("Delete error:", err);
      }
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    if (!selectedUser) return;

    try {
      const token = localStorage.getItem("token");
      const updatedData = {
        firstname: editFormData.firstname,
        lastname: editFormData.lastname,
        email: editFormData.email,
        role: editFormData.role,
      };

      await axiosInstance.put(`/users/${selectedUser._id}`, updatedData, {
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token,
        },
      });

      setUsers(users.map((u) =>
        u._id === selectedUser._id ? { ...u, ...updatedData } : u
      ));
      setSelectedUser(null);
      setError(null);
      toast.success("User updated successfully");
    } catch (err) {
      setError("Failed to update user: " + (err.response?.data?.message || err.message));
      console.error("Edit error:", err);
    }
  };

  const openEditModal = (user) => {
    setSelectedUser(user);
    setEditFormData({
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      role: user.role,
    });
  };

  const closeEditModal = () => {
    setSelectedUser(null);
    setError(null);
  };

  if (loading) {
    return (
      <div className="loader-container">
        <div className="spinner"></div>
      </div>
    );
  }

  if (error) return <div>{error}</div>;

  return (
    <DashboardLayout>
      <div className="container-fluid p-4 h-full">
        <div className="card border-0 shadow-sm w-100 h-full flex flex-col">
          <div className="card-header bg-white">
            <h5 className="card-title mb-0">Users</h5>
          </div>
          <div className="card-body p-0 flex-1 overflow-hidden">
            <div style={{ position: "relative", height: "calc(100vh - 180px)" }}>
              <table className="table-custom mb-0 users-table" style={{ tableLayout: "fixed", width: "100%" }}>
                <thead style={{ position: "sticky", top: 0, zIndex: 10, backgroundColor: "#5144A1" }}>
                  <tr>
                    <th className="table-header" style={{ width: "10%" }}>ID</th>
                    <th className="table-header" style={{ width: "20%" }}>First Name</th>
                    <th className="table-header" style={{ width: "20%" }}>Last Name</th>
                    <th className="table-header" style={{ width: "25%" }}>Email</th>
                    <th className="table-header" style={{ width: "15%" }}>Role</th>
                    {user?.role === "admin" && (
                      <th className="table-header" style={{ width: "15%" }}>Actions</th>
                    )}
                  </tr>
                </thead>
              </table>
              <div style={{ overflowY: "auto", overflowX: "hidden", height: "calc(100% - 60px)" }}>
                {users.length === 0 ? (
                  <div className="text-center py-5">
                    <svg
                      width="128"
                      height="128"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mx-auto mb-3"
                    >
                      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7"/>
                      <circle cx="12" cy="12" r="3"/>
                      <path d="M12 8v1m0 4v3m-4-2h8"/>
                    </svg>
                    <h5 className="text-muted">No data here</h5>
                  </div>
                ) : (
                  <table className="table-custom mb-0 users-table" style={{ tableLayout: "fixed", width: "100%" }}>
                    <tbody>
                      {users.map((userItem, index) => (
                        <tr key={userItem._id}>
                          <td className="table-cell" style={{ width: "10%", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{index + 1}</td>
                          <td className="table-cell" style={{ width: "20%", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{userItem.firstname}</td>
                          <td className="table-cell" style={{ width: "20%", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{userItem.lastname}</td>
                          <td className="table-cell email-cell" style={{ width: "25%", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{userItem.email}</td>
                          <td className="table-cell" style={{ width: "15%", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{userItem.role}</td>
                          {user?.role === "admin" && (
                            <td className="table-cell actions-cell" style={{ width: "15%" }}>
                              <div style={{ display: "inline-flex", gap: "1rem" }}>
                                <button
                                  className="btn btn-outline-primary"
                                  onClick={() => openEditModal(userItem)}
                                  style={{ minWidth: "80px" }}
                                >
                                  Edit
                                </button>
                                <button
                                  className="btn btn-outline-primary"
                                  onClick={() => handleDelete(userItem._id)}
                                  style={{ minWidth: "80px" }}
                                >
                                  Delete
                                </button>
                              </div>
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Modal for Editing User */}
        {selectedUser && user?.role === "admin" && (
          <div
            className="modal"
            tabIndex={-1}
            style={{
              display: "block",
              backgroundColor: "rgba(0,0,0,0.5)",
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 1050,
            }}
          >
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Edit User</h5>
                  <button type="button" className="btn-close" onClick={closeEditModal}></button>
                </div>
                <form onSubmit={handleEdit}>
                  <div className="modal-body">
                    {error && <div className="alert alert-danger">{error}</div>}
                    <div className="mb-3">
                      <label className="form-label">First Name</label>
                      <input
                        type="text"
                        className="form-control"
                        value={editFormData.firstname}
                        onChange={(e) => setEditFormData({ ...editFormData, firstname: e.target.value })}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Last Name</label>
                      <input
                        type="text"
                        className="form-control"
                        value={editFormData.lastname}
                        onChange={(e) => setEditFormData({ ...editFormData, lastname: e.target.value })}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Email</label>
                      <input
                        type="email"
                        className="form-control"
                        value={editFormData.email}
                        onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Role</label>
                      <select
                        className="form-control"
                        value={editFormData.role}
                        onChange={(e) => setEditFormData({ ...editFormData, role: e.target.value })}
                        required
                      >
                        <option value="admin">Admin</option>
                        <option value="host">Host</option>
                        <option value="guest">Guest</option>
                      </select>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={closeEditModal}>
                      Close
                    </button>
                    <button type="submit" className="btn btn-primary">
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default UsersPage;