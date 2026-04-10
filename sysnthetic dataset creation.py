import pandas as pd
import numpy as np

# Load dataset
df = pd.read_csv("synthetic_dataset.csv")

# Define region bias (realistic differences)
region_weights = {
    "North": 1.2,    # high consumption
    "South": 1.1,
    "East": 1.0,
    "West": 0.95,
    "Central": 0.85  # lower consumption
}

regions = list(region_weights.keys())

new_rows = []

for month in df["Month"].unique():
    month_data = df[df["Month"] == month]

    totals = {
        "Android": month_data["Android"].sum(),
        "iPhone": month_data["iPhone"].sum(),
        "Laptops": month_data["Laptops"].sum(),
        "Headphones": month_data["Headphones"].sum(),
        "Chargers": month_data["Chargers"].sum(),
    }

    for product, total in totals.items():
        weights = np.array([region_weights[r] for r in regions])
        
        # Add randomness
        noise = np.random.normal(1, 0.05, size=5)
        weights = weights * noise
        
        # Normalize
        weights = weights / weights.sum()
        
        # Distribute
        values = (weights * total).astype(int)

        # Fix rounding error
        diff = total - values.sum()
        for i in range(diff):
            values[i % 5] += 1

        # Store temporarily
        if product == "Android":
            android = values
        elif product == "iPhone":
            iphone = values
        elif product == "Laptops":
            laptops = values
        elif product == "Headphones":
            headphones = values
        elif product == "Chargers":
            chargers = values

    # Combine into rows
    for i, region in enumerate(regions):
        total_val = android[i] + iphone[i] + laptops[i] + headphones[i] + chargers[i]

        new_rows.append([
            month,
            region,
            android[i],
            iphone[i],
            laptops[i],
            headphones[i],
            chargers[i],
            total_val
        ])

# Create new dataframe
new_df = pd.DataFrame(new_rows, columns=[
    "Month","Region","Android","iPhone","Laptops","Headphones","Chargers","Total"
])

# Save
new_df.to_csv("realistic_dataset.csv", index=False)

print("✅ Realistic dataset created!")