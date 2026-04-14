import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import MarketRate from "./components/MarketRate";
import DroneApply from "./components/DroneApply";
import PestCheck from "./components/PestCheck";
import SubsidyApply from "./components/SubsidyApply";
import TrainingApply from "./components/TrainingApply";
import CheckBalance from "./components/CheckBalance";
import YojnaInfo from "./components/YojnaInfo";
import KrishiLexa from "./components/KrishiLexa";   // ✅ NEW import
import BhandarGhar from "./components/BhandarGhar";
import SmartSichai from "./components/SmartSichai";
import "./App.css";
import News from "./components/News"; 

function App() {
  return (
    <>
      <Navbar />
      <div className="app-container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/market-rate" element={<MarketRate />} />
          <Route path="/drone-apply" element={<DroneApply />} />
          <Route path="/pest-check" element={<PestCheck />} />
          <Route path="/subsidy-apply" element={<SubsidyApply />} />
          <Route path="/training-apply" element={<TrainingApply />} />
          <Route path="/check-balance" element={<CheckBalance />} />
          <Route path="/yojna-info" element={<YojnaInfo />} />
          <Route path="/krishi-lexa" element={<KrishiLexa />} />   {/* ✅ NEW route */}
          <Route path="/bhandar-ghar" element={<BhandarGhar />} />
          <Route path="/smart-sichai" element={<SmartSichai />} />
           
        </Routes>
          <div>
      <News />   {/* YAHI lagana hai */}
    </div>
      </div>
    </>
  );
}

export default App;
