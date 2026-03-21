import React, { useEffect, useState } from "react";

export default function MarketRate() {
  const [rates, setRates] = useState(null);

  useEffect(() => {
    // 🔥 API KEY HATA DI — direct MongoDB data
    fetch("http://127.0.0.1:5000/api/market-rate")
      .then((r) => r.json())
      .then((res) => {
        console.log(res);
        setRates(res.data);
      })
      .catch((e) => console.error(e));
  }, []);

  return (
    <div style={{ maxWidth: 900, margin: "auto" }}>
      <h2>📊 Market Rate / बाजार भाव</h2>

      {!rates ? (
        <p>Loading...</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ textAlign: "left", padding: 8 }}>Crop</th>
              <th style={{ textAlign: "left", padding: 8 }}>Rate (₹/Quintal)</th>
              <th style={{ textAlign: "left", padding: 8 }}>Market</th>
              <th style={{ textAlign: "left", padding: 8 }}>State</th>
            </tr>
          </thead>

          <tbody>
            {rates.map((item, index) => (
              <tr key={index}>
                <td style={{ padding: 8, borderBottom: "1px solid #ddd" }}>
                  {item.crop}
                </td>
                <td style={{ padding: 8, borderBottom: "1px solid #ddd" }}>
                  ₹{item.price_per_quintal}
                </td>
                <td style={{ padding: 8, borderBottom: "1px solid #ddd" }}>
                  {item.market}
                </td>
                <td style={{ padding: 8, borderBottom: "1px solid #ddd" }}>
                  {item.state}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
