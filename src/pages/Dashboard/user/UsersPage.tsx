import React, { useState, useEffect } from "react";
import DashboardLayout from "../../../components/dashboard/DashboardLayout";
import axiosInstance from "../../../api/axiosInstance"; // Adjust the import path as needed
import { useAuth } from "../../../context/AuthContext"; // Import useAuth to get user role
import '../../../styles/contributions-page.css'; // Uncommented for consistent styling
import { toast } from "react-toastify"; // Import toast for notifications
import '../../../styles/loader.css'

const UsersPage: React.FC = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth(); // Get the current user and role
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
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
        setUsers(response.data);
        setError(null);
      } catch (err) {
        setError("Failed to fetch users: " + (err.response?.data?.message || err.message));
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleDelete = async (userId: string) => {
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
        toast.success("User deleted successfully"); // Add toast notification for delete
      } catch (err) {
        setError("Failed to delete user: " + (err.response?.data?.message || err.message));
        console.error("Delete error:", err);
      }
    }
  };

  const handleEdit = async (e: React.FormEvent) => {
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
      toast.success("User updated successfully"); // Add toast notification for update
    } catch (err) {
      setError("Failed to update user: " + (err.response?.data?.message || err.message));
      console.error("Edit error:", err);
    }
  };

  const openEditModal = (user: any) => {
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
      <div className="container-fluid p-4">
        <div className="card border-0 shadow-sm w-100">
          <div className="card-header bg-white">
            <h5 className="card-title mb-0">Users</h5>
          </div>
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table-custom mb-0">
                <thead>
                  <tr>
                    <th style={{ backgroundColor: "#5144A1", color: "#FFFFFF", padding: "12px 20px" }}>ID</th>
                    <th style={{ backgroundColor: "#5144A1", color: "#FFFFFF", padding: "12px 20px" }}>First Name</th>
                    <th style={{ backgroundColor: "#5144A1", color: "#FFFFFF", padding: "12px 20px" }}>Last Name</th>
                    <th style={{ backgroundColor: "#5144A1", color: "#FFFFFF", padding: "12px 20px" }}>Email</th>
                    <th style={{ backgroundColor: "#5144A1", color: "#FFFFFF", padding: "12px 20px" }}>Role</th>
                    {user?.role === "admin" && (
                      <th style={{ backgroundColor: "#5144A1", color: "#FFFFFF", padding: "12px 20px" }}>Actions</th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {users.map((userItem, index) => (
                    <tr key={userItem._id}>
                      <td style={{ padding: "12px 20px", color: "#1F2937" }}>{index + 1}</td>
                      <td style={{ padding: "12px 20px", color: "#1F2937" }}>{userItem.firstname}</td>
                      <td style={{ padding: "12px 20px", color: "#1F2937" }}>{userItem.lastname}</td>
                      <td style={{ padding: "12px 20px", color: "#1F2937" }}>{userItem.email}</td>
                      <td style={{ padding: "12px 20px", color: "#1F2937" }}>{userItem.role}</td>
                      {user?.role === "admin" && (
                        <td style={{ padding: "12px 20px", color: "#1F2937" }}>
                          <button
                            className="btn btn-outline-primary"
                            onClick={() => openEditModal(userItem)}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-outline-primary ms-2"
                            onClick={() => handleDelete(userItem._id)}
                          >
                            Delete
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Modal for Editing User */}
        {selectedUser && user?.role === "admin" && (
          <div className="modal" tabIndex={-1} style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}>
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