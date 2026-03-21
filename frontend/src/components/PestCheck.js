import React, { useRef, useState } from "react";
import Webcam from "react-webcam"; // npm install react-webcam

export default function PestCheck(){
  const webcamRef = useRef(null);
  const [result, setResult] = useState(null);
  const capture = async ()=>{
    const imageSrc = webcamRef.current.getScreenshot();
    const blob = await (await fetch(imageSrc)).blob();
    const fd = new FormData(); fd.append("image", blob, "capture.jpg");
    const res = await fetch("http://127.0.0.1:5000/api/pest-detect", {method:'POST', body:fd});
    const data = await res.json();
    setResult(data.prediction || JSON.stringify(data));
  };
  return (
    <div style={{maxWidth:800, margin:'auto', textAlign:'center'}}>
      <h2>🐛 Pest Detection / कीट पहचान</h2>
      <Webcam audio={false} ref={webcamRef} screenshotFormat="image/jpeg" width={480} />
      <div style={{marginTop:10}}>
        <button onClick={capture}>Detect / पहचान करें</button>
      </div>
      {result && <div style={{marginTop:12, padding:12, background:'#fff2f2', borderRadius:8}}><b>Result:</b> {result}</div>}
    </div>
  );
}
