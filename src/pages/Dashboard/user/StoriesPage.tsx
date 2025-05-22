"use client";

import React, { useState, useEffect } from "react";
import DashboardLayout from "../../../components/dashboard/DashboardLayout";
import { useAuth } from "../../../context/AuthContext";
import axiosInstance from "../../../api/axiosInstance";
import { toast } from "react-toastify";
import { Edit, Trash2, Plus } from "lucide-react";

const StoriesPage: React.FC = () => {
  const [stories, setStories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const [selectedStory, setSelectedStory] = useState<any | null>(null);
  const [editFormData, setEditFormData] = useState({
    quote: "",
    name: "",
    location: "",
    category: "",
    amount: "",
  });
  const [addFormData, setAddFormData] = useState({
    quote: "",
    name: "",
    location: "",
    category: "",
    amount: "",
  });
  const [addFile, setAddFile] = useState<File | null>(null); // New state for add file
  const [editFile, setEditFile] = useState<File | null>(null); // New state for edit file
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalStories: 0,
    limit: 10,
  });
  const [showAddModal, setShowAddModal] = useState(false);

  const fetchStories = async (page: number = 1) => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      const response = await axiosInstance.get(`/stories?page=${page}&limit=${pagination.limit}`, {
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token,
        },
      });

      if (!response.data) {
        throw new Error("No data returned from the server");
      }

      const data = Array.isArray(response.data.stories) ? response.data.stories : [];
      const sortedStories = data.sort((a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setStories(sortedStories);
      setPagination({
        currentPage: response.data.pagination.currentPage,
        totalPages: response.data.pagination.totalPages,
        totalStories: response.data.pagination.totalStories,
        limit: response.data.pagination.limit,
      });
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || "An error occurred while fetching stories";
      setError(errorMessage);
      toast.error(errorMessage);
      setStories([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStories(pagination.currentPage);
  }, [pagination.currentPage]);

  const handleDelete = async (storyId: string) => {
    if (window.confirm("Are you sure you want to delete this story?")) {
      try {
        const token = localStorage.getItem("token");
        const response = await axiosInstance.delete(`/stories/${storyId}`, {
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": token,
          },
        });

        if (!response.data) {
          throw new Error("Failed to delete story");
        }

        toast.success("Story deleted successfully");
        fetchStories(pagination.currentPage);
      } catch (err: any) {
        const errorMessage = err.response?.data?.message || err.message || "Failed to delete story";
        toast.error(errorMessage);
      }
    }
  };

  const validateFormData = (data: any) => {
    if (!data.quote || data.quote.trim() === "") return "Quote is required";
    if (!data.name || data.name.trim() === "") return "Name is required";
    if (!data.location || data.location.trim() === "") return "Location is required";
    if (!data.category || data.category.trim() === "") return "Category is required";
    if (!data.amount || isNaN(parseInt(data.amount)) || parseInt(data.amount) <= 0) return "Amount must be a valid positive number";
    return null;
  };

  const handleAdd = async (e: React.FormEvent) => {
  e.preventDefault();

  const validationError = validateFormData(addFormData);
  if (validationError) {
    toast.error(validationError);
    return;
  }

  const formData = new FormData();
  formData.append("quote", addFormData.quote.trim());
  formData.append("name", addFormData.name.trim());
  formData.append("location", addFormData.location.trim());
  formData.append("category", addFormData.category.trim());
  formData.append("amount", parseInt(addFormData.amount).toString());
  if (addFile) {
    formData.append("image", addFile);
  }

  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Authentication token not found");

    console.log("Submitting story with payload:", Object.fromEntries(formData));

    const response = await axiosInstance.post(`/stories`, formData, {
      headers: {
        "x-auth-token": token,
      },
    });

    if (!response.data) {
      throw new Error("Failed to add story: No data returned");
    }

    toast.success("Story added successfully");
    setShowAddModal(false);
    setAddFormData({ quote: "", name: "", location: "", category: "", amount: "" });
    setAddFile(null);
    setAddFilePreview(null);
    fetchStories(pagination.currentPage);
  } catch (err: any) {
    const errorMessage = err.response?.data?.message || err.message || "Failed to add story";
    console.error("Error adding story:", err.response?.data || err);
    toast.error(errorMessage);
  }
};

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStory) return;

    const validationError = validateFormData(editFormData);
    if (validationError) {
      toast.error(validationError);
      return;
    }

    const formData = new FormData();
    formData.append("quote", editFormData.quote.trim());
    formData.append("name", editFormData.name.trim());
    formData.append("location", editFormData.location.trim());
    formData.append("category", editFormData.category.trim());
    formData.append("amount", parseInt(editFormData.amount).toString());
    if (editFile) {
      formData.append("image", editFile); // Append the file if selected
    }

    try {
      const token = localStorage.getItem("token");
      const response = await axiosInstance.put(`/stories/${selectedStory._id}`, formData, {
        headers: {
          "x-auth-token": token,
        },
      });

      if (!response.data) {
        throw new Error("Failed to update story");
      }

      const updatedStory = response.data;
      setStories(stories.map((s) =>
        s._id === selectedStory._id ? updatedStory : s
      ));
      setSelectedStory(null);
      setEditFile(null);
      toast.success("Story updated successfully");
      fetchStories(pagination.currentPage);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || "Failed to update story";
      toast.error(errorMessage);
    }
  };

  const openEditModal = (story: any) => {
    setSelectedStory(story);
    setEditFormData({
      quote: story.quote,
      name: story.name,
      location: story.location,
      category: story.category,
      amount: story.amount.toString(),
    });
    setEditFile(null); // Reset file selection when opening edit modal
  };

  const closeEditModal = () => {
    setSelectedStory(null);
    setEditFile(null);
  };

  const openAddModal = () => {
    setShowAddModal(true);
    setAddFile(null); // Reset file selection when opening add modal
  };

  const closeAddModal = () => {
    setShowAddModal(false);
    setAddFormData({ quote: "", name: "", location: "", category: "", amount: "" });
    setAddFile(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, setFile: (file: File | null) => void) => {
    const file = e.target.files?.[0] || null;
    if (file && !file.type.startsWith("image/")) {
      toast.error("Please select an image file (e.g., JPG, PNG).");
      return;
    }
    setFile(file);
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
          <div className="card-header bg-white d-flex justify-content-between align-items-center">
            <h5 className="card-title mb-0 text-lg font-semibold">Stories</h5>
            {user?.role === "admin" && (
              <button className="btn btn-purple" onClick={openAddModal}>
                <Plus size={16} className="me-2" />
                Add Stories
              </button>
            )}
          </div>
          <div className="card-body p-0">
            <div className="table-responsive" style={{ maxHeight: "calc(100vh - 250px)" }}>
              <table className="table-custom w-full text-sm">
                <thead className="sticky top-0 bg-primary text-white">
                  <tr>
                    <th className="table-header px-4 py-2" style={{ width: "5%" }}>ID</th>
                    <th className="table-header px-4 py-2" style={{ width: "25%" }}>Quote</th>
                    <th className="table-header px-4 py-2" style={{ width: "15%" }}>Name</th>
                    <th className="table-header px-4 py-2 d-none d-md-table-cell" style={{ width: "15%" }}>Location</th>
                    <th className="table-header px-4 py-2 d-none d-md-table-cell" style={{ width: "15%" }}>Category</th>
                    <th className="table-header px-4 py-2" style={{ width: "10%" }}>Amount</th>
                    {user?.role === "admin" && (
                      <th className="table-header px-4 py-2" style={{ width: "15%" }}>Actions</th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {stories.length === 0 ? (
                    <tr>
                      <td colSpan={user?.role === "admin" ? 7 : 6} className="text-center py-5">
                        <svg width="128" height="128" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-3">
                          <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7"/>
                          <circle cx="12" cy="12" r="3"/>
                          <path d="M12 8v1m0 4v3m-4-2h8"/>
                        </svg>
                        <h5 className="text-muted">No data here</h5>
                      </td>
                    </tr>
                  ) : (
                    stories.map((story, index) => (
                      <tr key={story._id} className="hover:bg-gray-50">
                        <td className="table-cell px-4 py-2" style={{ width: "5%" }}>
                          {(pagination.currentPage - 1) * pagination.limit + index + 1}
                        </td>
                        <td className="table-cell px-4 py-2 truncate" style={{ width: "25%" }}>
                          {story.quote}
                        </td>
                        <td className="table-cell px-4 py-2 truncate" style={{ width: "15%" }}>
                          {story.name}
                        </td>
                        <td className="table-cell px-4 py-2 truncate d-none d-md-table-cell" style={{ width: "15%" }}>
                          {story.location}
                        </td>
                        <td className="table-cell px-4 py-2 truncate d-none d-md-table-cell" style={{ width: "15%" }}>
                          {story.category}
                        </td>
                        <td className="table-cell px-4 py-2" style={{ width: "10%" }}>
                          ${story.amount}
                        </td>
                        {user?.role === "admin" && (
                          <td className="table-cell px-4 py-2" style={{ width: "15%" }}>
                            <div className="btn-group" role="group">
                              <button
                                className="btn btn-outline-primary btn-sm me-2"
                                onClick={() => openEditModal(story)}
                              >
                                <Edit size={16} /> Edit
                              </button>
                              <button
                                className="btn btn-outline-danger btn-sm"
                                onClick={() => handleDelete(story._id)}
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
                  {Math.min(pagination.currentPage * pagination.limit, pagination.totalStories)} of{" "}
                  {pagination.totalStories} stories
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

        {selectedStory && user?.role === "admin" && (
          <div className="modal" tabIndex={-1} style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Edit Story</h5>
                  <button type="button" className="btn-close" onClick={closeEditModal}></button>
                </div>
                <form onSubmit={handleEdit}>
                  <div className="modal-body">
                    {error && <div className="alert alert-danger">{error}</div>}
                    <div className="mb-3">
                      <label className="form-label">Quote</label>
                      <textarea
                        className="form-control"
                        value={editFormData.quote}
                        onChange={(e) => setEditFormData({ ...editFormData, quote: e.target.value })}
                        rows={3}
                        required
                      />
                    </div>
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
                      <label className="form-label">Location</label>
                      <input
                        type="text"
                        className="form-control"
                        value={editFormData.location}
                        onChange={(e) => setEditFormData({ ...editFormData, location: e.target.value })}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Category</label>
                      <select
                        className="form-control"
                        value={editFormData.category}
                        onChange={(e) => setEditFormData({ ...editFormData, category: e.target.value })}
                        required
                      >
                        <option value="">Select Category</option>
                        <option value="Home recovery">Home recovery</option>
                        <option value="Medical recovery">Medical recovery</option>
                        <option value="Emergency support">Emergency support</option>
                      </select>
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
                      <label className="form-label">Image</label>
                      <input
                        type="file"
                        className="form-control"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, setEditFile)}
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

        {showAddModal && user?.role === "admin" && (
          <div className="modal" tabIndex={-1} style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Add Story</h5>
                  <button type="button" className="btn-close" onClick={closeAddModal}></button>
                </div>
                <form onSubmit={handleAdd}>
                  <div className="modal-body">
                    {error && <div className="alert alert-danger">{error}</div>}
                    <div className="mb-3">
                      <label className="form-label">Quote</label>
                      <textarea
                        className="form-control"
                        value={addFormData.quote}
                        onChange={(e) => setAddFormData({ ...addFormData, quote: e.target.value })}
                        rows={3}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Name</label>
                      <input
                        type="text"
                        className="form-control"
                        value={addFormData.name}
                        onChange={(e) => setAddFormData({ ...addFormData, name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Location</label>
                      <input
                        type="text"
                        className="form-control"
                        value={addFormData.location}
                        onChange={(e) => setAddFormData({ ...addFormData, location: e.target.value })}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Category</label>
                      <select
                        className="form-control"
                        value={addFormData.category}
                        onChange={(e) => setAddFormData({ ...addFormData, category: e.target.value })}
                        required
                      >
                        <option value="">Select Category</option>
                        <option value="Home recovery">Home recovery</option>
                        <option value="Medical recovery">Medical recovery</option>
                        <option value="Emergency support">Emergency support</option>
                      </select>
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Amount</label>
                      <input
                        type="number"
                        className="form-control"
                        value={addFormData.amount}
                        onChange={(e) => setAddFormData({ ...addFormData, amount: e.target.value })}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Image</label>
                      <input
                        type="file"
                        className="form-control"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, setAddFile)}
                      />
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={closeAddModal}>
                      Close
                    </button>
                    <button type="submit" className="btn btn-primary">
                      Add Story
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
        .btn-purple {
          background-color: #6B46C1;
          color: white;
        }
        .btn-purple:hover {
          background-color: #5A3DA0;
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

export default StoriesPage;