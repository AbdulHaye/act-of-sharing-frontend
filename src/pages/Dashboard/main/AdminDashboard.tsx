"use client";

import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Users, DollarSign, Calendar, TrendingUp } from "lucide-react";
import DashboardLayout from "../../../components/dashboard/DashboardLayout";
import { useEvent } from "../../../context/EventContext";
import { useAuth } from "../../../context/AuthContext";
import axiosInstance from "../../../api/axiosInstance";
import { toast } from "react-toastify";

interface Stat {
  id: number;
  title: string;
  value: string | number;
  icon: React.ReactNode;
}

interface TotalGoalResponse {
  totalGoalAmount: number;
}

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const { events, getEvents, loading: eventsLoading } = useEvent();
  const [users, setUsers] = React.useState<any[]>([]);
  const [totalRaised, setTotalRaised] = React.useState<number>(0);
  const [totalGoalAmount, setTotalGoalAmount] = React.useState<number>(0);
  const [eventsPagination, setEventsPagination] = React.useState({
    currentPage: 1,
    totalPages: 1,
    totalEvents: 0,
    limit: 10,
  });
  const [usersPagination, setUsersPagination] = React.useState({
    currentPage: 1,
    totalPages: 1,
    totalUsers: 0,
    limit: 10,
  });
  const [usersLoading, setUsersLoading] = React.useState<boolean>(false);

  // Fetch users from the API
  const fetchUsers = async (page: number = 1) => {
    setUsersLoading(true);
    try {
      const token = localStorage.getItem("token") || "";
      const response = await axiosInstance.get(`/users?page=${page}&limit=${usersPagination.limit}`, {
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token,
        },
      });
      if (!response.data) {
        throw new Error("No data returned from the server");
      }
      setUsers(response.data.users);
      setUsersPagination({
        currentPage: response.data.pagination.currentPage,
        totalPages: response.data.pagination.totalPages,
        totalUsers: response.data.pagination.totalUsers,
        limit: response.data.pagination.limit,
      });
    } catch (error: any) {
      console.error("Error fetching users:", error);
      toast.error(error.response?.data?.message || "Failed to fetch users");
      setUsers([]);
    } finally {
      setUsersLoading(false);
    }
  };

  // Fetch events using EventContext
  const fetchEvents = async (page: number = 1) => {
    try {
      const response = await getEvents(page, eventsPagination.limit);
      setEventsPagination({
        currentPage: response.pagination.currentPage,
        totalPages: response.pagination.totalPages,
        totalEvents: response.pagination.totalEvents,
        limit: response.pagination.limit,
      });
    } catch (error: any) {
      console.error("Error fetching events:", error);
      toast.error(error.message || "Failed to fetch events");
    }
  };

  // Fetch total raised from contributions
  const fetchTotalRaised = async () => {
    try {
      const token = localStorage.getItem("token") || "";
      const response = await axiosInstance.get(`/contributions/total-funds`, {
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token,
        },
      });
      if (!response.data) {
        throw new Error("No data returned from the server");
      }
      console.log("Fetched total raised response:", response.data);
      setTotalRaised(Number(response.data.totalFunds) || 0);
    } catch (error: any) {
      console.error("Error fetching total raised:", error);
      toast.error(error.response?.data?.message || "Failed to fetch total raised");
      setTotalRaised(0);
    }
  };

  // Fetch total goal amount for all events
  const fetchTotalGoalAmount = async () => {
    try {
      const token = localStorage.getItem("token") || "";
      console.log("Fetching total goal amount with token:", token);
      const response = await axiosInstance.get<TotalGoalResponse>("/events/total-goal-amount", {
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token,
        },
      });
      console.log("Fetched total goal amount response:", response.data);
      const totalGoal = Number(response.data.totalGoalAmount) || 0;
      setTotalGoalAmount(totalGoal);
    } catch (error: any) {
      console.error("Error fetching total goal amount:", error);
      toast.error(error.response?.data?.message || "Failed to fetch total goal amount");
      setTotalGoalAmount(0);
    }
  };

  // Fetch data when the component mounts or pagination changes
  useEffect(() => {
    if (user) {
      fetchUsers(usersPagination.currentPage);
      fetchEvents(eventsPagination.currentPage);
      fetchTotalRaised();
      fetchTotalGoalAmount();
    }
  }, [user, usersPagination.currentPage, eventsPagination.currentPage]);

  // Handle page changes
  const handleUsersPageChange = (page: number) => {
    if (page >= 1 && page <= usersPagination.totalPages) {
      setUsersPagination((prev) => ({ ...prev, currentPage: page }));
    }
  };

  const handleEventsPageChange = (page: number) => {
    if (page >= 1 && page <= eventsPagination.totalPages) {
      setEventsPagination((prev) => ({ ...prev, currentPage: page }));
    }
  };

  // Compute stats dynamically
  const stats = React.useMemo(() => {
    const totalUsers = usersPagination.totalUsers;
    const totalEvents = eventsPagination.totalEvents;
    const thisMonth = new Date().getMonth();
    const lastMonth = thisMonth === 0 ? 11 : thisMonth - 1;
    const thisMonthUsers = users.filter(u => new Date(u.createdAt).getMonth() === thisMonth).length;
    const lastMonthUsers = users.filter(u => new Date(u.createdAt).getMonth() === lastMonth).length;
    const growthRate = lastMonthUsers > 0 ? ((thisMonthUsers - lastMonthUsers) / lastMonthUsers) * 100 : 0;

    return [
      {
        id: 1,
        title: "Total Users",
        value: totalUsers,
        icon: <Users size={24} />,
      },
      {
        id: 2,
        title: "Total Events",
        value: totalEvents,
        icon: <Calendar size={24} />,
      },
       {
        id: 4,
        title: "Total Goal Amount",
        value: `$${totalGoalAmount.toLocaleString()}`,
        icon: <DollarSign size={24} />,
      },
      {
        id: 3,
        title: "Total Donations",
        value: `$${totalRaised.toLocaleString()}`,
        icon: <DollarSign size={24} />,
      },
     
    ];
  }, [eventsPagination.totalEvents, usersPagination.totalUsers, totalRaised, totalGoalAmount, users]);

  // Recent events (sorted by date, most recent first)
  const recentEvents = React.useMemo(() => {
    return events
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .map(event => ({
        id: event._id,
        name: event.title || "Unnamed Event",
        location: event.location,
        date: new Date(event.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
        goalAmount: event.goalAmount,
        guests: Number(event.guestCount) || 0,
        status: event.status,
      }));
  }, [events]);

  // Recent users (sorted by join date, most recent first)
  const recentUsers = React.useMemo(() => {
    return users
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .map(user => ({
        id: user._id,
        name: `${user.firstName || "User"} ${user.lastName || ""}`.trim(),
        email: user.email || "N/A",
        role: user.role || "Guest",
        joined: new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      }));
  }, [users]);

  return (
    <DashboardLayout userRole="admin" userName={user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : "Admin User"}>
      <div className="dashboard-static-container min-h-screen bg-gray-100">
        <div className="container-fluid p-4 sm:p-6">
          {/* Stats Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {stats.map((stat) => (
              <div key={stat.id} className="card h-full border-0 shadow-sm bg-white">
                <div className="card-body flex items-center p-4">
                  <div className="stat-icon text-primary mr-3">{stat.icon}</div>
                  <div>
                    <h3 className="stat-value text-2xl font-bold">{stat.value}</h3>
                    <p className="stat-title text-muted mb-0 text-sm">{stat.title}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Tables Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="card border-0 shadow-sm bg-white">
              <div className="card-header bg-white flex justify-between items-center p-4">
                <h5 className="card-title mb-0 text-lg font-semibold">Recent Events</h5>
              </div>
              <div className="card-body p-0">
                <div className="relative overflow-x-auto" style={{ maxHeight: 'calc(100vh - 400px)' }}>
                  <table className="table-custom w-full text-sm">
                    <thead className="sticky top-0 bg-primary text-white">
                      <tr>
                        <th className="table-header px-4 py-2">Event Name</th>
                        <th className="table-header px-4 py-2 hidden sm:table-cell">Location</th>
                        <th className="table-header px-4 py-2 hidden md:table-cell">Date</th>
                        <th className="table-header px-4 py-2">Amount</th>
                        <th className="table-header px-4 py-2 hidden lg:table-cell">Guests</th>
                        <th className="table-header px-4 py-2 hidden lg:table-cell">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {eventsLoading ? (
                        <tr>
                          <td colSpan={6} className="text-center py-5">
                            <div className="spinner-border text-primary" role="status">
                              <span className="visually-hidden">Loading...</span>
                            </div>
                          </td>
                        </tr>
                      ) : recentEvents.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="text-center py-5">
                            <h5 className="text-muted">No events found</h5>
                          </td>
                        </tr>
                      ) : (
                        recentEvents.map((event) => (
                          <tr key={event.id} className="hover:bg-gray-50">
                            <td className="table-cell px-4 py-2 truncate">{event.name}</td>
                            <td className="table-cell px-4 py-2 truncate hidden sm:table-cell">{event.location}</td>
                            <td className="table-cell px-4 py-2 truncate hidden md:table-cell">{event.date}</td>
                            <td className="table-cell px-4 py-2 text-success font-semibold">${event.goalAmount.toLocaleString()}</td>
                            <td className="table-cell px-4 py-2 text-success font-semibold hidden lg:table-cell">{event.guests}</td>
                            <td className="table-cell px-4 py-2 hidden lg:table-cell">{event.status}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
                {/* Events Pagination Controls */}
                <div className="flex flex-col sm:flex-row justify-between items-center p-4 border-t border-gray-200">
                  <div className="mb-2 sm:mb-0 text-sm">
                    Showing {(eventsPagination.currentPage - 1) * eventsPagination.limit + 1} to{" "}
                    {Math.min(eventsPagination.currentPage * eventsPagination.limit, eventsPagination.totalEvents)} of{" "}
                    {eventsPagination.totalEvents} events
                  </div>
                  <nav>
                    <ul className="pagination flex space-x-2">
                      <li className={`page-item ${eventsPagination.currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""}`}>
                        <button className="page-link px-3 py-1 border rounded" onClick={() => handleEventsPageChange(eventsPagination.currentPage - 1)}>
                          Previous
                        </button>
                      </li>
                      {[...Array(eventsPagination.totalPages)].map((_, i) => (
                        <li key={i} className={`page-item ${eventsPagination.currentPage === i + 1 ? "bg-primary text-white" : "bg-white"} border rounded`}>
                          <button className="page-link px-3 py-1" onClick={() => handleEventsPageChange(i + 1)}>
                            {i + 1}
                          </button>
                        </li>
                      ))}
                      <li className={`page-item ${eventsPagination.currentPage === eventsPagination.totalPages ? "opacity-50 cursor-not-allowed" : ""}`}>
                        <button className="page-link px-3 py-1 border rounded" onClick={() => handleEventsPageChange(eventsPagination.currentPage + 1)}>
                          Next
                        </button>
                      </li>
                    </ul>
                  </nav>
                </div>
              </div>
            </div>
            <div className="card border-0 shadow-sm bg-white">
              <div className="card-header bg-white flex justify-between items-center p-4">
                <h5 className="card-title mb-0 text-lg font-semibold">All Users</h5>
              </div>
              <div className="card-body p-0">
                <div className="relative overflow-x-auto" style={{ maxHeight: 'calc(100vh - 400px)' }}>
                  <table className="table-custom w-full text-sm">
                    <thead className="sticky top-0 bg-primary text-white">
                      <tr>
                        <th className="table-header px-4 py-2">Name</th>
                        <th className="table-header px-4 py-2 hidden sm:table-cell">Email</th>
                        <th className="table-header px-4 py-2 hidden md:table-cell">Role</th>
                        <th className="table-header px-4 py-2 hidden lg:table-cell">Joined</th>
                      </tr>
                    </thead>
                    <tbody>
                      {usersLoading ? (
                        <tr>
                          <td colSpan={4} className="text-center py-5">
                            <div className="spinner-border text-primary" role="status">
                              <span className="visually-hidden">Loading...</span>
                            </div>
                          </td>
                        </tr>
                      ) : recentUsers.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="text-center py-5">
                            <h5 className="text-muted">No users found</h5>
                          </td>
                        </tr>
                      ) : (
                        recentUsers.map((user) => (
                          <tr key={user.id} className="hover:bg-gray-50">
                            <td className="table-cell px-4 py-2 truncate">{user.name}</td>
                            <td className="table-cell px-4 py-2 truncate hidden sm:table-cell">{user.email}</td>
                            <td className="table-cell px-4 py-2 hidden md:table-cell">
                              <span className={`badge ${user.role === "Host" ? "bg-primary" : "bg-primary"} px-2 py-1 rounded`}>
                                {user.role}
                              </span>
                            </td>
                            <td className="table-cell px-4 py-2 truncate hidden lg:table-cell">{user.joined}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
                {/* Users Pagination Controls */}
                <div className="flex flex-col sm:flex-row justify-between items-center p-4 border-t border-gray-200">
                  <div className="mb-2 sm:mb-0 text-sm">
                    Showing {(usersPagination.currentPage - 1) * usersPagination.limit + 1} to{" "}
                    {Math.min(usersPagination.currentPage * usersPagination.limit, usersPagination.totalUsers)} of{" "}
                    {usersPagination.totalUsers} users
                  </div>
                  <nav>
                    <ul className="pagination flex space-x-2">
                      <li className={`page-item ${usersPagination.currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""}`}>
                        <button className="page-link px-3 py-1 border rounded" onClick={() => handleUsersPageChange(usersPagination.currentPage - 1)}>
                          Previous
                        </button>
                      </li>
                      {[...Array(usersPagination.totalPages)].map((_, i) => (
                        <li key={i} className={`page-item ${usersPagination.currentPage === i + 1 ? "bg-primary text-white" : "bg-white"} border rounded`}>
                          <button className="page-link px-3 py-1" onClick={() => handleUsersPageChange(i + 1)}>
                            {i + 1}
                          </button>
                        </li>
                      ))}
                      <li className={`page-item ${usersPagination.currentPage === usersPagination.totalPages ? "opacity-50 cursor-not-allowed" : ""}`}>
                        <button className="page-link px-3 py-1 border rounded" onClick={() => handleUsersPageChange(usersPagination.currentPage + 1)}>
                          Next
                        </button>
                      </li>
                    </ul>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .dashboard-static-container {
          width: 100%;
        }
        .table-custom {
          border-collapse: collapse;
        }
        .table-header {
          font-weight: 600;
        }
        .table-cell {
          border-bottom: 1px solid #dee2e6;
        }
        .stat-icon {
          color: #5144A1;
        }
        .text-primary {
          color: #5144A1;
        }
        .bg-primary {
          background-color: #5144A1;
        }
        .text-success {
          color: #28a745;
        }
        .text-muted {
          color: #6c757d;
        }
        .badge {
          display: inline-block;
          font-size: 0.75rem;
        }
        @media (max-width: 640px) {
          .table-custom {
            font-size: 0.75rem;
          }
          .table-header, .table-cell {
            padding: 0.5rem;
          }
          .stat-value {
            font-size: 1.25rem;
          }
          .card-body {
            padding: 0.75rem;
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

export default AdminDashboard;