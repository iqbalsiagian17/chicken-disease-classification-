from flask import Blueprint, request, jsonify
import os
from werkzeug.utils import secure_filename
from config import UPLOAD_FOLDER, ALLOWED_EXTENSIONS
from services.mobilenetv2_predict import predict_image

predict_bp = Blueprint('predict', __name__)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@predict_bp.route('/predict', methods=['POST'])
def predict():
    if 'image' not in request.files:
        return jsonify({'error': 'No image uploaded'}), 400

    file = request.files['image']
    filename = secure_filename(file.filename)

    if not allowed_file(filename):
        return jsonify({'error': 'Invalid file format'}), 400

    # Buat folder upload jika belum ada
    os.makedirs(UPLOAD_FOLDER, exist_ok=True)

    filepath = os.path.join(UPLOAD_FOLDER, filename)
    file.save(filepath)

    result = predict_image(filepath)
    return jsonify(result)
