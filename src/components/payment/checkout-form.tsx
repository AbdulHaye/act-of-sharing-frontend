import React, { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import axios from "axios";

interface CheckoutFormProps {
  eventId: string;
  amount: string;
  subscriptionType: string;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({ eventId, amount, subscriptionType }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    mobile: "",
    countryCode: "+1",
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPaymentSuccessful, setIsPaymentSuccessful] = useState(false);
  const [phoneError, setPhoneError] = useState<string | null>(null); // New state for phone validation error

  // Define phone number length requirements by country code
  const phoneLengthRequirements: { [key: string]: { min: number; max: number } } = {
    "+1": { min: 10, max: 10 }, // USA and Canada
    "+44": { min: 10, max: 10 }, // UK
    "+91": { min: 10, max: 10 }, // India
    "+61": { min: 9, max: 9 }, // Australia
    "+49": { min: 10, max: 10 }, // Germany
    "+33": { min: 9, max: 9 }, // France
    "+86": { min: 11, max: 11 }, // China
    "+81": { min: 10, max: 10 }, // Japan
    "+55": { min: 10, max: 11 }, // Brazil
    "+27": { min: 9, max: 9 }, // South Africa
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === "mobile") {
      const numericValue = value.replace(/[^0-9]/g, "");
      setFormData({ ...formData, [name]: numericValue });

      // Validate phone number length based on the current country code
      const requirements = phoneLengthRequirements[formData.countryCode];
      if (numericValue.length < requirements.min) {
        setPhoneError(`Phone number must be at least ${requirements.min} digits for ${formData.countryCode}.`);
      } else if (numericValue.length > requirements.max) {
        setPhoneError(`Phone number cannot exceed ${requirements.max} digits for ${formData.countryCode}.`);
      } else {
        setPhoneError(null);
      }
    } else {
      setFormData({ ...formData, [name]: value });

      // If country code changes, re-validate the phone number
      if (name === "countryCode") {
        const requirements = phoneLengthRequirements[value];
        const mobileLength = formData.mobile.length;
        if (mobileLength < requirements.min) {
          setPhoneError(`Phone number must be at least ${requirements.min} digits for ${value}.`);
        } else if (mobileLength > requirements.max) {
          setPhoneError(`Phone number cannot exceed ${requirements.max} digits for ${value}.`);
        } else {
          setPhoneError(null);
        }
      }
    }
  };

  const isFormValid = () => {
    const requirements = phoneLengthRequirements[formData.countryCode];
    const mobileLength = formData.mobile.trim().length;

    return (
      formData.firstname.trim() !== "" &&
      formData.lastname.trim() !== "" &&
      formData.email.trim() !== "" &&
      formData.mobile.trim() !== "" &&
      mobileLength >= requirements.min &&
      mobileLength <= requirements.max &&
      !isProcessing &&
      !!stripe
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setError(null);

    if (!stripe || !elements) {
      setError("Stripe has not loaded correctly.");
      setIsProcessing(false);
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      setError("Card element not found.");
      setIsProcessing(false);
      return;
    }

    try {
      // Step 1: Create a payment method
      const { paymentMethod, error: paymentError } = await stripe.createPaymentMethod({
        type: "card",
        card: cardElement,
        billing_details: {
          name: `${formData.firstname} ${formData.lastname}`,
          email: formData.email,
          phone: `${formData.countryCode}${formData.mobile}`,
        },
      });

      if (paymentError) {
        setError(paymentError.message || "Payment method creation failed.");
        setIsProcessing(false);
        return;
      }

      // Step 2: Send the paymentMethodId to the backend to create a payment intent
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/contributions/donate`, {
        eventId,
        amount: Number.parseFloat(amount), // Convert to cents for Stripe
        subscriptionType,
        paymentMethodId: paymentMethod!.id,
        ...formData,
        mobile: `${formData.countryCode}${formData.mobile}`,
      });

      const { clientSecret, status } = response.data;

      if (status === "succeeded") {
        setIsPaymentSuccessful(true);
        setFormData({
          firstname: "",
          lastname: "",
          email: "",
          mobile: "",
          countryCode: "+1",
        });
        return;
      }

      if (!clientSecret) {
        setError("Failed to retrieve payment intent from server.");
        setIsProcessing(false);
        return;
      }

      // Step 3: Confirm the payment intent on the frontend
      const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: paymentMethod!.id,
      });

      if (confirmError) {
        setError(confirmError.message || "Payment confirmation failed.");
        setIsProcessing(false);
        return;
      }

      if (paymentIntent.status === "succeeded") {
        setIsPaymentSuccessful(true);
        setFormData({
          firstname: "",
          lastname: "",
          email: "",
          mobile: "",
          countryCode: "+1",
        });
      } else {
        setError("Payment did not succeed. Please try again.");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle click to make another donation
  const handleMakeAnotherDonation = () => {
    setIsPaymentSuccessful(false);
    setFormData({
      firstname: "",
      lastname: "",
      email: "",
      mobile: "",
      countryCode: "+1",
    });
    setPhoneError(null); // Clear phone error when resetting form
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-5" style={{ maxWidth: "600px", margin: "0 auto" }}>
      {isPaymentSuccessful ? (
        // Thank You Card
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg shadow-xl p-6 text-center transform transition-all duration-300 hover:scale-105">
          <div className="flex justify-center mb-4">
            <svg
              className="w-16 h-16 text-yellow-300 animate-pulse"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              ></path>
            </svg>
          </div>
          <h2 className="text-3xl font-bold mb-2">Thank You, {formData.firstname} {formData.lastname}!</h2>
          <p className="text-lg mb-4">
            Your {subscriptionType === "one-time" ? "one-time" : "monthly"} contribution of ${amount} means the world to us.
          </p>
          <p className="text-sm mb-6">
            Your generosity helps us continue our mission to make a difference in the community. We’ve sent a receipt to{" "}
            <span className="font-semibold">{formData.email}</span>.
          </p>
          <button
            onClick={handleMakeAnotherDonation}
            className="bg-white text-blue-600 font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-gray-100 transition-all duration-200"
          >
            Make Another Donation
          </button>
          <div className="mt-4 flex justify-center space-x-2">
            <div className="w-3 h-3 bg-yellow-300 rounded-full animate-bounce"></div>
            <div className="w-3 h-3 bg-yellow-300 rounded-full animate-bounce delay-100"></div>
            <div className="w-3 h-3 bg-yellow-300 rounded-full animate-bounce delay-200"></div>
          </div>
        </div>
      ) : (
        // Checkout Form
        <>
          <h2 className="text-center mb-4 fw-semibold" style={{ color: "var(--text-color)", fontSize: "1.75rem" }}>
            Checkout
          </h2>
          <div className="mb-4 text-end">
            <p className="mb-1" style={{ fontSize: "1rem", color: "var(--text-color)" }}>
              Subtotal: ${amount}
            </p>
            <p className="fw-bold" style={{ fontSize: "1.25rem", color: "var(--text-color)" }}>
              Order Total: ${amount}
            </p>
          </div>
          <div className="mb-4 p-4 border rounded" style={{ borderColor: "var(--border-color)" }}>
            <p className="fw-bold mb-3" style={{ color: "var(--text-color)" }}>
              Contact Information
            </p>
            <div className="row g-3">
              <div className="col-md-6">
                <input
                  type="text"
                  name="firstname"
                  placeholder="First Name"
                  value={formData.firstname}
                  onChange={handleInputChange}
                  className="form-control p-2"
                  required
                />
              </div>
              <div className="col-md-6">
                <input
                  type="text"
                  name="lastname"
                  placeholder="Last Name"
                  value={formData.lastname}
                  onChange={handleInputChange}
                  className="form-control p-2"
                  required
                />
              </div>
              <div className="col-12">
                <input
                  type="email"
                  name="email"
                  placeholder="Email address for receipt"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="form-control p-2"
                  required
                />
              </div>
              <div className="col-12">
                <div className="input-group">
                  <select
                    name="countryCode"
                    value={formData.countryCode}
                    onChange={handleInputChange}
                    className="form-select p-2"
                    style={{ maxWidth: "100px" }}
                  >
                    <option value="+1">+1 (USA)</option>
                    <option value="+1">+1 (Canada)</option>
                    <option value="+44">+44 (UK)</option>
                    <option value="+91">+91 (India)</option>
                    <option value="+61">+61 (Australia)</option>
                    <option value="+49">+49 (Germany)</option>
                    <option value="+33">+33 (France)</option>
                    <option value="+86">+86 (China)</option>
                    <option value="+81">+81 (Japan)</option>
                    <option value="+55">+55 (Brazil)</option>
                    <option value="+27">+27 (South Africa)</option>
                  </select>
                  <input
                    type="tel"
                    name="mobile"
                    placeholder="Phone number"
                    value={formData.mobile}
                    onChange={handleInputChange}
                    className="form-control p-2"
                    pattern="[0-9]*"
                    required
                  />
                </div>
                {phoneError && <p className="text-danger text-sm mt-1">{phoneError}</p>}
              </div>
            </div>
          </div>
          <div className="mb-4 p-4 border rounded" style={{ borderColor: "var(--border-color)" }}>
            <p className="fw-bold mb-3" style={{ color: "var(--text-color)" }}>
              Payment Method
            </p>
            <p className="text-muted mb-2" style={{ fontSize: "0.875rem" }}>
              All transactions are secure and encrypted
            </p>
            <CardElement className="p-3 border rounded" style={{ backgroundColor: "#fff" }} />
          </div>
          {error && <p className="text-danger text-center mb-4">{error}</p>}
          <button
            onClick={handleSubmit}
            className={`btn w-100 py-3 text-white ${isFormValid() ? "btn-primary" : "btn-secondary"}`}
            style={{
              fontSize: "1.1rem",
              fontWeight: "500",
              borderRadius: "0.5rem",
              transition: "all 0.3s ease",
              opacity: isFormValid() ? 1 : 0.6,
              pointerEvents: isFormValid() ? "auto" : "none",
            }}
            disabled={!isFormValid() || isProcessing || !stripe}
          >
            {isProcessing ? "Processing..." : `Donate $${amount} ${subscriptionType}`}
          </button>
          <p className="text-muted text-center mt-3" style={{ fontSize: "0.875rem" }}>
            By clicking Donate, you authorize this donation and agree it is non-refundable and made voluntarily without
            exchange of goods or services.
          </p>
          <p className="text-muted text-center" style={{ fontSize: "0.75rem" }}>
            Secure payment by Stripe
          </p>
        </>
      )}
    </div>
  );
};

export default CheckoutForm;