from flask import Blueprint, request, jsonify
from app.services.predict_service import predict_disease

predict_bp = Blueprint("prdict", __name__, url_prefix="/api")

@predict_bp.post("/predict")
def predict_leaf():
    if 'file' not in request.files:
        return jsonify({"status": "error", "mssage": "No file uploaded"}), 400
    
    file = request.files['file']
    if file.filename == "":
        return jsonify({"status": "error", "message": "Empty file"}), 400
    
    try:
        img_bytes = file.read()
        result = predict_disease(img_bytes)
        return jsonify({"status": "success", "data": result})
    
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500