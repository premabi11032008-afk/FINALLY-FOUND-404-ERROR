from fastapi import FastAPI, HTTPException, File, UploadFile
import cv2
import numpy as np
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import joblib
import os
import sys
from typing import List

# Add parent directory to path so we can import get_prediction_from_model
parent_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
sys.path.insert(0, parent_dir)

from get_prediction_from_model import predictions
from yolo_detection import analyze_image, get_valuation
from gemini_verification import verify_with_gemini

# Load env for Gemini key if available
from dotenv import load_dotenv
load_dotenv(os.path.join(parent_dir, 'frontend', '.env'))
GEMINI_API_KEY = os.getenv("VITE_GEMINI_API_KEY")

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global variables to hold the model and dataset
MODEL = None
DATASET = None

@app.on_event("startup")
def load_resources():
    global MODEL, DATASET
    try:
        model_path = os.path.join(parent_dir, "xgboost_model.pkl")
        data_path = os.path.join(parent_dir, "realistic_dataset.csv")
        MODEL = joblib.load(model_path)
        DATASET = pd.read_csv(data_path)
        print("Model and dataset loaded successfully.")
    except Exception as e:
        print(f"Error loading resources: {e}")

@app.get("/api/predict")
def predict(month: int, year: int):
    global MODEL, DATASET
    if MODEL is None or DATASET is None:
        raise HTTPException(status_code=500, detail="Model or dataset not loaded")
    
    try:
        pred_df = predictions(DATASET, month, year, MODEL)
        pred_df = pred_df.sort_values(by="Predicted_Total_Next_Month", ascending=False)
        top_2_regions = pred_df.head(2)["Region"].tolist()
        
        results = []
        for _, row in pred_df.iterrows():
            reg = row["Region"]
            is_top = reg in top_2_regions
            results.append({
                "region": reg,
                "predicted_total": row["Predicted_Total_Next_Month"],
                "is_top_hotspot": is_top
            })
            
        return {
            "year": year,
            "month": month,
            "predictions": results,
            "top_regions": top_2_regions
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/evaluate")
async def evaluate_device(files: List[UploadFile] = File(...)):
    try:
        results_list = []
        for file in files:
            contents = await file.read()
            nparr = np.frombuffer(contents, np.uint8)
            img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
            
            if img is None:
                continue
                
            rating, condition, recommendation, damage_percent, detections = analyze_image(img)
            
            # Check if YOLO detected a phone (67) or laptop (63)
            is_verified = any(d['class_id'] in [63, 67] and d['confidence'] > 0.4 for d in detections)
            device_type = next((d['class_name'] for d in detections if d['class_id'] in [63, 67]), "unknown")
            
            # FALLBACK TO GEMINI if YOLO is unsure
            if not is_verified and GEMINI_API_KEY:
                print(f"YOLO unsure about {file.filename}. Falling back to Gemini...")
                # We use the raw bytes for Gemini
                gemini_verified, gemini_type, gemini_cond = verify_with_gemini(contents, GEMINI_API_KEY)
                if gemini_verified:
                    print(f"Gemini verified: {gemini_type}")
                    is_verified = True
                    device_type = gemini_type
            
            price = get_valuation(rating)
            results_list.append({
                "rating": rating,
                "condition": condition,
                "recommendation": recommendation,
                "damage_percent": round(damage_percent, 2),
                "price": f"₹{price:,}",
                "raw_price": price,
                "is_verified": is_verified,
                "device_type": device_type
            })
        
        if not results_list:
            raise HTTPException(status_code=400, detail="No valid images provided")
            
        # Return the most conservative (lowest rating) result that is verified
        verified_results = [r for r in results_list if r['is_verified']]
        if not verified_results:
            return results_list[0] # Return one unverified result for feedback
            
        return min(verified_results, key=lambda x: x['rating'])

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/order")
async def place_order(order_data: dict):
    phone = order_data.get("phone")
    if not phone:
        raise HTTPException(status_code=400, detail="Phone number required")
    
    print(f"ORDER PLACED: {order_data}")
    return {
        "status": "success",
        "message": "Our executive will call you shortly for verification.",
        "account_info": "Please transfer the processing fee (₹99) to: AC: 9182374655, IFSC: RECOVER001"
    }
