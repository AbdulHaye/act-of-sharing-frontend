"use client";

import React, { useState, useEffect } from "react";
import DashboardLayout from "../../../components/dashboard/DashboardLayout";
import axiosInstance from "../../../api/axiosInstance";
import { useAuth } from "../../../context/AuthContext";
import { toast } from "react-toastify";
import { Edit, Trash2 } from "lucide-react";

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
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalRequests: 0,
    limit: 10,
  });

  const fetchRequests = async (page: number = 1) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axiosInstance.get(`/request?page=${page}&limit=${pagination.limit}`, {
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token,
        },
      });
      console.log("Fetched requests data:", response.data);
      setRequests(response.data.requests);
      setPagination({
        currentPage: response.data.pagination.currentPage,
        totalPages: response.data.pagination.totalPages,
        totalRequests: response.data.pagination.totalRequests,
        limit: response.data.pagination.limit,
      });
      setError(null);
    } catch (err) {
      setError("Failed to fetch requests: " + (err.response?.data?.message || err.message));
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests(pagination.currentPage);
  }, [pagination.currentPage]);

  useEffect(() => {
    if (requests.length > 0) {
      const sorted = [...requests].sort((a, b) => {
        const dateA = new Date(a.createdAt || a.created_at || '1970-01-01');
        const dateB = new Date(b.createdAt || b.created_at || '1970-01-01');
        return dateB.getTime() - dateA.getTime();
      });
      console.log("Sorted requests:", sorted);
      setSortedRequests(sorted);
    } else {
      setSortedRequests([]);
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
        fetchRequests(pagination.currentPage);
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
      fetchRequests(pagination.currentPage);
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

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= pagination.totalPages) {
      setPagination((prev) => ({ ...prev, currentPage: page }));
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <DashboardLayout>
      <div className="container-fluid p-4">
        <div className="card border-0 shadow-sm bg-white">
          <div className="card-header bg-white">
            <h5 className="card-title mb-0 text-lg font-semibold">Requests</h5>
          </div>
          <div className="card-body p-0">
            <div className="table-responsive" style={{ maxHeight: "calc(100vh - 250px)" }}>
              <table className="table-custom w-full text-sm">
                <thead className="sticky top-0 bg-primary text-white">
                  <tr>
                    <th className="table-header px-4 py-2" style={{ width: "5%" }}>ID</th>
                    <th className="table-header px-4 py-2" style={{ width: "10%" }}>Full Name</th>
                    <th className="table-header px-4 py-2 d-none d-md-table-cell" style={{ width: "10%" }}>Phone</th>
                    <th className="table-header px-4 py-2 d-none d-lg-table-cell" style={{ width: "15%" }}>Email</th>
                    <th className="table-header px-4 py-2" style={{ width: "10%" }}>Person Name</th>
                    <th className="table-header px-4 py-2 d-none d-md-table-cell" style={{ width: "10%" }}>Relationship</th>
                    <th className="table-header px-4 py-2" style={{ width: "10%" }}>Immediate Need</th>
                    <th className="table-header px-4 py-2 d-none d-md-table-cell" style={{ width: "10%" }}>Date</th>
                    <th className="table-header px-4 py-2 d-none d-lg-table-cell" style={{ width: "10%" }}>Additional Info</th>
                    {user?.role === "admin" && (
                      <th className="table-header px-4 py-2" style={{ width: "15%" }}>Actions</th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {sortedRequests.length === 0 ? (
                    <tr>
                      <td colSpan={user?.role === "admin" ? 10 : 9} className="text-center py-5">
                        <svg width="128" height="128" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-3">
                          <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7"/>
                          <circle cx="12" cy="12" r="3"/>
                          <path d="M12 8v1m0 4v3m-4-2h8"/>
                        </svg>
                        <h5 className="text-muted">No data here</h5>
                      </td>
                    </tr>
                  ) : (
                    sortedRequests.map((request, index) => (
                      <tr key={request._id} className="hover:bg-gray-50">
                        <td className="table-cell px-4 py-2" style={{ width: "5%" }}>
                          {(pagination.currentPage - 1) * pagination.limit + index + 1}
                        </td>
                        <td className="table-cell px-4 py-2 truncate" style={{ width: "10%" }}>
                          {request.fullName}
                        </td>
                        <td className="table-cell px-4 py-2 truncate d-none d-md-table-cell" style={{ width: "10%" }}>
                          {request.phone}
                        </td>
                        <td className="table-cell px-4 py-2 truncate d-none d-lg-table-cell" style={{ width: "15%" }}>
                          {request.email}
                        </td>
                        <td className="table-cell px-4 py-2 truncate" style={{ width: "10%" }}>
                          {request.personName}
                        </td>
                        <td className="table-cell px-4 py-2 truncate d-none d-md-table-cell" style={{ width: "10%" }}>
                          {request.relationshipToRequester || "Self"}
                        </td>
                        <td className="table-cell px-4 py-2 truncate" style={{ width: "10%" }}>
                          {request.immediateNeed}
                        </td>
                        <td className="table-cell px-4 py-2 truncate d-none d-md-table-cell" style={{ width: "10%" }}>
                          {request.preferredDate ? new Date(request.preferredDate).toLocaleDateString() : ""}
                        </td>
                        <td className="table-cell px-4 py-2 truncate d-none d-lg-table-cell" style={{ width: "10%" }}>
                          {truncateText(request.additionalInfo || "")}
                        </td>
                        {user?.role === "admin" && (
                          <td className="table-cell px-4 py-2" style={{ width: "15%" }}>
                            <div className="btn-group" role="group">
                              <button
                                className="btn btn-outline-primary btn-sm me-2"
                                onClick={() => openEditModal(request)}
                              >
                                <Edit size={16} /> Edit
                              </button>
                              <button
                                className="btn btn-outline-danger btn-sm"
                                onClick={() => handleDelete(request._id)}
                              >
                                <Trash2 size={16} /> Delete
                              </button>
                            </div>
                          </td>
                        )}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            <div className="card-footer bg-white py-3 border-t border-gray-200">
              <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center">
                <div className="mb-2 mb-sm-0 text-sm">
                  Showing {(pagination.currentPage - 1) * pagination.limit + 1} to{" "}
                  {Math.min(pagination.currentPage * pagination.limit, pagination.totalRequests)} of{" "}
                  {pagination.totalRequests} requests
                </div>
                <nav aria-label="Page navigation">
                  <ul className="pagination mb-0 flex space-x-2">
                    <li className={`page-item ${pagination.currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""}`}>
                      <button className="page-link px-3 py-1 border rounded" onClick={() => handlePageChange(pagination.currentPage - 1)}>
                        Previous
                      </button>
                    </li>
                    {[...Array(pagination.totalPages)].map((_, i) => (
                      <li key={i} className={`page-item ${pagination.currentPage === i + 1 ? "bg-primary text-white" : "bg-white"} border rounded`}>
                        <button className="page-link px-3 py-1" onClick={() => handlePageChange(i + 1)}>
                          {i + 1}
                        </button>
                      </li>
                    ))}
                    <li className={`page-item ${pagination.currentPage === pagination.totalPages ? "opacity-50 cursor-not-allowed" : ""}`}>
                      <button className="page-link px-3 py-1 border rounded" onClick={() => handlePageChange(pagination.currentPage + 1)}>
                        Next
                      </button>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
          </div>
        </div>

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

      <style jsx>{`
        .table-custom {
          border-collapse: collapse;
        }
        .table-header {
          font-weight: 600;
        }
        .table-cell {
          border-bottom: 1px solid #dee2e6;
        }
        .text-primary {
          color: #5144A1;
        }
        .bg-primary {
          background-color: #5144A1;
        }
        .text-muted {
          color: #6c757d;
        }
        @media (max-width: 640px) {
          .table-custom {
            font-size: 0.75rem;
          }
          .table-header, .table-cell {
            padding: 0.5rem;
          }
          .pagination {
            flex-wrap: wrap;
            justify-content: center;
          }
          .page-link {
            padding: 0.25rem 0.5rem;
            font-size: 0.75rem;
          }
        }
        @media (min-width: 641px) and (max-width: 1024px) {
          .table-custom {
            font-size: 0.875rem;
          }
          .table-header, .table-cell {
            padding: 0.75rem;
          }
        }
      `}</style>
    </DashboardLayout>
  );
};

export default RequestsPage;