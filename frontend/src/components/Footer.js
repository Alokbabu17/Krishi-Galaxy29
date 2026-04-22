import React from "react";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="bento-footer">
      <div className="footer-layout">
        
        {/* Brand Column */}
        <div className="footer-col brand-col">
          <div className="brand-logo">
            <span className="icon">🌱</span>
            <span className="hi">कृषि Galaxy</span>
          </div>
          <p className="en text-muted">Empowering modern Indian farmers through artificial intelligence and real-time connectivity.</p>
        </div>

        {/* Links Column */}
        <div className="footer-col links-col">
          <h4 className="hi text-white">त्वरित लिंक</h4>
          <p className="en subtitle">Quick Links</p>
          <ul>
            <li><a href="/market-rate">Market Rates / बाज़ार भाव</a></li>
            <li><a href="/smart-sichai">Smart Irrigation / स्मार्ट सिंचाई</a></li>
            <li><a href="/drone-apply">Drone Sprays / ड्रोन सेवा</a></li>
          </ul>
        </div>

        {/* Contact Column */}
        <div className="footer-col contact-col">
          <h4 className="hi text-white">संपर्क करें</h4>
          <p className="en subtitle">Contact Us</p>
          <div className="contact-info">
            <div className="info-pill">
              <span>📞</span> 1800-180-1551
            </div>
            <div className="info-pill">
              <span>✉️</span> support@krishigalaxy.in
            </div>
          </div>
        </div>

      </div>

      <div className="footer-bottom">
        <p className="en">© 2026 Krishi Galaxy Portal. All rights reserved.</p>
        <p className="hi highlighted">किसानों की उन्नति, देश की प्रगति</p>
      </div>
    </footer>
  );
}
