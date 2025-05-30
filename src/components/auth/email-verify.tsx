import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const VerifyEmail = () => {
  const [message, setMessage] = useState("Verifying your email...");
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const token = new URLSearchParams(location.search).get("token");
    if (token) {
      axios
        .get(`/api/users/verify-email?token=${token}`)
        .then((response) => {
          setMessage(response.data.message);
          setTimeout(() => navigate("/login"), 2000); // Redirect to login after 2 seconds
        })
        .catch((error) => {
          setMessage(
            error.response?.data?.message || "Email verification failed"
          );
        });
    } else {
      setMessage("No verification token provided.");
    }
  }, [location, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-6 bg-white rounded shadow-md">
        <h1 className="text-2xl font-bold mb-4">Email Verification</h1>
        <p>{message}</p>
      </div>
    </div>
  );
};

export default VerifyEmail;