from flask import Flask, jsonify
from flask_cors import CORS
import os

def create_app():
    app = Flask(__name__)
    CORS(app)

    # Health
    @app.get("/")
    def index():
        return jsonify({
            "status": "ok",
            "service": "Smart Farming solution by Pahari",
            "endpoints": []
        })
    
    from app.routes.crop_routes import crop_bp
    from app.routes.predict_routes import predict_bp

    app.register_blueprint(crop_bp)
    app.register_blueprint(predict_bp)

    
    return app