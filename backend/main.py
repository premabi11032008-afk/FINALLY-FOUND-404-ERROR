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
    return {
        "message": f"Order for terminal extraction (ID: {phone[-4:]}) has been successfully logged. Our executive members will contact this number shortly to verify coordinates and facilitate further continuation of the recovery protocol.",
        "status": "success"
    }

@app.get("/api/stats")
async def get_stats():
    global DATASET
    if DATASET is None:
        raise HTTPException(status_code=500, detail="Dataset not loaded")
    
    try:
        # 1. Total processed devices (Count)
        total_android = int(DATASET['Android'].sum())
        total_iphone = int(DATASET['iPhone'].sum())
        total_laptops = int(DATASET['Laptops'].sum())
        total_headphones = int(DATASET['Headphones'].sum())
        total_chargers = int(DATASET['Chargers'].sum())
        
        total_devices = total_android + total_iphone + total_laptops + total_headphones + total_chargers
        
        # 2. Gold Recovered (g) estimation
        # Phone: 0.03g, Laptop: 0.1g, Others: 0.005g
        gold_recovered = (total_android + total_iphone) * 0.03 + total_laptops * 0.1 + (total_headphones + total_chargers) * 0.005
        
        # 3. Revenue estimation (Lakhs)
        # Resale rate: 35%
        # Resale prices: Phone: 15k, Laptop: 35k, Others: 0.5k
        # Scrap prices: Phone: 0.5k, Laptop: 1.5k, Others: 0.05k
        resale_rate = 0.35
        scrap_rate = 0.65
        
        revenue = (
            (total_android + total_iphone) * (resale_rate * 15000 + scrap_rate * 500) +
            total_laptops * (resale_rate * 35000 + scrap_rate * 1500) +
            (total_headphones + total_chargers) * (resale_rate * 500 + scrap_rate * 50)
        )
        revenue_lakhs = revenue / 100000

        # 4. Monthly Generation (Tons) logic
        # Weight mapping: Phone: 0.2kg, Laptop: 2kg, Others: 0.1kg
        DATASET['Weight_kg'] = (
            (DATASET['Android'] + DATASET['iPhone']) * 0.2 +
            DATASET['Laptops'] * 2.0 +
            (DATASET['Headphones'] + DATASET['Chargers']) * 0.1
        )
        
        # Monthly generation (Tons)
        monthly_grouped = DATASET.groupby('Month')['Weight_kg'].sum() / 1000
        monthly_generation = []
        for month, weight in monthly_grouped.items():
            # Format month as 'Jan', 'Feb', etc. if needed, or just stay with YYYY-MM
            monthly_generation.append({"name": str(month), "generation": round(weight, 2)})

        # 5. Material Composition (Estimated Grams)
        # Gold: 0.03/phone, 0.1/laptop
        # Copper: 15/phone, 500/laptop
        # Plastic: 50/phone, 800/laptop
        total_gold = (total_android + total_iphone) * 0.03 + total_laptops * 0.1
        total_copper = (total_android + total_iphone) * 15 + total_laptops * 500
        total_plastic = (total_android + total_iphone) * 50 + total_laptops * 800
        total_rare_earths = (total_android + total_iphone) * 1 + total_laptops * 5
        
        material_comp = [
            {"name": "Gold (g)", "value": round(total_gold, 1), "fill": "#fbbf24"},
            {"name": "Copper (g)", "value": round(total_copper, 1), "fill": "#f97316"},
            {"name": "Plastic (g)", "value": round(total_plastic, 1), "fill": "#3b82f6"},
            {"name": "Rare Earths (g)", "value": round(total_rare_earths, 1), "fill": "#10b981"}
        ]
            
        # 6. Device Comparison (Resale vs Recycled)
        device_comp = [
            {
                "name": "Smartphones",
                "resold": int((total_android + total_iphone) * resale_rate),
                "recycled": int((total_android + total_iphone) * scrap_rate)
            },
            {
                "name": "Laptops",
                "resold": int(total_laptops * resale_rate),
                "recycled": int(total_laptops * scrap_rate)
            },
            {
                "name": "Accessories",
                "resold": int((total_headphones + total_chargers) * resale_rate),
                "recycled": int((total_headphones + total_chargers) * scrap_rate)
            }
        ]
        
        return {
            "metrics": {
                "totalDevices": f"{total_devices:,}",
                "goldRecovered": f"{round(gold_recovered, 1):,}",
                "totalRevenue": f"₹{round(revenue_lakhs, 1)}L",
                "revenueTrend": 14.2,
                "goldTrend": 5.8,
                "devicesTrend": 11.4
            },
            "monthlyGeneration": monthly_generation,
            "deviceComparison": device_comp,
            "materialComposition": material_comp,
            "b2bCommodities": [
                { "name": "Grade A Servers", "price": "₹1.4 Lakhs / ton" },
                { "name": "Industrial Board Mix", "price": "₹48,000 / ton" },
                { "name": "Raw Li-ion Banks", "price": "₹24,500 / ton" }
            ]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Chat endpoint
@app.post("/api/chat")
async def chat_with_ai(chat_data: dict):
    if not GEMINI_API_KEY:
        raise HTTPException(status_code=500, detail="Gemini API Key not configured")
    
    user_msg = chat_data.get("message")
    history = chat_data.get("history", []) # List of {role, parts: [{text}]}
    
    try:
        import google.generativeai as genai
        genai.configure(api_key=GEMINI_API_KEY)
        
        system_instruction = """
        You are "Re-Cover AI", an intelligent assistant for the Re-Cover platform.
        Our mission is to combat e-waste. Every phone and laptop is a "toxic fortune".
        If a user wants to check their device value or recycle, use the 'evaluate_device_redirect' tool.
        Encourage users to liquidize their hardware for instant INR payouts.
        """
        
        model = genai.GenerativeModel(
            model_name='gemini-1.5-flash',
            system_instruction=system_instruction,
            tools=[{
                "function_declarations": [{
                    "name": "evaluate_device_redirect",
                    "description": "Guides the user to the device evaluation page when they want to check their phone/laptop value or recycle."
                }]
            }]
        )
        
        # Format history for Gemini SDK
        # Gemini expects 'user' and 'model' (not 'assistant')
        chat = model.start_chat(history=history)
        response = chat.send_message(user_msg)
        
        # Check for function calls
        res_data = {"text": response.text, "redirect": False}
        
        # If there's a function call, we signal the frontend to redirect
        for part in response.candidates[0].content.parts:
            if part.function_call:
                if part.function_call.name == "evaluate_device_redirect":
                    res_data["redirect"] = True
                    res_data["text"] = "I am redirecting you to our AI Assessment Matrix right now! You can upload your photos there to get an instant payout."
        
        return res_data

    except Exception as e:
        print(f"Chat Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
