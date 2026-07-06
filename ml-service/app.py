import re

import numpy as np
from flask import Flask, jsonify, request
from flask_cors import CORS
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.svm import LinearSVC

VALID_LABELS = {"tinggi", "sedang", "rendah"}

app = Flask(__name__)
CORS(app)


def normalize_text(text):
    text = text.lower()
    text = re.sub(r"[^a-z0-9\s]", " ", text)
    return re.sub(r"\s+", " ", text).strip()


@app.get("/")
def index():
    return jsonify({
        "service": "SILAPUB SVM ML Service",
        "status": "running",
    })


@app.get("/health")
@app.post("/health")
def health():
    return jsonify({"success": True, "status": "healthy"})


@app.post("/predict")
def predict():
    payload = request.get_json(silent=True) or {}
    text = payload.get("text")
    training_data = payload.get("training_data")

    if not isinstance(text, str) or not text.strip():
        return jsonify({"success": False, "message": "Text is required"}), 400

    if not isinstance(training_data, list):
        return jsonify({"success": False, "message": "Training data must be a list"}), 400

    texts = []
    labels = []

    for item in training_data:
        item_text = item.get("text") if isinstance(item, dict) else None
        label = item.get("label") if isinstance(item, dict) else None

        if not isinstance(item_text, str) or not item_text.strip():
            return jsonify({"success": False, "message": "Every training item must have text"}), 400

        if label not in VALID_LABELS:
            return jsonify({"success": False, "message": "Every training item must have a valid label"}), 400

        texts.append(normalize_text(item_text))
        labels.append(label)

    if len(set(labels)) < 2:
        return jsonify({"success": False, "message": "Training data must contain at least 2 labels"}), 400

    vectorizer = TfidfVectorizer()
    train_vectors = vectorizer.fit_transform(texts)
    model = LinearSVC()
    model.fit(train_vectors, labels)

    prediction_vector = vectorizer.transform([normalize_text(text)])
    priority = model.predict(prediction_vector)[0]
    decision = model.decision_function(prediction_vector)
    max_score = float(np.max(decision)) if np.ndim(decision) > 1 else float(decision[0])
    score = round(1 / (1 + np.exp(-max_score)), 4)

    return jsonify({
        "success": True,
        "priority": priority,
        "score": score,
        "message": "Prediction completed",
    })


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5001, debug=True)
