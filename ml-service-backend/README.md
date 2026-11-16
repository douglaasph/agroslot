# AgroSlot — ML Service Backend

Serviço de IA do **AgroSlot**. Recebe a foto de uma folha de soja e devolve o diagnóstico feito por um modelo de visão computacional (TensorFlow/Keras).

O serviço expõe duas interfaces:

- **API HTTP (FastAPI):** endpoint `POST /predict` para enviar a imagem e `GET /health` para checar o estado.
- **Servidor MCP (Model Context Protocol):** a ferramenta `diagnose_plant`, que recebe a imagem em Base64. Fica montada em `/mcp`.

## Classes reconhecidas

| Classe | Descrição |
|---|---|
| `Bacterial_Blight_Crestamento` | Crestamento bacteriano |
| `Ferrugem_Asiatica` | Ferrugem-asiática |
| `Mosaico_Virus` | Mosaico viral |
| `Planta_Saudavel` | Planta saudável |

## Como funciona

1. A imagem (JPEG ou PNG) é convertida para RGB.
2. Ela é redimensionada mantendo a proporção para caber em **224×224 px** (`thumbnail` com LANCZOS).
3. O espaço que sobra é preenchido com preto (padding), para que a imagem final tenha exatamente 224×224.
4. Os pixels são enviados ao modelo como `float32`, **sem normalização externa**. Qualquer escala de valores precisa estar dentro do próprio modelo.
5. O modelo `models/modelo_agroslot.keras` devolve as probabilidades de cada classe, e a de maior valor vira o diagnóstico.

## Estrutura da pasta

```
ml-service-backend/
├── app/
│   ├── model.py        # carrega o modelo, define classes e tamanho da imagem
│   ├── prediction.py   # pré-processamento e inferência
│   └── server.py       # API FastAPI + servidor MCP
├── models/
│   └── modelo_agroslot.keras
└── requirements.txt
```

## Requisitos

- **Python 3.12**
- Git
- Cerca de 2 GB livres em disco (o TensorFlow é grande)

## Executando no Windows (PowerShell)

### 1. Crie e ative o ambiente virtual

```powershell
py -3.12 -m venv venv
.\venv\Scripts\Activate.ps1
python --version
```

O último comando deve mostrar `Python 3.12.x`.

Se o PowerShell bloquear a ativação ("execução de scripts desabilitada"), rode este comando e ative de novo:

```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
```

### 2. Instale as dependências

```powershell
python -m pip install --upgrade pip
python -m pip install -r requirements.txt
```

Use sempre `python -m pip` no Windows. Chamar `pip` diretamente falha ao tentar atualizar o próprio pip.

### 3. Inicie o servidor

```powershell
python -m uvicorn app.server:app --reload --port 8000
```

Quando aparecer `Application startup complete`, o serviço está no ar.

<br>

## Executando no Linux (Ubuntu/Debian)

### 1. Crie e ative o ambiente virtual

```bash
python3.12 -m venv venv
source venv/bin/activate
python --version
```

### 2. Instale as dependências

```bash
python -m pip install --upgrade pip
python -m pip install -r requirements.txt
```

### 3. Inicie o servidor

```bash
python -m uvicorn app.server:app --reload --port 8000
```

<br>

## Documentação interativa

Abra no navegador:

```
http://localhost:8000/docs
```

Nela você consegue enviar uma imagem ao `/predict` direto pela interface.

## Health check

```bash
curl http://localhost:8000/health
```

Resposta esperada:

```json
{"status": "ok"}
```

## Diagnóstico por imagem

Exemplo de resposta:

```json
{
  "class": "Ferrugem_Asiatica",
  "confidence": 0.972315,
  "confidence_percentage": 97.23,
  "classes": {
    "Bacterial_Blight_Crestamento": 0.01,
    "Ferrugem_Asiatica": 0.972315,
    "Mosaico_Virus": 0.012,
    "Planta_Saudavel": 0.005685
  }
}
```

Os valores acima são só ilustrativos.

<br>

## Endpoints

| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/health` | Verifica se o serviço está no ar |
| `POST` | `/predict` | Recebe `multipart/form-data` com o campo `file` (JPEG ou PNG) e devolve o diagnóstico |
| — | `/mcp` | Servidor MCP (HTTP) com a ferramenta `diagnose_plant` |

### Erros do `/predict`

| Código | Motivo |
|---|---|
| `400` | O tipo do arquivo não é JPEG/PNG, ou o arquivo está vazio |
| `500` | Falha ao processar a imagem ou ao executar o modelo |

## Ferramenta MCP

A ferramenta `diagnose_plant(image_base64: str)` recebe a imagem codificada em Base64 e devolve o mesmo formato de resposta do `/predict`. Ela retorna erro se o texto não for Base64 válido ou se a imagem estiver vazia.

Com o servidor rodando, o endpoint MCP HTTP fica em `http://localhost:8000/mcp`.

### Executando o MCP via stdio

O arquivo `server.py` termina com `mcp.run()` dentro do bloco `if __name__ == "__main__"`. Para usar o servidor como processo MCP local, sem HTTP, execute como módulo (os imports são relativos, então não funciona com `python app/server.py`):

```bash
python -m app.server
```

Esse modo não abre porta HTTP. Ele serve para clientes MCP que iniciam o processo diretamente.

## Dependências principais

- TensorFlow
- FastAPI
- MCP SDK
- Pillow e NumPy
- python-multipart
- OpenCV