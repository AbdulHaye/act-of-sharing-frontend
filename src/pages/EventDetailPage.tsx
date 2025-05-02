import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Calendar, Clock, MapPin, Users, DollarSign, Share2 } from 'lucide-react';
import '../styles/event-detail.css';

const EventDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [contribution, setContribution] = useState<number>(25);
  const [activeTab, setActiveTab] = useState<string>('details');

  // Mock event data
  const event = {
    id,
    title: "Dinner for the Martinez Family",
    image: "https://images.pexels.com/photos/5638331/pexels-photo-5638331.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    date: "June 15, 2025",
    time: "6:00 PM - 9:00 PM",
    location: "123 Main St, Portland, OR",
    hostName: "Robert Chen",
    hostImage: "https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    attendees: 8,
    maxAttendees: 12,
    raised: 1750,
    goal: 2500,
    description: "Join us for an evening of good food, great conversation, and the opportunity to help a family in need. The Martinez family recently experienced a devastating house fire and lost most of their belongings. Through this meal gathering, we aim to raise funds to help them with immediate housing needs and replacing essential items.",
    recipientName: "The Martinez Family",
    recipientImage: "https://images.pexels.com/photos/7108344/pexels-photo-7108344.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    recipientStory: "The Martinez family - Maria, Carlos, and their three children (ages 5, 8, and 12) - lost their home of ten years to an electrical fire last month. While they were fortunately unharmed, they lost nearly everything they owned. With limited insurance coverage, they're currently staying with relatives in a crowded situation. \n\nCarlos works as a mechanic and Maria is a part-time caregiver, but the sudden loss has created significant financial strain. The funds we raise will help them secure a temporary apartment while they rebuild and replace essential items for their children's education and daily needs.",
    updates: [
      { date: "May 10, 2025", text: "We've confirmed the location and menu for our gathering. Looking forward to seeing everyone there!" },
      { date: "May 5, 2025", text: "I just spoke with the Martinez family. They're overwhelmed with gratitude for our support. They specifically mentioned needing help with the security deposit for a temporary apartment." }
    ],
    comments: [
      { name: "Sarah Johnson", date: "May 8, 2025", text: "Looking forward to this gathering! I'll bring a dessert to share." },
      { name: "Michael Lee", date: "May 7, 2025", text: "I can't attend in person, but I'm happy to contribute. The Martinez family has always been so generous to our community." }
    ]
  };

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
          <div className="col-lg-8 mb-4 mb-lg-0">
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
                            I'm passionate about bringing people together to create positive change in our community. This is my third meal gathering to support local families in need.
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
                        <span className="recipient-need-category">Housing & Essential Needs</span>
                      </div>
                    </div>

                    <div className="recipient-content">
                      <h4>Their Story</h4>
                      {event.recipientStory.split('\n\n').map((paragraph, index) => (
                        <p key={index}>{paragraph}</p>
                      ))}

                      <h4 className="mt-4">How Funds Will Help</h4>
                      <div className="funds-usage">
                        <div className="fund-item">
                          <div className="fund-amount">$1,200</div>
                          <div className="fund-purpose">Security deposit & first month's rent</div>
                        </div>
                        <div className="fund-item">
                          <div className="fund-amount">$800</div>
                          <div className="fund-purpose">School supplies & children's essentials</div>
                        </div>
                        <div className="fund-item">
                          <div className="fund-amount">$500</div>
                          <div className="fund-purpose">Basic furniture & household items</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'updates' && (
                  <div className="updates-comments">
                    <div className="updates-section mb-5">
                      <h3>Updates from Host</h3>
                      {event.updates.map((update, index) => (
                        <div key={index} className="update-item">
                          <div className="update-date">{update.date}</div>
                          <div className="update-text">{update.text}</div>
                        </div>
                      ))}
                    </div>

                    <div className="comments-section">
                      <h3>Comments</h3>
                      {event.comments.map((comment, index) => (
                        <div key={index} className="comment-item">
                          <div className="comment-header">
                            <span className="comment-name">{comment.name}</span>
                            <span className="comment-date">{comment.date}</span>
                          </div>
                          <div className="comment-text">{comment.text}</div>
                        </div>
                      ))}

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

          <div className="col-lg-4">
            <div className="event-sidebar">
              <div className="contribution-card">
                <div className="funding-progress mb-4">
                  <div className="d-flex justify-content-between mb-2">
                    <span className="funding-raised">${event.raised.toLocaleString()} raised</span>
                    <span className="funding-goal">of ${event.goal.toLocaleString()}</span>
                  </div>
                  <div className="progress-bar-container">
                    <div
                      className="progress-bar-fill"
                      style={{ width: `${progressPercentage}%` }}
                    ></div>
                  </div>
                  <div className="funding-stats mt-2">
                    <div className="funding-percentage">{progressPercentage}%</div>
                    <div className="funding-remaining">${remainingAmount.toLocaleString()} to go</div>
                  </div>
                </div>

                <div className="contribution-section">
                  <h3 className="contribution-title">Make a Contribution</h3>

                  <div className="contribution-options mb-4">
                    {[25, 50, 100, 250].map(amount => (
                      <button
                        key={amount}
                        className={`contribution-option ${contribution === amount ? 'active' : ''}`}
                        onClick={() => handleContributionChange(amount)}
                      >
                        ${amount}
                      </button>
                    ))}
                    <button
                      className={`contribution-option ${![25, 50, 100, 250].includes(contribution) ? 'active' : ''}`}
                      onClick={() => setContribution(0)}
                    >
                      Other
                    </button>
                  </div>

                  {![25, 50, 100, 250].includes(contribution) && (
                    <div className="custom-amount mb-4">
                      <label htmlFor="customAmount">Custom Amount</label>
                      <div className="input-group">
                        <span className="input-group-text">$</span>
                        <input
                          type="number"
                          className="form-control"
                          id="customAmount"
                          value={contribution === 0 ? '' : contribution}
                          onChange={(e) => setContribution(Number(e.target.value))}
                          min="1"
                          placeholder="Enter amount"
                        />
                      </div>
                    </div>
                  )}

                  <div className="attendance-option mb-4">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="attendance"
                        id="attending"
                        defaultChecked
                      />
                      <label className="form-check-label" htmlFor="attending">
                        I'll attend the event
                      </label>
                    </div>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="attendance"
                        id="notAttending"
                      />
                      <label className="form-check-label" htmlFor="notAttending">
                        I can't attend, but want to contribute
                      </label>
                    </div>
                  </div>

                  <button className="btn btn-primary btn-lg w-100 mb-3">Contribute</button>

                  <div className="share-event text-center">
                    <button className="btn btn-link">
                      <Share2 size={16} className="me-1" /> Share This Event
                    </button>
                  </div>
                </div>
              </div>

              <div className="similar-events mt-4">
                <h3 className="sidebar-title">Similar Events</h3>
                <div className="similar-event-item">
                  <img
                    src="https://images.pexels.com/photos/5637739/pexels-photo-5637739.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                    alt="Brunch for Education Fund"
                    className="similar-event-image"
                  />
                  <div className="similar-event-content">
                    <h4>Brunch for Education Fund</h4>
                    <div className="similar-event-details">
                      <span>May 28, 2025</span>
                      <span>Virtual Event</span>
                    </div>
                    <Link to="/events/event2" className="btn btn-sm btn-outline-primary mt-2">
                      View Event
                    </Link>
                  </div>
                </div>
                <div className="similar-event-item">
                  <img
                    src="https://images.pexels.com/photos/1581384/pexels-photo-1581384.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                    alt="Lunch for Medical Support"
                    className="similar-event-image"
                  />
                  <div className="similar-event-content">
                    <h4>Lunch for Medical Support</h4>
                    <div className="similar-event-details">
                      <span>June 3, 2025</span>
                      <span>Chicago, IL</span>
                    </div>
                    <Link to="/events/event3" className="btn btn-sm btn-outline-primary mt-2">
                      View Event
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailPage;
