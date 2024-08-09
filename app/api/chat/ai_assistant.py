import os
from dotenv import load_dotenv
import requests

load_dotenv()
gemini_api_key = os.getenv("GEMINI_API_KEY")

class AI_Assistant:
    def __init__(self):
        self.gemini_api_key = gemini_api_key

        # Initial prompt
        self.full_transcript = [
            {"role": "system", "content": "You are a health care medical assistant. User asks you question and you gives medical advise to the user."},
        ]

    def generate_ai_response(self, transcript_text):
        prompt_text = (f"You are a doctor, and you have to give advice to the user using your information. This is what the user says: {transcript_text}. "
                    "Give your response in 3 lines max. You can't say this: 'Unfortunately, I can't provide medical advice. Please consult a doctor or pharmacist for personalized recommendations on treating coughs and colds.'")

        self.full_transcript.append({"role": "user", "content": prompt_text})
        print(f"\nUser: {prompt_text}")

        response = self.query_gemini(prompt_text)
        if response:
            text = response['candidates'][0]['content']['parts'][0]['text']
            print(f"AI: {text}")
            return text
        else:
            return "Sorry, I couldn't understand the question."


    def query_gemini(self, text):
        headers = {
            "Content-Type": "application/json"
        }

        data = {
            "contents": [
                {
                    "parts": [
                        {"text": text}
                    ]
                }
            ]
        }

        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key={self.gemini_api_key}"
        
        try:
            response = requests.post(url, headers=headers, json=data)
            response.raise_for_status()
            return response.json() 
        except requests.exceptions.RequestException as e:
            print(f"Error querying AI service: {e}")
            return None

if __name__ == "__main__":
    ai_assistant = AI_Assistant()
    ai_assistant.generate_ai_response(["How to cure cough and cold?"])