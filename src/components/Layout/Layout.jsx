import React, { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase";
import "./Layout.css";

const Layout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path);
  };

  const handleNavigation = (path) => {
    navigate(path);
    setIsMobileMenuOpen(false); // Close menu after navigation on mobile
  };

  return (
    <div className="layout">
      {/* Mobile Menu Button */}
      <button
        className="mobile-menu-btn"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        aria-label="Toggle menu"
      >
        <span className="hamburger-icon">{isMobileMenuOpen ? "✕" : "☰"}</span>
      </button>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div
          className="mobile-overlay"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`sidebar ${isMobileMenuOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <div className="logo">
            <span className="logo-icon">📅</span>
            <span className="logo-text">Eisenhower</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <button
            className={`nav-item ${
              isActive("/") && !isActive("/dashboard") && !isActive("/settings")
                ? "active"
                : ""
            }`}
            onClick={() => handleNavigation("/")}
          >
            <span className="nav-icon">📆</span>
            <span className="nav-text">Calendario</span>
          </button>

          <button
            className={`nav-item ${isActive("/dashboard") ? "active" : ""}`}
            onClick={() => handleNavigation("/dashboard")}
          >
            <span className="nav-icon">📊</span>
            <span className="nav-text">Dashboard</span>
          </button>

          <button
            className={`nav-item ${isActive("/settings") ? "active" : ""}`}
            onClick={() => handleNavigation("/settings")}
          >
            <span className="nav-icon">⚙️</span>
            <span className="nav-text">Configuración</span>
          </button>
        </nav>

        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">
              {auth.currentUser?.email?.[0].toUpperCase()}
            </div>
            <div className="user-details">
              <div className="user-email">{auth.currentUser?.email}</div>
            </div>
          </div>
          <button className="logout-btn" onClick={handleSignOut}>
            <span>🚪</span>
            <span>Salir</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
