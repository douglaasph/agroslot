from pathlib import Path

import tensorflow as tf

MODEL_PATH = (
    Path(__file__).parent.parent
    / "models"
    / "modelo_agroslot.keras"
)

CLASS_NAMES = [
    "Bacterial_Blight_Crestamento",
    "Ferrugem_Asiatica",
    "Mosaico_Virus",
    "Planta_Saudavel",
]

IMAGE_SIZE = (224, 224)

model = tf.keras.models.load_model(MODEL_PATH)