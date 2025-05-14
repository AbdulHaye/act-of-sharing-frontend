import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Calendar, Clock, MapPin, Users, DollarSign, Share2 } from 'lucide-react';
import { useEvent } from '../../../context/EventContext';
import '../../../styles/event-detail.css';

const EventDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getEventById, loading, error } = useEvent();
  const [event, setEvent] = useState<any>(null);
  const [contribution, setContribution] = useState<number>(25);
  const [activeTab, setActiveTab] = useState<string>('details');

  // Fetch event data
  useEffect(() => {
    const fetchEvent = async () => {
      if (id) {
        const fetchedEvent = await getEventById(id);
        if (fetchedEvent) {
          // Map API response to component's expected structure
          const formattedEvent = {
            id: fetchedEvent._id,
            title: fetchedEvent.title,
            image: fetchedEvent.imageUrl || 'https://via.placeholder.com/800x400', // Fallback image
            date: new Date(fetchedEvent.date).toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            }),
            time: fetchedEvent.time,
            location: fetchedEvent.location,
            hostName: fetchedEvent.createdBy || 'Unknown Host', // Adjust based on your API
            hostImage: 'https://via.placeholder.com/100', // Placeholder, update if host image is available
            attendees: fetchedEvent.guests?.length || 0,
            maxAttendees: fetchedEvent.guestCount,
            raised: fetchedEvent.currentAmount,
            goal: fetchedEvent.goalAmount,
            description: fetchedEvent.description,
            recipientName: fetchedEvent.recipient.name,
            recipientImage: fetchedEvent.recipient.photoUrl || 'https://via.placeholder.com/100', // Fallback image
            recipientStory: fetchedEvent.recipient.story,
            updates: [], // Add logic to fetch updates if available in API
            comments: [], // Add logic to fetch comments if available in API
          };
          setEvent(formattedEvent);
        }
      }
    };
    fetchEvent();
  }, [id, getEventById]);

  // Handle loading and error states
  if (loading) {
    return <div className="container mt-5">Loading...</div>;
  }

  if (error || !event) {
    return <div className="container mt-5">Error: {error || 'Event not found'}</div>;
  }

  const progressPercentage = Math.min(Math.round((event.raised / event.goal) * 100), 100);
  const remainingAmount = event.goal - event.raised;

  const handleContributionChange = (amount: number) => {
    setContribution(amount);
  };

  return (
    <div className="event-detail-page mt-5">
      <div className="event-header">
        <div className="container">
          <div className="event-breadcrumb mb-3">
            <Link to="/">Home</Link> &gt; <Link to="/events">Events</Link> &gt; <span>Current Event</span>
          </div>
          <h1 className="event-title">{event.title}</h1>
        </div>
      </div>

      <div className="container pb-5 mt-3">
        <div className="row">
          <div className="col-lg-12 mb-4 mb-lg-0">
            <div className="event-content-card">
              <img src={event.image} alt={event.title} className="event-main-image" />

              <div className="event-tabs">
                <button
                  className={`event-tab ${activeTab === 'details' ? 'active' : ''}`}
                  onClick={() => setActiveTab('details')}
                >
                  Event Details
                </button>
                <button
                  className={`event-tab ${activeTab === 'recipient' ? 'active' : ''}`}
                  onClick={() => setActiveTab('recipient')}
                >
                  Recipient Story
                </button>
                <button
                  className={`event-tab ${activeTab === 'updates' ? 'active' : ''}`}
                  onClick={() => setActiveTab('updates')}
                >
                  Updates & Comments
                </button>
              </div>

              <div className="event-tab-content p-4">
                {activeTab === 'details' && (
                  <>
                    <div className="event-description mb-4">
                      <h3>About This Event</h3>
                      <p>{event.description}</p>
                    </div>

                    <div className="event-details-grid">
                      <div className="event-detail-item">
                        <Calendar size={20} />
                        <div>
                          <h4>Date</h4>
                          <p>{event.date}</p>
                        </div>
                      </div>
                      <div className="event-detail-item">
                        <Clock size={20} />
                        <div>
                          <h4>Time</h4>
                          <p>{event.time}</p>
                        </div>
                      </div>
                      <div className="event-detail-item">
                        <MapPin size={20} />
                        <div>
                          <h4>Location</h4>
                          <p>{event.location}</p>
                        </div>
                      </div>
                      <div className="event-detail-item">
                        <Users size={20} />
                        <div>
                          <h4>Attendees</h4>
                          <p>{event.attendees} of {event.maxAttendees} spots filled</p>
                        </div>
                      </div>
                    </div>

                    <div className="event-host mt-5">
                      <h3 className="mb-4">Your Host</h3>
                      <div className="host-card">
                        <img src={event.hostImage} alt={event.hostName} className="host-image" />
                        <div className="host-info">
                          <h4>{event.hostName}</h4>
                          <p className="host-bio">
                            Passionate about bringing people together to create positive change in our community.
                          </p>
                          <button className="btn btn-outline-primary btn-sm">Contact Host</button>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {activeTab === 'recipient' && (
                  <div className="recipient-story">
                    <div className="recipient-header mb-4">
                      <img src={event.recipientImage} alt={event.recipientName} className="recipient-image" />
                      <div className="recipient-info">
                        <h3>Meet {event.recipientName}</h3>
                        <span className="recipient-need-category">{event.recipient.categoryOfNeed}</span>
                      </div>
                    </div>

                    <div className="recipient-content">
                      <h4>Their Story</h4>
                      {event.recipientStory.split('\n\n').map((paragraph: string, index: number) => (
                        <p key={index}>{paragraph}</p>
                      ))}

                      <h4 className="mt-4">How Funds Will Help</h4>
                      <div className="funds-usage">
                        {/* Parse fundsUsage if it's a string, or adjust based on API */}
                        <div className="fund-item">
                          <div className="fund-amount">TBD</div>
                          <div className="fund-purpose">{event.recipient.fundsUsage}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'updates' && (
                  <div className="updates-comments">
                    <div className="updates-section mb-5">
                      <h3>Updates from Host</h3>
                      {event.updates.length > 0 ? (
                        event.updates.map((update: any, index: number) => (
                          <div key={index} className="update-item">
                            <div className="update-date">{update.date}</div>
                            <div className="update-text">{update.text}</div>
                          </div>
                        ))
                      ) : (
                        <p>No updates available.</p>
                      )}
                    </div>

                    <div className="comments-section">
                      <h3>Comments</h3>
                      {event.comments.length > 0 ? (
                        event.comments.map((comment: any, index: number) => (
                          <div key={index} className="comment-item">
                            <div className="comment-header">
                              <span className="comment-name">{comment.name}</span>
                              <span className="comment-date">{comment.date}</span>
                            </div>
                            <div className="comment-text">{comment.text}</div>
                          </div>
                        ))
                      ) : (
                        <p>No comments available.</p>
                      )}

                      <div className="add-comment mt-4">
                        <h4>Add a Comment</h4>
                        <textarea
                          className="form-control mb-3"
                          rows={3}
                          placeholder="Write your comment here..."
                        ></textarea>
                        <button className="btn btn-primary">Post Comment</button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailPage;