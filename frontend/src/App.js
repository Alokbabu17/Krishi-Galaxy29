import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
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
          <Route path="/krishi-lexa" element={<KrishiLexa />} />   {/* ✅ NEW route */}
        </Routes>
          <div>
      <News />   {/* YAHI lagana hai */}
    </div>
      </div>
    </>
  );
}

export default App;
