import React, { useEffect, useState } from "react";
import "./SmartSichai.css";

export default function SmartSichai() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/smart-sichai");
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error("Fetch error:", err);
        setData({ status: "error", message: "Backend not reachable" });
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="smart-sichai">
      <h2>💧 स्मार्ट सिंचाई/Smart Irrigation</h2>
      {data ? (
        data.status === "success" ? (
          <div className="sichai-grid">
            
            {/* Soil Moisture Box */}
            <div className="box">
              <h3>🌱खेत की नमी जांच की जा रही है/ Cheking soil Moisture</h3>
              <p className="value">{data?.soilMoisture ?? "--"}%</p>
              <p className="advice">{data?.suggestions?.soil ?? "No suggestion"}</p>
            </div>

            {/* Temperature Box */}
            <div className="box">
              <h3>🌡️ तापमान/ Temperature</h3>
              <p className="value">{data?.temperature ?? "--"} °C</p>
              <p className="advice">{data?.suggestions?.temp ?? "No suggestion"}</p>
            </div>

            {/* Humidity Box */}
            <div className="box">
              <h3>💨 आद्रता (Humidity)</h3>
              <p className="value">{data?.humidity ?? "--"}%</p>
              <p className="advice">{data?.suggestions?.humidity ?? "No suggestion"}</p>
            </div>

          </div>
        ) : (
          <div className="error-box">
            <p>⚠️ Error: {data.message}</p>
            {data.debug && <small>Debug: {data.debug}</small>}
          </div>
        )
      ) : (
        <p>Loading sensor data...</p>
      )}
    </div>
  );
}
