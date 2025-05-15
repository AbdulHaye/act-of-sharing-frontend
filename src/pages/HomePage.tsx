import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Calendar, MapPin, Users, DollarSign } from "lucide-react";
import Hero from "../components/home/Hero";
import HowItWorks from "../components/home/HowItWorks";
import ImpactStories from "../components/home/ImpactStories";
import { useEvent } from "../context/EventContext";
import axiosInstance from "../api/axiosInstance"; // Adjust the import path as needed
import "../styles/home-page.css";
import { toast } from "react-toastify";

const HomePage: React.FC = () => {
  const handleButtonClick = () => {
    toast.info("Please login first");
  };

  const { events, loading, error, getPublicEvents } = useEvent();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    personName: "",
    relationship: "Self",
    immediateNeed: "",
    preferredDate: "",
    additionalInfo: "",
  });

  const handleFormClose = () => {
    setShowForm((prev) => !prev);
  };

  // Base URL from .env
  const baseUrl =
    import.meta.env.VITE_BASE_URL ||
    "https://commonchange-backend.onrender.com";

  // Fetch public events on mount
  useEffect(() => {
    getPublicEvents();
  }, [getPublicEvents]);

  // Handle image load error
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    console.error("Failed to load image:", e.currentTarget.src);
    e.currentTarget.style.display = "none"; // Hide broken image
    e.currentTarget.nextElementSibling.style.display = "flex"; // Show fallback
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axiosInstance.post("/request", formData, {
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token,
        },
      });
      toast.success("Request submitted successfully!");
      setShowForm(false);
      setFormData({
        fullName: "",
        phone: "",
        email: "",
        personName: "",
        relationship: "Self",
        immediateNeed: "",
        preferredDate: "",
        additionalInfo: "",
      });
    } catch (err) {
      toast.error(
        "Failed to submit request: " +
          (err.response?.data?.message || err.message)
      );
      console.error("Submit error:", err);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="home-page">
      <Hero />

      <HowItWorks />

      <section className="featured-events py-5">
        <div className="container">
          <div className="row text-center mb-5">
            <div className="col-lg-8 mx-auto">
              <h2 className="section-title">Upcoming Meals</h2>
              <p className="section-subtitle">
                Join these upcoming meal gatherings or host your own
              </p>
            </div>
          </div>

          {loading && (
            <div className="text-center">
              <p>Loading events...</p>
            </div>
          )}

          {error && (
            <div className="text-center text-danger">
              <p>Error: {error}</p>
            </div>
          )}

          {!loading && !error && events.length === 0 && (
            <div className="text-center">
              <p>No upcoming events found.</p>
            </div>
          )}

          {!loading && !error && events.length > 0 && (
            <div className="row">
              {events.slice(0, 3).map((event) => (
                <div key={event._id} className="col-md-6 col-lg-4 mb-4">
                  <div className="card h-100 border-0 shadow-sm">
                    <div className="position-relative">
                      {event.imageUrl ? (
                        <img
                          src={`${baseUrl}${event.imageUrl}`}
                          alt={event.title}
                          className="card-img-top"
                          style={{ height: "200px", objectFit: "cover" }}
                          onError={handleImageError}
                        />
                      ) : null}
                    </div>
                    <div className="card-body">
                      <h5 className="card-title">{event.title}</h5>
                      <div className="mb-3">
                        <div className="d-flex align-items-center mb-2">
                          <Calendar size={16} className="text-primary me-2" />
                          <small>
                            {new Date(event.date).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </small>
                        </div>
                        <div className="d-flex align-items-center mb-2">
                          <MapPin size={16} className="text-primary me-2" />
                          <small>{event.location}</small>
                        </div>
                        <div className="d-flex align-items-center mb-2">
                          <Users size={16} className="text-primary me-2" />
                          <small>{event.guestCount} Attendees</small>
                        </div>
                        <div className="d-flex align-items-center mb-2">
                          <DollarSign size={16} className="text-primary me-2" />
                          <small>
                            Raised: ${event.currentAmount} of $
                            {event.goalAmount}
                          </small>
                        </div>
                        <div className="d-flex align-items-center mb-2">
                          <small>
                            Hosted by: {event.recipient?.name || "Unknown Host"}
                          </small>
                        </div>
                      </div>
                      <Link
                        to={`/events/${event._id}`}
                        className="btn btn-outline-primary btn-sm"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Request Assistance Button */}
          <div className="text-center mt-5">
            <button
              className="btn btn-primary"
              onClick={handleFormClose}
            >
              Request Assistance
            </button>
          </div>

          {/* Request Assistance Form */}
          {showForm && (
            <div className="assistance-form-section">
              <h2 className="form-title">
                Need Assistance? We're Here to Help.
              </h2>
              <p className="form-subtitle">
                Meals with a Mission is committed to supporting those in need.
                If you or someone you know requires food, clothing, supplies, or
                other assistance, please fill out the form below. Our team will
                review your request and reach out as soon as possible.
              </p>
              <form onSubmit={handleFormSubmit} className="assistance-form">
                <div className="form-group">
                  <h3>Requester Information</h3>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="Full Name *"
                    required
                    className="form-control"
                  />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Phone *"
                    required
                    className="form-control"
                  />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Email *"
                    required
                    className="form-control"
                  />
                </div>
                <div className="form-group">
                  <h3>Person(s) in Need</h3>
                  <input
                    type="text"
                    name="personName"
                    value={formData.personName}
                    onChange={handleInputChange}
                    placeholder="Name"
                    className="form-control"
                  />
                  <select
                    name="relationship"
                    value={formData.relationship}
                    onChange={handleInputChange}
                    required
                    className="form-control"
                  >
                    <option value="Self">Self</option>
                    <option value="Friend">Friend</option>
                    <option value="Family">Family</option>
                    <option value="Other">Other</option>
                  </select>
                  <textarea
                    name="immediateNeed"
                    value={formData.immediateNeed}
                    onChange={handleInputChange}
                    placeholder="Immediate Need *"
                    required
                    className="form-control"
                  />
                </div>
                <div className="form-group">
                  <input
                    type="date"
                    name="preferredDate"
                    value={formData.preferredDate}
                    onChange={handleInputChange}
                    placeholder="Preferred Date for Assistance"
                    className="form-control"
                  />
                  <textarea
                    name="additionalInfo"
                    value={formData.additionalInfo}
                    onChange={handleInputChange}
                    placeholder="Additional Information: Anything else you would like us to know?"
                    className="form-control"
                  />
                </div>
                <div className="d-flex ">
                  <button type="submit" className="btn btn-primary mr-auto">
                    Submit
                  </button>

                </div>
              </form>
            </div>
          )}
        </div>
      </section>

      <ImpactStories />

      <section className="cta-section py-5">
        <div className="container">
          <div className="cta-card">
            <div className="row align-items-center">
              <div className="col-lg-8 mb-4 mb-lg-0">
                <h2 className="cta-title">Ready to Make a Difference?</h2>
                <p className="cta-text">
                  Host a meal, invite friends, and create meaningful impact in
                  your community.
                </p>
              </div>
              <div className="col-lg-4 text-lg-end">
                <button
                  className="btn btn-primary btn-lg"
                  onClick={handleButtonClick}
                >
                  Get Started
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
