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

const AuthModal: React.FC<AuthModalProps> = ({
  mode,
  onClose,
  onToggleMode,
}) => {
  const [firstname, setfirstname] = useState("");
  const [lastname, setlastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("host");
  const [showPassword, setShowPassword] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [message, setMessage] = useState<{
    text: string;
    type: "error" | "success";
  } | null>(null);
  const { login, register } = useAuth();

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 50);
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "auto";
    };
  }, [onClose]);
  const navigate = useNavigate();

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    // Email validation
    if (!validateEmail(email)) {
      setMessage({
        text: "Please enter a valid email address (e.g., user@example.com)",
        type: "error",
      });
      return;
    }

    try {
      if (mode === "signup") {
        // Password validation: at least 8 characters and contains at least one special character
        const specialCharRegex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
        if (password.length < 8) {
          setMessage({
            text: "Password must be at least 8 characters long",
            type: "error",
          });
          return;
        }
        if (!specialCharRegex.test(password)) {
          setMessage({
            text: "Password must contain at least one special character",
            type: "error",
          });
          return;
        }
        await register({ firstname, lastname, email, password, role });
        setMessage({ text: "User registered successfully", type: "success" });
        toast.success("Registered successfully");
      } else {
        try {
          await login(email, password);
        } catch (loginError: any) {
          throw new Error("Invalid credentials");
        }
      }
      if (!specialCharRegex.test(password)) {
        setMessage({
          text: "Password must contain at least one special character",
          type: "error",
        });
        return;
      }
      const successMessage = await register({ firstname, lastname, email, password, role });
      setMessage({ text: successMessage || "User registered successfully", type: "success" });
      toast.success("Registered successfully");
      onClose();
    } else {
      await login(email, password);
      onClose();
    } catch (err: any) {
      setMessage({
        text: err.message || err.response?.data?.message || "An error occurred",
        type: "error",
      });
    }
  } catch (err: any) {
    setMessage({
      text: err.message || "An error occurred",
      type: "error",
    });
  }
};

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="auth-modal-overlay" onClick={handleClose}>
      <div
        className={`auth-modal-container ${isVisible ? "visible" : ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="auth-modal-header">
          <div className="auth-modal-logo">
            <Heart size={24} className="auth-logo-icon" />
            <h2>{mode === "login" ? "Welcome Back" : "Join COMMONCHANGE"}</h2>
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
                  onChange={(e) => setfirstname(e.target.value)}
                  required
                  className="auth-input"
                  placeholder="Enter your first name"
                />
              </div>
              <div className="auth-form-group">
                <label htmlFor="lastname">Last Name</label>
                <input
                  id="lastname"
                  type="text"
                  value={lastname}
                  onChange={(e) => setlastname(e.target.value)}
                  required
                  className="auth-input"
                  placeholder="Enter your last name"
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
              />
              <button
                type="button"
                className="password-toggle-button"
                onClick={togglePasswordVisibility}
                aria-label={showPassword ? "Hide password" : "Show password"}
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
              >
                <Key size={16} className="me-2" />
                Forgot Password?
              </button>
            </div>
          )}

          {mode === "signup" && (
            <div className="auth-form-group">
              <label htmlFor="role">Role</label>
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="auth-input"
              >
                <option value="host">Host</option>
              </select>
            </div>
          )}

          <button type="submit" className="auth-submit-button">
            {mode === "login" ? "Login" : "Sign Up"}
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