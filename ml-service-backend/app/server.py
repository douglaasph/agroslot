import base64
from contextlib import asynccontextmanager

from fastapi import FastAPI, File, HTTPException, UploadFile
from mcp.server import MCPServer

from .prediction import predict_image

# 1. Cria a instância do MCP
mcp = MCPServer("Modelo de IA AgroSlot")

# 2. Cria o app ASGI do MCP, instruindo-o a servir na raiz ('/') do seu próprio sub-app
mcp_app = mcp.streamable_http_app(streamable_http_path="/")

# 3. Define o lifespan do FastAPI, que gerenciará o ciclo de vida do MCP
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Inicia o gerenciador de sessões do MCP
    async with mcp.session_manager.run():
        yield

# 4. Cria o app FastAPI passando o lifespan
app = FastAPI(title="Serviço de IA AgroSlot", lifespan=lifespan)


@mcp.tool()
def diagnose_plant(image_base64: str) -> dict:
    try:
        image_bytes = base64.b64decode(image_base64, validate=True)
    except Exception as error:
        raise ValueError("O texto enviado não é um Base64 válido.") from error

    if not image_bytes:
        raise ValueError("A imagem enviada está vazia.")

    try:
        return predict_image(image_bytes)
    except Exception as error:
        raise ValueError(
            f"Erro ao processar a imagem: {str(error)}"
        ) from error


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    if file.content_type not in {"image/jpeg", "image/png"}:
        raise HTTPException(
            status_code=400,
            detail="Apenas imagens JPEG e PNG são permitidas.",
        )

    image_bytes = await file.read()

    if not image_bytes:
        raise HTTPException(
            status_code=400,
            detail="A imagem enviada está vazia.",
        )

    try:
        return predict_image(image_bytes)
    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=f"Erro ao processar a imagem: {error}",
        ) from error

# 5. Monta o app do MCP no caminho '/mcp'
app.mount("/mcp", mcp_app)


if __name__ == "__main__":
    mcp.run()