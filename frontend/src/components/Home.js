import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Footer from "./Footer";
import "./Home.css";

export default function Home() {
  const [weather, setWeather] = useState(null);
  const [news, setNews] = useState([]);
  const [hindiNews, setHindiNews] = useState([]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(fetchWeather, showError);
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
    }
  }, []);

  useEffect(() => {
    async function fetchNews() {
      try {
        const apiKey = "5cf825d1ef6c429f964c76198066c8f4";
        // 1. General top headlines for the horizontal ribbon
        const urlGen = `https://newsapi.org/v2/top-headlines?country=in&apiKey=${apiKey}`;
        // 2. Specific Hindi agricultural news for the vertical scroller
        const urlHindi = `https://newsapi.org/v2/everything?q=कृषि OR किसान&language=hi&sortBy=publishedAt&apiKey=${apiKey}`;

        // Fetch General News
        const resGen = await fetch(urlGen);
        const dataGen = await resGen.json();
        if (dataGen.articles) {
          setNews(dataGen.articles.map((a) => a.title));
        }

        // Fetch Hindi Farming News
        const resHindi = await fetch(urlHindi);
        const dataHindi = await resHindi.json();
        if (dataHindi.articles) {
          // Filter out missing titles
          const validHindi = dataHindi.articles.filter(a => a.title && a.title !== "[Removed]");
          setHindiNews(validHindi.slice(0, 10)); // keep top 10
        }
      } catch (err) {
        console.error("News error:", err);
      }
    }
    fetchNews();
  }, []);

  const newsString = news.length > 0 
    ? news.join("  ✦  ") + "  ✦  " + news.join("  ✦  ")
    : "पीएम किसान सम्मान निधि की नई अपडेट ✦ स्मार्ट कृषि उपकरणों पर भारी छूट ✦ मौसम पूर्वानुमान: आने वाले दिनों में बारिश की संभावना ✦";

  return (
    <div className="home-dashboard">
      <header className="dashboard-header">
        <h1 className="main-title text-gradient-green">कृषि Galaxy</h1>
        <p className="main-subtitle">
          <span className="hi">डिजिटल भारत, उन्नत किसान</span>
          <span className="en">Digital India, Empowered Farmers</span>
        </p>
      </header>

      <div className="news-ribbon">
        <div className="ribbon-badge">
          <span className="blink-dot"></span>
          <span className="hi">ताज़ा खबर</span>
        </div>
        <div className="ribbon-scroll-container">
          <div className="ribbon-content">
            {newsString}
          </div>
        </div>
      </div>

      {/* NEW LAYOUT WRAPPER TO PREVENT UI STRETCHING */}
      <div className="home-layout-wrapper">
        
        {/* LEFT COMPONENT: The Main Bento Grid */}
        <div className="bento-grid">
          
          {/* Krishi Lexa AI */}
          <Link to="/krishi-lexa" className="bento-box bento-lexa-ai">
            <div className="lexa-aurora"></div>
            <div className="bento-content">
              <div className="bento-header">
                <span className="ai-badge">★ AI Power</span>
              </div>
              <div className="lexa-hero-text">
                <h2 className="title">कृषि Lek-sha</h2>
                <h3 className="subtitle text-gradient-blue">आपकी व्यक्तिगत AI कृषि विशेषज्ञ</h3>
                <p className="desc-en">Talk to your personal farming assistant. Get real-time insights on Soil Moisture, Temperature, & NDVI via satellite.</p>
              </div>
              <div className="lexa-action">
                <div className="voice-wave">
                  <span></span><span></span><span></span><span></span>
                </div>
                <span className="action-text">अभी पूछें | Ask Now</span>
              </div>
            </div>
          </Link>

          {/* Small Bento Boxes: Weather & Calendar (Perfectly packs next to Lexa) */}
          <div className="bento-box bento-weather">
            {weather ? (
               <div className="bento-content">
                  <div className="w-icon-container">
                    <img src={weather.icon} alt="weather" className="bento-w-icon" />
                  </div>
                  <div className="w-data">
                    <h2 className="w-temp">{weather.temp}°</h2>
                    <p className="w-cond">{weather.condition}</p>
                    <p className="w-city">📍 {weather.city}</p>
                  </div>
               </div>
            ) : (
              <div className="bento-content centered">
                <div className="loading-ring"></div>
                <p>Fetching Weather...</p>
              </div>
            )}
          </div>

          <div className="bento-box bento-calendar">
            <div className="bento-content centered text-center">
              <h3 className="cal-day">{new Date().toLocaleDateString("hi-IN", { weekday: "long" })}</h3>
              <h1 className="cal-date">{new Date().getDate()}</h1>
              <p className="cal-month">{new Date().toLocaleDateString("hi-IN", { month: "long" })}</p>
              <p className="cal-en">{new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}</p>
            </div>
          </div>

          {/* Action Boxes wrap around seamlessly underneath */}
          <Link to="/market-rate" className="bento-box action-box box-orange">
            <div className="bento-content">
              <div className="box-icon">📈</div>
              <h3 className="hi font-bold">बाज़ार भाव</h3>
              <p className="en">Market Rates</p>
            </div>
          </Link>

          <Link to="/drone-apply" className="bento-box action-box box-blue">
            <div className="bento-content">
              <div className="box-icon">🚁</div>
              <h3 className="hi font-bold">ड्रोन छिड़काव</h3>
              <p className="en">Drone Services</p>
            </div>
          </Link>

          <Link to="/pest-check" className="bento-box action-box box-green">
            <div className="bento-content">
              <div className="box-icon">🐛</div>
              <h3 className="hi font-bold">कीट जांच</h3>
              <p className="en">Pest Control</p>
            </div>
          </Link>

          

          <Link to="/bhandar-ghar" className="bento-box action-box box-purple">
            <div className="bento-content">
              <div className="box-icon">❄️</div>
              <h3 className="hi font-bold">भण्डार घर</h3>
              <p className="en">Cold Storage</p>
            </div>
          </Link>

        </div>

        {/* RIGHT COMPONENT: Isolated Sidebar for News so it doesn't stretch the grid */}
        <div className="right-sidebar">
          <div className="bento-box bento-hindi-news">
            <div className="bento-content">
              <h3 className="news-sidebar-title">
                <span className="icon">📰</span> कृषि समाचार
              </h3>
              <div className="vertical-scroll-container">
                <div className="vertical-scroll-content">
                  {hindiNews.length > 0 ? (
                    hindiNews.map((article, idx) => (
                      <div className="news-card" key={idx}>
                        <a href={article.url} target="_blank" rel="noopener noreferrer">
                          <p className="news-headline">{article.title}</p>
                          <span className="news-source text-gradient-green">{article.source.name}</span>
                        </a>
                      </div>
                    ))
                  ) : (
                    <>
                      <div className="news-card"><p className="news-headline">किसानों के लिए नई योजना की घोषणा...</p><span className="news-source text-gradient-green">Krishi Jagran</span></div>
                      <div className="news-card"><p className="news-headline">आने वाले दिनों में बारिश होने की संभावना...</p><span className="news-source text-gradient-green">Weather Update</span></div>
                      <div className="news-card"><p className="news-headline">बाज़ार भाव में आज की तेज़ गिरावट...</p><span className="news-source text-gradient-green">Mandi News</span></div>
                    </>
                  )}
                  {/* Duplicate the items to allow seamless vertical scroll loop */}
                  {hindiNews.length > 0 && hindiNews.map((article, idx) => (
                    <div className="news-card" key={idx + "dup"}>
                      <a href={article.url} target="_blank" rel="noopener noreferrer">
                        <p className="news-headline">{article.title}</p>
                        <span className="news-source text-gradient-green">{article.source.name}</span>
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
      
      <Footer />
    </div>
  );
}