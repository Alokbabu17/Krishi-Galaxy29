import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (path) => location.pathname === path;

  return (
    <div className={`navbar-wrapper ${scrolled ? "scrolled" : ""}`}>
      <nav className="dock-navbar">
        <div className="navbar-brand">
          <Link to="/">
            <div className="brand-logo-text">
              <span className="icon">🌱</span>
              <div className="text-col">
                <span className="brand-hi">कृषि Galaxy</span>
                <span className="brand-en">Farmer Portal</span>
              </div>
            </div>
          </Link>
        </div>

        <ul className="navbar-links">
          <li>
            <Link to="/" className={`nav-pill ${isActive("/") ? "active" : ""}`}>
              <span className="icon">🏠</span>
              <div className="pill-text">
                <span className="hi">होम</span>
                <span className="en">Home</span>
              </div>
            </Link>
          </li>
          <li>
            <Link to="/pest-check" className={`nav-pill ${isActive("/pest-check") ? "active" : ""}`}>
              <span className="icon">🐛</span>
              <div className="pill-text">
                <span className="hi">कीट जांच</span>
                <span className="en">Pest Check</span>
              </div>
            </Link>
          </li>
          <li>
            <Link to="/bhandar-ghar" className={`nav-pill ${isActive("/bhandar-ghar") ? "active" : ""}`}>
              <span className="icon">❄️</span>
              <div className="pill-text">
                <span className="hi">भण्डार घर</span>
                <span className="en">Storage</span>
              </div>
            </Link>
          </li>
          <li>
            <Link to="/krishi-lexa" className={`nav-pill glow-pill ${isActive("/krishi-lexa") ? "active" : ""}`}>
              <span className="icon ai-icon">✨</span>
              <div className="pill-text">
                <span className="hi ai-text">कृषि लेक्सा</span>
                <span className="en ai-text">AI Assistant</span>
              </div>
            </Link>
          </li>
        </ul>

        <div className="navbar-search">
          <div className="dock-search">
            <span className="search-icon">🔍</span>
            <input type="text" placeholder="खोजें / Search..." />
          </div>
        </div>
      </nav>
    </div>
  );
}