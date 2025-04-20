from flask import Flask
from flask_cors import CORS  # Tambah ini
from backend.routes.predict_routes import predict_bp
from backend.config import UPLOAD_FOLDER
import os

app = Flask(__name__)
CORS(app)  # Aktifkan CORS di seluruh route

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

app.register_blueprint(predict_bp)

@app.route('/')
def home():
    return "Chicken Disease Classification API is running! 🚀"


if __name__ == '__main__':
    app.run(debug=True)
