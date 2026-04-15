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

# ================= GEE (NDVI) =================
import ee

# ---------- ENV ----------
load_dotenv()
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
GOOGLE_MAPS_API_KEY = os.getenv("GOOGLE_MAPS_API_KEY")

service_account = os.getenv("GEE_SERVICE_ACCOUNT")
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
key_path = os.path.join(BASE_DIR, "credentials.json")

credentials = ee.ServiceAccountCredentials(service_account, key_path)
ee.Initialize(credentials)

def get_ndvi(lat, lon):
    try:
        point = ee.Geometry.Point([lon, lat])

        collection = (
            ee.ImageCollection("COPERNICUS/S2_SR")
            .filterBounds(point)
            .filterDate('2024-01-01', '2026-12-31')
            .sort('CLOUDY_PIXEL_PERCENTAGE')
            .first()
        )

        ndvi = collection.normalizedDifference(['B8', 'B4']).rename('NDVI')

        value = ndvi.reduceRegion(
            reducer=ee.Reducer.mean(),
            geometry=point,
            scale=10
        ).get('NDVI').getInfo()

        return round(value, 2)

    except:
        return None

groq_client = Groq(api_key=GROQ_API_KEY)

# ---------- APP ----------
app = Flask(__name__)
CORS(app)

# ================= MongoDB Connection =================
MONGO_URI = "mongodb://localhost:27017"
mongo_client = MongoClient(MONGO_URI)

mongo_db = mongo_client["Krishi_galaxy"]

market_collection   = mongo_db["market_rates"]
drone_collection    = mongo_db["drone_applications"]
subsidy_collection  = mongo_db["subsidy_applications"]
training_collection = mongo_db["training_applications"]

print("✅ MongoDB Connected (krishi_galaxy)")
print("✅ GEE NDVI Connected")

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
        "message_en": "✅ Krishi Galaxy Backend Running",
        "message_hi": "✅ कृषि गैलेक्सी बैकएंड चालू है"
    }

@app.route('/test', methods=['GET'])
def test():
    return {"message": "Flask connected successfully"}

# ================= VOICE — Krishi Lexa =================
def _clean_for_tts(text):
    text = re.sub(r'\*{1,3}(.*?)\*{1,3}', r'\1', text, flags=re.DOTALL)
    text = re.sub(r'_{1,3}(.*?)_{1,3}', r'\1', text, flags=re.DOTALL)
    text = re.sub(r'\n{3,}', '\n\n', text)
    return text.strip()

@app.route("/voice", methods=["POST"])
def voice_assistant():
    file = request.files.get("file")
    if not file:
        return jsonify({"status": "error", "message": "No audio file"}), 400

    tmp_in = tempfile.NamedTemporaryFile(delete=False, suffix=".webm")
    file.save(tmp_in.name)
    tmp_in.close()

    try:
        # Convert to wav
        audio_seg = AudioSegment.from_file(tmp_in.name)
        wav_path = tmp_in.name.replace(".webm", ".wav")
        audio_seg.export(wav_path, format="wav")

        # Speech to text
        recognizer = sr.Recognizer()
        with sr.AudioFile(wav_path) as src:
            audio_data = recognizer.record(src)

        user_text = recognizer.recognize_google(audio_data, language="hi-IN")

        # ===== NDVI FETCH =====
        ndvi_text = ""

        if "khet" in user_text and "sehat" in user_text:
            try:
                lat = float(request.form.get("lat", 23.2599))
                lon = float(request.form.get("lon", 77.4126))

                ndvi_value = get_ndvi(lat, lon)

                if ndvi_value is not None:
                    if ndvi_value > 0.6:
                        status = "Fasal healthy hai"
                    elif ndvi_value > 0.3:
                        status = "Fasal thodi weak hai"
                    else:
                        status = "Fasal stress me hai"

                    ndvi_text = f"""
                    Satellite NDVI:
                    NDVI Value: {ndvi_value}
                    Crop Status: {status}
                    """
                else:
                    ndvi_text = "Satellite NDVI data available nahi hai."

            except:
                ndvi_text = "NDVI fetch error."

        # ===== GET SENSOR DATA FROM SMART IRRIGATION =====
        try:
            sensor = requests.get("http://localhost:5001/get-data").json()
            sensor_text = f"""
            Sensor Data:
            Temperature: {sensor['temp']} C
            Humidity: {sensor['humidity']} %
            Soil Moisture: {sensor['soil']}
            Irrigation Decision: {sensor['decision']}
            """
        except:
            sensor_text = "Sensor data available nahi hai."

        # ===== AI PROMPT =====
        final_prompt = f"""
        Tum Krishi Lexa ho ek smart krishi sahayak.

        {sensor_text}

        {ndvi_text}

        Kisan ka sawaal:
        {user_text}

        Sensor aur satellite data ko dhyan me rakhkar simple Hindi me jawab do.
        """

        response = groq_client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": final_prompt}]
        )

        reply_text = response.choices[0].message.content
        clean_reply = _clean_for_tts(reply_text)

        # Text to speech
        mp3_path = os.path.join(tempfile.gettempdir(), "krishi_reply.mp3")
        asyncio.run(
            edge_tts.Communicate(
                clean_reply,
                "hi-IN-SwaraNeural"
            ).save(mp3_path)
        )

        # Send audio
        with open(mp3_path, "rb") as f:
            audio_b64 = base64.b64encode(f.read()).decode()

        return jsonify({
            "status": "success",
            "user_text": user_text,
            "reply": clean_reply,
            "audio": audio_b64
        })

    except Exception as e:
        return jsonify({"status": "error", "message": str(e)})

# ================= RUN =================
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True, use_reloader=False)