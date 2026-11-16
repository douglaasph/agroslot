from io import BytesIO

import numpy as np
from PIL import Image, ImageOps

from .model import CLASS_NAMES, IMAGE_SIZE, model


def predict_image(image_bytes: bytes) -> dict:
    image = Image.open(BytesIO(image_bytes)).convert("RGB")

    image.thumbnail(IMAGE_SIZE, Image.Resampling.LANCZOS)
    
    delta_w = IMAGE_SIZE[0] - image.size[0]
    delta_h = IMAGE_SIZE[1] - image.size[1]
    padding = (
        delta_w // 2, 
        delta_h // 2, 
        delta_w - (delta_w // 2), 
        delta_h - (delta_h // 2)
    )
    image = ImageOps.expand(image, padding, fill=(0, 0, 0))


    image_array = np.asarray(image, dtype=np.float32)
    image_array = np.expand_dims(image_array, axis=0)

    # Realiza a predição
    probabilities = model.predict(image_array, verbose=0)[0]

    predicted_index = int(np.argmax(probabilities))
    confidence = float(probabilities[predicted_index])

    return {
        "class": CLASS_NAMES[predicted_index],
        "confidence": round(confidence, 6),
        "confidence_percentage": round(confidence * 100, 2),
        "classes": {
            CLASS_NAMES[index]: round(float(value), 6)
            for index, value in enumerate(probabilities)
        },
    }