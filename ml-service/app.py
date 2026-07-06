from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.get("/")
def index():
    return jsonify({
        "service": "SILAPUB SVM ML Service",
        "status": "running"
    })

@app.post("/predict")
def predict():
    return jsonify({
        "success": True,
        "priority": "sedang",
        "message": "Dummy prediction aktif. Model SVM akan ditambahkan pada tahap berikutnya."
    })

if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5001, debug=True)