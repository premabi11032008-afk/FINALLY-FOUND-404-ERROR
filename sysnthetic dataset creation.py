import os
import pandas as pd

base_dir = os.path.dirname(os.path.abspath(__file__))
file_path = os.path.join(base_dir, "synthetic_dataset.csv")

data = pd.read_csv(file_path)
regions = ["North","South","East","West","Central"]

rows = []

for _, row in data.iterrows():
    month = row["Month"]
    a = row["Android Phone"]
    i = row["iPhone"]
    l = row["Laptops"]
    h = row["Headphones"]
    c = row["Chargers"]
    values = [a, i, l, h, c]
    split = []

    for val in values:
        base = val // 5
        remainder = val % 5
        dist = [base + (1 if x < remainder else 0) for x in range(5)]
        split.append(dist)

    for r in range(5):
        android = split[0][r]
        iphone = split[1][r]
        laptops = split[2][r]
        headphones = split[3][r]
        chargers = split[4][r]

        total = android + iphone + laptops + headphones + chargers

        rows.append([month, regions[r], android, iphone, laptops, headphones, chargers, total])

df = pd.DataFrame(rows, columns=["Month","Region","Android","iPhone","Laptops","Headphones","Chargers","Total"])

df.to_csv("synthetic_dataset.csv")