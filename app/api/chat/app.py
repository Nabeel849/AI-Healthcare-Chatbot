from flask import Flask, request, jsonify
from flask_cors import CORS
from ai_assistant import AI_Assistant 


app = Flask(__name__)
CORS(app)
ai_assistant = AI_Assistant()

@app.route('/api/chat', methods=['POST'])
def ai_response():
    data = request.json
    print("Received data:", data)  # Log received data
    user_query = data.get('query', '')
    if not user_query:
        print("No query provided")
        return jsonify({"error": "No query provided"}), 400

    response_text = ai_assistant.generate_ai_response(user_query)
    print("Generated AI response:", response_text)  # Log AI response
    return jsonify({"response": response_text})


if __name__ == '__main__':
    app.run(debug=True)
