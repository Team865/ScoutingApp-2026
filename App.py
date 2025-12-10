from flask import Flask, render_template, request, send_from_directory
from datetime import datetime

app = Flask(__name__, static_url_path="", static_folder=".")

@app.route("/")
def index():
    return send_from_directory(".", "index.html")

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
