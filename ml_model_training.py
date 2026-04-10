import pandas as pd
import numpy as np
import os

from xgboost import XGBRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error
import joblib
from preprocess_dataset import preprocess_csv

base_dir = os.path.dirname(os.path.abspath(__file__))
file_path = os.path.join(base_dir, "synthetic_dataset.csv")

df=preprocess_csv(file_path)

train = df[df["Month"] < "2025-07-01"]
test  = df[df["Month"] >= "2025-07-01"]

features = ["year", "month", "lag_1", "lag_2", "lag_3", "rolling_mean_3"]
target = "Total"

X_train, y_train = train[features], train[target]
X_test, y_test = test[features], test[target]

model = XGBRegressor(
    n_estimators=200,
    learning_rate=0.05,
    max_depth=4,
    random_state=42
)

model.fit(X_train, y_train)

y_pred = model.predict(X_test)

mae = mean_absolute_error(y_test, y_pred)
rmse = np.sqrt(mean_squared_error(y_test, y_pred))

print("📊 Evaluation Results:")
print("MAE :", mae)
print("RMSE:", rmse)

predictions = []

for region in df["Region"].unique():
    region_df = df[df["Region"] == region].sort_values("Month")

    last_3 = region_df["Total"].iloc[-3:].values

    next_input = pd.DataFrame({
        "year": [2026],
        "month": [1],
        "lag_1": [last_3[-1]],
        "lag_2": [last_3[-2]],
        "lag_3": [last_3[-3]],
        "rolling_mean_3": [np.mean(last_3)]
    })

    pred = model.predict(next_input)[0]

    predictions.append({
        "Region": region,
        "Predicted_Total_Next_Month": round(pred, 2)
    })

pred_df = pd.DataFrame(predictions)

print("\n🔮 Next Month Predictions:")
print(pred_df)

model_path = os.path.join(base_dir, "xgboost_model.pkl")
joblib.dump(model, model_path)

print("\n✅ Model saved at:", model_path)