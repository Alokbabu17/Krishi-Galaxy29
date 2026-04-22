import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import KrishiLexa from "./components/KrishiLexa";   // ✅ NEW import


function App() {
  return (
    <>
      <Navbar />
      <div className="app-container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/krishi-lexa" element={<KrishiLexa />} />   {/* ✅ NEW route */}

        </Routes>
      </div>
    </>
  );
}

export default App;
