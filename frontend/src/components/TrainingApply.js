import React, { useState } from "react";

export default function TrainingApply() {
  const [f, setF] = useState({ name: "", topic: "", contact: "" });
  const [m, setM] = useState("");

  const h = (e) => setF({ ...f, [e.target.name]: e.target.value });

  const s = (e) => {
    e.preventDefault();

    fetch("http://127.0.0.1:5000/api/training-apply", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(f)
    })
      .then((r) => r.json())
      .then(res => {
  if (res && res.status === "success") {
    setM("Submitted successfully ✅");
    setF({ name:'', topic:'', contact:'' });
  } else {
    setM("Submission failed ❌");
  }
})

      .catch((e) => console.error(e));
  };

  return (
    <div style={{ maxWidth: 700, margin: "auto" }}>
      <h2>📚 Training / प्रशिक्षण</h2>
      <form onSubmit={s} style={{ display: "grid", gap: 10 }}>
        <input name="name" value={f.name} onChange={h} placeholder="Farmer Name / नाम" required />
        <input name="topic" value={f.topic} onChange={h} placeholder="Training Topic / विषय" required />
        <input name="contact" value={f.contact} onChange={h} placeholder="Contact / संपर्क" required />
        <button type="submit">Submit / जमा करें</button>
      </form>
      {m && <p style={{ color: "green" }}>{m}</p>}
    </div>
  );
}
