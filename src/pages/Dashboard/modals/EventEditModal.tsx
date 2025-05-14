import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, MapPin, Users, DollarSign, FileText, Image } from 'lucide-react';
import { useEvent } from '../../../context/EventContext';
import type { EventFormData } from '../modals/EventCreationForm';
import { toast } from 'react-toastify';
import '../../../styles/my-events.css';

interface EventEditModalProps {
  show: boolean;
  onHide: () => void;
  event: {
    _id: string;
    title: string;
    date: string;
    location: string;
    guestCount: number;
    goalAmount: number;
    description: string;
    imageUrl?: string | null;
    recipient: {
      name: string;
      categoryOfNeed: string;
      story: string;
      photoUrl?: string | null;
      fundsUsage: string;
    };
    hostId: {
      _id: string;
      firstname: string;
      lastname: string;
    };
    status: string;
    currentAmount: number;
    createdAt: string;
    updatedAt: string;
  } | null;
}

const EventEditModal: React.FC<EventEditModalProps> = ({ show, onHide, event }) => {
  const { updateEvent } = useEvent();
  const [currentStep, setCurrentStep] = useState<number>(1);
  const totalSteps = 3;
  const [formData, setFormData] = useState<EventFormData>({
    name: '',
    date: '',
    time: '',
    location: '',
    maxGuests: '',
    fundingGoal: '',
    description: '',
    eventImage: null,
    recipientName: '',
    categoryOfNeed: '',
    recipientStory: '',
    recipientPhoto: null,
    fundsUsage: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const categoryLabels: Record<string, string> = {
    medical: 'Medical Expenses',
    housing: 'Housing',
    education: 'Education',
    business: 'Small Business',
    disaster: 'Disaster Relief',
    other: 'Other',
  };

  useEffect(() => {
    console.log('Modal event prop:', event);
    if (event) {
      const eventDate = new Date(event.date);
      setFormData({
        name: event.title,
        description: event.description,
        date: eventDate.toISOString().split('T')[0],
        time: eventDate.toTimeString().slice(0, 5),
        location: event.location,
        maxGuests: event.guestCount.toString(),
        fundingGoal: event.goalAmount.toString(),
        recipientName: event.recipient.name,
        categoryOfNeed: event.recipient.categoryOfNeed,
        recipientStory: event.recipient.story,
        fundsUsage: event.recipient.fundsUsage,
        eventImage: null,
        recipientPhoto: null,
      });
    } else {
      setFormData({
        name: '',
        date: '',
        time: '',
        location: '',
        maxGuests: '',
        fundingGoal: '',
        description: '',
        eventImage: null,
        recipientName: '',
        categoryOfNeed: '',
        recipientStory: '',
        recipientPhoto: null,
        fundsUsage: '',
      });
    }
  }, [event]);

  const validateStep = (step: number): Record<string, string> => {
    const errors: Record<string, string> = {};
    if (step === 1) {
      if (!formData.name) errors.name = 'Event title is required';
      if (!formData.date) errors.date = 'Date is required';
      if (!formData.time) errors.time = 'Time is required';
      if (!formData.location) errors.location = 'Location is required';
      if (!formData.maxGuests) {
        errors.maxGuests = 'Max guests is required';
      } else if (isNaN(Number(formData.maxGuests)) || Number(formData.maxGuests) < 2) {
        errors.maxGuests = 'Max guests must be at least 2';
      }
      if (!formData.fundingGoal) {
        errors.fundingGoal = 'Funding goal is required';
      } else if (isNaN(Number(formData.fundingGoal)) || Number(formData.fundingGoal) < 100) {
        errors.fundingGoal = 'Funding goal must be at least 100';
      }
      if (!formData.description) errors.description = 'Description is required';
    } else if (step === 2) {
      if (!formData.recipientName) errors.recipientName = 'Recipient name is required';
      if (!formData.categoryOfNeed) errors.categoryOfNeed = 'Category of need is required';
      if (!formData.recipientStory) errors.recipientStory = 'Recipient story is required';
      if (!formData.fundsUsage) errors.fundsUsage = 'Funds usage is required';
    }
    return errors;
  };

  const nextStep = () => {
    const stepErrors = validateStep(currentStep);
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
    } else {
      setErrors({});
      if (currentStep < totalSteps) {
        setCurrentStep(currentStep + 1);
        window.scrollTo(0, 0);
      }
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name } = e.target;
    const file = e.target.files ? e.target.files[0] : null;
    setFormData((prev) => ({ ...prev, [name]: file }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!event) {
      toast.error('No event selected');
      return;
    }
    const step1Errors = validateStep(1);
    const step2Errors = validateStep(2);
    const allErrors = { ...step1Errors, ...step2Errors };
    if (Object.keys(allErrors).length > 0) {
      setErrors(allErrors);
      return;
    }
    const termsCheck = document.getElementById('termsCheck') as HTMLInputElement;
    if (!termsCheck.checked) {
      toast.error('Please agree to the terms');
      return;
    }

    try {
      const updatedData: EventFormData = { ...formData };
      console.log('Submitting updated data:', updatedData);
      await updateEvent(event._id, updatedData);
      toast.success('Event updated successfully');
      onHide();
    } catch (err) {
      console.error('Error updating event:', err);
      toast.error('Failed to update event');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'N/A';
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full m-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h3 className="text-xl font-semibold">Edit Event</h3>
          <button onClick={onHide} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6">
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
                  Update the details of your meal gathering, including when and where it will be hosted.
                </p>

                <div className="form-group">
                  <label htmlFor="name">Event Title *</label>
                  <div className="input-icon-wrapper">
                    <span className="input-icon">
                      <FileText size={18} />
                    </span>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="form-control"
                      placeholder="Give your event a meaningful name"
                      required
                    />
                  </div>
                  {errors.name && <div className="text-danger">{errors.name}</div>}
                </div>

                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="date">Date *</label>
                      <div className="input-icon-wrapper">
                        <span className="input-icon">
                          <Calendar size={18} />
                        </span>
                        <input
                          type="date"
                          id="date"
                          name="date"
                          value={formData.date}
                          onChange={handleInputChange}
                          className="form-control"
                          required
                        />
                      </div>
                      {errors.date && <div className="text-danger">{errors.date}</div>}
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="time">Time *</label>
                      <div className="input-icon-wrapper">
                        <span className="input-icon">
                          <Clock size={18} />
                        </span>
                        <input
                          type="time"
                          id="time"
                          name="time"
                          value={formData.time}
                          onChange={handleInputChange}
                          className="form-control"
                          required
                        />
                      </div>
                      {errors.time && <div className="text-danger">{errors.time}</div>}
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="location">Location *</label>
                  <div className="input-icon-wrapper">
                    <span className="input-icon">
                      <MapPin size={18} />
                    </span>
                    <input
                      type="text"
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      className="form-control"
                      placeholder="Address or virtual link"
                      required
                    />
                  </div>
                  {errors.location && <div className="text-danger">{errors.location}</div>}
                </div>

                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="maxGuests">Max Guests *</label>
                      <div className="input-icon-wrapper">
                        <span className="input-icon">
                          <Users size={18} />
                        </span>
                        <input
                          type="number"
                          id="maxGuests"
                          name="maxGuests"
                          value={formData.maxGuests}
                          onChange={handleInputChange}
                          className="form-control"
                          placeholder="e.g., 12"
                          min="2"
                          required
                        />
                      </div>
                      {errors.maxGuests && <div className="text-danger">{errors.maxGuests}</div>}
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="fundingGoal">Funding Goal *</label>
                      <div className="input-icon-wrapper">
                        <span className="input-icon">
                          <DollarSign size={18} />
                        </span>
                        <input
                          type="number"
                          id="fundingGoal"
                          name="fundingGoal"
                          value={formData.fundingGoal}
                          onChange={handleInputChange}
                          className="form-control"
                          placeholder="e.g., 500"
                          min="100"
                          required
                        />
                      </div>
                      {errors.fundingGoal && <div className="text-danger">{errors.fundingGoal}</div>}
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="description">Event Description *</label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="form-control"
                    rows={4}
                    placeholder="Tell your guests what to expect at your gathering"
                    required
                  ></textarea>
                  {errors.description && <div className="text-danger">{errors.description}</div>}
                </div>

                <div className="form-group">
                  <label htmlFor="eventImage">Event Image</label>
                  <div className="input-icon-wrapper file-input-wrapper">
                    <span className="input-icon">
                      <Image size={18} />
                    </span>
                    <input
                      type="file"
                      id="eventImage"
                      name="eventImage"
                      onChange={handleFileChange}
                      className="form-control"
                      accept="image/*"
                    />
                  </div>
                  <small className="text-muted">
                    Upload an image that represents your meal gathering. Recommended size: 1200x800px.
                    {event?.imageUrl && ' Current image will be replaced if a new one is uploaded.'}
                  </small>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="form-step">
                <h2 className="form-step-title">Recipient Information</h2>
                <p className="form-step-description">
                  Update the story of who will benefit from your meal gathering and why they need support.
                </p>

                <div className="form-group">
                  <label htmlFor="recipientName">Recipient Name *</label>
                  <input
                    type="text"
                    id="recipientName"
                    name="recipientName"
                    value={formData.recipientName}
                    onChange={handleInputChange}
                    className="form-control"
                    placeholder="Individual or family name"
                    required
                  />
                  {errors.recipientName && <div className="text-danger">{errors.recipientName}</div>}
                </div>

                <div className="form-group">
                  <label htmlFor="categoryOfNeed">Category of Need *</label>
                  <select
                    id="categoryOfNeed"
                    name="categoryOfNeed"
                    value={formData.categoryOfNeed}
                    onChange={handleInputChange}
                    className="form-control"
                    required
                  >
                    <option value="">Select a category</option>
                    <option value="medical">Medical Expenses</option>
                    <option value="housing">Housing</option>
                    <option value="education">Education</option>
                    <option value="business">Small Business</option>
                    <option value="disaster">Disaster Relief</option>
                    <option value="other">Other</option>
                  </select>
                  {errors.categoryOfNeed && <div className="text-danger">{errors.categoryOfNeed}</div>}
                </div>

                <div className="form-group">
                  <label htmlFor="recipientStory">Their Story *</label>
                  <textarea
                    id="recipientStory"
                    name="recipientStory"
                    value={formData.recipientStory}
                    onChange={handleInputChange}
                    className="form-control"
                    rows={6}
                    placeholder="Share why this person or family needs support and how the funds will help"
                    required
                  ></textarea>
                  {errors.recipientStory && <div className="text-danger">{errors.recipientStory}</div>}
                </div>

                <div className="form-group">
                  <label htmlFor="recipientPhoto">Recipient Photo</label>
                  <div className="input-icon-wrapper file-input-wrapper">
                    <span className="input-icon">
                      <Image size={18} />
                    </span>
                    <input
                      type="file"
                      id="recipientPhoto"
                      name="recipientPhoto"
                      onChange={handleFileChange}
                      className="form-control"
                      accept="image/*"
                    />
                  </div>
                  <small className="text-muted">
                    With permission, upload a photo of the recipient or something representing their situation.
                    {event?.recipient.photoUrl && ' Current photo will be replaced if a new one is uploaded.'}
                  </small>
                </div>

                <div className="form-group">
                  <label htmlFor="fundsUsage">How Funds Will Be Used *</label>
                  <textarea
                    id="fundsUsage"
                    name="fundsUsage"
                    value={formData.fundsUsage}
                    onChange={handleInputChange}
                    className="form-control"
                    rows={4}
                    placeholder="Explain exactly how the money raised will help the recipient"
                    required
                  ></textarea>
                  {errors.fundsUsage && <div className="text-danger">{errors.fundsUsage}</div>}
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="form-step">
                <h2 className="form-step-title">Review Your Changes</h2>
                <p className="form-step-description">Please review all details before saving your changes.</p>

                <div className="review-section">
                  <h3 className="review-section-title">Event Details</h3>
                  <div className="review-item">
                    <span className="review-label">Title:</span>
                    <span className="review-value">{formData.name}</span>
                  </div>
                  <div className="review-item">
                    <span className="review-label">Date & Time:</span>
                    <span className="review-value">
                      {formData.date} • {formData.time}
                    </span>
                  </div>
                  <div className="review-item">
                    <span className="review-label">Location:</span>
                    <span className="review-value">{formData.location}</span>
                  </div>
                  <div className="review-item">
                    <span className="review-label">Max Guests:</span>
                    <span className="review-value">{formData.maxGuests}</span>
                  </div>
                  <div className="review-item">
                    <span className="review-label">Funding Goal:</span>
                    <span className="review-value">${formData.fundingGoal}</span>
                  </div>
                  <div className="review-item">
                    <span className="review-label">Description:</span>
                    <span className="review-value">{formData.description}</span>
                  </div>
                  {formData.eventImage && (
                    <div className="review-item">
                      <span className="review-label">Event Image:</span>
                      <span className="review-value">{formData.eventImage.name}</span>
                    </div>
                  )}
                  {event?.imageUrl && !formData.eventImage && (
                    <div className="review-item">
                      <span className="review-label">Current Event Image:</span>
                      <span className="review-value">{event.imageUrl}</span>
                    </div>
                  )}
                  <div className="review-item">
                    <span className="review-label">Current Amount Raised:</span>
                    <span className="review-value">${event?.currentAmount || 0}</span>
                  </div>
                  <div className="review-item">
                    <span className="review-label">Status:</span>
                    <span className="review-value">{event?.status || 'N/A'}</span>
                  </div>
                  <div className="review-item">
                    <span className="review-label">Created At:</span>
                    <span className="review-value">{event ? formatDate(event.createdAt) : 'N/A'}</span>
                  </div>
                  <div className="review-item">
                    <span className="review-label">Updated At:</span>
                    <span className="review-value">{event ? formatDate(event.updatedAt) : 'N/A'}</span>
                  </div>
                </div>

                <div className="review-section">
                  <h3 className="review-section-title">Recipient Information</h3>
                  <div className="review-item">
                    <span className="review-label">Name:</span>
                    <span className="review-value">{formData.recipientName}</span>
                  </div>
                  <div className="review-item">
                    <span className="review-label">Category:</span>
                    <span className="review-value">{categoryLabels[formData.categoryOfNeed] || formData.categoryOfNeed}</span>
                  </div>
                  <div className="review-item">
                    <span className="review-label">Story:</span>
                    <span className="review-value">{formData.recipientStory}</span>
                  </div>
                  {formData.recipientPhoto && (
                    <div className="review-item">
                      <span className="review-label">Recipient Photo:</span>
                      <span className="review-value">{formData.recipientPhoto.name}</span>
                    </div>
                  )}
                  {event?.recipient.photoUrl && !formData.recipientPhoto && (
                    <div className="review-item">
                      <span className="review-label">Current Recipient Photo:</span>
                      <span className="review-value">{event.recipient.photoUrl}</span>
                    </div>
                  )}
                  <div className="review-item">
                    <span className="review-label">Funds Usage:</span>
                    <span className="review-value">{formData.fundsUsage}</span>
                  </div>
                </div>

                <div className="review-section">
                  <h3 className="review-section-title">Host Information</h3>
                  <div className="review-item">
                    <span className="review-label">Host Name:</span>
                    <span className="review-value">
                      {event?.hostId ? `${event.hostId.firstname} ${event.hostId.lastname}` : 'N/A'}
                    </span>
                  </div>
                  <div className="review-item">
                    <span className="review-label">Host ID:</span>
                    <span className="review-value">{event?.hostId?._id || 'N/A'}</span>
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
                <button type="button" className="btn btn-outline-primary" onClick={prevStep}>
                  Back
                </button>
              )}
              {currentStep < totalSteps ? (
                <button type="button" className="btn btn-primary" onClick={nextStep}>
                  Continue
                </button>
              ) : (
                <button type="submit" className="btn btn-primary">
                  Save Changes
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventEditModal;