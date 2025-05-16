import React, { useState } from "react";
import { X, Calendar, Clock, MapPin, Users, DollarSign, FileText, Image } from "lucide-react";
import { useEvent } from "../context/EventContext";
import { useAuth } from "../context/AuthContext";
import { toast } from 'react-toastify';

interface EventFormData {
  name: string;
  date: string;
  time: string;
  location: string;
  maxGuests: string;
  fundingGoal: string;
  description: string;
  eventImage: File | null;
  recipientName: string;
  categoryOfNeed: string;
  recipientStory: string;
  recipientPhoto: File | null;
  fundsUsage: string;
  visibility: "" | "public" | "private";
}

interface EventCreationFormProps {
  onClose: () => void;
}

const EventCreationForm: React.FC<EventCreationFormProps> = ({ onClose }) => {
  const { createEvent, loading, error } = useEvent();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isTermsChecked, setIsTermsChecked] = useState(false); // State for checkbox
  const totalSteps = 3;
  const [formData, setFormData] = useState<EventFormData>({
    name: "",
    date: "",
    time: "",
    location: "",
    maxGuests: "",
    fundingGoal: "",
    description: "",
    eventImage: null,
    recipientName: "",
    categoryOfNeed: "",
    recipientStory: "",
    recipientPhoto: null,
    fundsUsage: "",
    visibility: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const categoryLabels: Record<string, string> = {
    medical: "Medical Expenses",
    housing: "Housing",
    education: "Education",
    business: "Small Business",
    disaster: "Disaster Relief",
    other: "Other",
  };

  const validateStep = (step: number): Record<string, string> => {
    const errors: Record<string, string> = {};
    if (step === 1) {
      if (!formData.name) errors.name = "Event title is required";
      if (!formData.date) errors.date = "Date is required";
      if (!formData.time) errors.time = "Time is required";
      if (!formData.location) errors.location = "Location is required";
      if (!formData.maxGuests) {
        errors.maxGuests = "Max guests is required";
      } else if (isNaN(Number(formData.maxGuests)) || Number(formData.maxGuests) < 2) {
        errors.maxGuests = "Max guests must be at least 2";
      }
      if (!formData.fundingGoal) {
        errors.fundingGoal = "Funding goal is required";
      } else if (isNaN(Number(formData.fundingGoal)) || Number(formData.fundingGoal) < 25) {
        errors.fundingGoal = "Funding goal must be at least 25";
      }
      if (!formData.description) errors.description = "Description is required";
      if (!formData.visibility) errors.visibility = "Event visibility is required";
    } else if (step === 2) {
      if (!formData.recipientName) errors.recipientName = "Recipient name is required";
      if (!formData.categoryOfNeed) errors.categoryOfNeed = "Category of need is required";
      if (!formData.recipientStory) errors.recipientStory = "Recipient story is required";
      if (!formData.fundsUsage) errors.fundsUsage = "Funds usage is required";
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const step1Errors = validateStep(1);
    const step2Errors = validateStep(2);
    const allErrors = { ...step1Errors, ...step2Errors };
    if (Object.keys(allErrors).length > 0) {
      setErrors(allErrors);
      return;
    }
    if (!isTermsChecked) {
      setErrors((prev) => ({ ...prev, termsCheck: "Please check the box" }));
      return;
    }

    const eventDataWithCreator = {
      ...formData,
      createdBy: user?.id || "",
    };

    await createEvent(eventDataWithCreator);
    if (!error) {
      toast.success("Event created successfully!");
      onClose();
    } else {
      setErrors((prev) => ({ ...prev, submit: error }));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name } = e.target;
    const file = e.target.files ? e.target.files[0] : null;
    setFormData((prev) => ({ ...prev, [name]: file }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsTermsChecked(e.target.checked);
    if (e.target.checked) {
      setErrors((prev) => ({ ...prev, termsCheck: "" }));
    } else {
      setErrors((prev) => ({ ...prev, termsCheck: "Please check the box" }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full m-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b pt-10"> {/* Added pt-10 for top spacing */}
          <h3 className="text-xl font-semibold">Create New Event</h3>
          <button className="text-gray-500 hover:text-gray-700" disabled={loading} onClick={onClose}>
            <X size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6">
          <div className="form-progress mb-4">
            {[...Array(totalSteps)].map((_, index) => (
              <div
                key={index}
                className={`progress-step ${currentStep > index + 1 ? "completed" : ""} ${currentStep === index + 1 ? "active" : ""}`}
              >
                <div className="progress-circle">{index + 1}</div>
                <div className="progress-label">
                  {index === 0 ? "Event Details" : index === 1 ? "Recipient Info" : "Review"}
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
                  <label htmlFor="name">Event Title *</label>
                  <div className="input-icon-wrapper">
                    <span className="input-icon"><FileText size={18} /></span>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="form-control"
                      placeholder="Give your event a meaningful name"
                      required
                      disabled={loading}
                    />
                  </div>
                  {errors.name && <div className="text-danger">{errors.name}</div>}
                </div>

                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="date">Date *</label>
                      <div className="input-icon-wrapper">
                        <span className="input-icon"><Calendar size={18} /></span>
                        <input
                          type="date"
                          id="date"
                          name="date"
                          value={formData.date}
                          onChange={handleInputChange}
                          className="form-control"
                          required
                          disabled={loading}
                        />
                      </div>
                      {errors.date && <div className="text-danger">{errors.date}</div>}
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="time">Time *</label>
                      <div className="input-icon-wrapper">
                        <span className="input-icon"><Clock size={18} /></span>
                        <input
                          type="time"
                          id="time"
                          name="time"
                          value={formData.time}
                          onChange={handleInputChange}
                          className="form-control"
                          required
                          disabled={loading}
                        />
                      </div>
                      {errors.time && <div className="text-danger">{errors.time}</div>}
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="location">Location *</label>
                  <div className="input-icon-wrapper">
                    <span className="input-icon"><MapPin size={18} /></span>
                    <input
                      type="text"
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      className="form-control"
                      placeholder="Address or virtual link"
                      required
                      disabled={loading}
                    />
                  </div>
                  {errors.location && <div className="text-danger">{errors.location}</div>}
                </div>

                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="maxGuests">Max Guests *</label>
                      <div className="input-icon-wrapper">
                        <span className="input-icon"><Users size={18} /></span>
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
                          disabled={loading}
                        />
                      </div>
                      {errors.maxGuests && <div className="text-danger">{errors.maxGuests}</div>}
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="fundingGoal">Funding Goal *</label>
                      <div className="input-icon-wrapper">
                        <span className="input-icon"><DollarSign size={18} /></span>
                        <input
                          type="number"
                          id="fundingGoal"
                          name="fundingGoal"
                          value={formData.fundingGoal}
                          onChange={handleInputChange}
                          className="form-control"
                          placeholder="e.g., 25-100 or more"
                          min="100"
                          required
                          disabled={loading}
                        />
                      </div>
                      {errors.fundingGoal && <div className="text-danger">{errors.fundingGoal}</div>}
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="visibility">Visibility *</label>
                  <div className="input-icon-wrapper">
                    <span className="input-icon"><Users size={18} /></span>
                    <select
                      id="visibility"
                      name="visibility"
                      value={formData.visibility}
                      onChange={handleInputChange}
                      className="form-control"
                      required
                      disabled={loading}
                    >
                      <option value="" disabled>Select visibility</option>
                      <option value="public">Public</option>
                      <option value="private">Private</option>
                    </select>
                  </div>
                  {errors.visibility && <div className="text-danger">{errors.visibility}</div>}
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
                    disabled={loading}
                  ></textarea>
                  {errors.description && <div className="text-danger">{errors.description}</div>}
                </div>

                <div className="form-group">
                  <label htmlFor="eventImage">Event Image</label>
                  <div className="input-icon-wrapper file-input-wrapper">
                    <span className="input-icon"><Image size={18} /></span>
                    <input
                      type="file"
                      id="eventImage"
                      name="eventImage"
                      onChange={handleFileChange}
                      className="form-control"
                      accept="image/*"
                      disabled={loading}
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
                    id="recipientName"
                    name="recipientName"
                    value={formData.recipientName}
                    onChange={handleInputChange}
                    className="form-control"
                    placeholder="Individual or family name"
                    required
                    disabled={loading}
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
                    disabled={loading}
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
                    disabled={loading}
                  ></textarea>
                  {errors.recipientStory && <div className="text-danger">{errors.recipientStory}</div>}
                </div>

                <div className="form-group">
                  <label htmlFor="recipientPhoto">Recipient Photo</label>
                  <div className="input-icon-wrapper file-input-wrapper">
                    <span className="input-icon"><Image size={18} /></span>
                    <input
                      type="file"
                      id="recipientPhoto"
                      name="recipientPhoto"
                      onChange={handleFileChange}
                      className="form-control"
                      accept="image/*"
                      disabled={loading}
                    />
                  </div>
                  <small className="text-muted">
                    With permission, upload a photo of the recipient or something representing their situation.
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
                    disabled={loading}
                  ></textarea>
                  {errors.fundsUsage && <div className="text-danger">{errors.fundsUsage}</div>}
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
                    <span className="review-value">{formData.name}</span>
                  </div>
                  <div className="review-item">
                    <span className="review-label">Date & Time:</span>
                    <span className="review-value">{formData.date} • {formData.time}</span>
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
                    <span className="review-label">Visibility:</span>
                    <span className="review-value">{formData.visibility.charAt(0).toUpperCase() + formData.visibility.slice(1)}</span>
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
                  <div className="review-item">
                    <span className="review-label">Funds Usage:</span>
                    <span className="review-value">{formData.fundsUsage}</span>
                  </div>
                </div>

                <div className="form-group form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="termsCheck"
                    checked={isTermsChecked}
                    onChange={handleCheckboxChange}
                    required
                    disabled={loading}
                  />
                  <label className="form-check-label" htmlFor="termsCheck" aria-required>
                    I confirm that all information is accurate and I have permission to share the recipient's story.
                  </label>
                  {errors.termsCheck && <div className="text-danger mt-2">{errors.termsCheck}</div>}
                </div>
                {error && <div className="text-danger mt-2">{error}</div>}
              </div>
            )}

            <div className="form-navigation">
              {currentStep > 1 && (
                <button type="button" className="btn btn-outline-primary" onClick={prevStep} disabled={loading}>
                  Back
                </button>
              )}
              {currentStep < totalSteps ? (
                <button type="button" className="btn btn-primary" onClick={nextStep} disabled={loading}>
                  Continue
                </button>
              ) : (
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading || !isTermsChecked}
                >
                  {loading ? "Creating..." : "Create Event"}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventCreationForm;