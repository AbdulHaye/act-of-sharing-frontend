"use client"

import React, { useEffect } from "react"
import { Link } from "react-router-dom"
import { Users, DollarSign, Calendar, TrendingUp, ArrowUpRight, ArrowDownRight, ChevronRight } from "lucide-react"
import DashboardLayout from "../../../components/dashboard/DashboardLayout"
import { useEvent } from "../../../context/EventContext"
import { useAuth } from "../../../context/AuthContext"

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const { events, getEvents} = useEvent();
  const [users, setUsers] = React.useState<any[]>([]);

  // Fetch users from the API
  const fetchUsers = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/users`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": localStorage.getItem("token") || "", // Assuming token is stored in localStorage
        },
      });
      console.error("Response:", response); // Log the response for debugging
      
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
      setUsers([]); // Fallback to empty array on error
    }
  };

  // Fetch data when the component mounts
  useEffect(() => {
    console.log("User:", user); // Log the user for debugging
    if (user) {
      // fetchEvents(); // Fetch all events (admin sees all, not filtered by user)
      fetchUsers(); // Fetch all users
    }
  }, [user, getEvents]);

  // Compute stats dynamically
  const stats = React.useMemo(() => {
    const totalUsers = users.length;
    const totalEvents = events.length;
    const totalRaised = events.reduce((sum, event) => sum + (Number(event.goalAmount) || 0), 0);

    // Calculate growth rate (e.g., new users this month vs. last month)
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
        change: `+${users.filter(u => new Date(u.createdAt).getMonth() === thisMonth).length} this month`,
        isPositive: true,
      },
      {
        id: 2,
        title: "Total Events",
        value: totalEvents.toString(),
        icon: <Calendar size={24} />,
        change: `+${events.filter(e => new Date(e.createdAt).getMonth() === thisMonth).length} this month`,
        isPositive: true,
      },
      {
        id: 3,
        title: "Total Raised",
        value: `$${totalRaised.toLocaleString()}`,
        icon: <DollarSign size={24} />,
        change: `+$${events.filter(e => new Date(e.createdAt).getMonth() === thisMonth).reduce((sum, e) => sum + (Number(e.goalAmount) || 0), 0).toLocaleString()} this month`,
        isPositive: true,
      },
      {
        id: 4,
        title: "Growth Rate",
        value: `${growthRate.toFixed(1)}%`,
        icon: <TrendingUp size={24} />,
        change: `${growthRate >= 0 ? "+" : ""}${growthRate.toFixed(1)}%`,
        isPositive: growthRate >= 0,
      },
    ];
  }, [events, users]);

  // Recent events (sorted by date, most recent first)
  const recentEvents = React.useMemo(() => {
    return events
      // .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .map(event => ({
        id: event.id,
        name: event.title || "Unnamed Event",
        location: event.location,
        date: new Date(event.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
        goalAmount: event.goalAmount,
        guests: Number(event.guestCount) || 0,
        status: event.status,
      }))
      // .slice(0, 4);
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
      <div className="container-fluid p-4">
        {/* Stats Row */}
        <div className="row g-4 mb-4">
          {stats.map((stat) => (
            <div key={stat.id} className="col-12 col-md-6 col-xl-3">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <div className="stat-icon">{stat.icon}</div>
                    <div className={`stat-change ${stat.isPositive ? "text-success" : "text-danger"}`}>
                      {stat.isPositive ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                      <span>{stat.change}</span>
                    </div>
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
                {/* <Link to="/dashboard/events" className="btn btn-sm btn-link text-primary">
                  View All <ChevronRight size={16} />
                </Link> */}
              </div>
              <div className="card-body p-0">
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead className="table-light">
                      <tr>
                        <th>Event Name</th>
                        <th>Location</th>
                        <th>Date</th>
                        <th>Amount</th>
                        <th>Guests</th>
                        <th>status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentEvents.map((event) => (
                        <tr key={event.id}>
                          <td>{event.name}</td>
                          <td>{event.location}</td>
                          <td>{event.date}</td>

                          <td className="text-success fw-semibold">{event.goalAmount}</td>
                          <td className="text-success fw-semibold">{event.guests}</td>
                          <td>{event.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
          <div className="col-12 col-lg-6">
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-white d-flex justify-content-between align-items-center">
                <h5 className="card-title mb-0">All Users</h5>
                {/* <Link to="/dashboard/users" className="btn btn-sm btn-link text-primary">
                  View Details <ChevronRight size={16} />
                </Link> */}
              </div>
              <div className="card-body p-0">
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead className="table-light">
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Joined</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentUsers.map((user) => (
                        <tr key={user._id}>
                          <td>{user.name}</td>
                          <td>{user.email}</td>
                          <td>
                            <span className={`badge ${user.role === "Host" ? "bg-primary" : "bg-primary"}`}>
                              {user.role}
                            </span>
                          </td>
                          <td>{user.joined}</td>
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
    </DashboardLayout>
  )
}

export default AdminDashboard