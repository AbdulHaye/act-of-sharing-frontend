import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar, 
  ChevronRight, 
  Clock, 
  DollarSign, 
  Edit, 
  Copy, 
  Trash2, 
  Users, 
  CreditCard, 
  Bell, 
  Settings, 
  List
} from 'lucide-react';
import '../styles/dashboard.css';

const DashboardPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('hosting');

  // Sample data - in a real app, you would fetch this from your API
  const hostedEvents = [
    {
      id: "event1",
      title: "Dinner for the Martinez Family",
      image: "https://images.pexels.com/photos/5638331/pexels-photo-5638331.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      date: "June 15, 2025",
      time: "6:00 PM",
      location: "Portland, OR",
      attendees: 8,
      maxAttendees: 12,
      raised: 1750,
      goal: 2500,
      status: "upcoming"
    },
    {
      id: "event4",
      title: "Potluck for Education Fund",
      image: "https://images.pexels.com/photos/3184183/pexels-photo-3184183.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      date: "July 22, 2025",
      time: "5:30 PM",
      location: "Portland, OR",
      attendees: 0,
      maxAttendees: 15,
      raised: 0,
      goal: 3000,
      status: "draft"
    },
    {
      id: "event5",
      title: "Community Garden Fundraiser",
      image: "https://images.pexels.com/photos/745045/pexels-photo-745045.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      date: "April 10, 2025",
      time: "12:00 PM",
      location: "Portland, OR",
      attendees: 18,
      maxAttendees: 20,
      raised: 3800,
      goal: 3500,
      status: "completed"
    }
  ];
  
  const attendingEvents = [
    {
      id: "event2",
      title: "Brunch for Education Fund",
      image: "https://images.pexels.com/photos/5637739/pexels-photo-5637739.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      date: "May 28, 2025",
      time: "11:00 AM",
      location: "Virtual Event",
      hostName: "Maria Johnson",
      contribution: 50,
      status: "upcoming"
    },
    {
      id: "event3",
      title: "Lunch for Medical Support",
      image: "https://images.pexels.com/photos/1581384/pexels-photo-1581384.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      date: "March 15, 2025",
      time: "12:30 PM",
      location: "Chicago, IL",
      hostName: "James Wilson",
      contribution: 75,
      status: "past"
    }
  ];
  
  const contributions = [
    {
      id: "contrib1",
      eventTitle: "Brunch for Education Fund",
      date: "May 20, 2025",
      amount: 50,
      status: "completed",
      recipient: "Smith Family"
    },
    {
      id: "contrib2",
      eventTitle: "Lunch for Medical Support",
      date: "March 10, 2025",
      amount: 75,
      status: "completed",
      recipient: "John Davis"
    },
    {
      id: "contrib3",
      eventTitle: "Emergency Housing Fundraiser",
      date: "February 5, 2025",
      amount: 100,
      status: "completed",
      recipient: "Garcia Family"
    }
  ];

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <div className="container">
          <h1 className="dashboard-title">My Dashboard</h1>
        </div>
      </div>
      
      <div className="container py-5">
        <div className="row">
          <div className="col-lg-3 mb-4">
            <div className="dashboard-sidebar">
              <div className="user-profile mb-4">
                <img 
                  src="https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=600" 
                  alt="User Profile" 
                  className="user-avatar"
                />
                <div className="user-info">
                  <h3>Robert Chen</h3>
                  <p>Portland, OR</p>
                </div>
              </div>
              
              <div className="dashboard-nav">
                <button 
                  className={`nav-item ${activeTab === 'hosting' ? 'active' : ''}`}
                  onClick={() => setActiveTab('hosting')}
                >
                  <Calendar size={20} />
                  <span>Hosting</span>
                  <ChevronRight size={16} className="nav-arrow" />
                </button>
                <button 
                  className={`nav-item ${activeTab === 'attending' ? 'active' : ''}`}
                  onClick={() => setActiveTab('attending')}
                >
                  <Users size={20} />
                  <span>Attending</span>
                  <ChevronRight size={16} className="nav-arrow" />
                </button>
                <button 
                  className={`nav-item ${activeTab === 'contributions' ? 'active' : ''}`}
                  onClick={() => setActiveTab('contributions')}
                >
                  <DollarSign size={20} />
                  <span>Contributions</span>
                  <ChevronRight size={16} className="nav-arrow" />
                </button>
                <button 
                  className={`nav-item ${activeTab === 'payment' ? 'active' : ''}`}
                  onClick={() => setActiveTab('payment')}
                >
                  <CreditCard size={20} />
                  <span>Payment Methods</span>
                  <ChevronRight size={16} className="nav-arrow" />
                </button>
                <button 
                  className={`nav-item ${activeTab === 'notifications' ? 'active' : ''}`}
                  onClick={() => setActiveTab('notifications')}
                >
                  <Bell size={20} />
                  <span>Notifications</span>
                  <ChevronRight size={16} className="nav-arrow" />
                </button>
                <button 
                  className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}
                  onClick={() => setActiveTab('settings')}
                >
                  <Settings size={20} />
                  <span>Account Settings</span>
                  <ChevronRight size={16} className="nav-arrow" />
                </button>
              </div>
              
              <div className="dashboard-stats mt-4">
                <div className="stat-card">
                  <div className="stat-value">$1,975</div>
                  <div className="stat-label">Total Contributed</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">5</div>
                  <div className="stat-label">Events Hosted</div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="col-lg-9">
            <div className="dashboard-content">
              {activeTab === 'hosting' && (
                <div className="hosting-section">
                  <div className="section-header">
                    <h2>Events You're Hosting</h2>
                    <Link to="/create-event" className="btn btn-primary">
                      + New Event
                    </Link>
                  </div>
                  
                  <div className="dashboard-tabs mb-4">
                    <button className="tab-button active">All</button>
                    <button className="tab-button">Upcoming</button>
                    <button className="tab-button">Past</button>
                    <button className="tab-button">Drafts</button>
                  </div>
                  
                  <div className="hosting-events">
                    {hostedEvents.map(event => (
                      <div key={event.id} className={`event-row ${event.status}`}>
                        <div className="event-image-container">
                          <img 
                            src={event.image} 
                            alt={event.title} 
                            className="event-thumbnail"
                          />
                          {event.status === 'draft' && (
                            <div className="event-status-badge">Draft</div>
                          )}
                          {event.status === 'completed' && (
                            <div className="event-status-badge completed">Completed</div>
                          )}
                        </div>
                        
                        <div className="event-details">
                          <h3 className="event-title">
                            <Link to={`/events/${event.id}`}>{event.title}</Link>
                          </h3>
                          <div className="event-meta">
                            <div className="event-meta-item">
                              <Calendar size={14} />
                              <span>{event.date}</span>
                            </div>
                            <div className="event-meta-item">
                              <Clock size={14} />
                              <span>{event.time}</span>
                            </div>
                            <div className="event-meta-item">
                              <Users size={14} />
                              <span>{event.attendees}/{event.maxAttendees} Guests</span>
                            </div>
                          </div>
                          
                          {event.status !== 'draft' && (
                            <div className="fundraising-progress">
                              <div className="progress-stats">
                                <span>${event.raised.toLocaleString()} raised of ${event.goal.toLocaleString()}</span>
                                <span>{Math.round((event.raised / event.goal) * 100)}%</span>
                              </div>
                              <div className="progress-bar-container">
                                <div 
                                  className="progress-bar-fill" 
                                  style={{ width: `${Math.min(Math.round((event.raised / event.goal) * 100), 100)}%` }}
                                ></div>
                              </div>
                            </div>
                          )}
                        </div>
                        
                        <div className="event-actions">
                          <Link to={`/events/${event.id}`} className="btn btn-sm btn-outline-primary mb-2">
                            View
                          </Link>
                          <button className="btn btn-sm btn-outline-secondary mb-2">
                            <Edit size={14} className="me-1" /> Edit
                          </button>
                          <div className="dropdown-action">
                            <button className="btn btn-sm btn-outline-secondary">
                              <List size={14} className="me-1" /> More
                            </button>
                            <div className="dropdown-menu">
                              <button className="dropdown-item">
                                <Copy size={14} className="me-2" /> Duplicate
                              </button>
                              <button className="dropdown-item text-danger">
                                <Trash2 size={14} className="me-2" /> Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {activeTab === 'attending' && (
                <div className="attending-section">
                  <div className="section-header">
                    <h2>Events You're Attending</h2>
                    <Link to="/events" className="btn btn-outline-primary">
                      Browse Events
                    </Link>
                  </div>
                  
                  <div className="dashboard-tabs mb-4">
                    <button className="tab-button active">All</button>
                    <button className="tab-button">Upcoming</button>
                    <button className="tab-button">Past</button>
                  </div>
                  
                  <div className="attending-events">
                    {attendingEvents.map(event => (
                      <div key={event.id} className={`event-row ${event.status}`}>
                        <div className="event-image-container">
                          <img 
                            src={event.image} 
                            alt={event.title} 
                            className="event-thumbnail"
                          />
                          {event.status === 'past' && (
                            <div className="event-status-badge completed">Past Event</div>
                          )}
                        </div>
                        
                        <div className="event-details">
                          <h3 className="event-title">
                            <Link to={`/events/${event.id}`}>{event.title}</Link>
                          </h3>
                          <div className="event-meta">
                            <div className="event-meta-item">
                              <Calendar size={14} />
                              <span>{event.date}</span>
                            </div>
                            <div className="event-meta-item">
                              <Clock size={14} />
                              <span>{event.time}</span>
                            </div>
                          </div>
                          <div className="event-host">
                            Hosted by: {event.hostName}
                          </div>
                          <div className="event-contribution">
                            Your contribution: ${event.contribution}
                          </div>
                        </div>
                        
                        <div className="event-actions">
                          <Link to={`/events/${event.id}`} className="btn btn-sm btn-outline-primary mb-2">
                            View Event
                          </Link>
                          {event.status === 'upcoming' && (
                            <button className="btn btn-sm btn-outline-secondary">
                              Cancel RSVP
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {activeTab === 'contributions' && (
                <div className="contributions-section">
                  <div className="section-header">
                    <h2>Your Contributions</h2>
                  </div>
                  
                  <div className="contributions-summary mb-4">
                    <div className="summary-card">
                      <div className="summary-value">$225</div>
                      <div className="summary-label">Total Contributed</div>
                    </div>
                    <div className="summary-card">
                      <div className="summary-value">3</div>
                      <div className="summary-label">People Helped</div>
                    </div>
                    <div className="summary-card">
                      <div className="summary-value">2025</div>
                      <div className="summary-label">Impact Year</div>
                    </div>
                  </div>
                  
                  <div className="contributions-table">
                    <div className="table-header">
                      <div className="header-cell">Event</div>
                      <div className="header-cell">Date</div>
                      <div className="header-cell">Amount</div>
                      <div className="header-cell">Recipient</div>
                      <div className="header-cell">Status</div>
                    </div>
                    
                    {contributions.map(contribution => (
                      <div key={contribution.id} className="table-row">
                        <div className="table-cell event-name">
                          <Link to={`/events/${contribution.id}`}>{contribution.eventTitle}</Link>
                        </div>
                        <div className="table-cell">{contribution.date}</div>
                        <div className="table-cell amount">${contribution.amount}</div>
                        <div className="table-cell">{contribution.recipient}</div>
                        <div className="table-cell">
                          <span className={`status-badge ${contribution.status}`}>
                            {contribution.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {(activeTab === 'payment' || activeTab === 'notifications' || activeTab === 'settings') && (
                <div className="placeholder-section text-center py-5">
                  <h2>Coming Soon</h2>
                  <p className="text-muted">This section is under development.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;