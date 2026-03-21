import React, { useState } from "react";
import "./KrishiLexa.css";

function KrishiLexa() {
  const [answer, setAnswer]   = useState("");
  const [userText, setUserText] = useState("");   // ✅ NEW: user ne kya bola
  const [loading, setLoading] = useState(false);

  const startRecording = async () => {
    try {
      const stream        = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      let chunks          = [];

      mediaRecorder.ondataavailable = (e) => chunks.push(e.data);

      mediaRecorder.onstop = async () => {
        const blob     = new Blob(chunks, { type: "audio/webm" });
        const formData = new FormData();
        formData.append("file", blob, "input.webm");

        setLoading(true);
        setUserText("");
        setAnswer("");

        try {
          const response = await fetch("http://localhost:5000/voice", {
            method: "POST",
            body:   formData,
          });

          const data = await response.json();

          if (data.status === "success") {

            // ✅ UPDATED: user_text + reply (naye backend ke fields)
            setUserText(data.user_text || "");
            setAnswer(data.reply      || "");

            // ✅ UPDATED: base64 audio play karo
            const audioBytes = atob(data.audio);
            const arrayBuf   = new ArrayBuffer(audioBytes.length);
            const view       = new Uint8Array(arrayBuf);
            for (let i = 0; i < audioBytes.length; i++) {
              view[i] = audioBytes.charCodeAt(i);
            }
            const audioBlob = new Blob([arrayBuf], { type: "audio/mp3" });
            const audioUrl  = URL.createObjectURL(audioBlob);
            const audio     = new Audio(audioUrl);
            audio.play();

          } else {
            setAnswer("❌ Error: " + (data.message || "Unknown error"));
          }

        } catch (err) {
          setAnswer("⚠️ Request failed: " + err.message);
        }

        setLoading(false);
      };

      mediaRecorder.start();
      setTimeout(() => mediaRecorder.stop(), 5000); // 5 sec recording
    } catch (err) {
      setAnswer("🎤 Microphone error: " + err.message);
    }
  };

  return (
    <div className="krishi-lexa-container">
      <div className="overlay">
        <h1>🌾 Krishi-Lexa: Your AI Assistant</h1>

        <button className="mic-btn" onClick={startRecording} disabled={loading}>
          🎤 {loading ? "Listening..." : "Ask Krishi-Lexa"}
        </button>

        {/* ✅ NEW: User ne kya bola — dikhao */}
        {userText && (
          <div className="user-text-box">
            <span className="label">🧑 Aapne poocha:</span>
            <p>{userText}</p>
          </div>
        )}

        {/* AI ka reply */}
        {answer && (
          <pre className="answer-box">{answer}</pre>
        )}

      </div>
    </div>
  );
}

export default KrishiLexa;