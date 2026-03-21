import React, { useState } from "react";

export default function DroneApply() {
  const [form, setForm] = useState({
    name: "",
    crop: "",
    area: "",
    contact: ""
  });
  const [msg, setMsg] = useState("");

  const handle = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const submit = (e) => {
    e.preventDefault();

    fetch("http://127.0.0.1:5000/api/drone-apply", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    })
      .then((r) => r.json())
      .then((res) => {
        setMsg(res.message || "Submitted successfully");
        setForm({ name: "", crop: "", area: "", contact: "" });
      })
      .catch((e) => console.error(e));
  };

  return (
    <div style={{ maxWidth: 700, margin: "auto" }}>
      <h2>🚁 Drone Sprinkling / ड्रोन छिड़काव आवेदन</h2>
      <form onSubmit={submit} style={{ display: "grid", gap: 12 }}>
        <input name="name" value={form.name} onChange={handle} placeholder="Farmer Name / किसान का नाम" required />
        <input name="crop" value={form.crop} onChange={handle} placeholder="Crop Type / फसल" required />
        <input name="area" value={form.area} onChange={handle} placeholder="Area (acres) / क्षेत्रफल" required />
        <input name="contact" value={form.contact} onChange={handle} placeholder="Contact No / मोबाइल" required />
        <button type="submit">Submit / जमा करें</button>
      </form>
      {msg && <p style={{ color: "green" }}>{msg}</p>}
    </div>
  );
}
