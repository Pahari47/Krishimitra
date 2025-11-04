from flask import Blueprint, request, jsonify
from app.services.crop_service import recommend_crop

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