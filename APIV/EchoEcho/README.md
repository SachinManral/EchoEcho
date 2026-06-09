# EchoEcho

EchoEcho is a lightweight AI songwriting inspiration notebook. Pick a mood, theme, style, instruments, energy, and tempo; the FastAPI backend sends the prompt to the KieAI Suno API, saves the original full MP3 locally, and keeps a persistent JSON history. A 30 second trim can be created later from the website.

## Stack

- Frontend: HTML, CSS, vanilla JavaScript
- Backend: FastAPI
- Generation: KieAI Suno API
- Storage: JSON and local audio files

## Setup on Windows PowerShell

1. Create a virtual environment.

```powershell
python -m venv .venv
```

2. Activate it.

```powershell
.venv\Scripts\Activate.ps1
```

3. Install dependencies.

```powershell
pip install -r requirements.txt
```

4. Optional: install FFmpeg if you want to create 30 second trims. Full KieAI generation does not require FFmpeg.

```powershell
winget install Gyan.FFmpeg
ffmpeg -version
```

If `ffmpeg -version` is not found after installation, close and reopen PowerShell so PATH is refreshed. Without FFmpeg, original MP3 generation still works; the trim endpoint returns a friendly error.

5. Add your KieAI key and public callback URL to `.env`.

```env
KIEAI_API_KEY=your_key_here
PUBLIC_BASE_URL=https://your-public-domain-or-ngrok-url
KIEAI_CALLBACK_PATH=/api/kieai/callback
TRIM_DURATION_SECONDS=30
```

KieAI requires `callBackUrl` when creating Suno generation tasks. EchoEcho builds it as:

```text
PUBLIC_BASE_URL.rstrip("/") + KIEAI_CALLBACK_PATH
```

`PUBLIC_BASE_URL` must be reachable from the public internet. `http://localhost:8000` and `http://127.0.0.1:8000` are not valid for external callbacks unless exposed through a tunnel.

For local development with ngrok:

```powershell
ngrok http 8000
```

Then copy the HTTPS forwarding URL into `.env`:

```env
PUBLIC_BASE_URL=https://xxxx.ngrok-free.app
KIEAI_CALLBACK_PATH=/api/kieai/callback
```

Close and restart Uvicorn after changing `.env`.

6. Start the app.

```powershell
uvicorn backend.main:app --reload
```

Open `http://127.0.0.1:8000`.

The frontend is plain HTML, CSS, and JavaScript. FastAPI serves `frontend/index.html`, `frontend/styles.css`, and `frontend/script.js` directly, so there is no frontend build step.

If you serve the frontend separately on another local port, the JavaScript automatically sends API requests to `http://127.0.0.1:8000`. You can override this in the browser before loading `script.js` by setting `window.ECHOECHO_API_BASE`.

## Test

```powershell
.venv\Scripts\Activate.ps1
pytest -q
```

## Endpoints

- `POST /generate`
- `POST /api/generate`
- `POST /generate-inspiration`
- `POST /api/library/{code}/trim`
- `POST /api/kieai/callback`
- `POST /kieai/callback`
- `GET /status`
- `GET /history`
- `GET /inspirations`
- `GET /library/refresh`
- `GET /api/kieai/callbacks`
- `GET /song/{song_id}`
- `GET /download/{code}`
- `GET /download/{code}/original`
- `GET /download/{code}/trimmed`
- `GET /favicon.ico`

## Files

- Original generated MP3 files are saved as `backend/generated/ECHO_{code}_original.mp3`.
- Optional trimmed MP3 files are saved as `backend/generated/ECHO_{code}_trimmed.mp3`.
- History is appended to `backend/song_history.json`.
- KieAI callback events are appended to `backend/kieai_callbacks.json`.
- Song IDs are unique four-letter uppercase IDs.

## Notes

KieAI generation can take a while. The frontend keeps a compact progress bar, elapsed time, and estimated remaining time running while the `/generate` request is active. Generation saves the original MP3 first and never trims automatically. If KieAI rejects the request or generation fails, the UI stops progress and shows a friendly error while the backend logs the sanitized KieAI response.
