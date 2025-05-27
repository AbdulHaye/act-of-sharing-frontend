
"use client";

import React, { useState, useEffect } from "react";
import DashboardLayout from "../../../components/dashboard/DashboardLayout";
import { useAuth } from "../../../context/AuthContext";
import axiosInstance from "../../../api/axiosInstance";
import { toast } from "react-toastify";
import { Edit, Trash2 } from "lucide-react";

interface DeleteConfirmationModalProps {
  show: boolean;
  onHide: () => void;
  onConfirm: () => void;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  show,
  onHide,
  onConfirm,
}) => {
  if (!show) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title">Confirm Deletion</h5>
        </div>
        <div className="modal-body">
          <p>Are you sure you want to delete this contact? This action cannot be undone.</p>
        </div>
        <div className="modal-footer">
          <button className="btn btn-outline-secondary" onClick={onHide}>
            No
          </button>
          <button className="btn btn-danger" onClick={onConfirm}>
            Yes
          </button>
        </div>
      </div>
      <style jsx>{`
        .modal-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1050;
        }
        .modal-content {
          background: white;
          border-radius: 8px;
          width: 400px;
          max-width: 90%;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        }
        .modal-header {
          padding: 1rem;
          border-bottom: 1px solid #dee2e6;
        }
        .modal-title {
          margin: 0;
          font-size: 1.25rem;
          font-weight: 500;
        }
        .modal-body {
          padding: 1rem;
          color: #333;
        }
        .modal-footer {
          padding: 1rem;
          border-top: 1px solid #dee2e6;
          display: flex;
          justify-content: flex-end;
          gap: 0.5rem;
        }
        .btn-danger {
          background-color: #dc3545;
          border-color: #dc3545;
          color: white;
        }
        .btn-danger:hover {
          background-color: #c82333;
          border-color: #bd2130;
        }
        .btn-outline-secondary {
          color: #6c757d;
          border-color: #6c757d;
        }
        .btn-outline-secondary:hover {
          background-color: #6c757d;
          color: white;
        }
      `}</style>
    </div>
  );
};

