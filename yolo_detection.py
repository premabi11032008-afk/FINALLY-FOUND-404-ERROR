from ultralytics import YOLO
import cv2
import os
import numpy as np

# Load YOLO Model
model = YOLO("yolov8n.pt")

input_folder = "input_folder"
output_folder = "output_images"

os.makedirs(output_folder, exist_ok=True)

image_files = [f for f in os.listdir(input_folder) if f.endswith(('.jpg','.png','.jpeg'))]

for image_name in image_files:

    image_path = os.path.join(input_folder, image_name)

    image = cv2.imread(image_path)

    results = model(image)

    for result in results:

        annotated_frame = result.plot()

        boxes = result.boxes

        for box in boxes:

            x1, y1, x2, y2 = map(int, box.xyxy[0])

            cropped = image[y1:y2, x1:x2]

            gray = cv2.cvtColor(cropped, cv2.COLOR_BGR2GRAY)

            edges = cv2.Canny(gray, 100, 200)

            damage_pixels = np.sum(edges > 0)

            total_pixels = cropped.shape[0] * cropped.shape[1]

            damage_percent = (damage_pixels / total_pixels) * 100

            # LOGICAL RATING SYSTEM
            if damage_percent < 2:
                rating = 9
                condition = "Excellent"
                recommendation = "Premium Resale"

            elif damage_percent < 5:
                rating = 7
                condition = "Good"
                recommendation = "Normal Resale"

            elif damage_percent < 10:
                rating = 5
                condition = "Average"
                recommendation = "Refurbish and Sell"

            elif damage_percent < 20:
                rating = 3
                condition = "Poor"
                recommendation = "Repair Before Sale"

            else:
                rating = 1
                condition = "Severely Damaged"
                recommendation = "Recycle / Scrap Recovery"

            # Display Damage %
            cv2.putText(
                annotated_frame,
                f"Damage: {damage_percent:.2f}%",
                (x1, y1-10),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.7,
                (0,0,255),
                2
            )

    output_path = os.path.join(output_folder, image_name)

    cv2.imwrite(output_path, annotated_frame)

    print(f"\nImage: {image_name}")
    print(f"Damage Percentage: {damage_percent:.2f}%")
    print(f"Damage Rating: {rating}/10")
    print(f"Condition: {condition}")
    print(f"Recommended: {recommendation}")

print("\nProcessing Complete!")