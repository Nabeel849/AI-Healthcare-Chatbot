from flask import Flask, request, jsonify
from ai_assistant import AI_Assistant 

app = Flask(__name__)
ai_assistant = AI_Assistant()

@app.route('/api/ai-response', methods=['POST'])
def ai_response():
    data = request.json
    user_query = data.get('query', '')
    if not user_query:
        return jsonify({"error": "No query provided"}), 400

    response_text = ai_assistant.generate_ai_response(user_query)
    return jsonify({"response": response_text})


if __name__ == '__main__':
    app.run(debug=True)
