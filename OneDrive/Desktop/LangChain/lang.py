from dotenv import load_dotenv
import os
from google import genai

# Cargar .env
load_dotenv()
api_key = os.getenv("GOOGLE_API_KEY")
if not api_key:
    raise ValueError("No se encontró GOOGLE_API_KEY en .env")

# Crear cliente
client = genai.Client(api_key=api_key)

# Modelo válido (asegúrate de usar uno publicado oficialmente)
model_name = "gemini-2.5-flash"

try:
    response = client.models.generate_content(
        model=model_name,
        contents="hola me puedes decir que es la otan?"
    )
    print("\nRespuesta de Gemini:")
    print(response.text)

except Exception as e:
    print("Error al inicializar o usar Gemini:")
    print(e)

