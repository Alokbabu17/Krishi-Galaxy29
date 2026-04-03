import React, { useEffect, useState } from "react";
import "./SmartSichai.css";

export default function SmartSichai() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("http://localhost:5001/api/smart-sichai");
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
      <h2>💧 स्मार्ट सिंचाई / Smart Irrigation</h2>

      {data ? (
        data.status === "success" ? (
          <div className="sichai-grid">

            {/* Soil Moisture */}
            <div className="box">
              <h3>🌱 खेत की नमी / Soil Moisture</h3>
              <p className="value">{data.data?.soilMoisture ?? "--"}%</p>
              <p className="advice">
                {data.data?.soilMoisture < 30
                  ? "नमी कम है, पानी दें"
                  : data.data?.soilMoisture > 70
                  ? "नमी ज्यादा है, पानी न दें"
                  : "नमी सही है"}
              </p>
            </div>

            {/* Temperature */}
            <div className="box">
              <h3>🌡️ तापमान / Temperature</h3>
              <p className="value">{data.data?.temperature ?? "--"} °C</p>
              <p className="advice">
                {data.data?.temperature > 35
                  ? "तापमान ज्यादा है, शाम को सिंचाई करें"
                  : data.data?.temperature < 15
                  ? "तापमान कम है, फसल को बचाएं"
                  : "तापमान सामान्य है"}
              </p>
            </div>

            {/* Humidity */}
            <div className="box">
              <h3>💨 आद्रता / Humidity</h3>
              <p className="value">{data.data?.humidity ?? "--"}%</p>
              <p className="advice">
                {data.data?.humidity > 80
                  ? "आद्रता ज्यादा है, फंगस का खतरा"
                  : data.data?.humidity < 30
                  ? "आद्रता कम है"
                  : "आद्रता सामान्य है"}
              </p>
            </div>

          </div>
        ) : (
          <div className="error-box">
            <p>⚠️ Error: {data.message}</p>
          </div>
        )
      ) : (
        <p>Loading sensor data...</p>
      )}
    </div>
  );
}