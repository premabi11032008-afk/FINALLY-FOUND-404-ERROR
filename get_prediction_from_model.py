import pandas as pd
import numpy as np

def predictions(df :pd.DataFrame, month :int ,year :int , model):
    predictions = []

    for region in df["Region"].unique():
        region_df = df[df["Region"] == region].sort_values("Month")

        last_3 = region_df["Total"].iloc[-3:].values

        next_input = pd.DataFrame({
            "year": [year],
            "month": [month],
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

    return pred_df