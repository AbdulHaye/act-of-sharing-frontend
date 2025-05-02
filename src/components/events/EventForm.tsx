import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Users, DollarSign, FileText, Image } from 'lucide-react';
import '../../styles/event-form.css';

const EventForm: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };

  return (
    <div className="event-form-container">
      <div className="form-progress mb-4">
        {[...Array(totalSteps)].map((_, index) => (
          <div 
            key={index} 
            className={`progress-step ${currentStep > index + 1 ? 'completed' : ''} ${currentStep === index + 1 ? 'active' : ''}`}
          >
            <div className="progress-circle">{index + 1}</div>
            <div className="progress-label">
              {index === 0 ? 'Event Details' : index === 1 ? 'Recipient Info' : 'Review'}
            </div>
            {index < totalSteps - 1 && <div className="progress-line"></div>}
          </div>
        ))}
      </div>

      <div className="form-card">
        {currentStep === 1 && (
          <div className="form-step">
            <h2 className="form-step-title">Event Details</h2>
            <p className="form-step-description">
              Let's set up your meal gathering. Provide details about when and where you'll host.
            </p>

            <div className="form-group">
              <label htmlFor="eventTitle">Event Title *</label>
              <div className="input-icon-wrapper">
                <span className="input-icon"><FileText size={18} /></span>
                <input 
                  type="text" 
                  className="form-control" 
                  id="eventTitle" 
                  placeholder="Give your event a meaningful name"
                  required 
                />
              </div>
            </div>

            <div className="row">
              <div className="col-md-6">
                <div className="form-group">
                  <label htmlFor="eventDate">Date *</label>
                  <div className="input-icon-wrapper">
                    <span className="input-icon"><Calendar size={18} /></span>
                    <input 
                      type="date" 
                      className="form-control" 
                      id="eventDate" 
                      required 
                    />
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label htmlFor="eventTime">Time *</label>
                  <div className="input-icon-wrapper">
                    <span className="input-icon"><Clock size={18} /></span>
                    <input 
                      type="time" 
                      className="form-control" 
                      id="eventTime" 
                      required 
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="eventLocation">Location *</label>
              <div className="input-icon-wrapper">
                <span className="input-icon"><MapPin size={18} /></span>
                <input 
                  type="text" 
                  className="form-control" 
                  id="eventLocation" 
                  placeholder="Address or virtual link"
                  required 
                />
              </div>
            </div>

            <div className="row">
              <div className="col-md-6">
                <div className="form-group">
                  <label htmlFor="maxGuests">Max Guests *</label>
                  <div className="input-icon-wrapper">
                    <span className="input-icon"><Users size={18} /></span>
                    <input 
                      type="number" 
                      className="form-control" 
                      id="maxGuests" 
                      placeholder="e.g., 12" 
                      min="2"
                      required 
                    />
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label htmlFor="fundingGoal">Funding Goal *</label>
                  <div className="input-icon-wrapper">
                    <span className="input-icon"><DollarSign size={18} /></span>
                    <input 
                      type="number" 
                      className="form-control" 
                      id="fundingGoal" 
                      placeholder="e.g., 500" 
                      min="100"
                      required 
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="eventDescription">Event Description *</label>
              <textarea 
                className="form-control" 
                id="eventDescription" 
                rows={4}
                placeholder="Tell your guests what to expect at your gathering"
                required
              ></textarea>
            </div>

            <div className="form-group">
              <label htmlFor="eventImage">Event Image</label>
              <div className="input-icon-wrapper file-input-wrapper">
                <span className="input-icon"><Image size={18} /></span>
                <input 
                  type="file" 
                  className="form-control" 
                  id="eventImage"
                  accept="image/*"
                />
              </div>
              <small className="text-muted">
                Upload an image that represents your meal gathering. Recommended size: 1200x800px.
              </small>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="form-step">
            <h2 className="form-step-title">Recipient Information</h2>
            <p className="form-step-description">
              Share the story of who will benefit from your meal gathering and why they need support.
            </p>

            <div className="form-group">
              <label htmlFor="recipientName">Recipient Name *</label>
              <input 
                type="text" 
                className="form-control" 
                id="recipientName" 
                placeholder="Individual or family name"
                required 
              />
            </div>

            <div className="form-group">
              <label htmlFor="needCategory">Category of Need *</label>
              <select className="form-control" id="needCategory" required>
                <option value="">Select a category</option>
                <option value="medical">Medical Expenses</option>
                <option value="housing">Housing</option>
                <option value="education">Education</option>
                <option value="business">Small Business</option>
                <option value="disaster">Disaster Relief</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="recipientStory">Their Story *</label>
              <textarea 
                className="form-control" 
                id="recipientStory" 
                rows={6}
                placeholder="Share why this person or family needs support and how the funds will help"
                required
              ></textarea>
            </div>

            <div className="form-group">
              <label htmlFor="recipientImage">Recipient Photo</label>
              <div className="input-icon-wrapper file-input-wrapper">
                <span className="input-icon"><Image size={18} /></span>
                <input 
                  type="file" 
                  className="form-control" 
                  id="recipientImage"
                  accept="image/*"
                />
              </div>
              <small className="text-muted">
                With permission, upload a photo of the recipient or something representing their situation.
              </small>
            </div>

            <div className="form-group">
              <label htmlFor="fundsUsage">How Funds Will Be Used *</label>
              <textarea 
                className="form-control" 
                id="fundsUsage" 
                rows={4}
                placeholder="Explain exactly how the money raised will help the recipient"
                required
              ></textarea>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="form-step">
            <h2 className="form-step-title">Review Your Event</h2>
            <p className="form-step-description">
              Please review all details before creating your event.
            </p>

            <div className="review-section">
              <h3 className="review-section-title">Event Details</h3>
              <div className="review-item">
                <span className="review-label">Title:</span>
                <span className="review-value">Sunday Dinner for the Johnson Family</span>
              </div>
              <div className="review-item">
                <span className="review-label">Date & Time:</span>
                <span className="review-value">June 15, 2025 • 6:00 PM</span>
              </div>
              <div className="review-item">
                <span className="review-label">Location:</span>
                <span className="review-value">123 Main Street, Portland, OR</span>
              </div>
              <div className="review-item">
                <span className="review-label">Max Guests:</span>
                <span className="review-value">12</span>
              </div>
              <div className="review-item">
                <span className="review-label">Funding Goal:</span>
                <span className="review-value">$2,500</span>
              </div>
            </div>

            <div className="review-section">
              <h3 className="review-section-title">Recipient Information</h3>
              <div className="review-item">
                <span className="review-label">Name:</span>
                <span className="review-value">The Johnson Family</span>
              </div>
              <div className="review-item">
                <span className="review-label">Category:</span>
                <span className="review-value">Medical Expenses</span>
              </div>
            </div>

            <div className="form-group form-check">
              <input type="checkbox" className="form-check-input" id="termsCheck" required />
              <label className="form-check-label" htmlFor="termsCheck">
                I confirm that all information is accurate and I have permission to share the recipient's story.
              </label>
            </div>
          </div>
        )}

        <div className="form-navigation">
          {currentStep > 1 && (
            <button 
              type="button" 
              className="btn btn-outline-primary" 
              onClick={prevStep}
            >
              Back
            </button>
          )}
          
          {currentStep < totalSteps ? (
            <button 
              type="button" 
              className="btn btn-primary" 
              onClick={nextStep}
            >
              Continue
            </button>
          ) : (
            <button 
              type="submit" 
              className="btn btn-primary"
            >
              Create Event
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventForm;