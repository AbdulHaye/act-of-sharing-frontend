"use client"

import React, { useState, useEffect } from "react";
import DashboardLayout from "../../../components/dashboard/DashboardLayout";
import axiosInstance from "../../../api/axiosInstance";
import { useAuth } from "../../../context/AuthContext";
import '../../../styles/user-pages.css';
import { toast } from "react-toastify";
import '../../../styles/loader.css';

// Helper function to truncate text after 15 words
const truncateText = (text: string, wordLimit: number = 15) => {
  if (!text) return "";
  const words = text.trim().split(/\s+/);
  if (words.length <= wordLimit) return text;
  return words.slice(0, wordLimit).join(" ") + "...";
};

const RequestsPage: React.FC = () => {
  const [requests, setRequests] = useState([]);
  const [sortedRequests, setSortedRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
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
        console.log("Fetched requests data:", response.data);
        setRequests(response.data);
        setError(null);
      } catch (err) {
        setError("Failed to fetch requests: " + (err.response?.data?.message || err.message));
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  useEffect(() => {
    if (requests.length > 0) {
      const sorted = [...requests].sort((a, b) => {
        const dateA = new Date(a.createdAt || a.created_at || '1970-01-01');
        const dateB = new Date(b.createdAt || b.created_at || '1970-01-01');
        return dateB.getTime() - dateA.getTime();
      });
      console.log("Sorted requests:", sorted);
      setSortedRequests(sorted);
    }
  }, [requests]);

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
      relationshipToRequester: request.relationshipToRequester || "Self",
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
      <div className="container-fluid p-4 h-full">
        <div className="card border-0 shadow-sm w-100 h-full flex flex-col">
          <div className="card-header bg-white">
            <h5 className="card-title mb-0">Requests</h5>
          </div>
          <div className="card-body p-0 flex-1 overflow-hidden">
            <div style={{ position: "relative", height: "calc(100vh - 180px)" }}>
              <table className="table-custom mb-0 requests-table" style={{ tableLayout: "fixed", width: "100%" }}>
                <thead style={{ position: "sticky", top: 0, zIndex: 10, backgroundColor: "#5144A1" }}>
                  <tr>
                    <th className="table-header" style={{ width: "5%" }}>ID</th>
                    <th className="table-header" style={{ width: "10%" }}>Full Name</th>
                    <th className="table-header" style={{ width: "10%" }}>Phone</th>
                    <th className="table-header" style={{ width: "15%" }}>Email</th>
                    <th className="table-header" style={{ width: "10%" }}>Person Name</th>
                    <th className="table-header" style={{ width: "10%" }}>Relationship</th>
                    <th className="table-header" style={{ width: "10%" }}>Immediate Need</th>
                    <th className="table-header" style={{ width: "10%" }}>Date</th>
                    <th className="table-header" style={{ width: "10%" }}>Additional Info</th>
                    {user?.role === "admin" && (
                      <th className="table-header" style={{ width: "15%" }}>Actions</th>
                    )}
                  </tr>
                </thead>
              </table>
              <div style={{ overflowY: "auto", overflowX: "hidden", height: "calc(100% - 60px)" }}>
                {sortedRequests.length === 0 ? (
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
                  <table className="table-custom mb-0 requests-table" style={{ tableLayout: "fixed", width: "100%" }}>
                    <tbody>
                      {sortedRequests.map((request, index) => (
                        <tr key={request._id}>
                          <td className="table-cell" style={{ width: "5%", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{index + 1}</td>
                          <td className="table-cell" style={{ width: "10%", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{request.fullName}</td>
                          <td className="table-cell" style={{ width: "10%", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{request.phone}</td>
                          <td className="table-cell email-cell" style={{ width: "15%", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{request.email}</td>
                          <td className="table-cell" style={{ width: "10%", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{request.personName}</td>
                          <td className="table-cell" style={{ width: "10%", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{request.relationshipToRequester || "Self"}</td>
                          <td className="table-cell need-cell" style={{ width: "10%", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{request.immediateNeed}</td>
                          <td className="table-cell" style={{ width: "10%", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{request.preferredDate ? new Date(request.preferredDate).toLocaleDateString() : ""}</td>
                          <td className="table-cell info-cell" style={{ width: "10%", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{truncateText(request.additionalInfo || "")}</td>
                          {user?.role === "admin" && (
                            <td className="table-cell actions-cell" style={{ width: "15%" }}>
                              <div style={{ display: "inline-flex", gap: "1rem" }}>
                                <button
                                  className="btn btn-outline-primary"
                                  onClick={() => openEditModal(request)}
                                  style={{ minWidth: "80px" }}
                                >
                                  Edit
                                </button>
                                <button
                                  className="btn btn-outline-primary"
                                  onClick={() => handleDelete(request._id)}
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