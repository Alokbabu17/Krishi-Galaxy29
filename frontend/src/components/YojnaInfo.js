import React, { useState } from 'react';
import './YojnaInfo.css';

const dummyYojnas = [
  {
    id: 1,
    titleEn: "PM-Kisan Samman Nidhi",
    titleHi: "पीएम-किसान सम्मान निधि",
    date: "12 April 2026",
    category: "Financial Support",
    shortDesc: "Direct income support of ₹6,000 per year for farmer families.",
    longDesc: "Under the Pradhan Mantri Kisan Samman Nidhi (PM-KISAN), landholding farmer families are provided with a financial benefit of ₹6,000 per annum per family. This amount is disbursed in three equal installments of ₹2,000 every four months. The scheme aims to supplement the financial needs of farmers to procure various inputs related to agriculture and allied activities.",
    eligibility: "All landholding eligible farmer families (subject to exclusion criteria).",
    benefits: "₹6,000 deposited directly to bank accounts annually."
  },
  {
    id: 2,
    titleEn: "Pradhan Mantri Fasal Bima Yojana (PMFBY)",
    titleHi: "प्रधान मंत्री फसल बीमा योजना",
    date: "05 March 2026",
    category: "Insurance",
    shortDesc: "Comprehensive crop insurance from pre-sowing to post-harvest.",
    longDesc: "PMFBY provides comprehensive insurance cover against failure of the crop, thus helping in stabilizing the income of farmers. The scheme covers all food & oilseed crops and annual commercial/horticultural crops for which past yield data is available. Premium rates to be paid by farmers are very low and balance premium is paid by the Government.",
    eligibility: "All farmers growing notified crops in a notified area.",
    benefits: "Risk coverage against natural calamities, pests, and diseases."
  },
  {
    id: 3,
    titleEn: "Kisan Credit Card (KCC) Scheme",
    titleHi: "किसान क्रेडिट कार्ड (KCC)",
    date: "22 February 2026",
    category: "Credit/Loan",
    shortDesc: "Single window loan system to meet the credit needs of farmers.",
    longDesc: "The KCC scheme was designed to provide adequate and timely credit support from the banking system under a single window. Flexible and simplified procedures make it easier for farmers to manage their short-term credit requirements for cultivation, post-harvest expenses, and working capital for maintenance.",
    eligibility: "Owner cultivators as well as tenant farmers, sharecroppers.",
    benefits: "Low interest rates, flexible repayment rules."
  },
  {
    id: 4,
    titleEn: "Soil Health Card Scheme",
    titleHi: "मृदा स्वास्थ्य कार्ड योजना",
    date: "14 January 2026",
    category: "Agricultural Inputs",
    shortDesc: "Provides farmers with the nutrient status of their soil.",
    longDesc: "This scheme aims at promoting soil test based and balanced use of fertilizers to enable farmers to realize higher yields at lower cost. The card contains status of soil with respect to 12 parameters and advises farmers on fertilizers and their quantities they should apply.",
    eligibility: "All uniform landholding farmers.",
    benefits: "Better yields, saving on fertilizer costs."
  },
  {
    id: 5,
    titleEn: "Paramparagat Krishi Vikas Yojana (PKVY)",
    titleHi: "परम्परागत कृषि विकास योजना",
    date: "10 November 2025",
    category: "Organic Farming",
    shortDesc: "Promotes commercial organic farming through cluster approach.",
    longDesc: "PKVY is a traditional farming improvement program aiming to boost organic farming in India. Fifty or more farmers form a cluster having 50 acres of land to take up the organic farming. The scheme covers certification costs, and promotes traditional wisdom with modern science.",
    eligibility: "Farmers willing to adopt organic farming.",
    benefits: "Financial assistance of ₹50,000 per hectare for 3 years."
  },
  {
    id: 6,
    titleEn: "PM Krishi Sinchai Yojana (PMKSY)",
    titleHi: "प्रधान मंत्री कृषि सिंचाई योजना",
    date: "30 October 2025",
    category: "Irrigation",
    shortDesc: "Aims to achieve convergence of investments in irrigation.",
    longDesc: "PMKSY has been formulated with the vision of extending the coverage of irrigation 'Har Khet ko pani' and improving water use efficiency 'More crop per drop'. It involves end-to-end solutions on source creation, distribution, management, and field application.",
    eligibility: "All farmers.",
    benefits: "Subsidies for drip and sprinkler irrigation systems."
  },
  {
    id: 7,
    titleEn: "National Agriculture Market (e-NAM)",
    titleHi: "राष्ट्रीय कृषि बाजार (e-NAM)",
    date: "15 September 2025",
    category: "Market & Trade",
    shortDesc: "Pan-India electronic trading portal for agricultural commodities.",
    longDesc: "e-NAM integrates the existing APMC mandis to create a unified national market for agricultural commodities. It promises better price discovery for farmers, smooth marketing, and transparent transactions online.",
    eligibility: "Farmers registered with APMC mandis.",
    benefits: "Direct access to buyers across the country, competitive prices."
  },
  {
    id: 8,
    titleEn: "PM Kusum Yojana",
    titleHi: "पीएम कुसुम योजना",
    date: "05 August 2025",
    category: "Renewable Energy",
    shortDesc: "Installation of solar pumps and grid-connected solar power plants.",
    longDesc: "The scheme consists of three components: setting up decentralized ground-mounted grid-connected renewable power plants, installation of standalone solar agriculture pumps, and solarization of existing grid-connected agriculture pumps.",
    eligibility: "Farmers, groups of farmers, cooperatives, panchayats.",
    benefits: "Energy security, additional income by selling surplus power."
  },
  {
    id: 9,
    titleEn: "Gramin Bhandaran Yojana",
    titleHi: "ग्रामीण भण्डारण योजना",
    date: "18 July 2025",
    category: "Infrastructure",
    shortDesc: "Creation of scientific storage capacity with allied facilities.",
    longDesc: "This rural godown scheme is aimed at preventing distress sale of agricultural produce immediately after harvest. By facilitating scientific storage, it ensures farmers can store their produce and sell it at a better price later.",
    eligibility: "Individuals, farmers, producer groups, NGOs.",
    benefits: "Capital investment subsidy for building godowns."
  },
  {
    id: 10,
    titleEn: "Sub-Mission on Agricultural Mechanization",
    titleHi: "कृषि यंत्रीकरण उप-मिशन",
    date: "04 June 2025",
    category: "Machinery/Equipment",
    shortDesc: "Encourages custom hiring centers and machine banks.",
    longDesc: "SMAM aims to increase the reach of farm mechanization to small and marginal farmers and to the regions where availability of farm power is low. It provides financial assistance for the procurement of agricultural machinery and equipment.",
    eligibility: "All farmers, especially small and marginal farmers.",
    benefits: "Up to 50-80% subsidy on buying agricultural machines."
  }
];

