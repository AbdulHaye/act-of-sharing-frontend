import React, { useState, useEffect } from "react";
import DashboardLayout from "../../../components/dashboard/DashboardLayout";
import axiosInstance from "../../../api/axiosInstance"; // Adjust the import path as needed
import { useAuth } from "../../../context/AuthContext"; // Import useAuth to get user role
import '../../../styles/contributions-page.css'; // Reuse existing styling
import { toast } from "react-toastify"; // Import toast for notifications
import '../../../styles/loader.css'


const RequestsPage: React.FC = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth(); // Get the current user and role
  const [selectedRequest, setSelectedRequest] = useState<any | null>(null);
  const [editFormData, setEditFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    personName: "",
    relationshipToRequester: "",
    immediateNeed: "",
    preferredDate: "",
    additionalInfo: "",
  });

  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const response = await axiosInstance.get("/request", {
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": token,
          },
        });
        setRequests(response.data);
        setError(null);
      } catch (err) {
        setError("Failed to fetch requests: " + (err.response?.data?.message || err.message));
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const handleDelete = async (requestId: string) => {
    if (window.confirm("Are you sure you want to delete this request?")) {
      try {
        const token = localStorage.getItem("token");
        await axiosInstance.delete(`/request/${requestId}`, {
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": token,
          },
        });
        setRequests(requests.filter((r) => r._id !== requestId));
        toast.success("Request deleted successfully");
      } catch (err) {
        setError("Failed to delete request: " + (err.response?.data?.message || err.message));
        console.error("Delete error:", err);
      }
    }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRequest) return;

    try {
      const token = localStorage.getItem("token");
      const updatedData = {
        fullName: editFormData.fullName,
        phone: editFormData.phone,
        email: editFormData.email,
        personName: editFormData.personName,
        relationshipToRequester: editFormData.relationshipToRequester,
        immediateNeed: editFormData.immediateNeed,
        preferredDate: editFormData.preferredDate,
        additionalInfo: editFormData.additionalInfo,
      };

      await axiosInstance.put(`/request/${selectedRequest._id}`, updatedData, {
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token,
        },
      });

      setRequests(requests.map((r) =>
        r._id === selectedRequest._id ? { ...r, ...updatedData } : r
      ));
      setSelectedRequest(null);
      setError(null);
      toast.success("Request updated successfully");
    } catch (err) {
      setError("Failed to update request: " + (err.response?.data?.message || err.message));
      console.error("Edit error:", err);
    }
  };

  const openEditModal = (request: any) => {
    setSelectedRequest(request);
    setEditFormData({
      fullName: request.fullName,
      phone: request.phone,
      email: request.email,
      personName: request.personName,
      relationshipToRequester: request.relationshipToRequester || "Self", // Default to "Self" if undefined
      immediateNeed: request.immediateNeed,
      preferredDate: request.preferredDate ? new Date(request.preferredDate).toISOString().split('T')[0] : "",
      additionalInfo: request.additionalInfo,
    });
  };

  const closeEditModal = () => {
    setSelectedRequest(null);
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
            <h5 className="card-title mb-0">Requests</h5>
          </div>
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table-custom mb-0">
                <thead>
                  <tr>
                    <th style={{ backgroundColor: "#5144A1", color: "#FFFFFF", padding: "12px 20px" }}>ID</th>
                    <th style={{ backgroundColor: "#5144A1", color: "#FFFFFF", padding: "12px 20px" }}>Full Name</th>
                    <th style={{ backgroundColor: "#5144A1", color: "#FFFFFF", padding: "12px 20px" }}>Phone</th>
                    <th style={{ backgroundColor: "#5144A1", color: "#FFFFFF", padding: "12px 20px" }}>Email</th>
                    <th style={{ backgroundColor: "#5144A1", color: "#FFFFFF", padding: "12px 20px" }}>Person Name</th>
                    <th style={{ backgroundColor: "#5144A1", color: "#FFFFFF", padding: "12px 20px" }}>Relationship</th>
                    <th style={{ backgroundColor: "#5144A1", color: "#FFFFFF", padding: "12px 20px" }}>Immediate Need</th>
                    <th style={{ backgroundColor: "#5144A1", color: "#FFFFFF", padding: "12px 20px" }}>Date</th>
                    <th style={{ backgroundColor: "#5144A1", color: "#FFFFFF", padding: "12px 20px" }}>Additional Info</th>
                    {user?.role === "admin" && (
                      <th style={{ backgroundColor: "#5144A1", color: "#FFFFFF", padding: "12px 20px" }}>Actions</th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {requests.map((request, index) => (
                    <tr key={request._id}>
                      <td style={{ padding: "12px 20px", color: "#1F2937" }}>{index + 1}</td>
                      <td style={{ padding: "12px 20px", color: "#1F2937" }}>{request.fullName}</td>
                      <td style={{ padding: "12px 20px", color: "#1F2937" }}>{request.phone}</td>
                      <td style={{ padding: "12px 20px", color: "#1F2937" }}>{request.email}</td>
                      <td style={{ padding: "12px 20px", color: "#1F2937" }}>{request.personName}</td>
                      <td style={{ padding: "12px 20px", color: "#1F2937" }}>{request.relationshipToRequester || "Self"}</td>
                      <td style={{ padding: "12px 20px", color: "#1F2937" }}>{request.immediateNeed}</td>
                      <td style={{ padding: "12px 20px", color: "#1F2937" }}>
                        {request.preferredDate ? new Date(request.preferredDate).toLocaleDateString() : ""}
                      </td>
                      <td style={{ padding: "12px 20px", color: "#1F2937" }}>{request.additionalInfo}</td>
                      {user?.role === "admin" && (
                        <td style={{ padding: "12px 20px", color: "#1F2937", whiteSpace: "nowrap" }}>
                          <button
                            className="btn btn-outline-primary"
                            style={{ marginRight: "0.5rem" }}
                            onClick={() => openEditModal(request)}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-outline-primary"
                            onClick={() => handleDelete(request._id)}
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

        {/* Modal for Editing Request */}
        {selectedRequest && user?.role === "admin" && (
          <div className="modal" tabIndex={-1} style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Edit Request</h5>
                  <button type="button" className="btn-close" onClick={closeEditModal}></button>
                </div>
                <form onSubmit={handleEdit}>
                  <div className="modal-body">
                    {error && <div className="alert alert-danger">{error}</div>}
                    <div className="mb-3">
                      <label className="form-label">Full Name</label>
                      <input
                        type="text"
                        className="form-control"
                        value={editFormData.fullName}
                        onChange={(e) => setEditFormData({ ...editFormData, fullName: e.target.value })}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Phone</label>
                      <input
                        type="tel"
                        className="form-control"
                        value={editFormData.phone}
                        onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
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
                      <label className="form-label">Person Name</label>
                      <input
                        type="text"
                        className="form-control"
                        value={editFormData.personName}
                        onChange={(e) => setEditFormData({ ...editFormData, personName: e.target.value })}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Relationship to Requester</label>
                      <select
                        className="form-control"
                        value={editFormData.relationshipToRequester}
                        onChange={(e) => setEditFormData({ ...editFormData, relationshipToRequester: e.target.value })}
                        required
                      >
                        <option value="Self">Self</option>
                        <option value="Friend">Friend</option>
                        <option value="Family">Family</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Immediate Need</label>
                      <textarea
                        className="form-control"
                        value={editFormData.immediateNeed}
                        onChange={(e) => setEditFormData({ ...editFormData, immediateNeed: e.target.value })}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Preferred Date</label>
                      <input
                        type="date"
                        className="form-control"
                        value={editFormData.preferredDate}
                        onChange={(e) => setEditFormData({ ...editFormData, preferredDate: e.target.value })}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Additional Info</label>
                      <textarea
                        className="form-control"
                        value={editFormData.additionalInfo}
                        onChange={(e) => setEditFormData({ ...editFormData, additionalInfo: e.target.value })}
                      />
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

export default RequestsPage;