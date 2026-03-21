from flask import Flask, jsonify, request
from flask_cors import CORS
import os
import tempfile
import base64
import requests
import threading
import time as _time
from threading import Lock

# ================= MongoDB =================
from pymongo import MongoClient

# ================= AI / Voice =================
# ✅ CHANGED: OpenAI → Groq,  gTTS → edge-tts
from groq import Groq
from dotenv import load_dotenv
import speech_recognition as sr
from pydub import AudioSegment
import edge_tts
import asyncio
import re

# ================= YOLO =================
from ultralytics import YOLO
import cv2
import numpy as np

# ================= IOT =================
import serial

# ---------- ENV ----------
load_dotenv()
# ✅ CHANGED: OPENAI_API_KEY → GROQ_API_KEY
GROQ_API_KEY     = os.getenv("GROQ_API_KEY")
GOOGLE_MAPS_API_KEY = os.getenv("GOOGLE_MAPS_API_KEY")

# ✅ CHANGED: OpenAI client → Groq client
groq_client = Groq(api_key=GROQ_API_KEY)

# ---------- APP ----------
app = Flask(__name__)
CORS(app)

# ================= MongoDB Connection =================
MONGO_URI = "mongodb://localhost:27017"
mongo_client = MongoClient(MONGO_URI)

# ✅ FINAL DATABASE NAME
mongo_db = mongo_client["Krishi_galaxy"]

market_collection   = mongo_db["market_rates"]
drone_collection    = mongo_db["drone_applications"]
subsidy_collection  = mongo_db["subsidy_applications"]
training_collection = mongo_db["training_applications"]

print("✅ MongoDB Connected (krishi_galaxy)")

# ================= YOLO =================
yolo_model = YOLO("yolov8n.pt")

PESTICIDE_SUGGESTIONS = {
    "aphid":       "Use Neem oil spray (5ml per litre of water).",
    "caterpillar": "Use Bacillus thuringiensis (Bt) spray.",
    "whitefly":    "Use Imidacloprid 0.3ml per litre of water.",
    "grasshopper": "Use Chlorpyrifos spray carefully.",
    "locust":      "Use Malathion or Neem-based bio pesticide."
}

# ================= HOME =================
@app.route("/")
def home():
    return {
        "message_en": "✅ Krishi Galaxy Backend Running (MongoDB)",
        "message_hi": "✅ कृषि गैलेक्सी बैकएंड चालू है (MongoDB)"
    }

# ================= MARKET RATE =================
@app.route("/api/market-rate", methods=["GET"])
def get_market_rate():
    rates = list(market_collection.find({}, {"_id": 0}))
    return jsonify({
        "status": "success",
        "data":   rates
    })

# ================= DRONE =================
@app.route("/api/drone-apply", methods=["POST"])
def drone_apply():
    data = request.get_json()
    drone_collection.insert_one(data)
    return jsonify({
        "status":  "success",
        "message": "Drone application submitted",
    })

@app.route("/api/drone-applications", methods=["GET"])
def drone_applications():
    apps = list(drone_collection.find({}, {"_id": 0}))
    return jsonify({"status": "success", "data": apps})

# ================= SUBSIDY =================
@app.route("/api/subsidy-apply", methods=["POST"])
def subsidy_apply():
    data = request.get_json()
    subsidy_collection.insert_one(data)
    return jsonify({
        "status":  "success",
        "message": "Subsidy application submitted",
    })

@app.route("/api/subsidy-applications", methods=["GET"])
def subsidy_applications():
    apps = list(subsidy_collection.find({}, {"_id": 0}))
    return jsonify({"status": "success", "data": apps})

# ================= TRAINING =================
@app.route("/api/training-apply", methods=["POST"])
def training_apply():
    data = request.get_json()
    training_collection.insert_one(data)
    return jsonify({
        "status":  "success",
        "message": "Training application submitted",
    })

@app.route("/api/training-applications", methods=["GET"])
def training_applications():
    apps = list(training_collection.find({}, {"_id": 0}))
    return jsonify({"status": "success", "data": apps})

# ================= YOJNA =================
@app.route("/api/yojna-info", methods=["GET"])
def yojna_info():
    schemes = [
        {"name": "PM-Kisan Samman Nidhi", "benefit": "₹6000/year"},
        {"name": "Fasal Bima Yojna",       "benefit": "Crop Insurance"},
        {"name": "Soil Health Card",        "benefit": "Free soil testing"}
    ]
    return jsonify({"status": "success", "data": schemes})

# ================= PEST =================
@app.route("/api/pest-detect", methods=["POST"])
def pest_detect():
    file = request.files.get("image")
    if not file:
        return jsonify({"status": "error"}), 400

    img     = cv2.imdecode(np.frombuffer(file.read(), np.uint8), cv2.IMREAD_COLOR)
    results = yolo_model(img)

    pests = []
    for r in results:
        for box in r.boxes:
            pests.append(yolo_model.names[int(box.cls[0])])

    if not pests:
        return jsonify({"status": "success", "prediction": "No pest detected"})

    pest       = pests[0].lower()
    suggestion = PESTICIDE_SUGGESTIONS.get(pest, "General pesticide spray")

    return jsonify({
        "status":     "success",
        "prediction": pest,
        "suggestion": suggestion
    })

# ================= VOICE — Krishi Lek-sha =================
# ✅ CHANGED: OpenAI GPT-4o-mini → Groq LLaMA 3.3
#             gTTS (slow)        → edge-tts (fast Hindi voice)

