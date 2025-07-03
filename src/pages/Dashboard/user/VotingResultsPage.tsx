"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import DashboardLayout from "../../../components/dashboard/DashboardLayout";
import axiosInstance from "../../../api/axiosInstance";

interface VotingResult {
  id: number;
  title: string;
  description: string;
  totalVotes: number;
  percentage: number;
  status: "winner" | "runner-up" | "participant";
  category: string;
}

interface VotingStats {
  totalParticipants: number;
  totalVotes: number;
  completionRate: number;
  topCategory: string;
}

const VotingResultsPage: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const eventId = location.state?.eventId; // Retrieve eventId from state
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [votingResults, setVotingResults] = useState<VotingResult[]>([]);
  const [stats, setStats] = useState<VotingStats>({
    totalParticipants: 0,
    totalVotes: 0,
    completionRate: 0,
    topCategory: "",
  });
  const [loadingResults, setLoadingResults] = useState<boolean>(true);

  const categories = ["all", "Infrastructure", "Education", "Healthcare"];

  // Validate eventId on component mount and fetch results
  useEffect(() => {
    if (!eventId) {
      toast.error("No event selected. Please go back and select an event.");
      navigate("/dashboard/my-events");
      return;
    }

    const fetchResults = async () => {
      try {
        const baseUrl = import.meta.env.VITE_API_URL;
        const url = `${baseUrl}/events/${eventId}/results`;
        console.log("Fetching results from:", url); // Debug log
        const response = await axiosInstance.get(url);

        if (response.status === 200 && response.data) {
          setVotingResults(
            response.data.results.map((result: any) => ({
              id: result.id || result._id || 1,
              title: result.title || "Untitled",
              description: result.description || "No description",
              totalVotes: result.totalVotes || 0,
              percentage: result.percentage || 0,
              status: result.status || "participant",
              category: result.category || "Uncategorized",
            }))
          );
          setStats({
            totalParticipants: response.data.stats.totalParticipants || 0,
            totalVotes: response.data.stats.totalVotes || 0,
            completionRate: response.data.stats.completionRate || 0,
            topCategory: response.data.stats.topCategory || "",
          });
        } else {
          throw new Error("Failed to fetch voting results");
        }
      } catch (error: any) {
        console.error("Error fetching results:", error.response ? error.response.data : error.message);
        toast.error("Failed to load voting results. Please try again.");
      } finally {
        setLoadingResults(false);
      }
    };

    fetchResults();
  }, [eventId, navigate]);

  const filteredResults =
    selectedCategory === "all"
      ? votingResults
      : votingResults.filter((result) => result.category === selectedCategory);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "winner":
        return "#4ADE80";
      case "runner-up":
        return "#F59E0B";
      default:
        return "#6B7280";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "winner":
        return (
          <svg className="status-icon" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        );
      case "runner-up":
        return (
          <svg className="status-icon" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
          </svg>
        );
      default:
        return (
          <svg className="status-icon" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
          </svg>
        );
    }
  };

  if (authLoading) {
    return (
      <DashboardLayout userRole="host" userName="">
        <div className="container-fluid p-4">
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3 text-muted">Loading voting results...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!user) {
    return null; // DashboardPage handles redirection
  }

  const userName = `${user.firstname || "User"} ${user.lastname || ""}`;
  const userRole = user.role || "host";

  return (
    <DashboardLayout userRole={userRole as "admin" | "host" | "guest"} userName={userName}>
      <div className="container-fluid p-4">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4">
          <div className="mb-3 mb-md-0">
            <h2 className="mb-1">Voting Results</h2>
            <p className="text-muted">Community voting has concluded. Here are the final results.</p>
          </div>
          <div className="d-flex flex-column flex-sm-row gap-2">
            <button
              className="btn btn-outline-secondary mb-2 mb-sm-0"
              onClick={() => navigate("/dashboard/my-events")}
            >
              <svg className="me-2" width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17l-5-5m0 0l5-5m-5 5h12" />
              </svg>
              Back to Dashboard
            </button>
            {/* <button className="btn btn-primary" onClick={() => navigate("/voting/new")}>
              <svg className="me-2" width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Start New Voting
            </button> */}
          </div>
        </div>

        <div className="card border-0 shadow-sm">
          <div className="card-body">
            {/* Stats Overview */}
            <div className="stats-grid mb-4">
              <div className="stat-card">
                <div className="stat-number">{stats.totalParticipants.toLocaleString()}</div>
                <div className="stat-label">Total Participants</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">{stats.totalVotes.toLocaleString()}</div>
                <div className="stat-label">Total Votes Cast</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">{stats.completionRate}%</div>
                <div className="stat-label">Completion Rate</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">{stats.topCategory}</div>
                <div className="stat-label">Top Category</div>
              </div>
            </div>

            {/* Category Filter */}
            <div className="filter-section mb-4">
              <h4 className="mb-3">Filter by Category</h4>
              <div className="category-filters">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`btn ${selectedCategory === category ? "btn-primary" : "btn-outline-secondary"} me-2 mb-2`}
                  >
                    {category === "all" ? "All Categories" : category}
                  </button>
                ))}
              </div>
            </div>

            {/* Results List with Scrollable Container */}
            <div className="results-section">
              <h4 className="mb-3">
                {selectedCategory === "all" ? "All Results" : `${selectedCategory} Results`}
                <span className="text-muted ms-2">({filteredResults.length} items)</span>
              </h4>

              <div className="results-scroll-container">
                <div className="results-list">
                  {loadingResults ? (
                    <div className="text-center py-3">Loading results...</div>
                  ) : filteredResults.length > 0 ? (
                    filteredResults.map((result, index) => (
                      <div
                        key={result.id}
                        className={`result-card ${result.status} mb-3 p-3 border rounded`}
                      >
                        <div className="d-flex flex-column flex-md-row gap-3">
                          <div className="result-rank fw-bold fs-4">#{index + 1}</div>
                          <div className="flex-grow-1">
                            <h5 className="mb-1">{result.title}</h5>
                            <p className="text-muted mb-2">{result.description}</p>
                            <div className="d-flex flex-wrap gap-2 align-items-center">
                              <span className="badge bg-light text-dark">{result.category}</span>
                              <div className="status-badge" style={{ color: getStatusColor(result.status) }}>
                                {getStatusIcon(result.status)}
                                <span className="ms-1">
                                  {result.status === "winner"
                                    ? "Winner"
                                    : result.status === "runner-up"
                                      ? "Runner-up"
                                      : "Participant"}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="result-stats">
                            <div className="text-center">
                              <div className="fw-bold">{result.totalVotes.toLocaleString()}</div>
                              <div className="text-muted small">votes</div>
                            </div>
                            <div className="percentage-display ms-3">
                              <div className="fw-bold text-end">{result.percentage}%</div>
                              <div className="progress mt-1" style={{ height: "8px" }}>
                                <div
                                  className="progress-bar"
                                  role="progressbar"
                                  style={{
                                    width: `${result.percentage}%`,
                                    backgroundColor: getStatusColor(result.status),
                                  }}
                                  aria-valuenow={result.percentage}
                                  aria-valuemin={0}
                                  aria-valuemax={100}
                                ></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-3">No results available for this event.</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .stat-card {
          background: #f8f9fa;
          border-radius: 8px;
          padding: 1.5rem;
          text-align: center;
          border: 1px solid #e9ecef;
        }

        .stat-number {
          font-size: 1.5rem;
          font-weight: 600;
          color: #1F2937;
          margin-bottom: 0.5rem;
        }

        .stat-label {
          font-size: 0.875rem;
          color: #6B7280;
          font-weight: 500;
        }

        .filter-section {
          margin-bottom: 2rem;
        }

        .category-filters {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .results-scroll-container {
          max-height: 500px; /* Set a fixed height for the scrollable area */
          overflow-y: auto; /* Enable vertical scrolling */
          padding-right: 1rem; /* Add padding to prevent content from touching scrollbar */
        }

        .results-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .result-card {
          transition: all 0.2s ease;
        }

        .result-card.winner {
          border-color: #4ADE80;
          background: rgba(74, 222, 128, 0.05);
        }

        .result-card.runner-up {
          border-color: #F59E0B;
          background: rgba(245, 158, 11, 0.05);
        }

        .result-rank {
          color: #5144A1;
        }

        .status-badge {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          font-weight: 500;
          font-size: 0.875rem;
        }

        .status-icon {
          width: 16px;
          height: 16px;
        }

        .percentage-display {
          min-width: 150px;
        }

        /* Custom scrollbar styling for better appearance */
        .results-scroll-container::-webkit-scrollbar {
          width: 8px;
        }

        .results-scroll-container::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 4px;
        }

        .results-scroll-container::-webkit-scrollbar-thumb {
          background: #888;
          border-radius: 4px;
        }

        .results-scroll-container::-webkit-scrollbar-thumb:hover {
          background: #555;
        }

        @media (max-width: 768px) {
          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .results-scroll-container {
            max-height: 400px; /* Adjust height for smaller screens */
          }

          .result-stats {
            flex-direction: column;
            align-items: stretch;
            gap: 1rem;
          }

          .percentage-display {
            min-width: auto;
          }
        }

        @media (max-width: 480px) {
          .stats-grid {
            grid-template-columns: 1fr;
          }

          .result-rank {
            align-self: flex-start;
          }

          .results-scroll-container {
            max-height: 300px; /* Further adjust height for very small screens */
          }
        }
      `}</style>
    </DashboardLayout>
  );
};

export default VotingResultsPage;