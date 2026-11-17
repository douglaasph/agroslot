from pathlib import Path

import tensorflow as tf

MODEL_PATH = (
    Path(__file__).parent.parent
    / "models"
    / "modelo_agroslot.keras"
)

CLASS_NAMES = [
    "BACTERIAL_BLIGHT_CRESTAMENTO",
    "FERRUGEM_ASIATICA",
    "MOSAICO_VIRUS",
    "PLANTA_SAUDAVEL",
]

IMAGE_SIZE = (224, 224)

model = tf.keras.models.load_model(MODEL_PATH)