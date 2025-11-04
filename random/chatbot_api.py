from flask import Flask, request, jsonify
from flask_cors import CORS
import speech_recognition as sr
import pyttsx3
from gemini_ai import get_gemini_response

app = Flask(__name__)
CORS(app)

# Initialize speech engine once
engine = pyttsx3.init()
engine.setProperty("rate", 150)

# Initialize recognizer once
recognizer = sr.Recognizer()

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

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)