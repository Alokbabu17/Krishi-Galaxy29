import React, {useEffect, useState} from "react";
export default function YojnaInfo(){
  const [schemes,setSchemes]=useState([]);
  useEffect(()=>{ fetch("http://127.0.0.1:5000/api/yojna-info").then(r=>r.json()).then(res=>setSchemes(res.data)).catch(e=>console.error(e)) },[]);
  return (<div style={{maxWidth:800, margin:'auto'}}><h2>📜 Sarkari Yojna / योजनाएँ</h2><ul>{schemes.map((s,i)=>(<li key={i}><b>{s.name_hi} / {s.name_en}:</b> {s.benefit}</li>))}</ul></div>);
}
