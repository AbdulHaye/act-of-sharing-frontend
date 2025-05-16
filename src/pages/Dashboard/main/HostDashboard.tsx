"use client"

import React, { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Calendar, Users, DollarSign, Plus, ChevronRight, Star } from "lucide-react"
import DashboardLayout from "../../../components/dashboard/DashboardLayout"
import EventCreationForm from "../../../modals/EventCreationForm"
import { useEvent } from "../../../context/EventContext"
import { useAuth } from "../../../context/AuthContext"

const HostDashboard: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { user } = useAuth()
  const { events, getHostSpecificEvents } = useEvent()
  const navigate = useNavigate()
  const [totalRaised, setTotalRaised] = useState(0)

  // Fetch host-specific events and total raised when the component mounts
  useEffect(() => {
    if (user?._id) {
      getHostSpecificEvents(); // Fetch only events created by this host
      fetchTotalRaised();
    }
  }, [user, getHostSpecificEvents])

  // Fetch total raised from contributions for this host's events
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

  // Compute stats dynamically
  const stats = React.useMemo(() => {
    const totalEvents = events.length
    const totalGuests = events.reduce((sum, event) => sum + (Number(event.guestCount) || 0), 0)
    const pastEvents = events.filter(event => new Date(event.date) < new Date())
    const avgRating = pastEvents.length > 0
      ? pastEvents.reduce((sum, event) => sum + (event.rating || 4.5), 0) / pastEvents.length
      : 0

    return [
      { id: 1, title: "Total Events", value: totalEvents.toString(), icon: <Calendar size={24} />, change: `+${events.filter(e => new Date(e.createdAt).getMonth() === new Date().getMonth()).length} this month` },
      { id: 2, title: "Total Guests", value: totalGuests.toString(), icon: <Users size={24} />, change: `+${events.filter(e => new Date(e.createdAt).getMonth() === new Date().getMonth()).reduce((sum, e) => sum + (Number(e.guestCount) || 0), 0)} this month` },
      { id: 3, title: "Total Raised", value: `$${totalRaised.toLocaleString()}`, icon: <DollarSign size={24} />, change: `+$${events.filter(e => new Date(e.createdAt).getMonth() === new Date().getMonth()).reduce((sum, e) => sum + (Number(e.goalAmount) || 0), 0).toLocaleString()} this month` },
      { id: 4, title: "Avg. Rating", value: avgRating.toFixed(1), icon: <Star size={24} />, change: `from ${pastEvents.length} reviews` },
    ]
  }, [events, totalRaised])

  // Filter and format upcoming events
  const upcomingEvents = React.useMemo(() => {
    return events
      .filter(event => event.status === "upcoming")
      .map(event => ({
        id: event._id,
        name: event.title || "Unnamed Event",
        date: new Date(event.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
        time: event.time ? new Date(`1970-01-01T${event.time}`).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }) : "N/A",
        guests: Number(event.guestCount) || 0,
        raised: `$${event.currentAmount || 0}`,
      }));
  }, [events]);

  // Filter and format past events
  const pastEvents = React.useMemo(() => {
    return events
      .filter(event => new Date(event.date) < new Date())
      .map(event => ({
        id: event._id,
        name: event.title || "Unnamed Event",
        date: new Date(event.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
        guests: Number(event.guestCount) || 0,
        raised: `$${Number(event.goalAmount || 0).toLocaleString()}`,
        rating: event.rating || 4.5,
      }))
      .slice(0, 4)
  }, [events])

  // Placeholder for recent guests
  const recentGuests = React.useMemo(() => {
    const mockGuests = [
      { id: 1, name: "Thomas Wilson", email: "thomas@example.com", events: 3, totalDonated: "$350" },
      { id: 2, name: "Lisa Anderson", email: "lisa@example.com", events: 2, totalDonated: "$275" },
      { id: 3, name: "Robert Johnson", email: "robert@example.com", events: 4, totalDonated: "$520" },
      { id: 4, name: "Jennifer Lee", email: "jennifer@example.com", events: 1, totalDonated: "$150" },
    ]
    return mockGuests
  }, [])

  // Get user name for welcome banner
  const userName = user?.firstname && user?.lastname ? `${user.firstname} ${user.lastname}` : "Host"

  // Updated onClose to include navigation
  const onClose = () => {
    setIsModalOpen(false)
  }

  return (
    <DashboardLayout>
      <div className="container-fluid p-4">
        {/* Welcome Banner */}
        <div className="card border-0 bg-primary text-white mb-4 shadow-sm">
          <div className="card-body p-4">
            <div className="row align-items-center">
              <div className="col-12 col-md-8">
                <h2 className="mb-2 text-white"> {userName}!</h2>
                <p className="mb-md-0">
                  You have <strong>{upcomingEvents.length} upcoming events</strong> scheduled. Your events have raised{" "}
                  <strong>{stats.find(stat => stat.title === "Total Raised")?.value || "$0"}</strong>{" "}
                  for charitable causes so far.
                </p>
              </div>
              <div className="col-12 col-md-4 text-md-end mt-3 mt-md-0">
                <button onClick={() => setIsModalOpen(true)} className="btn btn-light">
                  <Plus size={18} className="me-2" />
                  Host New Event
                </button>
              </div>
            </div>
          </div>
        </div>

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
                  {/* <small className="text-primary">{stat.change}</small> */}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Upcoming Events */}
        <div className="card border-0 shadow-sm mb-4">
          <div className="card-header bg-white d-flex justify-content-between align-items-center">
            <h5 className="card-title mb-0">Upcoming Events</h5>
            <button onClick={() => setIsModalOpen(true)} className="btn btn-sm btn-primary">
              <Plus size={16} className="me-1" />
              New Event
            </button>
          </div>
          <div className="card-body p-0">
            {upcomingEvents.length > 0 ? (
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Event Name</th>
                      <th>Date</th>
                      <th>Time</th>
                      <th>Guests</th>
                    </tr>
                  </thead>
                  <tbody>
                    {upcomingEvents.map((event) => (
                      <tr key={event.id}>
                        <td className="fw-semibold">{event.name}</td>
                        <td>{event.date}</td>
                        <td>{event.time}</td>
                        <td>{event.guests}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-5">
                <Calendar size={48} className="text-muted mb-3" />
                <h5>No Upcoming Events</h5>
                <p className="text-muted">You don't have any events scheduled.</p>
                <button onClick={() => setIsModalOpen(true)} className="btn btn-primary">
                  <Plus size={18} className="me-2" />
                  Host New Event
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {isModalOpen && <EventCreationForm onClose={onClose} />}
    </DashboardLayout>
  )
}

export default HostDashboard