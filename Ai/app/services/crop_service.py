import pickle
import numpy as np

with open("app/models/crop_recommendation.pkl", "rb") as f:
    data = pickle.load(f)
    model = data["model"]
    scaler = data["scaler"]
    encoder = data["encoder"]

def moisture_based_adjustment(crop, moisture):
    """
    Adjust crop suggestion based on soil moisture level
    """
    low_water_crops = ["millet", "sorghum", "maize", "cotton", "groundnut"]
    high_water_crops = ["rice", "sugarcane", "jute"]

    if moisture < 25:
        if crop not in low_water_crops:
            return np.random.choice(low_water_crops)
    elif moisture > 65:
        if crop not in high_water_crops:
            return np.random.choice(high_water_crops)
    
    return crop


def temp_adjustment(crop, soil_temp):
    """
    Adjust crop suggestion based on soil temperature
    """
    cool_crops = ["wheat", "barley", "peas", "potato"]
    hot_crops = ["rice", "maize", "sugarcane", "cotton"]

    if soil_temp < 18:
        if crop not in cool_crops:
            return np.random.choice(cool_crops)
    elif soil_temp > 32:
        if crop not in hot_crops:
            return np.random.choice(hot_crops)
        
    return crop

def recommend_crop(soil, weather):
    """
    soil = { 'N':..., 'P':..., 'K':..., 'ph':..., 'soil_temp':..., 'soil_moisture':... }
    weather = { 'temperature':..., 'humidity':..., 'rainfall':... }
    """

    input_data = np.array([[
        soil.get("N", 0),
        soil.get("P", 0),
        soil.get("K", 0),
        weather.get("temperature", 0),
        weather.get("humidity", 0),
        soil.get("ph", 0),
        weather.get("rainfall", 0)
    ]])

    input_scaled = scaler.transform(input_data)
    prediction = model.predict(input_scaled)[0]
    crop_name = encoder.inverse_transform([prediction])[0]

    moisture = soil.get("soil_moisture", None)
    soil_temp = soil.get("soil_temp", None)

    explanation = []

    if moisture is not None:
        crop_name, msg = moisture_based_adjustment(crop_name, moisture)
        explanation.append(msg)

    if soil_temp is not None:
        crop_name, msg = temp_adjustment(crop_name, soil_temp)
        explanation.append(msg)

    if not explanation:
        explanation.append("Selected crop based on soil nutrients & weather")


    return {
        "recommended_crop": crop_name,
        "reasoning": explanation,
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
