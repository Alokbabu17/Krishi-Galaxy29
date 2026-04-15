import React, { useState } from "react";
import "./KrishiLexa.css";

function KrishiLexa() {
  const [answer, setAnswer] = useState("");
  const [userText, setUserText] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("idle");

  const startRecording = async () => {
    try {
      setStatus("listening");

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      let chunks = [];

      const audioContext = new AudioContext();
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      source.connect(analyser);

      const dataArray = new Uint8Array(analyser.fftSize);

      let silenceStart = null;
      let recording = true;

      mediaRecorder.ondataavailable = (e) => {
        chunks.push(e.data);
      };

      mediaRecorder.start();

      // Silence detection loop
      const detectSilence = () => {
        if (!recording) return;

        analyser.getByteTimeDomainData(dataArray);
        let silence = true;

        for (let i = 0; i < dataArray.length; i++) {
          if (Math.abs(dataArray[i] - 128) > 5) {
            silence = false;
            silenceStart = null;
            break;
          }
        }

        if (silence) {
          if (!silenceStart) {
            silenceStart = Date.now();
          } else {
            if (Date.now() - silenceStart > 2000) {
              recording = false;
              mediaRecorder.stop();
              setStatus("thinking");
              return;
            }
          }
        }

        requestAnimationFrame(detectSilence);
      };

      detectSilence();

      mediaRecorder.onstop = async () => {
        const blob = new Blob(chunks, { type: "audio/webm" });
        const formData = new FormData();
        formData.append("file", blob, "input.webm");

        setLoading(true);

        try {
          // ===== LIVE GPS FETCH =====
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              formData.append("lat", position.coords.latitude);
              formData.append("lon", position.coords.longitude);

              const response = await fetch("http://localhost:5000/voice", {
                method: "POST",
                body: formData,
              });

              const data = await response.json();

              if (data.status === "success") {
                setUserText(data.user_text || "");
                setAnswer(data.reply || "");

                if (data.audio) {
                  const audio = new Audio(
                    "data:audio/mp3;base64," + data.audio
                  );
                  audio.play();
                }
              } else {
                setAnswer("Error: " + data.message);
              }

              setLoading(false);
              setStatus("idle");
            },

            (gpsError) => {
              setAnswer("GPS Permission/Error: " + gpsError.message);
              setLoading(false);
              setStatus("idle");
            }
          );
        } catch (err) {
          setAnswer("Request failed: " + err.message);
          setLoading(false);
          setStatus("idle");
        }
      };
    } catch (err) {
      setAnswer("Mic error: " + err.message);
      setStatus("idle");
    }
  };

  return (
    <div className="krishi-lexa-container">
      <div className="overlay">
        <div className="lexa-card">
          <div className="lexa-header">
            <div className="ai-orb"></div>
            <h1 className="welcome-text">कृषि लेक्सा</h1>
            <p className="sub-text">Aapki Modern Krishi Sahayak</p>
          </div>

          <div className="chat-container">
            {userText && (
              <div className="message user-message">
                <span className="label">🧑 Aapne poocha:</span>
                <p>{userText}</p>
              </div>
            )}

            {status === "thinking" && (
              <div className="message ai-message thinking-message">
                <span className="label">🤖 Krishi Lexa:</span>
                <div className="dot-typing"></div>
              </div>
            )}

            {answer && status !== "thinking" && (
              <div className="message ai-message">
                <span className="label">🤖 Krishi Lexa:</span>
                <p>{answer}</p>
              </div>
            )}
          </div>

          <div className="action-area">
            {status === "listening" && (
              <div className="listening-indicator">
                <span>Sun rahi hoon...</span>
                <div className="wave-container">
                  <div className="wave"></div>
                  <div className="wave"></div>
                  <div className="wave"></div>
                </div>
              </div>
            )}

            <button
              className={`mic-btn ${
                status === "listening" ? "pulsing" : ""
              }`}
              onClick={startRecording}
              disabled={loading}
            >
              <span className="mic-icon">🎤</span>
              <span className="btn-text">
                {loading
                  ? "Processing..."
                  : status === "listening"
                  ? "Listening..."
                  : "Tap to Speak"}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default KrishiLexa;