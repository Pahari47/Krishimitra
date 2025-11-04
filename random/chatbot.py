import speech_recognition as sr
import pyttsx3
from gemini_ai import get_gemini_response


engine = pyttsx3.init()
engine.setProperty("rate", 150)  

def speak(text):

    engine.say(text)
    engine.runAndWait()

def listen():
   
    recognizer = sr.Recognizer()
    with sr.Microphone() as source:
        print("🎤 Listening...")
        recognizer.adjust_for_ambient_noise(source)  
        try:
            audio = recognizer.listen(source, timeout=5)
            text = recognizer.recognize_google(audio)
            print(f"🗣 You: {text}")
            return text
        except sr.UnknownValueError:
            print("Could not understand, please try again.")
            return ""
        except sr.RequestError:
            print("Error with speech recognition service.")
            return ""

def chatbot():
    print("\n🌾 Agriculture Chatbot: Type or speak your question (Say 'exit' to stop).")
    
    while True:
        print("\nPress 'Enter' to type or say 'speak' to use voice input.")
        choice = input().strip().lower()
        
        if choice == "speak":
            user_input = listen()
        else:
            user_input = input("You: ")

        if user_input.lower() in ["exit", "quit"]:
            print("👋 Exiting... Goodbye!")
            break
        
        response = get_gemini_response(user_input)
        print(f"🤖 Bot: {response}")
        speak(response)  

if __name__ == "__main__":
    chatbot()
