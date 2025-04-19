import os

# Folder path (absolute)
BASE_DIR = os.path.abspath(os.path.dirname(__file__))

# Path model - update jika kamu pakai MobileNetV2
MODEL_PATH = os.path.join(BASE_DIR, '..', 'models-google-collabs', 'final_model_finetune.h5')

# Upload folder
UPLOAD_FOLDER = os.path.join(BASE_DIR, '..', 'uploads')

# Allowed extensions
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}
