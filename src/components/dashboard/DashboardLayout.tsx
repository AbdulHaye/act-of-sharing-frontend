"use client";

import React, { type ReactNode, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Heart,
  Home,
  Calendar,
  Users,
  Settings,
  PieChart,
  DollarSign,
  LogOut,
  Menu,
  X,
  Bell,
  User,
  ChevronDown,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useEvent } from "../../context/EventContext";
import "../../styles/dashboard.css";

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const location = useLocation();
  const { user, logout } = useAuth();

  const { getHostSpecificEvents } = useEvent(); // Only import getHostSpecificEvents
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const [notificationsOpen, setNotificationsOpen] = React.useState(false);

  const userDropdownRef = useRef<HTMLDivElement>(null);
  const notificationsDropdownRef = useRef<HTMLDivElement>(null);

  // Remove the useEffect that fetches events here, as it should be handled by child components
  // Child components like InvitePage will fetch events as needed

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userDropdownRef.current &&
        !userDropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
      if (
        notificationsDropdownRef.current &&
        !notificationsDropdownRef.current.contains(event.target as Node)
      ) {
        setNotificationsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Get user details from AuthContext
  const userName =
    user?.firstname && user?.lastname
      ? `${user.firstname} ${user.lastname}`
      : "User";
  const userRole =
    (user?.role?.toLowerCase() as "admin" | "host" | "guest") || "host";

  const getNavItems = () => {
    const commonItems = [
      {
        path: `/dashboard/${userRole}`,
        icon: <Home size={20} />,
        label: "Dashboard",
      },
      {
        path: "/dashboard/my-events",
        icon: <Calendar size={20} />,
        label:
          user.role === "guest" || user.role === "admin"
            ? "Events"
            : "My Events",
      },
      {
        path: "/dashboard/profile",
        icon: <User size={20} />,
        label: "Profile",
      },
      {
        path: "/dashboard/contributions",
        icon: <DollarSign size={20} />,
        label: "Contributions",
      },
    ];

    if (userRole === "admin") {
      return [
        ...commonItems,
        { path: "/dashboard/users", icon: <Users size={20} />, label: "Users" },
        // { path: "/dashboard/analytics", icon: <PieChart size={20} />, label: "Analytics" },
        // { path: "/dashboard/finances", icon: <DollarSign size={20} />, label: "Finances" },
        // { path: "/dashboard/settings", icon: <Settings size={20} />, label: "Settings" },
      ];
    } else if (userRole === "host") {
      return [
        ...commonItems,
        { path: "/dashboard/invite", icon: <Users size={20} />, label: "Invite" },
        // { path: "/dashboard/earnings", icon: <DollarSign size={20} />, label: "Earnings" },
      ];
    } else {
      return [
        ...commonItems,
        // { path: "/dashboard/find-events", icon: <Calendar size={20} />, label: "Find Events" },
        // { path: "/dashboard/donations", icon: <DollarSign size={20} />, label: "My Donations" },
      ];
    }
  };

  const navItems = getNavItems();

  // Generate notifications based on real events (using a mock approach since events aren't fetched here)
  const notifications = [
    {
      id: 1,
      text: "No upcoming events",
      time: new Date().toLocaleTimeString(),
    },
  ]; // Use a default notification since events aren't fetched here

  return (
    <div className="dashboard-container">
      {sidebarOpen && (
        <div className="sidebar-overlay d-lg-none" onClick={closeSidebar}></div>
      )}

      <div className={`dashboard-sidebar ${sidebarOpen ? "show" : ""}`}>
        <div className="sidebar-header">
          <Link to="/" className="sidebar-brand">
            <Heart size={24} className="text-primary me-2" />
            <span>COMMONCHANGE</span>
          </Link>
          <button className="sidebar-close d-lg-none" onClick={closeSidebar}>
            <X size={20} />
          </button>
        </div>

        <div className="sidebar-user">
          <div className="user-avatar">{userName.charAt(0).toUpperCase()}</div>
          <div className="user-info">
            <h6 className="mb-0">{userName}</h6>
            <span className="user-role">
              {userRole.charAt(0).toUpperCase() + userRole.slice(1)}
            </span>
          </div>
        </div>

        <ul className="sidebar-nav">
          {navItems.map((item) => (
            <li key={item.path} className="sidebar-item">
              <Link
                to={item.path}
                className={`sidebar-link ${
                  location.pathname === item.path ? "active" : ""
                }`}
                onClick={closeSidebar}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
          <li className="sidebar-item mt-auto">
            <Link
              to="/"
              className="sidebar-link text-danger"
              onClick={() => {
                closeSidebar(), logout();
              }}
            >
              <LogOut size={20} />
              <span>Logout</span>
            </Link>
          </li>
        </ul>
      </div>

      <div className="dashboard-main">
        <header className="dashboard-header">
          <div className="header-left">
            <button className="menu-toggle d-lg-none" onClick={toggleSidebar}>
              <Menu size={24} />
            </button>
            <h1 className="header-title">
              {navItems.find((item) => item.path === location.pathname)
                ?.label || "Dashboard"}
            </h1>
          </div>

          <div className="header-right">
            <div className="dropdown" ref={notificationsDropdownRef}>
              <button
                className="btn btn-icon position-relative"
                onClick={() => {
                  setNotificationsOpen(!notificationsOpen);
                  setDropdownOpen(false);
                }}
              >
                <Bell size={20} />
                <span className="notification-badge">
                  {notifications.length}
                </span>
              </button>

              <div
                className={`dropdown-menu dropdown-menu-end notification-dropdown ${
                  notificationsOpen ? "show" : ""
                }`}
              >
                <div className="dropdown-header d-flex justify-content-between align-items-center">
                  <span>Notifications</span>
                  <a href="#" className="text-primary small">
                    Mark all as read
                  </a>
                </div>
                <div className="notification-list">
                  {notifications.map((notification) => (
                    <a
                      key={notification.id}
                      href="#"
                      className="dropdown-item notification-item"
                    >
                      <div className="notification-icon">
                        <Bell size={16} />
                      </div>
                      <div className="notification-content">
                        <p className="mb-0">{notification.text}</p>
                        <span className="notification-time">
                          {notification.time}
                        </span>
                      </div>
                    </a>
                  ))}
                </div>
                <div className="dropdown-footer">
                  <a href="#" className="text-center d-block">
                    View all notifications
                  </a>
                </div>
              </div>
            </div>

            <div className="dropdown user-dropdown mr-3 mb-3" ref={userDropdownRef}>
              <button
                className="btn btn-icon user-dropdown-toggle"
                onClick={() => {
                  setDropdownOpen(!dropdownOpen);
                  setNotificationsOpen(false);
                }}
              >
                <div className="user-avatar-sm">
                  {userName.charAt(0).toUpperCase()}
                </div>
                {/* <span className="d-none d-md-inline ms-2 user-name">
                  {userName}
                </span> */}
                {/* <ChevronDown size={14} className="ms-2" /> */}
              </button>

              <div
                className={`dropdown-menu dropdown-menu-end ${
                  dropdownOpen ? "show" : ""
                }`}
              >
                <div className="dropdown-header">
                  <span>Signed in as</span>
                  <h6 className="mb-0">{userName}</h6>
                </div>
                <Link to="/dashboard/profile" className="dropdown-item">
                  <User size={16} className="me-2" />
                  <span>Profile</span>
                </Link>
                <div className="dropdown-divider"></div>
                <Link
                  to="/logout"
                  className="dropdown-item text-danger"
                  onClick={logout}
                >
                  <LogOut size={16} className="me-2" />
                  <span>Logout</span>
                </Link>
              </div>
            </div>
          </div>
        </header>

        <main className="dashboard-content">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;