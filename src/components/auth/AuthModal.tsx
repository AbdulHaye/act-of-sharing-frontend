import type React from "react";
import { useState, useEffect } from "react";
import { X, Eye, EyeOff, Heart, Key } from "lucide-react";
import "../../styles/auth-modal.css";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

interface AuthModalProps {
  mode: "login" | "signup";
  onClose: () => void;
  onToggleMode: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ mode, onClose, onToggleMode }) => {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("host");
  const [showPassword, setShowPassword] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{
    text: string;
    type: "error" | "success";
  } | null>(null);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const { login, register, resendVerificationEmail } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 50);
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (showVerificationModal) {
          setShowVerificationModal(false);
        } else {
          onClose();
        }
      }
    };
    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "auto";
    };
  }, [onClose, showVerificationModal]);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(?:[a-zA-Z]{2,})$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setIsLoading(true);

    if (!validateEmail(email)) {
      setMessage({
        text: "Please enter a valid email address",
        type: "error",
      });
      setIsLoading(false);
      return;
    }

    try {
      if (mode === "signup") {
        const specialCharRegex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
        if (password.length < 8) {
          setMessage({
            text: "Password must be at least 8 characters long",
            type: "error",
          });
          setIsLoading(false);
          return;
        }
        if (!specialCharRegex.test(password)) {
          setMessage({
            text: "Password must contain at least one special character",
            type: "error",
          });
          setIsLoading(false);
          return;
        }
        await register({ firstname, lastname, email, password, role });
        setShowVerificationModal(true);
        toast.success("Registration successful! Please check your email to verify.");
      } else {
        await login(email, password);
        onClose();
      }
    } catch (err: any) {
      const errorMessage = err.message || err.response?.data?.message || "An error occurred";
      if (err.response?.status === 400) {
        setMessage({ text: "Invalid credentials", type: "error" });
      } else if (err.response?.status === 403) {
        setMessage({ text: "Please verify your email before logging in", type: "error" });
      } else {
        setMessage({ text: errorMessage, type: "error" });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendEmail = async () => {
    setIsLoading(true); // Start loading
    try {
      const response = await fetch("http://localhost:5000/api/users/resend-verification-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (response.ok) {
        toast.success("Verification email resent successfully. Please check your email.");
      } else {
        throw new Error(data.message || "Failed to resend verification email");
      }
    } catch (err: any) {
      const errorMessage = err.message || "Failed to resend verification email";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  const handleOpenEmail = () => {
    const emailProviders = [
      { domain: "gmail.com", url: "https://mail.google.com" },
      { domain: "outlook.com", url: "https://outlook.live.com" },
      { domain: "yahoo.com", url: "https://mail.yahoo.com" },
      { domain: "icloud.com", url: "https://www.icloud.com/mail" },
    ];

    const emailDomain = email.split("@")[1]?.toLowerCase();
    const provider = emailProviders.find((p) => p.domain === emailDomain);
    const emailUrl = provider ? provider.url : "https://mail.google.com";

    window.open(emailUrl, "_blank");
    setShowVerificationModal(false);
    onClose();
  };

  const handleClose = () => {
    setIsVisible(false);
    setShowVerificationModal(false);
    setTimeout(onClose, 300);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  if (showVerificationModal) {
    return (
      <div className="auth-modal-overlay">
        <div
          className={`auth-modal-container ${isVisible ? "visible" : ""}`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="auth-modal-header">
            <div className="auth-modal-logo">
              <Heart size={24} className="auth-logo-icon" />
              <h2>Verify Your Email</h2>
            </div>
            <button className="auth-close-button" onClick={handleClose}>
              <X size={20} />
            </button>
          </div>
          <div className="auth-form">
            <p>
              A verification email has been sent to <strong>{email}</strong>. Please
              check your inbox or spam folder and verify your email to log in.
            </p>
            <div className="auth-form-group">
              <button
                type="button"
                className="auth-submit-button"
                onClick={handleOpenEmail}
                disabled={isLoading}
              >
                Open Email
              </button>
              <button
                type="button"
                className="auth-link-button mt-3"
                onClick={handleResendEmail}
                disabled={isLoading}
              >
                Resend Verification Email
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-modal-overlay">
      <div
        className={`auth-modal-container ${isVisible ? "visible" : ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="auth-modal-header">
          <div className="auth-modal-logo">
            <Heart size={24} className="auth-logo-icon" />
            <h2>{mode === "login" ? "Welcome Back" : "Acts of Sharing"}</h2>
          </div>
          <button className="auth-close-button" onClick={handleClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {message && (
            <div
              className={`alert ${
                message.type === "error" ? "alert-danger" : "alert-success"
              }`}
            >
              {message.text}
            </div>
          )}

          {mode === "signup" && (
            <div className="auth-form-row">
              <div className="auth-form-group">
                <label htmlFor="firstname">First Name</label>
                <input
                  id="firstname"
                  type="text"
                  value={firstname}
                  onChange={(e) => setFirstname(e.target.value)}
                  required
                  className="auth-input"
                  placeholder="Enter your first name"
                  disabled={isLoading}
                />
              </div>
              <div className="auth-form-group">
                <label htmlFor="lastname">Last Name</label>
                <input
                  id="lastname"
                  type="text"
                  value={lastname}
                  onChange={(e) => setLastname(e.target.value)}
                  required
                  className="auth-input"
                  placeholder="Enter your last name"
                  disabled={isLoading}
                />
              </div>
            </div>
          )}

          <div className="auth-form-group">
            <label htmlFor="email">Email address</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="auth-input"
              placeholder="Enter your email"
              disabled={isLoading}
            />
          </div>

          <div className="auth-form-group">
            <label htmlFor="password">Password</label>
            <div className="password-input-container">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="auth-input"
                placeholder="Enter your password"
                disabled={isLoading}
              />
              <button
                type="button"
                className="password-toggle-button"
                onClick={togglePasswordVisibility}
                aria-label={showPassword ? "Hide password" : "Show password"}
                disabled={isLoading}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          {mode === "login" && (
            <div className="auth-form-group text-right">
              <button
                type="button"
                className="auth-link-button"
                onClick={() => {
                  onClose();
                  navigate("/reset-password");
                }}
                disabled={isLoading}
              >
                <Key size={16} className="me-2" />
                Forgot Password?
              </button>
            </div>
          )}

          <button type="submit" className="auth-submit-button" disabled={isLoading}>
            {isLoading ? (
              <div className="spinner-border spinner-border-sm text-light" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            ) : (
              mode === "login" ? "Login" : "Sign Up"
            )}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            {mode === "login"
              ? "Don't have an account?"
              : "Already have an account?"}
            <button
              type="button"
              className="auth-toggle-button"
              onClick={onToggleMode}
              disabled={isLoading}
            >
              {mode === "login" ? "Sign Up" : "Login"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;