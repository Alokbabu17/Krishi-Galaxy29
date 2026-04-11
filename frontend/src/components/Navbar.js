import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";
import makeInIndiaLogo from "../public/images/king2.png";

export default function Navbar() {
  return (
    <nav className="navbar glass-navbar">
      <div className="navbar-brand">
        <Link to="/">
          <img
            src={makeInIndiaLogo}
            alt="Make in India"
            className="brand-logo"
          />
        </Link>
      </div>

      <ul className="navbar-links">
        <li>
          <Link to="/" className="nav-item">
            <span className="en">Home</span>
            <span className="hi">होम</span>
          </Link>
        </li>
        <li>
          <Link to="/yojna-info" className="nav-item">
            <span className="en">Govt. Schemes</span>
            <span className="hi">सरकारी योजनायें</span>
          </Link>
        </li>
        <li>
          <Link to="/check-balance" className="nav-item">
            <span className="en">Check Balance</span>
            <span className="hi">बैलेंस देखे</span>
          </Link>
        </li>
        <li>
          <Link to="/pest-check" className="nav-item">
            <span className="en">Pest Detection</span>
            <span className="hi">कीट जांच</span>
          </Link>
        </li>
        <li>
          <Link to="/bhandar-ghar" className="nav-item">
            <span className="en">Cold Storage</span>
            <span className="hi">भण्डार घर</span>
          </Link>
        </li>
        <li>
          <Link to="/krishi-lexa" className="nav-item highlight-item">
            <span className="en">Krishi Lek-sha 🌾</span>
            <span className="hi">कृषि लेक्षा</span>
          </Link>
        </li>
      </ul>

      <div className="navbar-search">
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input type="text" placeholder="खोजें / Search..." />
        </div>
      </div>
    </nav>
  );
}