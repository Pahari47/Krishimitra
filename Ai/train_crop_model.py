import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.ensemble import RandomForestClassifier
import pickle

df = pd.read_csv("app/data/crop_recommendation.csv")

X = df.drop("label", axis=1)
y = df["label"]

label_encoder = LabelEncoder()
y_encoded = label_encoder.fit_transform(y)

scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

X_train, X_test, y_train, y_test = train_test_split(
    X_scaled, y_encoded, test_size=0.2, random_state=42
)


model = RandomForestClassifier(n_estimators=200, random_state=42)
model.fit(X_train, y_train)

accuracy = model.score(X_test, y_test)
print(f"Model train successfully! Accuracy: {accuracy:.2f}")

with open("app/models/crop_recommendation.pkl", "wb") as f:
    pickle.dump({
        "model": model,
        "scaler": scaler,
        "encoder": label_encoder
    }, f)

print("Saved as crop_recommendation.pkl")
