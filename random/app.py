from flask import Flask, request, jsonify
from flask_cors import CORS
import speech_recognition as sr
import pyttsx3
import os
import json
import numpy as np
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
import base64
import io
from PIL import Image

app = Flask(__name__)
CORS(app)

# ========== Chatbot Configuration ==========
# Initialize speech engine once
engine = pyttsx3.init()
engine.setProperty("rate", 150)

# Initialize recognizer once
recognizer = sr.Recognizer()

# ========== Plant Disease Model Configuration ==========
# Load model and class names
MODEL_PATH = "model/pest_disease_model.h5"
CLASS_NAMES_PATH = "model/class_names.json"

# Load model
model = load_model(MODEL_PATH)

# Load class names as dictionary
with open(CLASS_NAMES_PATH, "r") as f:
    class_names = json.load(f)

# ========== Helper Functions ==========
def preprocess_image(img_data):
    """Preprocess an image from base64 data"""
    img = Image.open(io.BytesIO(img_data))
    img = img.resize((224, 224))
    img_array = image.img_to_array(img) / 255.0
    img_array = np.expand_dims(img_array, axis=0)
    return img_array

def get_gemini_response(user_input):
    """Mock function - replace with actual Gemini API call"""
    # In a real implementation, you would call the Gemini API here
    return f"AI response to: {user_input}"

# ========== API Endpoints ==========
@app.route('/api/chat', methods=['POST'])
def chat():
    try:
        data = request.get_json()
        user_input = data.get('message', '').strip()
        input_type = data.get('type', 'text')
        
        if input_type == 'speech':
            with sr.Microphone() as source:
                print("🎤 Listening...")
                recognizer.adjust_for_ambient_noise(source, duration=1)
                try:
                    audio = recognizer.listen(source, timeout=5, phrase_time_limit=8)
                    user_input = recognizer.recognize_google(audio)
                    print(f"Recognized speech: {user_input}")
                except sr.WaitTimeoutError:
                    return jsonify({
                        "status": "error",
                        "message": "No speech detected within timeout"
                    })
                except sr.UnknownValueError:
                    return jsonify({
                        "status": "error",
                        "message": "Could not understand audio"
                    })
                except sr.RequestError as e:
                    return jsonify({
                        "status": "error",
                        "message": f"Speech recognition error: {str(e)}"
                    })
        
        if not user_input:
            return jsonify({
                "status": "error",
                "message": "Empty input received"
            })
        
        if user_input.lower() in ["exit", "quit"]:
            return jsonify({
                "status": "success",
                "response": "Goodbye! Have a great day!"
            })
        
        response = get_gemini_response(user_input)
        return jsonify({
            "status": "success",
            "response": response,
            "user_input": user_input  # Return the recognized input
        })
        
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": f"An error occurred: {str(e)}"
        }), 500

@app.route('/api/speak', methods=['POST'])
def speak():
    try:
        data = request.get_json()
        text = data.get('text', '').strip()
        
        if not text:
            return jsonify({
                "status": "error",
                "message": "No text provided"
            })
        
        engine.say(text)
        engine.runAndWait()
        return jsonify({"status": "success"})
        
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": f"Speech synthesis failed: {str(e)}"
        }), 500

@app.route("/api/predict", methods=["POST"])
def predict():
    # First check for file upload
    if 'file' not in request.files:
        return jsonify({"error": "No file part in the request"}), 400
    
    file = request.files['file']
    
    # Check if file was actually uploaded
    if file.filename == '':
        return jsonify({"error": "No file selected"}), 400
    
    # Verify it's an image file
    if not allowed_file(file.filename):
        return jsonify({"error": "Invalid file type. Only images are allowed."}), 400
    
    try:
        # Read and verify the image
        img_data = file.read()
        img = Image.open(io.BytesIO(img_data))
        img.verify()  # Verify it's actually an image
        
        # Process the image
        img = Image.open(io.BytesIO(img_data))  # Reopen after verify
        img = img.resize((224, 224))
        
        # Convert to RGB if needed
        if img.mode != 'RGB':
            img = img.convert('RGB')
            
        img_array = image.img_to_array(img) / 255.0
        img_array = np.expand_dims(img_array, axis=0)
        
        # Make prediction
        predictions = model.predict(img_array)
        predicted_class_idx = np.argmax(predictions)
        confidence = np.max(predictions) * 100
        predicted_class_idx_str = str(predicted_class_idx)
        
        # Get class info
        result = {
            "leaf_name": "Unknown",
            "status": "Unknown",
            "confidence": f"{confidence:.2f}%"
        }
        
        if predicted_class_idx_str in class_names:
            result.update({
               "leaf_name": class_names[predicted_class_idx_str].get("Leaf Name", "Unknown"),
    "status": class_names[predicted_class_idx_str].get("Status", "Unknown"),
    "confidence": f"{confidence:.2f}%",
    "cause": class_names[predicted_class_idx_str].get("Cause", "Not available"),
    "treatment": class_names[predicted_class_idx_str].get("Treatment", "Not available"),
    "prevention": class_names[predicted_class_idx_str].get("Prevention", "Not available"),
    "class_index": predicted_class_idx_str  # For debugging
            })
        
        return jsonify(result)
        
    except Exception as e:
        return jsonify({"error": f"Image processing failed: {str(e)}"}), 400

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in {'png', 'jpg', 'jpeg', 'gif'}

@app.route('/')
def index():
    return """
    <h1>API Server Running</h1>
    <p>Available endpoints:</p>
    <ul>
        <li>POST /api/chat - Chatbot endpoint</li>
        <li>POST /api/speak - Text-to-speech endpoint</li>
        <li>POST /api/predict - Plant disease prediction</li>
    </ul>
    """

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)