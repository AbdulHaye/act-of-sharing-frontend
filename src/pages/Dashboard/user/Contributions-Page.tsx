import React, { useState, useEffect } from "react";
import DashboardLayout from "../../../components/dashboard/DashboardLayout";
import axiosInstance from "../../../api/axiosInstance"; // Adjust the import path as needed
import { useAuth } from "../../../context/AuthContext"; // Import useAuth to get user role
import '../../../styles/contributions-page.css'; // Adjust the import path as needed
import { toast } from "react-toastify";
import '../../../styles/loader.css'

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
        setContributions(response.data);
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
       toast.info("Contribution updatd successfully");
    } catch (err) {
      setError("Failed to update contribution: " + (err.response?.data?.message || err.message));
      console.error("Edit error:", err);
    }
  };

  const openEditModal = (contribution: any) => {
    setSelectedContribution(contribution);
    setEditFormData({
      eventId: { title: contribution.eventId.title },
      userId: {
        firstname: contribution.userId.firstname,
        lastname: contribution.userId.lastname,
        email: contribution.userId.email,
      },
      amount: contribution.amount.toString(),
      status: contribution.status,
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
      <div className="container-fluid p-4">
        <div className="card border-0 shadow-sm w-100">
          <div className="card-header bg-white">
            <h5 className="card-title mb-0">Donations</h5>
          </div>
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table-custom mb-0">
                <thead>
                  <tr>
                    <th style={{ backgroundColor: "#5144A1", color: "#FFFFFF", padding: "12px 20px" }}>ID</th>
                    <th style={{ backgroundColor: "#5144A1", color: "#FFFFFF", padding: "12px 20px" }}>Event Title</th>
                    <th style={{ backgroundColor: "#5144A1", color: "#FFFFFF", padding: "12px 20px" }}>User Name</th>
                    <th style={{ backgroundColor: "#5144A1", color: "#FFFFFF", padding: "12px 20px" }}>Email</th>
                    <th style={{ backgroundColor: "#5144A1", color: "#FFFFFF", padding: "12px 20px" }}>Amount</th>
                    <th style={{ backgroundColor: "#5144A1", color: "#FFFFFF", padding: "12px 20px" }}>Status</th>
                    {user?.role === "admin" && (
                      <th style={{ backgroundColor: "#5144A1", color: "#FFFFFF", padding: "12px 20px" }}>Actions</th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {contributions.map((contribution, index) => (
                    <tr key={contribution._id}>
                      <td style={{ padding: "12px 20px", color: "#1F2937" }}>{index + 1}</td>
                      <td style={{ padding: "12px 20px", color: "#1F2937" }}>{contribution.eventId.title}</td>
                      <td style={{ padding: "12px 20px", color: "#1F2937" }}>
                        {contribution.userId.firstname} {contribution.userId.lastname}
                      </td>
                      <td style={{ padding: "12px 20px", color: "#1F2937" }}>{contribution.userId.email}</td>
                      <td style={{ padding: "12px 20px", color: "#1F2937" }}>${contribution.amount}.00</td>
                      <td style={{ padding: "12px 20px", color: "#1F2937" }}>{contribution.status}</td>
                      {user?.role === "admin" && (
                        <td style={{ padding: "12px 20px", color: "#1F2937" }}>
                          <button
                            className="btn btn-outline-primary"
                            onClick={() => openEditModal(contribution)}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-outline-primary ms-2"
                            onClick={() => handleDelete(contribution._id)}
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