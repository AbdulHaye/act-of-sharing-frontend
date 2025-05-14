"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Link, useLocation } from "react-router-dom"
import { Heart } from "lucide-react"
import "../../styles/navbar.css"
import AuthModal from "../auth/AuthModal"
import { useAuth } from "../../context/AuthContext"

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formMode, setFormMode] = useState<"login" | "signup">("login")
  const location = useLocation()
  const { user, logout, isAuthenticated } = useAuth()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  useEffect(() => {
    setIsMenuOpen(false)
  }, [location])

  const handleLoginClick = () => {
    setFormMode("login")
    setIsModalOpen(true)
  }

  const handleSignupClick = () => {
    setFormMode("signup")
    setIsModalOpen(true)
  }

  return (
    <>
      <nav className={`navbar navbar-expand-lg fixed-top ${isScrolled ? "bg-white shadow-sm" : "bg-transparent"}`}>
        <div className="container">
          <Link to="/" className="navbar-brand d-flex align-items-center">
            <Heart size={28} className="me-2 text-primary" />
            <span className="fw-semibold">COMMONCHANGE</span>
          </Link>

          <button
            className="navbar-toggler"
            type="button"
            onClick={toggleMenu}
            aria-controls="navbarNav"
            aria-expanded={isMenuOpen}
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className={`collapse navbar-collapse ${isMenuOpen ? "show" : ""}`} id="navbarNav">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link to="/" className={`nav-link ${location.pathname === "/" ? "active" : ""}`}>
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  to="/how-it-works"
                  className={`nav-link ${location.pathname === "/how-it-works" ? "active" : ""}`}
                >
                  How It Works
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/about" className={`nav-link ${location.pathname === "/about" ? "active" : ""}`}>
                  About Us
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/dashboard" className={`nav-link ${location.pathname === "/dashboard" ? "active" : ""}`}>
                  My Events
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/create-event" className="btn btn-primary ms-lg-3 mt-2 mt-lg-0">
                  Host a Meal
                </Link>
              </li>
            </ul>
          </div>
          <div className="ms-auto d-flex gap-2 align-items-center">
            {isAuthenticated ? (
              <>
                <span>{user?.firstName}</span>
                <button className="btn btn-outline-primary" onClick={logout} style={{ minWidth: "80px" }}>
                  Logout
                </button>
                <Link to="/dashboard" className="btn btn-primary" style={{ minWidth: "80px" }}>
                  Dashboard
                </Link>
              </>
            ) : (
              <>
                <button className="btn btn-outline-primary" onClick={handleLoginClick} style={{ minWidth: "80px" }}>
                  Login
                </button>
                <button className="btn btn-primary" onClick={handleSignupClick} style={{ minWidth: "80px" }}>
                  Sign Up
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      {isModalOpen && (
        <AuthModal
          mode={formMode}
          onClose={() => setIsModalOpen(false)}
          onToggleMode={() => setFormMode(formMode === "login" ? "signup" : "login")}
        />
      )}
    </>
  )
}

export default Navbar