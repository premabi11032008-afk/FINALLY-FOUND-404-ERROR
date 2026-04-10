from ultralytics import YOLO
import cv2
import numpy as np
import os

# Load YOLO Model
_model = None

def get_model():
    global _model
    if _model is None:
        _model = YOLO("yolov8n.pt")
    return _model

def analyze_image(image):
    """
    Analyzes an image (numpy array) for damage using YOLO and Canny edge detection.
    Returns: (rating, condition, recommendation, damage_percent, detections)
    detections: list of dicts with {class_id, class_name, confidence}
    """
    model = get_model()
    results = model(image)
    
    damage_percent = 0
    rating = 1
    condition = "Unknown"
    recommendation = "N/A"
    detections = []

    for result in results:
        boxes = result.boxes
        if len(boxes) == 0:
            continue
            
        for box in boxes:
            cls_id = int(box.cls[0])
            conf = float(box.conf[0])
            name = model.names[cls_id]
            detections.append({"class_id": cls_id, "class_name": name, "confidence": conf})

        # Analysis for the first detected object (main device)
        box = boxes[0]
        x1, y1, x2, y2 = map(int, box.xyxy[0])
        cropped = image[y1:y2, x1:x2]
        
        if cropped.size == 0:
            continue
            
        gray = cv2.cvtColor(cropped, cv2.COLOR_BGR2GRAY)
        edges = cv2.Canny(gray, 100, 200)
        damage_pixels = np.sum(edges > 0)
        total_pixels = cropped.shape[0] * cropped.shape[1]

        damage_percent = (damage_pixels / total_pixels) * 100

        # LOGICAL RATING SYSTEM
        if damage_percent < 2:
            rating = 10
            condition = "Excellent"
            recommendation = "Premium Resale"
        elif damage_percent < 5:
            rating = 8
            condition = "Good"
            recommendation = "Normal Resale"
        elif damage_percent < 10:
            rating = 6
            condition = "Average"
            recommendation = "Refurbish and Sell"
        elif damage_percent < 20:
            rating = 4
            condition = "Poor"
            recommendation = "Repair Before Sale"
        else:
            rating = 2
            condition = "Severely Damaged"
            recommendation = "Recycle / Scrap Recovery"
        
        break # Just one object for assessment analysis

    return rating, condition, recommendation, damage_percent, detections

def get_valuation(rating):
    """
    Returns a simple valuation based on rating (0-10).
    Max value is 80,000 INR.
    """
    # Simple linear or stepped pricing
    if rating >= 9:
        price = 80000
    elif rating >= 7:
        price = 45000
    elif rating >= 5:
        price = 25000
    elif rating >= 3:
        price = 8000
    else:
        price = 1500
        
    # Add a bit of "random demand" variance (e.g. +/- 10%)
    variance = np.random.randint(-500, 500)
    return max(0, price + variance)

if __name__ == "__main__":
    # Test block
    print("Testing YOLO Model Refactor...")
    # Add manual test if needed