export default function YojnaInfo() {
  const [selectedYojna, setSelectedYojna] = useState(null);
  const [isNewspaperMode, setIsNewspaperMode] = useState(false);

  const handleReadMore = (yojna) => {
    setSelectedYojna(yojna);
    setTimeout(() => {
      setIsNewspaperMode(true);
    }, 50); // slight delay to trigger animation
  };

  const handleBack = () => {
    setIsNewspaperMode(false);
    setTimeout(() => {
      setSelectedYojna(null);
    }, 500); // Wait for transition out
  };

  return (
    <div className="yojna-container">
      {!selectedYojna ? (
        <div className="yojna-list-view fade-in">
          <div className="yojna-header">
            <h2>📜 Sarkari Yojna</h2>
            <p>Government Schemes & Subsidies for Farmers</p>
          </div>
          
          <div className="yojna-grid">
            {dummyYojnas.map((yojna) => (
              <div 
                className="yojna-card" 
                key={yojna.id}
                onClick={() => handleReadMore(yojna)}
              >
                <div className="card-badge">{yojna.category}</div>
                <h3>{yojna.titleHi}</h3>
                <h4>{yojna.titleEn}</h4>
                <p className="yojna-short">{yojna.shortDesc}</p>
                
                <div className="yojna-card-footer">
                  <span className="yojna-date">{yojna.date}</span>
                  <button className="read-more-btn">Read Article →</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className={`newspaper-view ${isNewspaperMode ? 'open' : ''}`}>
          <div className="newspaper-nav">
            <button className="news-back-btn" onClick={handleBack}>
              ← Back to Schemes
            </button>
            <span className="news-date">{selectedYojna.date}</span>
          </div>

          <article className="newspaper-article">
            <header className="article-header">
              <span className="article-category">{selectedYojna.category.toUpperCase()}</span>
              <h1 className="article-title">{selectedYojna.titleHi}</h1>
              <h2 className="article-subtitle">{selectedYojna.titleEn}</h2>
              <div className="header-divider"></div>
            </header>

            <div className="article-content">
              <p className="article-dropcap">
                {selectedYojna.longDesc.charAt(0)}
              </p>
              <p className="article-body-text">
                {selectedYojna.longDesc.substring(1)}
              </p>

              <div className="article-highlights box-info">
                <h3>📌 Eligibility</h3>
                <p>{selectedYojna.eligibility}</p>
              </div>

              <div className="article-highlights box-success">
                <h3>💰 Key Benefits</h3>
                <p>{selectedYojna.benefits}</p>
              </div>
            </div>

            <footer className="article-footer">
              <div className="footer-line"></div>
              <p>Published by: Krishi Galaxy Information Desk</p>
            </footer>
          </article>
        </div>
      )}
    </div>
  );
}
