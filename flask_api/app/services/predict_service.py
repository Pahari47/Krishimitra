import numpy as np
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
from PIL import Image
import json
import io

model = load_model("app/models/pest_disease_model.h5")

with open("app/data/class_names.json", "r") as f:
    class_mapping = json.load(f)

def preprocess_image(img_bytes):
    img = Image.open(io.BytesIO(img_bytes))
    img = img.resize((224, 224))

    if img.mode != 'RGB':
        img = img.convert('RGB')

    img_array = image.img_to_array(img) / 255.0
    img_array = np.expand_dims(img_array, axis=0)
    return img_array

def predict_disease(img_bytes):
    img_array = preprocess_image(img_bytes)
    predictions = model.predict(img_array)
    idx = np.argmax(predictions)
    confidence = float(np.max(predictions) * 100)
    idx_str = str(idx)

    result = {
        "class_index": idx_str,
        "confidence": f"{confidence:.2f}%",
        "leaf_name": class_mapping.get(idx_str, {}).get("Leaf Name", "Unknown"),
        "status": class_mapping.get(idx_str, {}).get("Status", "Unknown"),
        "cause": class_mapping.get(idx_str, {}).get("Cause", "Not available"),
        "treatment": class_mapping.get(idx_str, {}).get("Treatment", "Not available"),
        "prevention": class_mapping.get(idx_str, {}).get("Prevention", "Not available"),
    }

    return result