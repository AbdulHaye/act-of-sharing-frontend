import React, { useState, useEffect } from "react";
import DashboardLayout from "../../../components/dashboard/DashboardLayout";
import axiosInstance from "../../../api/axiosInstance"; // Adjust the import path as needed
import { useAuth } from "../../../context/AuthContext"; // Import useAuth to get user role
// import '../../../styles/Contributions-page.css'; // Adjust the import path as needed
import { toast } from "react-toastify";
import '../../../styles/loader.css';

const ContributionsPage: React.FC = () => {
  const [contributions, setContributions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth(); // Get the current user and role
  const [selectedContribution, setSelectedContribution] = useState<any | null>(null);
  const [editFormData, setEditFormData] = useState({
    eventId: { title: "" },
    userId: { firstname: "", lastname: "", email: "" },
    amount: "",
    status: "",
  });

  useEffect(() => {
    const fetchContributions = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const response = await axiosInstance.get("/contributions", {
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": token,
          },
        });
        // Sort contributions by createdAt in descending order (latest first)
        const sortedContributions = response.data.sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setContributions(sortedContributions);
        setError(null);
      } catch (err) {
        setError("Failed to fetch contributions: " + (err.response?.data?.message || err.message));
      } finally {
        setLoading(false);
      }
    };

    fetchContributions();
  }, []);

  const handleDelete = async (contributionId: string) => {
    if (window.confirm("Are you sure you want to delete this contribution?")) {
      try {
        const token = localStorage.getItem("token");
        await axiosInstance.delete(`/contributions/${contributionId}`, {
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": token,
          },
        });
        setContributions(contributions.filter((c) => c._id !== contributionId));
        toast.info("Contribution deleted successfully");
      } catch (err) {
        setError("Failed to delete contribution: " + (err.response?.data?.message || err.message));
        console.error("Delete error:", err);
      }
    }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedContribution) return;

    try {
      const token = localStorage.getItem("token");
      const updatedData = {
        eventId: { title: editFormData.eventId.title },
        userId: {
          firstname: editFormData.userId.firstname,
          lastname: editFormData.userId.lastname,
          email: editFormData.userId.email,
        },
        amount: parseFloat(editFormData.amount),
        status: editFormData.status,
      };

      await axiosInstance.put(`/contributions/${selectedContribution._id}`, updatedData, {
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token,
        },
      });

      setContributions(contributions.map((c) =>
        c._id === selectedContribution._id ? { ...c, ...updatedData } : c
      ));
      setSelectedContribution(null);
      setError(null);
      toast.info("Contribution updated successfully");
    } catch (err) {
      setError("Failed to update contribution: " + (err.response?.data?.message || err.message));
      console.error("Edit error:", err);
    }
  };

  const openEditModal = (contribution: any) => {
    setSelectedContribution(contribution);
    setEditFormData({
      eventId: { title: contribution.eventId?.title || "" },
      userId: {
        firstname: contribution.userId?.firstname || "",
        lastname: contribution.userId?.lastname || "",
        email: contribution.userId?.email || "",
      },
      amount: contribution.amount?.toString() || "",
      status: contribution.status || "",
    });
  };

  const closeEditModal = () => {
    setSelectedContribution(null);
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
            <h5 className="card-title mb-0">Donations</h5>
          </div>
          <div className="card-body p-0 flex-1 overflow-hidden">
            <div style={{ position: "relative", height: "calc(100vh - 180px)" }}>
              <table className="table-custom mb-0 contributions-table">
                <thead style={{ position: "sticky", top: 0, zIndex: 10, backgroundColor: "#5144A1" }}>
                  <tr>
                    <th className="table-header">ID</th>
                    <th className="table-header">Event Title</th>
                    <th className="table-header">User Name</th>
                    <th className="table-header">Email</th>
                    <th className="table-header">Amount</th>
                    <th className="table-header">Status</th>
                    {user?.role === "admin" && (
                      <th className="table-header">Actions</th>
                    )}
                  </tr>
                </thead>
              </table>
              <div style={{ overflowY: "auto", overflowX: "hidden", height: "calc(100% - 60px)" }}>
                {contributions.length === 0 ? (
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
                    <h5 className="text-muted">No records found</h5>
                  </div>
                ) : (
                  <table className="table-custom mb-0 contributions-table">
                    <tbody>
                      {contributions.map((contribution, index) => (
                        <tr key={contribution._id}>
                          <td className="table-cell">{index + 1}</td>
                          <td className="table-cell">{contribution.eventId?.title || "N/A"}</td>
                          <td className="table-cell">
                            {contribution.userId
                              ? `${contribution.userId.firstname || ""} ${contribution.userId.lastname || ""}`.trim() || "N/A"
                              : "N/A"}
                          </td>
                          <td className="table-cell email-cell">{contribution.userId?.email || "N/A"}</td>
                          <td className="table-cell">${contribution.amount?.toFixed(2) || "0.00"}</td>
                          <td className="table-cell">{contribution.status || "N/A"}</td>
                          {user?.role === "admin" && (
                            <td className="table-cell" style={{ whiteSpace: "nowrap" }}>
                              <button
                                className="btn btn-outline-primary me-2"
                                onClick={() => openEditModal(contribution)}
                                style={{ minWidth: "60px" }}
                              >
                                Edit
                              </button>
                              <button
                                className="btn btn-outline-primary"
                                onClick={() => handleDelete(contribution._id)}
                                style={{ minWidth: "60px" }}
                              >
                                Delete
                              </button>
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

        {/* Modal for Editing Contribution */}
        {selectedContribution && user?.role === "admin" && (
          <div className="modal" tabIndex={-1} style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Edit Contribution</h5>
                  <button type="button" className="btn-close" onClick={closeEditModal}></button>
                </div>
                <form onSubmit={handleEdit}>
                  <div className="modal-body">
                    {error && <div className="alert alert-danger">{error}</div>}
                    <div className="mb-3">
                      <label className="form-label">Event Title</label>
                      <input
                        type="text"
                        className="form-control"
                        value={editFormData.eventId.title}
                        onChange={(e) => setEditFormData({ ...editFormData, eventId: { title: e.target.value } })}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">First Name</label>
                      <input
                        type="text"
                        className="form-control"
                        value={editFormData.userId.firstname}
                        onChange={(e) => setEditFormData({ ...editFormData, userId: { ...editFormData.userId, firstname: e.target.value } })}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Last Name</label>
                      <input
                        type="text"
                        className="form-control"
                        value={editFormData.userId.lastname}
                        onChange={(e) => setEditFormData({ ...editFormData, userId: { ...editFormData.userId, lastname: e.target.value } })}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Email</label>
                      <input
                        type="email"
                        className="form-control"
                        value={editFormData.userId.email}
                        onChange={(e) => setEditFormData({ ...editFormData, userId: { ...editFormData.userId, email: e.target.value } })}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Amount</label>
                      <input
                        type="number"
                        className="form-control"
                        value={editFormData.amount}
                        onChange={(e) => setEditFormData({ ...editFormData, amount: e.target.value })}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Status</label>
                      <select
                        className="form-control"
                        value={editFormData.status}
                        onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value })}
                        required
                      >
                        <option value="pending">Pending</option>
                        <option value="completed">Completed</option>
                        <option value="failed">Failed</option>
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

export default ContributionsPage;