const ContactPage: React.FC = () => {
  const [contacts, setContacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const [selectedContact, setSelectedContact] = useState<any | null>(null);
  const [editFormData, setEditFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [contactIdToDelete, setContactIdToDelete] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalContacts: 0,
    limit: 10,
  });

  const fetchContacts = async (page: number = 1) => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      const response = await axiosInstance.get(`/contact?page=${page}&limit=${pagination.limit}`, {
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token,
        },
      });

      if (!response.data) {
        throw new Error("No data returned from the server");
      }

      const data = Array.isArray(response.data.contacts) ? response.data.contacts : [];
      console.log("Fetched contacts data:", data);

      const sortedContacts = data.sort((a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setContacts(sortedContacts);
      setPagination({
        currentPage: response.data.pagination.currentPage,
        totalPages: response.data.pagination.totalPages,
        totalContacts: response.data.pagination.totalContacts,
        limit: response.data.pagination.limit,
      });
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || "An error occurred while fetching contacts";
      setError(errorMessage);
      toast.error(errorMessage);
      setContacts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts(pagination.currentPage);
  }, [pagination.currentPage]);

  const handleDelete = (contactId: string) => {
    console.log("Preparing to delete contact with ID:", contactId);
    setContactIdToDelete(contactId);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!contactIdToDelete) return;

    try {
      const token = localStorage.getItem("token");
      const response = await axiosInstance.delete(`/contact/${contactIdToDelete}`, {
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token,
        },
      });

      if (!response.data) {
        throw new Error("Failed to delete contact");
      }

      toast.success("Contact deleted successfully");
      fetchContacts(pagination.currentPage);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || "Failed to delete contact";
      toast.error(errorMessage);
    } finally {
      setShowDeleteModal(false);
      setContactIdToDelete(null);
    }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedContact) return;

    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(editFormData.email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    const updatedData = {
      name: editFormData.name,
      email: editFormData.email,
      message: editFormData.message,
    };

    try {
      const token = localStorage.getItem("token");
      const response = await axiosInstance.put(`/contact/${selectedContact._id}`, updatedData, {
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token,
        },
      });

      if (!response.data) {
        throw new Error("Failed to update contact");
      }

      const updatedContact = response.data;
      setContacts(contacts.map((c) =>
        c._id === selectedContact._id ? updatedContact : c
      ));
      setSelectedContact(null);
      toast.success("Contact updated successfully");
      fetchContacts(pagination.currentPage);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || "Failed to update contact";
      toast.error(errorMessage);
    }
  };

  const openEditModal = (contact: any) => {
    setSelectedContact(contact);
    setEditFormData({
      name: contact.name,
      email: contact.email,
      message: contact.message,
    });
  };

  const closeEditModal = () => {
    setSelectedContact(null);
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= pagination.totalPages) {
      setPagination((prev) => ({ ...prev, currentPage: page }));
    }
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "N/A";
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
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
            <h5 className="card-title mb-0 text-lg font-semibold">Contact</h5>
          </div>
          <div className="card-body p-0">
            <div className="table-responsive" style={{ maxHeight: "calc(100vh - 250px)" }}>
              <table className="table-custom w-full text-sm">
                <thead className="sticky top-0 bg-primary text-white">
                  <tr>
                    <th className="table-header px-4 py-2" style={{ width: "10%" }}>ID</th>
                    <th className="table-header px-4 py-2" style={{ width: "15%" }}>Name</th>
                    <th className="table-header px-4 py-2 d-none d-md-table-cell" style={{ width: "20%" }}>Email</th>
                    <th className="table-header px-4 py-2" style={{ width: "30%" }}>Message</th>
                    <th className="table-header px-4 py-2" style={{ width: "15%" }}>Date</th>
                    {user?.role === "admin" && (
                      <th className="table-header px-4 py-2" style={{ width: "10%" }}>Actions</th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {contacts.length === 0 ? (
                    <tr>
                      <td colSpan={user?.role === "admin" ? 6 : 5} className="text-center py-5">
                        <svg width="128" height="128" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-3">
                          <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7"/>
                          <circle cx="12" cy="12" r="3"/>
                          <path d="M12 8v1m0 4v3m-4-2h8"/>
                        </svg>
                        <h5 className="text-muted">No data here</h5>
                      </td>
                    </tr>
                  ) : (
                    contacts.map((contact, index) => (
                      <tr key={contact._id} className="hover:bg-gray-50">
                        <td className="table-cell px-4 py-2" style={{ width: "10%" }}>
                          {(pagination.currentPage - 1) * pagination.limit + index + 1}
                        </td>
                        <td className="table-cell px-4 py-2 truncate" style={{ width: "15%" }}>
                          {contact.name}
                        </td>
                        <td className="table-cell px-4 py-2 truncate d-none d-md-table-cell" style={{ width: "20%" }}>
                          {contact.email}
                        </td>
                        <td className="table-cell px-4 py-2 truncate" style={{ width: "30%" }}>
                          {contact.message || "N/A"}
                        </td>
                        <td className="table-cell px-4 py-2" style={{ width: "15%" }}>
                          {formatDate(contact.createdAt)}
                        </td>
                        {user?.role === "admin" && (
                          <td className="table-cell px-4 py-2" style={{ width: "10%" }}>
                            <div className="btn-group" role="group">
                              <button
                                className="btn btn-outline-primary btn-sm me-2"
                                onClick={() => openEditModal(contact)}
                              >
                                <Edit size={16} /> Edit
                              </button>
                              <button
                                className="btn btn-outline-danger btn-sm"
                                onClick={() => handleDelete(contact._id)}
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
                  {Math.min(pagination.currentPage * pagination.limit, pagination.totalContacts)} of{" "}
                  {pagination.totalContacts} contacts
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

        {selectedContact && user?.role === "admin" && (
          <div className="modal" tabIndex={-1} style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)", position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 1050 }}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Edit Contact</h5>
                  <button type="button" className="btn-close" onClick={closeEditModal}></button>
                </div>
                <form onSubmit={handleEdit}>
                  <div className="modal-body">
                    {error && <div className="alert alert-danger">{error}</div>}
                    <div className="mb-3">
                      <label className="form-label">Name</label>
                      <input
                        type="text"
                        className="form-control"
                        value={editFormData.name}
                        onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
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
                      <label className="form-label">Message</label>
                      <textarea
                        className="form-control"
                        value={editFormData.message}
                        onChange={(e) => setEditFormData({ ...editFormData, message: e.target.value })}
                        rows={3}
                        required
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

        <DeleteConfirmationModal
          show={showDeleteModal}
          onHide={() => {
            setShowDeleteModal(false);
            setContactIdToDelete(null);
          }}
          onConfirm={confirmDelete}
        />
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

export default ContactPage;
