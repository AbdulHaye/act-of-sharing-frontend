import React, { useState, useEffect } from "react";
import DashboardLayout from "../../../components/dashboard/DashboardLayout";
import { useAuth } from "../../../context/AuthContext";
import '../../../styles/user-pages.css';
import { toast } from "react-toastify";
import '../../../styles/loader.css'

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

  const baseUrl = "https://commonchange-backend.onrender.com";

  useEffect(() => {
    const fetchContacts = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${baseUrl}/api/contact`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch contacts");
        }

        const data = await response.json();
        const sortedContacts = data.sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setContacts(sortedContacts);
      } catch (err: any) {
        setError(err.message || "An error occurred while fetching contacts");
        toast.error(err.message || "Failed to fetch contacts");
      } finally {
        setLoading(false);
      }
    };

    fetchContacts();
  }, []);

  const handleDelete = async (contactId: string) => {
    if (window.confirm("Are you sure you want to delete this contact?")) {
      try {
        const response = await fetch(`${baseUrl}/api/contact/${contactId}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to delete contact");
        }

        setContacts(contacts.filter((c) => c._id !== contactId));
        toast.success("Contact deleted successfully");
      } catch (err: any) {
        toast.error(err.message || "Failed to delete contact");
      }
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
      const response = await fetch(`${baseUrl}/api/contact/${selectedContact._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update contact");
      }

      const updatedContact = await response.json();
      setContacts(contacts.map((c) =>
        c._id === selectedContact._id ? updatedContact : c
      ));
      setSelectedContact(null);
      toast.success("Contact updated successfully");
    } catch (err: any) {
      toast.error(err.message || "Failed to update contact");
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
            <h5 className="card-title mb-0">Contact</h5>
          </div>
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table-custom mb-0">
                <thead>
                  <tr>
                    <th style={{ backgroundColor: "#5144A1", color: "#FFFFFF", padding: "12px 20px" }}>ID</th>
                    <th style={{ backgroundColor: "#5144A1", color: "#FFFFFF", padding: "12px 20px" }}>Name</th>
                    <th style={{ backgroundColor: "#5144A1", color: "#FFFFFF", padding: "12px 20px" }}>Email</th>
                    <th style={{ backgroundColor: "#5144A1", color: "#FFFFFF", padding: "12px 20px" }}>Message</th>
                    {user?.role === "admin" && (
                      <th style={{ backgroundColor: "#5144A1", color: "#FFFFFF", padding: "12px 20px" }}>Actions</th>
                    )}
                  </tr>
                </thead>
              </table>
              <div style={{ overflowY: "auto", overflowX: "hidden", height: "calc(100vh - 180px)" }}>
                {contacts.length === 0 ? (
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
                  <table className="table-custom mb-0">
                    <tbody>
                      {contacts.map((contact, index) => (
                        <tr key={contact._id}>
                          <td className="table-cell" style={{ padding: "12px 20px", color: "#1F2937" }}>{index + 1}</td>
                          <td className="table-cell" style={{ padding: "12px 20px", color: "#1F2937" }}>{contact.name}</td>
                          <td className="table-cell" style={{ padding: "12px 20px", color: "#1F2937" }}>{contact.email}</td>
                          <td className="table-cell" style={{ padding: "12px 20px", color: "#1F2937" }}>{contact.message || "N/A"}</td>
                          {user?.role === "admin" && (
                            <td className="table-cell" style={{ padding: "12px 20px", color: "#1F2937" }}>
                              <div style={{ display: "inline-flex", gap: "1rem" }}>
                                <button
                                  className="btn btn-outline-primary"
                                  onClick={() => openEditModal(contact)}
                                  style={{ minWidth: "80px" }}
                                >
                                  Edit
                                </button>
                                <button
                                  className="btn btn-outline-primary"
                                  onClick={() => handleDelete(contact._id)}
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

        {/* Modal for Editing Contact */}
        {selectedContact && user?.role === "admin" && (
          <div className="modal" tabIndex={-1} style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}>
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
      </div>
    </DashboardLayout>
  );
};

export default ContactPage;