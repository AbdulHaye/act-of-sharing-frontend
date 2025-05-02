import React from 'react';
import { Link } from 'react-router-dom';
import Hero from '../components/home/Hero';
import HowItWorks from '../components/home/HowItWorks';
import ImpactStories from '../components/home/ImpactStories';
import EventCard from '../components/events/EventCard';
import '../styles/home-page.css';

const HomePage: React.FC = () => {
  // Sample data for featured events
  const featuredEvents = [
    {
      id: "event1",
      title: "Dinner for the Martinez Family",
      image: "https://images.pexels.com/photos/5638331/pexels-photo-5638331.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      date: "June 15, 2025 • 6:00 PM",
      location: "Portland, OR",
      hostName: "Robert Chen",
      attendees: 8,
      maxAttendees: 12,
      raised: 1750,
      goal: 2500
    },
    {
      id: "event2",
      title: "Brunch for Education Fund",
      image: "https://images.pexels.com/photos/5637739/pexels-photo-5637739.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      date: "May 28, 2025 • 11:00 AM",
      location: "Virtual Event",
      hostName: "Maria Johnson",
      attendees: 15,
      maxAttendees: 20,
      raised: 3200,
      goal: 4000
    },
    {
      id: "event3",
      title: "Lunch for Medical Support",
      image: "https://images.pexels.com/photos/1581384/pexels-photo-1581384.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      date: "June 3, 2025 • 12:30 PM",
      location: "Chicago, IL",
      hostName: "James Wilson",
      attendees: 6,
      maxAttendees: 10,
      raised: 1200,
      goal: 3000
    }
  ];

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
          
          <div className="row">
            {featuredEvents.map((event) => (
              <div key={event.id} className="col-md-6 col-lg-4 mb-4">
                <EventCard {...event} />
              </div>
            ))}
          </div>
          
          <div className="text-center mt-4">
            <Link to="/events" className="btn btn-outline-primary btn-lg">
              View All Events
            </Link>
          </div>
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
                  Host a meal, invite friends, and create meaningful impact in your community.
                </p>
              </div>
              <div className="col-lg-4 text-lg-end">
                <Link to="/create-event" className="btn btn-primary btn-lg">
                  Host a Meal
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;