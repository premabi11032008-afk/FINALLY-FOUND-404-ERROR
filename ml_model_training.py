import pandas as pd
import numpy as np
import os

from xgboost import XGBRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error
import joblib

from preprocess_dataset import preprocess_csv
from get_prediction_from_model import predictions

base_dir = os.path.dirname(os.path.abspath(__file__))
file_path = os.path.join(base_dir, "realistic_dataset.csv")

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

print("Next Month Prediction ")
print(predictions(df=df,month=3,
                  year=2026,model=model))

model_path = os.path.join(base_dir, "xgboost_model.pkl")
joblib.dump(model, model_path)

print("\n✅ Model saved at:", model_path)