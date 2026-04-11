import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Home.css";

export default function Home() {
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(fetchWeather, showError);
    } else {
      alert("❌ Geolocation not supported");
    }

    async function fetchWeather(position) {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;

      const apiKey = "d9bbc4482ebd49a7838145054251709";
      const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${lat},${lon}&lang=hi`;

      try {
        const response = await fetch(url);
        const data = await response.json();
        setWeather({
          city: data.location.name,
          temp: data.current.temp_c,
          condition: data.current.condition.text,
          icon: data.current.condition.icon,
        });
      } catch (err) {
        console.error("Weather fetch error:", err);
      }
    }

    function showError(error) {
      console.error("Location error:", error);
      alert("❌ Location fetch failed");
    }
  }, []);
  const [news, setNews] = useState([]);

useEffect(() => {
  async function fetchNews() {
    try {
      const apiKey = "5cf825d1ef6c429f964c76198066c8f4"; // apna key daal
      const url = `https://newsapi.org/v2/top-headlines?country=in&apiKey=${apiKey}`;


      const response = await fetch(url);
      const data = await response.json();
      if (data.articles) {
        setNews(data.articles.map(a => a.title));
      }
    } catch (err) {
      console.error("News fetch error:", err);
    }
  }
  fetchNews();
}, []);


  return (
    <div className="home-container">
      <div className="home-overlay">
        <div className="hero-glass">
          <h1 className="hero-title">🌱 कृषि Galaxy</h1>
          <h2 className="hero-subtitle">भारतीय किसान पोर्टल</h2>
          
          {/* ✅ News Ticker */}
          <div className="news-ticker-glass">
            <marquee behavior="scroll" direction="left" scrollamount="5">
              {news.length > 0 ? news.join("  ✦  ") : "⏳ समाचार लोड हो रहा है..."}
            </marquee>
          </div>
        </div>

        <div className="main-layout">
          <div className="glass-widget calendar-widget">
            <div className="calendar-day">
              {new Date().toLocaleDateString("hi-IN", { weekday: "long" })}
            </div>
            <div className="calendar-date">{new Date().getDate()}</div>
            <div className="calendar-month-year">
              {new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}
            </div>
          </div>

          <div className="button-grid">
            <Link to="/market-rate" className="glass-button btn-market">
              <div className="btn-content">
                <h3>फसलों का बाजार भाव देखें</h3>
                <p>Check crops market rate</p>
              </div>
            </Link>

            <Link to="/drone-apply" className="glass-button btn-drone">
              <div className="btn-content">
                <h3>ड्रोन छिड़काव के लिए आवेदन करें</h3>
                <p>Apply for Drone Sprinkling pesticide</p>
              </div>
            </Link>

            <Link to="/pest-check" className="glass-button btn-pest">
              <div className="btn-content">
                <h3>खेतों में पेस्ट की जांच करें</h3>
                <p>Check for pest in Field</p>
              </div>
            </Link>

            <Link to="/training-apply" className="glass-button btn-training">
              <div className="btn-content">
                <h3>कृषि प्रशिक्षण सत्र के लिए आवेदन करें</h3>
                <p>Apply for Agro Training Session</p>
              </div>
            </Link>

            <Link to="/krishi-lexa" className="glass-button btn-lexa">
              <div className="btn-content">
                <h3>🌾 कृषी-लेक्सा</h3>
                <p>Ask your AI Voice Assistant</p>
              </div>
            </Link>

            <Link to="/more" className="glass-button btn-more">
              <div className="btn-content">
                <h3>🔍 अन्य सेवाएं</h3>
                <p>Explore more features</p>
              </div>
            </Link>

            <Link to="/bhandar-ghar" className="glass-button btn-bhandar">
              <div className="btn-content">
                <h3>🔎 भण्डार घर खोजें</h3>
                <p>Find nearest storage houses</p>
              </div>
            </Link>

            <Link to="/smart-sichai" className="glass-button btn-sichai">
              <div className="btn-content">
                <h3>💧 स्मार्ट सिंचाई</h3>
                <p>Smart Irrigation Monitoring</p>
              </div>
            </Link>
          </div>

          {weather ? (
            <div className="glass-widget weather-widget">
              <h3>🌦 मौसम अपडेट</h3>
              <p className="w-loc">📍 {weather.city}</p>
              <p className="w-temp">🌡 {weather.temp}°C</p>
              <p className="w-cond">{weather.condition}</p>
              <img src={weather.icon} alt="weather icon" className="w-icon" />
            </div>
          ) : (
            <div></div>
          )}
        </div>
      </div>
    </div>
  );
}