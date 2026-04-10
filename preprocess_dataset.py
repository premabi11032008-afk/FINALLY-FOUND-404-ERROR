import pandas as pd

def preprocess_csv(csv_file_name):
    
    df = pd.read_csv(csv_file_name)
    df["Month"] = pd.to_datetime(df["Month"])
    df = df.sort_values(["Region", "Month"])

    # Time features
    df["year"] = df["Month"].dt.year
    df["month"] = df["Month"].dt.month

    # Lag features
    for lag in [1, 2, 3]:
        df[f"lag_{lag}"] = df.groupby("Region")["Total"].shift(lag)

    # Rolling mean
    df["rolling_mean_3"] = df.groupby("Region")["Total"].shift(1).rolling(3).mean()

    # Drop NaNs
    df = df.dropna()

    return df