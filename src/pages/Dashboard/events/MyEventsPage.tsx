import type React from "react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Calendar,
  MapPin,
  Users,
  DollarSign,
  Edit,
  Trash2,
  Eye,
  Plus,
  Info,
} from "lucide-react";
import { useEvent } from "../../../context/EventContext";
import { useAuth } from "../../../context/AuthContext";
import DashboardLayout from "../../../components/dashboard/DashboardLayout";
import EventEditModal from "../modals/EventEditModal";
import "../../../styles/my-events.css";
import { toast } from "react-toastify";

const MyEventsPage: React.FC = () => {
  const { events, loading, error, getEvents, deleteEvent } = useEvent();
  const { user } = useAuth();
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "upcoming" | "past">("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  // Base URL from .env
  const baseUrl =
    import.meta.env.VITE_BASE_URL ||
    "https://commonchange-backend.onrender.com";

  useEffect(() => {
    if (user?._id) {
      console.log("Fetching events for user:", user._id);
      getEvents();
    }
  }, [user, getEvents]);

  const handleEditEvent = (event: Event) => {
    console.log("Editing event:", event);
    setSelectedEvent(event);
    setShowEditModal(true);
  };

  const handleDeleteEvent = async (eventId: string) => {
    console.log("Deleting event with ID:", eventId);
    if (
      window.confirm(
        "Are you sure you want to delete this event? This action cannot be undone."
      )
    ) {
      setIsDeleting(eventId);
      try {
        await deleteEvent(eventId);
        toast.success("Event deleted successfully");
      } catch (err) {
        console.error("Failed to delete event:", err);
      } finally {
        setIsDeleting(null);
      }
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "N/A";
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const isUpcoming = (dateString: string) => {
    const eventDate = new Date(dateString);
    const now = new Date();
    return eventDate > now;
  };

  // Handle image load error
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    console.error("Failed to load image:", e.currentTarget.src);
    e.currentTarget.style.display = "none"; // Hide broken image
    e.currentTarget.nextElementSibling.style.display = "flex"; // Show fallback
  };

  if (!user) {
    return null; // DashboardPage handles redirection
  }

  const userEvents = events;
  console.log("User Events:", userEvents);

  const filteredEvents = userEvents.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.recipient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.recipient.categoryOfNeed
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    if (filter === "upcoming") {
      return matchesSearch && isUpcoming(event.date);
    } else if (filter === "past") {
      return matchesSearch && !isUpcoming(event.date);
    }

    return matchesSearch;
  });

  const userName = `${user.firstname || "User"} ${user.lastname || ""}`;
  const userRole = user.role || "host";
  console.log("User Role:", userRole);

  return (
    <DashboardLayout
      userRole={userRole as "admin" | "host" | "guest"}
      userName={userName}
    >
      <div className="container-fluid p-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="mb-1">My Events</h2>
            <p className="text-muted">Manage all your hosted events</p>
          </div>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        <div className="card border-0 shadow-sm mb-4">
          <div className="card-header bg-white">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
              <div className="btn-group">
                <button
                  className={`btn ${
                    filter === "all" ? "btn-primary" : "btn-outline-primary"
                  }`}
                  onClick={() => setFilter("all")}
                >
                  All Events
                </button>
                <button
                  className={`btn ${
                    filter === "upcoming"
                      ? "btn-primary"
                      : "btn-outline-primary"
                  }`}
                  onClick={() => setFilter("upcoming")}
                >
                  Upcoming
                </button>
                <button
                  className={`btn ${
                    filter === "past" ? "btn-primary" : "btn-outline-primary"
                  }`}
                  onClick={() => setFilter("past")}
                >
                  Past
                </button>
              </div>
            </div>
          </div>
          <div className="card-body">
            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-3 text-muted">Loading your events...</p>
              </div>
            ) : (
              <div className="row g-4">
                {filteredEvents.map((event) => (
                  <div key={event._id} className="col-12 col-md-6 col-xl-4">
                    <div
                      className={`card h-100 ${
                        !isUpcoming(event.date) ? "border-light" : "border"
                      }`}
                    >
                      <div className="position-relative">
                        {event.imageUrl ? (
                          <img
                            src={`${baseUrl}${event.imageUrl}`}
                            alt={event.title}
                            className="card-img-top"
                            style={{ height: "160px", objectFit: "cover" }}
                            onError={handleImageError}
                          />
                        ) : null}
                        {/* <div
                          className="bg-light d-flex align-items-center justify-content-center"
                          style={{ height: "160px", display: event.imageUrl ? "none" : "flex" }}
                        >
                          <Calendar size={32} className="text-muted" />
                        </div> */}
                        {!isUpcoming(event.date) && (
                          <div className="position-absolute top-0 end-0 m-2 badge bg-dark">
                            Past Event
                          </div>
                        )}
                      </div>
                      <div className="card-body">
                        <h5 className="card-title">{event.title}</h5>
                        <div className="mb-3">
                          <div className="d-flex align-items-center mb-2">
                            <Calendar size={16} className="text-primary me-2" />
                            <small>{formatDate(event.date)}</small>
                          </div>
                          <div className="d-flex align-items-center mb-2">
                            <MapPin size={16} className="text-primary me-2" />
                            <small>{event.location}</small>
                          </div>
                          <div className="d-flex align-items-center mb-2">
                            <Users size={16} className="text-primary me-2" />
                            <small>Guest Max: {event.guestCount}</small>
                          </div>
                          <div className="d-flex align-items-center mb-2">
                            <DollarSign
                              size={16}
                              className="text-primary me-2"
                            />
                            <small>Goal: ${event.goalAmount}</small>
                          </div>
                          <div className="d-flex align-items-center mb-2">
                            <Info size={16} className="text-primary me-2" />
                            <small>Recipient: {event.recipient.name}</small>
                          </div>
                          <div className="d-flex align-items-center mb-2">
                            <Info size={16} className="text-primary me-2" />
                            <small>
                              Category: {event.recipient.categoryOfNeed}
                            </small>
                          </div>
                        </div>
                        <div className="mb-3">
                          <div className="d-flex justify-content-between align-items-center mb-1">
                            <small>Fundraising Progress</small>
                            <small>
                              ${event.currentAmount} of ${event.goalAmount}
                            </small>
                          </div>
                          <div className="progress" style={{ height: "8px" }}>
                            <div
                              className="progress-bar"
                              style={{
                                width: `${
                                  (event.currentAmount / event.goalAmount) * 100
                                }%`,
                                backgroundColor: "#5144A1", // Custom color
                              }}
                            ></div>
                          </div>
                        </div>
                        <div className="d-flex gap-2">
                          {user.role !== "guest" && (
                            <button
                              className="btn btn-sm btn-outline-secondary"
                              onClick={() => handleEditEvent(event)}
                            >
                              <Edit size={16} className="btn-outline-primary" />
                              <span>Edit</span>
                            </button>
                          )}
                          {user.role !== "guest" && (
                            <button
                              className="btn btn-sm btn-outline-primary ms-auto"
                              onClick={() => handleDeleteEvent(event._id)}
                              disabled={isDeleting === event._id}
                            >
                              <Trash2 size={16} className="btn-outline-primary-1" />
                              <span>
                                {isDeleting === event._id
                                  ? "Deleting..."
                                  : "Delete"}
                              </span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <EventEditModal
        show={showEditModal}
        onHide={() => {
          console.log("Closing modal");
          setShowEditModal(false);
          setSelectedEvent(null);
        }}
        event={selectedEvent}
      />
    </DashboardLayout>
  );
};

export default MyEventsPage;
