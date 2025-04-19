import numpy as np
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
from backend.config import MODEL_PATH

# Load model sekali saja saat pertama
model = load_model(MODEL_PATH)

# Daftar kelas (urutan harus sesuai saat training)
class_names = ['Chicken_Coccidiosis', 'Chicken_Healthy', 'Chicken_NewCastleDisease', 'Chicken_Salmonella']

def predict_image(img_path):
    img = image.load_img(img_path, target_size=(224, 224))
    img_array = image.img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0)
    img_array = img_array / 255.0  # Normalize

    predictions = model.predict(img_array)
    predicted_class = class_names[np.argmax(predictions)]

    return {
        "class_name": predicted_class,
        "confidence": float(np.max(predictions))
    }
