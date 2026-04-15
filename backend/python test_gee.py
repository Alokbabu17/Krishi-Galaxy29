import ee
import os
from dotenv import load_dotenv

load_dotenv()

service_account = os.getenv("GEE_SERVICE_ACCOUNT")

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
key_path = os.path.join(BASE_DIR, "credentials.json")

credentials = ee.ServiceAccountCredentials(service_account, key_path)
ee.Initialize(credentials)

print("GEE Connected Successfully!")