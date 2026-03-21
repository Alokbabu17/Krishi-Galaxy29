import React, {useState} from "react";
export default function CheckBalance(){
  const [b,setB]=useState(null);
  const fetchB = ()=> fetch("http://127.0.0.1:5000/api/check-balance").then(r=>r.json()).then(res=>setB(res.data)).catch(e=>console.error(e));
  return (<div style={{maxWidth:600, margin:'auto'}}><h2>💳 Check Balance / बैलेंस देखें</h2><button onClick={fetchB}>Check / जांचें</button>{b && <div style={{marginTop:12}}><p>Farmer ID: {b.farmer_id}</p><p>Balance: {b.balance} {b.currency}</p></div>}</div>)
}
