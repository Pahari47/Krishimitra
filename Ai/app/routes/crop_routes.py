from flask import Blueprint, request, jsonify
from app.services.crop_service import recommend_crop
from app.services.weather_service import get_weather

crop_bp = Blueprint("crop", __name__, url_prefix="/api")

@crop_bp.post("/recommend")
def crop_recommend_api():
    data = request.get_json()

    soil = data.get("soil", {})
    weather = data.get("weather", {})

    try:
        result = recommend_crop(soil, weather)
        return jsonify({"status": "success", "data": result})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 400
    


@crop_bp.post("/recommend/auto")
def crop_recommended_auto():
    data = request.get_json()
    soil = data.get("soil", {})
    lat = data.get("lat")
    lon = data.get("lon")

    if lat is None or lon is None:
        return jsonify({"status": "error", "message": "lat & lon required"}), 400
    
    weather = get_weather(lat, lon)

    if "error" in weather:
        return jsonify({"status": "error", "message": weather["error"]})
    
    result = recommend_crop(soil, weather)

    return jsonify({
        "success": "success",
        "source": "live_weather",
        "weather": weather,
        "data": result
    })