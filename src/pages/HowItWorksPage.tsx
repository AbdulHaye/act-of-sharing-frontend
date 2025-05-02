import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Calendar, Heart, MessageCircle, DollarSign, Award } from 'lucide-react';
import '../styles/how-it-works-page.css';

const HowItWorksPage: React.FC = () => {
  return (
    <div className="how-it-works-page">
      <section className="how-it-works-hero">
        <div className="container">
          <div className="row">
            <div className="col-lg-8 mx-auto text-center">
              <h1 className="hero-title">How It Works</h1>
              <p className="hero-subtitle">
                A simple step-by-step guide to hosting your own meal gathering and creating positive impact
              </p>
            </div>
          </div>
        </div>
      </section>
      
      <section className="process-overview py-5">
        <div className="container">
          <div className="process-timeline">
            <div className="process-step">
              <div className="process-icon">
                <Calendar size={32} />
              </div>
              <div className="process-content">
                <h2>1. Schedule a Meal</h2>
                <p>
                  Create an event by selecting a date, time, and location for your meal gathering. This can be at your home, a restaurant, or even a virtual gathering.
                </p>
                <div className="process-features">
                  <div className="process-feature">
                    <span className="feature-check">✓</span>
                    <span>Choose in-person or virtual format</span>
                  </div>
                  <div className="process-feature">
                    <span className="feature-check">✓</span>
                    <span>Set a convenient date and time</span>
                  </div>
                  <div className="process-feature">
                    <span className="feature-check">✓</span>
                    <span>Determine your guest capacity</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="process-step">
              <div className="process-icon">
                <Heart size={32} />
              </div>
              <div className="process-content">
                <h2>2. Identify a Need</h2>
                <p>
                  Select someone in your community who needs support. Share their story and how the funds raised will specifically help them overcome their current challenge.
                </p>
                <div className="process-features">
                  <div className="process-feature">
                    <span className="feature-check">✓</span>
                    <span>Choose a recipient with a specific need</span>
                  </div>
                  <div className="process-feature">
                    <span className="feature-check">✓</span>
                    <span>Document their story with their permission</span>
                  </div>
                  <div className="process-feature">
                    <span className="feature-check">✓</span>
                    <span>Set a clear fundraising goal</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="process-step">
              <div className="process-icon">
                <Users size={32} />
              </div>
              <div className="process-content">
                <h2>3. Invite Your Guests</h2>
                <p>
                  Send invitations to friends, family, and colleagues who might want to participate. Share the recipient's story and explain how their contributions will make an impact.
                </p>
                <div className="process-features">
                  <div className="process-feature">
                    <span className="feature-check">✓</span>
                    <span>Easily send email invitations</span>
                  </div>
                  <div className="process-feature">
                    <span className="feature-check">✓</span>
                    <span>Share via social media or direct link</span>
                  </div>
                  <div className="process-feature">
                    <span className="feature-check">✓</span>
                    <span>Track RSVPs and contributions</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="process-step">
              <div className="process-icon">
                <DollarSign size={32} />
              </div>
              <div className="process-content">
                <h2>4. Gather and Contribute</h2>
                <p>
                  At your meal, enjoy food and conversation while collecting contributions toward your goal. Guests can contribute online or in person, with real-time progress tracking.
                </p>
                <div className="process-features">
                  <div className="process-feature">
                    <span className="feature-check">✓</span>
                    <span>Secure online payment processing</span>
                  </div>
                  <div className="process-feature">
                    <span className="feature-check">✓</span>
                    <span>Watch your goal tracker update in real-time</span>
                  </div>
                  <div className="process-feature">
                    <span className="feature-check">✓</span>
                    <span>Share the recipient's story during the meal</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="process-step">
              <div className="process-icon">
                <MessageCircle size={32} />
              </div>
              <div className="process-content">
                <h2>5. Create a Message</h2>
                <p>
                  Together with your guests, craft a personal message, card, or video for the recipient to accompany the financial gift. This adds a meaningful personal touch to your contribution.
                </p>
                <div className="process-features">
                  <div className="process-feature">
                    <span className="feature-check">✓</span>
                    <span>Record video messages during your gathering</span>
                  </div>
                  <div className="process-feature">
                    <span className="feature-check">✓</span>
                    <span>Write collective notes of encouragement</span>
                  </div>
                  <div className="process-feature">
                    <span className="feature-check">✓</span>
                    <span>Capture photos of your gathering</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="process-step">
              <div className="process-icon">
                <Award size={32} />
              </div>
              <div className="process-content">
                <h2>6. Make an Impact</h2>
                <p>
                  After your event, the collected funds are securely transferred to the recipient. You'll receive confirmation and can share impact updates with your guests.
                </p>
                <div className="process-features">
                  <div className="process-feature">
                    <span className="feature-check">✓</span>
                    <span>Secure fund disbursement to recipient</span>
                  </div>
                  <div className="process-feature">
                    <span className="feature-check">✓</span>
                    <span>Share follow-up updates with your guests</span>
                  </div>
                  <div className="process-feature">
                    <span className="feature-check">✓</span>
                    <span>Track your impact history and create future events</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <section className="faq-section py-5 bg-light">
        <div className="container">
          <div className="row text-center mb-5">
            <div className="col-lg-8 mx-auto">
              <h2 className="section-title">Frequently Asked Questions</h2>
              <p className="section-subtitle">
                Common questions about hosting and participating in meal gatherings
              </p>
            </div>
          </div>
          
          <div className="row">
            <div className="col-lg-10 mx-auto">
              <div className="accordion" id="faqAccordion">
                <div className="accordion-item">
                  <h2 className="accordion-header" id="headingOne">
                    <button 
                      className="accordion-button" 
                      type="button" 
                      data-bs-toggle="collapse" 
                      data-bs-target="#collapseOne" 
                      aria-expanded="true" 
                      aria-controls="collapseOne"
                    >
                      Who can host a meal gathering?
                    </button>
                  </h2>
                  <div 
                    id="collapseOne" 
                    className="accordion-collapse collapse show" 
                    aria-labelledby="headingOne" 
                    data-bs-parent="#faqAccordion"
                  >
                    <div className="accordion-body">
                      Anyone can host a meal gathering! Whether you're an individual, family, community group, or business, if you know someone in need and want to bring people together to help, you can create an event. Our platform provides all the tools you need to organize, invite guests, collect contributions, and make an impact.
                    </div>
                  </div>
                </div>
                
                <div className="accordion-item">
                  <h2 className="accordion-header" id="headingTwo">
                    <button 
                      className="accordion-button collapsed" 
                      type="button" 
                      data-bs-toggle="collapse" 
                      data-bs-target="#collapseTwo" 
                      aria-expanded="false" 
                      aria-controls="collapseTwo"
                    >
                      How are funds disbursed to recipients?
                    </button>
                  </h2>
                  <div 
                    id="collapseTwo" 
                    className="accordion-collapse collapse" 
                    aria-labelledby="headingTwo" 
                    data-bs-parent="#faqAccordion"
                  >
                    <div className="accordion-body">
                      After your event reaches its end date, the collected funds are processed and disbursed directly to the recipient via their preferred method (bank transfer, check, or other secure options). We verify all recipients before disbursement to ensure the funds go to the intended person or family. Hosts receive a confirmation when the funds are transferred, and they can share this update with their guests.
                    </div>
                  </div>
                </div>
                
                <div className="accordion-item">
                  <h2 className="accordion-header" id="headingThree">
                    <button 
                      className="accordion-button collapsed" 
                      type="button" 
                      data-bs-toggle="collapse" 
                      data-bs-target="#collapseThree" 
                      aria-expanded="false" 
                      aria-controls="collapseThree"
                    >
                      Can I contribute if I can't attend the meal?
                    </button>
                  </h2>
                  <div 
                    id="collapseThree" 
                    className="accordion-collapse collapse" 
                    aria-labelledby="headingThree" 
                    data-bs-parent="#faqAccordion"
                  >
                    <div className="accordion-body">
                      Absolutely! While the shared meal experience enhances the giving process, we understand that not everyone can attend in person. When you receive an invitation, you'll have the option to contribute financially even if you can't join the gathering. You'll still receive updates about the impact of your contribution and can even send a message to be shared during the event.
                    </div>
                  </div>
                </div>
                
                <div className="accordion-item">
                  <h2 className="accordion-header" id="headingFour">
                    <button 
                      className="accordion-button collapsed" 
                      type="button" 
                      data-bs-toggle="collapse" 
                      data-bs-target="#collapseFour" 
                      aria-expanded="false" 
                      aria-controls="collapseFour"
                    >
                      What types of needs can be supported?
                    </button>
                  </h2>
                  <div 
                    id="collapseFour" 
                    className="accordion-collapse collapse" 
                    aria-labelledby="headingFour" 
                    data-bs-parent="#faqAccordion"
                  >
                    <div className="accordion-body">
                      Our platform supports a wide range of needs including but not limited to: medical expenses, housing assistance, education costs, small business startup funding, disaster recovery, and other personal or family hardships. The key is that there's a specific, tangible need with a clear fundraising goal. We encourage transparent sharing of how the funds will be used to help guests understand the impact of their contributions.
                    </div>
                  </div>
                </div>
                
                <div className="accordion-item">
                  <h2 className="accordion-header" id="headingFive">
                    <button 
                      className="accordion-button collapsed" 
                      type="button" 
                      data-bs-toggle="collapse" 
                      data-bs-target="#collapseFive" 
                      aria-expanded="false" 
                      aria-controls="collapseFive"
                    >
                      Are there any fees for using the platform?
                    </button>
                  </h2>
                  <div 
                    id="collapseFive" 
                    className="accordion-collapse collapse" 
                    aria-labelledby="headingFive" 
                    data-bs-parent="#faqAccordion"
                  >
                    <div className="accordion-body">
                      We charge a small platform fee of 5% to cover our operational costs, technology maintenance, and customer support. In addition, there are standard payment processing fees (approximately 2.9% + $0.30 per transaction) which are automatically deducted from contributions. We're committed to transparency, so these fees are clearly displayed during the contribution process. 100% of the remaining funds go directly to the recipient.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <section className="host-cta py-5">
        <div className="container">
          <div className="cta-card">
            <div className="row align-items-center">
              <div className="col-lg-7 mb-4 mb-lg-0">
                <h2>Ready to Make a Difference?</h2>
                <p className="mb-0">
                  Create your meal gathering today and bring people together for a meaningful cause.
                </p>
              </div>
              <div className="col-lg-5 text-lg-end">
                <Link to="/create-event" className="btn btn-primary btn-lg me-3">
                  Host a Meal
                </Link>
                <Link to="/events" className="btn btn-outline-light btn-lg">
                  Browse Events
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HowItWorksPage;