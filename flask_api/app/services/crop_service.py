import pickle
import numpy as np
import pandas as pd

with open("app/models/crop_recommendation.pkl", "rb") as f:
    data = pickle.load(f)
    model = data["model"]
    scaler = data["scaler"]
    encoder = data["encoder"]


def moisture_based_adjustment(crop, moisture):
    """
    Adjust crop suggestion based on soil moisture level
    Returns (crop, explanation_string)
    """
    low_water_crops = ["millet", "sorghum", "maize", "cotton", "groundnut"]
    high_water_crops = ["rice", "sugarcane", "jute"]

    if moisture < 25:
        if crop not in low_water_crops:
            new_crop = np.random.choice(low_water_crops)
            return new_crop, f"Changed due to low soil moisture (<25%). Selected drought-resistant crop: {new_crop}"
    elif moisture > 65:
        if crop not in high_water_crops:
            new_crop = np.random.choice(high_water_crops)
            return new_crop, f"Changed due to high soil moisture (>65%). Selected water-loving crop: {new_crop}"

    return crop, None


def temp_adjustment(crop, soil_temp):
    """
    Adjust crop suggestion based on soil temperature
    Returns (crop, explanation_string)
    """
    cool_crops = ["wheat", "barley", "peas", "potato"]
    hot_crops = ["rice", "maize", "sugarcane", "cotton"]

    if soil_temp < 18:
        if crop not in cool_crops:
            new_crop = np.random.choice(cool_crops)
            return new_crop, f"Changed due to low soil temperature (<18°C). Selected cool-season crop: {new_crop}"
    elif soil_temp > 32:
        if crop not in hot_crops:
            new_crop = np.random.choice(hot_crops)
            return new_crop, f"Changed due to high soil temperature (>32°C). Selected heat-tolerant crop: {new_crop}"

    return crop, None


def recommend_crop(soil, weather):
    """
    soil = { 'N':..., 'P':..., 'K':..., 'ph':..., 'soil_temp':..., 'soil_moisture':... }
    weather = { 'temperature':..., 'humidity':..., 'rainfall':... }
    """

    # ✅ Use DataFrame with proper feature names (fixes StandardScaler warning)
    input_df = pd.DataFrame([{
        "N": soil.get("N", 0),
        "P": soil.get("P", 0),
        "K": soil.get("K", 0),
        "temperature": weather.get("temperature", 0),
        "humidity": weather.get("humidity", 0),
        "ph": soil.get("ph", 0),
        "rainfall": weather.get("rainfall", 0)
    }])

    input_scaled = scaler.transform(input_df)

    prediction = model.predict(input_scaled)[0]

    crop_name = encoder.inverse_transform([prediction])[0]

    # Additional adjustments
    moisture = soil.get("soil_moisture", None)
    soil_temp = soil.get("soil_temp", None)

    reasoning = []

    if moisture is not None:
        crop_name, msg = moisture_based_adjustment(crop_name, moisture)
        if msg:
            reasoning.append(msg)

    if soil_temp is not None:
        crop_name, msg = temp_adjustment(crop_name, soil_temp)
        if msg:
            reasoning.append(msg)

    if not reasoning:
        reasoning.append("Selected crop based on soil nutrients & weather")

    return {
        "recommended_crop": crop_name,
        "reasoning": reasoning,
        "input_used": {
            "N": soil["N"],
            "P": soil["P"],
            "K": soil["K"],
            "temperature": weather["temperature"],
            "humidity": weather["humidity"],
            "ph": soil["ph"],
            "rainfall": weather["rainfall"],
            "soil_temp": soil_temp,
            "soil_moisture": moisture
        }
    }
