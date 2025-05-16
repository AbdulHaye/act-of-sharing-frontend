"use client"

import React, { useEffect } from "react"
import { Link } from "react-router-dom"
import { Users, DollarSign, Calendar, TrendingUp, ArrowUpRight, ArrowDownRight, ChevronRight } from "lucide-react"
import DashboardLayout from "../../../components/dashboard/DashboardLayout"
import { useEvent } from "../../../context/EventContext"
import { useAuth } from "../../../context/AuthContext"

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const { events, getEvents } = useEvent();
  const [users, setUsers] = React.useState<any[]>([]);
  const [totalRaised, setTotalRaised] = React.useState(0);

  // Fetch users from the API
  const fetchUsers = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/users`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": localStorage.getItem("token") || "",
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
      setUsers([]);
    }
  };

  // Fetch total raised from contributions
  const fetchTotalRaised = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/contributions/total-funds`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": localStorage.getItem("token") || "",
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch total raised");
      }
      const data = await response.json();
      setTotalRaised(Number(data.totalFunds) || 0);
    } catch (error) {
      console.error("Error fetching total raised:", error);
      setTotalRaised(0);
    }
  };

  // Fetch data when the component mounts
  useEffect(() => {
    if (user) {
      fetchUsers();
      fetchTotalRaised();
    }
  }, [user, getEvents]);

  // Compute stats dynamically
  const stats = React.useMemo(() => {
    const totalUsers = users.length;
    const totalEvents = events.length;
    const thisMonth = new Date().getMonth();
    const lastMonth = thisMonth === 0 ? 11 : thisMonth - 1;
    const thisMonthUsers = users.filter(u => new Date(u.createdAt).getMonth() === thisMonth).length;
    const lastMonthUsers = users.filter(u => new Date(u.createdAt).getMonth() === lastMonth).length;
    const growthRate = lastMonthUsers > 0 ? ((thisMonthUsers - lastMonthUsers) / lastMonthUsers) * 100 : 0;

    return [
      {
        id: 1,
        title: "Total Users",
        value: totalUsers.toString(),
        icon: <Users size={24} />,
      },
      {
        id: 2,
        title: "Total Events",
        value: totalEvents.toString(),
        icon: <Calendar size={24} />,
      },
      {
        id: 3,
        title: "Total Raised",
        value: `$${totalRaised.toLocaleString()}`,
        icon: <DollarSign size={24} />,
      },
      {
        id: 4,
        title: "Growth Rate",
        value: `${growthRate.toFixed(1)}%`,
        icon: <TrendingUp size={24} />,
      },
    ];
  }, [events, users, totalRaised]);

  // Recent events (sorted by date, most recent first)
  const recentEvents = React.useMemo(() => {
    return events
      .map(event => ({
        id: event.id,
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
      <div className="dashboard-static-container">
        <div className="container-fluid p-4">
          {/* Stats Row */}
          <div className="row g-4 mb-4">
            {stats.map((stat) => (
              <div key={stat.id} className="col-12 col-md-6 col-xl-3">
                <div className="card h-100 border-0 shadow-sm">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <div className="stat-icon">{stat.icon}</div>
                    </div>
                    <h3 className="stat-value">{stat.value}</h3>
                    <p className="stat-title text-muted mb-0">{stat.title}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Tables Row */}
          <div className="row g-4">
            <div className="col-12 col-lg-6">
              <div className="card border-0 shadow-sm">
                <div className="card-header bg-white d-flex justify-content-between align-items-center">
                  <h5 className="card-title mb-0">Recent Events</h5>
                </div>
                <div className="card-body p-0">
                  <div style={{ position: "relative", height: "calc(100vh - 300px)" }}>
                    <table className="table-custom mb-0 events-table">
                      <thead style={{ position: "sticky", top: 0, zIndex: 10, backgroundColor: "#5144A1" }}>
                        <tr>
                          <th className="table-header">Event Name</th>
                          <th className="table-header">Location</th>
                          <th className="table-header">Date</th>
                          <th className="table-header">Amount</th>
                          <th className="table-header">Guests</th>
                          <th className="table-header">Status</th>
                        </tr>
                      </thead>
                    </table>
                    <div style={{ overflowY: "auto", overflowX: "hidden", height: "calc(100% - 60px)" }}>
                      <table className="table-custom mb-0 events-table">
                        <tbody>
                          {recentEvents.map((event) => (
                            <tr key={event.id}>
                              <td className="table-cell">{event.name}</td>
                              <td className="table-cell">{event.location}</td>
                              <td className="table-cell">{event.date}</td>
                              <td className="table-cell text-success fw-semibold">{event.goalAmount}</td>
                              <td className="table-cell text-success fw-semibold">{event.guests}</td>
                              <td className="table-cell">{event.status}</td>
                            </tr>
                          ))}
                          {recentEvents.length === 0 && (
                            <tr>
                              <td colSpan={6} className="text-center text-muted">
                                No events found
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-12 col-lg-6">
              <div className="card border-0 shadow-sm">
                <div className="card-header bg-white d-flex justify-content-between align-items-center">
                  <h5 className="card-title mb-0">All Users</h5>
                </div>
                <div className="card-body p-0">
                  <div style={{ position: "relative", height: "calc(100vh - 300px)" }}>
                    <table className="table-custom mb-0 users-table">
                      <thead style={{ position: "sticky", top: 0, zIndex: 10, backgroundColor: "#5144A1" }}>
                        <tr>
                          <th className="table-header">Name</th>
                          <th className="table-header">Email</th>
                          <th className="table-header">Role</th>
                          <th className="table-header">Joined</th>
                        </tr>
                      </thead>
                    </table>
                    <div style={{ overflowY: "auto", overflowX: "hidden", height: "calc(100% - 60px)" }}>
                      <table className="table-custom mb-0 users-table">
                        <tbody>
                          {recentUsers.map((user) => (
                            <tr key={user.id}>
                              <td className="table-cell">{user.name}</td>
                              <td className="table-cell">{user.email}</td>
                              <td className="table-cell">
                                <span className={`badge ${user.role === "Host" ? "bg-primary" : "bg-primary"}`}>
                                  {user.role}
                                </span>
                              </td>
                              <td className="table-cell">{user.joined}</td>
                            </tr>
                          ))}
                          {recentUsers.length === 0 && (
                            <tr>
                              <td colSpan={4} className="text-center text-muted">
                                No users found
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default AdminDashboard