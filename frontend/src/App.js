import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import KrishiLexa from "./components/KrishiLexa";
import BhandarGhar from "./components/BhandarGhar";

import "./App.css";

function App() {
  return (
    <div className="mesh-background">
      <div className="app-layout">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/krishi-lexa" element={<KrishiLexa />} />
            <Route path="/bhandar-ghar" element={<BhandarGhar />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;
