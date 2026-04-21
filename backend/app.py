from flask import Flask, jsonify, request
from flask_cors import CORS
import os
import tempfile
import base64
import requests
import threading
import time as _time
from threading import Lock
import json

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

# ================= NDVI (POINT - OLD) =================
def get_ndvi(lat, lon):
    try:
        point = ee.Geometry.Point([lon, lat])

        collection = (
            ee.ImageCollection("COPERNICUS/S2_SR_HARMONIZED")
            .filterBounds(point)
            .filterDate('2026-04-10', '2026-04-19')
            .sort('CLOUDY_PIXEL_PERCENTAGE')
        )
        collection = collection.select(['B4', 'B8'])
        image = collection.sort('system:time_start', False).first()
        ndvi = image.normalizedDifference(['B8', 'B4']).rename('NDVI')

        value = ndvi.reduceRegion(
            reducer=ee.Reducer.mean(),
            geometry=point,
            scale=10
        ).get('NDVI').getInfo()

        return round(value, 2)

    except:
        return None

# ================= NDVI (POLYGON + IMAGE) =================
def get_ndvi_polygon(coords):
    try:
        print("Coords received:", coords)
        polygon = ee.Geometry.Polygon([coords])

        collection = (
         ee.ImageCollection("COPERNICUS/S2_SR_HARMONIZED")
         .filterBounds(polygon)
         .filterDate('2026-04-10', '2026-04-19')
         .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 20))
     )
        collection = collection.select(['B4', 'B8'])
        
        image = collection.sort('system:time_start', False).first()

        ndvi = image.normalizedDifference(['B8', 'B4']).rename('NDVI')

        # ===== VALUE =====
        value = ndvi.reduceRegion(
            reducer=ee.Reducer.mean(),
            geometry=polygon,
            scale=10,
            maxPixels=1e9
        ).get('NDVI').getInfo()

        ndvi_value = round(value, 2) if value else None
        print("NDVI Value:", ndvi_value)
        
        # ===== IMAGE (NEW 🔥) =====
        ndvi_vis = ndvi.visualize(
            min=0,
            max=1,
            palette=['red', 'yellow', 'green']
        )

        ndvi_url = ndvi_vis.getThumbURL({
            'region': polygon,
            'scale': 10
        })

        return ndvi_value, ndvi_url

    except Exception as e:
        print("NDVI ERROR:", e)
        return None, None

groq_client = Groq(api_key=GROQ_API_KEY)

# ---------- APP ----------
app = Flask(__name__)
CORS(app)

# ================= MongoDB =================
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

# ================= VOICE =================
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
        audio_seg = AudioSegment.from_file(tmp_in.name)
        wav_path = tmp_in.name.replace(".webm", ".wav")
        audio_seg.export(wav_path, format="wav")

        recognizer = sr.Recognizer()
        with sr.AudioFile(wav_path) as src:
            audio_data = recognizer.record(src)

        user_text = recognizer.recognize_google(audio_data, language="hi-IN")

        # ===== NDVI =====
        ndvi_text = ""
        ndvi_url = None

        if any(word in user_text.lower() for word in ["khet", "खेत", "hariyali", "हरियाली"]):
            try:
                coords = request.form.get("coords")

                if coords:
                    coords = json.loads(coords)
                    ndvi_value, ndvi_url = get_ndvi_polygon(coords)
                else:
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

        # ===== SENSOR =====
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

        # ===== AI =====
        final_prompt = f"""
        Tum Krishi Lexa ho ek smart krishi sahayak.

        {sensor_text}

        {ndvi_text}

        Kisan ka sawaal:
        {user_text}

        Simple Hindi me jawab do.
        """

        response = groq_client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": final_prompt}]
        )

        reply_text = response.choices[0].message.content
        clean_reply = _clean_for_tts(reply_text)

        # ===== TTS =====
        mp3_path = os.path.join(tempfile.gettempdir(), "krishi_reply.mp3")
        asyncio.run(
            edge_tts.Communicate(clean_reply, "hi-IN-SwaraNeural").save(mp3_path)
        )

        with open(mp3_path, "rb") as f:
            audio_b64 = base64.b64encode(f.read()).decode()

        return jsonify({
            "status": "success",
            "user_text": user_text,
            "reply": clean_reply,
            "audio": audio_b64,
            "ndvi_image": ndvi_url   # 🔥 NEW OUTPUT
        })

    except Exception as e:
        return jsonify({"status": "error", "message": str(e)})

# ================= RUN =================
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True, use_reloader=False)