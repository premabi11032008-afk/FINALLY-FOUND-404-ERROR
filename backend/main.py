from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import joblib
import os
import sys

# Add parent directory to path so we can import get_prediction_from_model
parent_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
sys.path.insert(0, parent_dir)

from get_prediction_from_model import predictions

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust in production
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
