import React, { useState, useEffect, useRef } from "react";
import "./KrishiLexa.css";

function KrishiLexa() {
  const [answer, setAnswer] = useState("");
  const [userText, setUserText] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("idle");

  const polygonRef = useRef(null);
  const mapRef = useRef(null);
  const overlayRef = useRef(null);

  // ================= MAP LOAD =================
  useEffect(() => {
    loadMap();
    // eslint-disable-next-line
  }, []);

  const loadMap = () => {
    const script = document.createElement("script");
    script.src =
      "https://maps.googleapis.com/maps/api/js?key=AIzaSyCSJMETyxQJVmXI9gC6-lhomf9gBvGMDTc&libraries=drawing";
    script.async = true;
    script.onload = initMap;
    document.body.appendChild(script);
  };

  const initMap = () => {
    navigator.geolocation.getCurrentPosition((pos) => {
      const location = {
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
      };

      const map = new window.google.maps.Map(
        document.getElementById("map"),
        {
          center: location,
          zoom: 16,
          mapTypeId: "satellite",
        }
      );

      mapRef.current = map;

      const drawingManager = new window.google.maps.drawing.DrawingManager({
        drawingMode: window.google.maps.drawing.OverlayType.POLYGON,
        drawingControl: true,
        drawingControlOptions: {
          position: window.google.maps.ControlPosition.TOP_CENTER,
          drawingModes: ["polygon"],
        },
      });

      drawingManager.setMap(map);

      window.google.maps.event.addListener(
        drawingManager,
        "overlaycomplete",
        (event) => {
          if (polygonRef.current) {
            polygonRef.current.setMap(null);
          }

          polygonRef.current = event.overlay;
        }
      );
    });
  };

  // ================= GET POLYGON COORDS =================
  const getPolygonCoords = () => {
    if (!polygonRef.current) return null;

    const path = polygonRef.current.getPath();
    let coords = [];

    for (let i = 0; i < path.getLength(); i++) {
      const point = path.getAt(i);
      coords.push([point.lng(), point.lat()]);
    }

    return coords;
  };

  // ================= GET BOUNDS =================
  const getBounds = () => {
    const bounds = new window.google.maps.LatLngBounds();
    const path = polygonRef.current.getPath();

    for (let i = 0; i < path.getLength(); i++) {
      bounds.extend(path.getAt(i));
    }

    return bounds;
  };

  // ================= SHOW NDVI OVERLAY =================
  const showNDVIOverlay = (imageUrl) => {
    if (!polygonRef.current || !mapRef.current) return;

    const bounds = getBounds();

    if (overlayRef.current) {
      overlayRef.current.setMap(null);
    }

    const overlay = new window.google.maps.GroundOverlay(
      imageUrl,
      bounds
    );

    overlay.setMap(mapRef.current);
    overlayRef.current = overlay;

    // 🔥 Zoom into field
    mapRef.current.fitBounds(bounds);

    // 🔥 Animation (fade effect)
    const img = document.querySelector("img[src='" + imageUrl + "']");
    if (img) {
      img.style.opacity = 0;
      img.style.transition = "opacity 1.5s ease-in-out";
      setTimeout(() => {
        img.style.opacity = 0.85;
      }, 100);
    }
  };

  // ================= VOICE =================
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
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              formData.append("lat", position.coords.latitude);
              formData.append("lon", position.coords.longitude);

              const coords = getPolygonCoords();
              if (coords) {
                formData.append("coords", JSON.stringify(coords));
              }

              const response = await fetch("http://localhost:5000/voice", {
                method: "POST",
                body: formData,
              });

              const data = await response.json();

              if (data.status === "success") {
                setUserText(data.user_text || "");
                setAnswer(data.reply || "");

                // 🔥 NDVI OVERLAY SHOW
                if (data.ndvi_image) {
                  showNDVIOverlay(data.ndvi_image);
                }

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
              setAnswer("GPS Error: " + gpsError.message);
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
        <div className="main-layout">

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
              <button
                className="mic-btn"
                onClick={startRecording}
                disabled={loading}
              >
                🎤 {loading ? "Processing..." : "Tap to Speak"}
              </button>
            </div>
          </div>

          <div className="map-container">
            <div className="map-overlay">
              📍 Apna khet draw kare
            </div>
            <div id="map"></div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default KrishiLexa;