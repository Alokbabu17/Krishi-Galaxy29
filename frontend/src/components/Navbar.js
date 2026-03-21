import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";
import makeInIndiaLogo from "../public/images/king2.png";

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <div className="logo">
          <img
            src={makeInIndiaLogo}
            alt="Make in India"
            style={{ height: "60px", objectFit: "contain" }}
          />
        </div>
      </div>

      <ul className="navbar-links">
        <li><Link to="/">Home /<br />होम पर जाएं</Link></li>
        <li><Link to="/yojna-info">Govt. Schemes /<br />सरकारी योजनायें</Link></li>
        <li><Link to="/check-balance">Check Balance /<br />बैलेंस देखे</Link></li>
        <li><Link to="/pest-check">Pest Detection /<br />कीट की जांच करे</Link></li>
        <li><Link to="/bhandar-ghar">Cold Storage Locator /<br />भण्डार घर खोजे</Link></li>

        {/* ✅ NEW: Krishi Lek-sha Voice Assistant */}
        <li><Link to="/krishi-lexa">Krishi Lek-sha 🌾<br />कृषि लेक्षा</Link></li>

      </ul>

      <div className="navbar-search">
        <input placeholder="Search / खोजें..." />
      </div>
    </nav>
  );
}