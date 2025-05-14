import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useEvent } from "../../context/EventContext";

const EventViewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { events, fetchEvents, error } = useEvent();

  useEffect(() => {
    if (id) {
      fetchEvents(); 
    }
  }, [id, fetchEvents]);

  const event = events.find(e => e.id === id);

  if (!event) {
    return <div className="container mt-5">{error || "Event not found"}</div>;
  }

  return (
    <div className="container mt-5">
      <h2>{event.title}</h2>
      <div className="card">
        <div className="card-body">
          <p><strong>Date:</strong> {event.date}</p>
          <p><strong>Time:</strong> {event.time}</p>
          <p><strong>Location:</strong> {event.location}</p>
          <p><strong>Max Guests:</strong> {event.guestCount}</p>
          <p><strong>Funding Goal:</strong> ${event.goalAmount}</p>
          <p><strong>Description:</strong> {event.description}</p>
          <p><strong>Recipient:</strong> {event.recipient.name}</p>
          <p><strong>Category:</strong> {event.categoryOfNeed}</p>
          <p><strong>Recipient Story:</strong> {event.recipientStory}</p>
          <p><strong>Funds Usage:</strong> {event.fundsUsage}</p>
          <button className="btn btn-primary" onClick={() => navigate(-1)}>Back</button>
        </div>
      </div>
    </div>
  );
};

export default EventViewPage;