def _clean_for_tts(text):
    """Markdown / asterisks hatao — TTS ke liye clean text"""
    text = re.sub(r'\*{1,3}(.*?)\*{1,3}', r'\1', text, flags=re.DOTALL)
    text = re.sub(r'_{1,3}(.*?)_{1,3}',   r'\1', text, flags=re.DOTALL)
    text = re.sub(r'^\s*#{1,6}\s+',        '',    text, flags=re.MULTILINE)
    text = re.sub(r'^\s*[-*•]\s+',         '',    text, flags=re.MULTILINE)
    text = re.sub(r'^\s*\d+[.)]\s+',       '',    text, flags=re.MULTILINE)
    text = re.sub(r'`{1,3}(.*?)`{1,3}',   r'\1', text, flags=re.DOTALL)
    text = re.sub(r'\n{3,}',               '\n\n', text)
    return text.strip()

def _detect_lang(text):
    """Hindi Devanagari script detect karo"""
    hindi = re.findall(r'[\u0900-\u097F]', text)
    return 'hi' if len(hindi) / max(len(text), 1) > 0.15 else 'en'

async def _edge_generate(text, voice, path):
    """edge-tts se mp3 file generate karo"""
    comm = edge_tts.Communicate(text=text, voice=voice, rate="+10%")
    await comm.save(path)

@app.route("/voice", methods=["POST"])
def voice_assistant():
    file = request.files.get("file")
    if not file:
        return jsonify({"status": "error", "message": "No audio file"}), 400

    tmp_in  = None
    wav_tmp = None
    mp3_tmp = None

    try:
        # ── 1. Audio input save karo ──
        tmp_in = tempfile.NamedTemporaryFile(delete=False, suffix=".webm")
        file.save(tmp_in.name)
        tmp_in.close()

        # ── 2. Convert to WAV (pydub) ──
        audio_seg = AudioSegment.from_file(tmp_in.name)
        wav_tmp   = tempfile.NamedTemporaryFile(delete=False, suffix=".wav")
        audio_seg.export(wav_tmp.name, format="wav")
        wav_tmp.close()

        # ── 3. Speech → Text (Google STT, Hindi) ──
        recognizer = sr.Recognizer()
        with sr.AudioFile(wav_tmp.name) as src:
            audio_data = recognizer.record(src)
        user_text = recognizer.recognize_google(audio_data, language="hi-IN")

        # ── 4. ✅ Groq LLaMA 3.3 se answer lo ──
        response = groq_client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {
                    "role": "system",
                    "content": (
                        "Aap Krishi Lek-sha hain — ek AI voice assistant jo "
                        "Bhartiya kisaano ki madad karta hai. "
                        "Hamesha Hindi mein, simple aur seedha jawab do. "
                        "Markdown formatting bilkul mat use karo — "
                        "koi asterisk, bullet, ya heading nahi."
                    )
                },
                {"role": "user", "content": user_text}
            ]
        )
        reply_text = response.choices[0].message.content

        # ── 5. Clean text (markdown hatao) ──
        clean_reply = _clean_for_tts(reply_text)

        # ── 6. ✅ edge-tts se fast Hindi audio banao ──
        lang  = _detect_lang(clean_reply)
        voice = "hi-IN-SwaraNeural" if lang == "hi" else "en-IN-NeerjaNeural"

        mp3_tmp = tempfile.NamedTemporaryFile(delete=False, suffix=".mp3")
        mp3_tmp.close()
        asyncio.run(_edge_generate(clean_reply, voice, mp3_tmp.name))

        # ── 7. Base64 encode → frontend ko bhejo ──
        with open(mp3_tmp.name, "rb") as f:
            audio_b64 = base64.b64encode(f.read()).decode()

        return jsonify({
            "status":    "success",
            "user_text": user_text,    # user ne kya bola (display ke liye)
            "reply":     reply_text,   # AI ka full reply  (chat mein dikhao)
            "audio":     audio_b64     # base64 mp3        (play ke liye)
        })

    except sr.UnknownValueError:
        return jsonify({
            "status":  "error",
            "message": "Awaaz samajh nahi aayi, dobara bolein"
        }), 400

    except sr.RequestError as e:
        return jsonify({
            "status":  "error",
            "message": f"STT service error: {e}"
        }), 500

    except Exception as e:
        return jsonify({
            "status":  "error",
            "message": str(e)
        }), 500

    finally:
        # ── Temp files cleanup ──
        for fpath in [
            tmp_in.name  if tmp_in  else None,
            wav_tmp.name if wav_tmp else None,
            mp3_tmp.name if mp3_tmp else None,
        ]:
            try:
                if fpath and os.path.exists(fpath):
                    os.remove(fpath)
            except Exception:
                pass

# ================= IOT =================
latest_iot_data = None
iot_lock = Lock()

def serial_reader():
    global latest_iot_data
    while True:
        with iot_lock:
            latest_iot_data = {
                "temperature": 25,
                "humidity":    60,
                "soilMoisture": 55
            }
        _time.sleep(5)

threading.Thread(target=serial_reader, daemon=True).start()

@app.route("/api/smart-sichai", methods=["GET"])
def smart_sichai():
    with iot_lock:
        data = latest_iot_data
    return jsonify({"status": "success", "data": data})

# ================= RUN =================
if __name__ == "__main__":
    app.run(debug=True, port=5000)