from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/process', methods=['POST'])
def process_request():
    question = request.json.get('question')

    return jsonify({
        'question': question,
        'status': 'Super status',
        'answer': 'Ответ на вопрос:  ' + question
    })


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001)
