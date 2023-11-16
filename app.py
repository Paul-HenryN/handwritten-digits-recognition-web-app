from flask import Flask, render_template, request
import numpy as np
from PIL import Image
import matplotlib.pyplot as plt
from src.logistic_regression import model

app = Flask(__name__)


@app.route("/", methods=["GET"])
def hello_world():
    return render_template("index.html")


@app.route("/predict", methods=["POST"])
def predict():
    body = request.json

    raw_img_data = np.array(body.get("data")).reshape(250, 250, -1).astype("uint8")

    cleaned_img_data = np.array(
        Image.fromarray(raw_img_data).convert("L").resize((28, 28))
    )

    prediction = model.predict(cleaned_img_data.reshape(1, -1))[0]

    probs = list(model.predict_proba(cleaned_img_data.reshape(1, -1))[0])

    return {"prediction": int(prediction), "probs": probs}
