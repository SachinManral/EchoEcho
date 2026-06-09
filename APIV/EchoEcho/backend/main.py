from __future__ import annotations

import json
import logging
from contextlib import asynccontextmanager
from collections.abc import AsyncIterator
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, Field

from .suno_generator import (
    GenerationInput,
    KieAIConfigError,
    KieAIResponseError,
    generate_song,
    get_callback_path,
    get_default_trim_duration_seconds,
    trim_audio,
    validate_kieai_config,
)


BASE_DIR = Path(__file__).resolve().parent
PROJECT_DIR = BASE_DIR.parent
FRONTEND_DIR = PROJECT_DIR / "frontend"
GENERATED_DIR = BASE_DIR / "generated"
STATIC_DIR = BASE_DIR / "static"
HISTORY_FILE = BASE_DIR / "song_history.json"
CALLBACK_FILE = BASE_DIR / "kieai_callbacks.json"

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(levelname)s [EchoEcho] %(message)s",
)
logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(_: FastAPI) -> AsyncIterator[None]:
    ensure_files()
    validate_kieai_config()
    yield


app = FastAPI(title="EchoEcho", version="1.0.0", lifespan=lifespan)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class GenerateRequest(BaseModel):
    mood: str
    theme: str
    style: str
    instruments: list[str] = Field(default_factory=list)
    tempo: int = Field(ge=60, le=160)
    energy: int = Field(ge=1, le=10)


class TrimRequest(BaseModel):
    duration_seconds: int | None = Field(default=None, ge=1, le=600)
    force: bool = False


def ensure_files() -> None:
    GENERATED_DIR.mkdir(parents=True, exist_ok=True)
    STATIC_DIR.mkdir(parents=True, exist_ok=True)
    if not HISTORY_FILE.exists():
        HISTORY_FILE.write_text("[]", encoding="utf-8")
    if not CALLBACK_FILE.exists():
        CALLBACK_FILE.write_text("[]", encoding="utf-8")


ensure_files()


def read_history() -> list[dict[str, Any]]:
    ensure_files()
    try:
        raw = HISTORY_FILE.read_text(encoding="utf-8").strip()
        history = json.loads(raw or "[]")
        return history if isinstance(history, list) else []
    except json.JSONDecodeError:
        logger.exception("History file is not valid JSON")
        return []


def write_history(history: list[dict[str, Any]]) -> None:
    HISTORY_FILE.write_text(json.dumps(history, indent=2), encoding="utf-8")


def record_code(record: dict[str, Any]) -> str:
    return str(record.get("code") or record.get("song_id") or "").upper()


def original_filename(record: dict[str, Any]) -> str | None:
    filename = record.get("original_audio_filename")
    if filename:
        return Path(str(filename)).name
    code = record_code(record)
    if record.get("audio_file"):
        return Path(str(record["audio_file"])).name
    return f"ECHO_{code}_original.mp3" if code else None


def trimmed_filename(record: dict[str, Any]) -> str | None:
    filename = record.get("trimmed_audio_filename")
    return Path(str(filename)).name if filename else None


def find_history_record(code: str) -> tuple[list[dict[str, Any]], dict[str, Any] | None]:
    normalized = code.upper()
    history = read_history()
    for record in history:
        if record_code(record) == normalized:
            return history, record
    return history, None


def read_callbacks() -> list[dict[str, Any]]:
    ensure_files()
    try:
        raw = CALLBACK_FILE.read_text(encoding="utf-8").strip()
        callbacks = json.loads(raw or "[]")
        return callbacks if isinstance(callbacks, list) else []
    except json.JSONDecodeError:
        logger.exception("KieAI callback file is not valid JSON")
        return []


def write_callbacks(callbacks: list[dict[str, Any]]) -> None:
    CALLBACK_FILE.write_text(json.dumps(callbacks, indent=2), encoding="utf-8")


def callback_task_id(payload: dict[str, Any]) -> str | None:
    data = payload.get("data") if isinstance(payload.get("data"), dict) else {}
    task_id = data.get("taskId") or data.get("task_id")
    return str(task_id) if task_id else None


def callback_type(payload: dict[str, Any]) -> str | None:
    data = payload.get("data") if isinstance(payload.get("data"), dict) else {}
    value = data.get("callbackType") or data.get("status")
    return str(value) if value else None


def store_callback(payload: dict[str, Any]) -> dict[str, Any]:
    received_at = datetime.now(timezone.utc).isoformat()
    task_id = callback_task_id(payload)
    status = callback_type(payload)
    callbacks = read_callbacks()
    event = {
        "received_at": received_at,
        "task_id": task_id,
        "status": status,
        "payload": payload,
    }
    callbacks.append(event)
    write_callbacks(callbacks)

    if task_id:
        history = read_history()
        updated = False
        for record in history:
            if record.get("task_id") == task_id:
                record["callback_status"] = status
                record["callback_received_at"] = received_at
                record["callback_payload"] = payload
                updated = True
        if updated:
            write_history(history)

    return event


def with_urls(record: dict[str, Any]) -> dict[str, Any]:
    code = record_code(record)
    original = original_filename(record)
    trimmed = trimmed_filename(record)
    return {
        **record,
        "code": code,
        "song_id": code,
        "original_audio_url": f"/generated/{original}" if original else None,
        "original_download_url": f"/download/{code}/original" if code else None,
        "trimmed_audio_url": f"/generated/{trimmed}" if trimmed else None,
        "trimmed_download_url": f"/download/{code}/trimmed" if trimmed else None,
        "audio_url": f"/generated/{original}" if original else None,
        "download_url": f"/download/{code}/original" if code else None,
    }


@app.post("/generate")
@app.post("/api/generate")
async def generate(request: GenerateRequest) -> dict[str, Any]:
    try:
        history = read_history()
        existing_ids = {item.get("song_id") for item in history}
        generated = await generate_song(
            GenerationInput(
                mood=request.mood,
                theme=request.theme,
                style=request.style,
                instruments=request.instruments,
                tempo=request.tempo,
                energy=request.energy,
            ),
            generated_dir=GENERATED_DIR,
            existing_ids=existing_ids,
        )
        history.append(generated)
        write_history(history)
        logger.info("History appended for song_id=%s", generated["song_id"])
        return {"ok": True, "song": with_urls(generated)}
    except KieAIConfigError as exc:
        logger.error("KieAI configuration error: %s", exc)
        raise HTTPException(status_code=500, detail=str(exc)) from exc
    except KieAIResponseError as exc:
        logger.error("KieAI request error: %s", exc)
        raise HTTPException(status_code=502, detail=str(exc)) from exc
    except Exception as exc:
        logger.exception("Generation failed")
        raise HTTPException(status_code=500, detail="Song generation failed. Please try again.") from exc


@app.post("/generate-inspiration")
async def generate_inspiration(request: GenerateRequest) -> dict[str, Any]:
    return await generate(request)


@app.get("/status")
def status() -> dict[str, Any]:
    return {
        "ok": True,
        "service": "EchoEcho",
        "history_count": len(read_history()),
    }


@app.get("/history")
def history() -> dict[str, Any]:
    records = [with_urls(item) for item in read_history()]
    return {"songs": list(reversed(records))}


@app.get("/inspirations")
def inspirations() -> dict[str, Any]:
    return history()


@app.get("/library/refresh")
def refresh_library() -> dict[str, Any]:
    return history()


@app.post("/api/library/{code}/trim")
def trim_library_item(code: str, request: TrimRequest | None = None) -> dict[str, Any]:
    request = request or TrimRequest()
    history, record = find_history_record(code)
    if not record:
        raise HTTPException(status_code=404, detail="Library item not found.")

    normalized = record_code(record)
    source_name = original_filename(record)
    if not source_name:
        raise HTTPException(status_code=404, detail="Original audio file is missing from metadata.")

    source = GENERATED_DIR / source_name
    if not source.exists():
        raise HTTPException(status_code=404, detail="Original audio file was not found on disk.")

    destination_name = f"ECHO_{normalized}_trimmed.mp3"
    destination = GENERATED_DIR / destination_name
    if destination.exists() and not request.force:
        record["trimmed_audio_filename"] = destination_name
        write_history(history)
        return {"ok": True, "song": with_urls(record)}

    duration = request.duration_seconds or get_default_trim_duration_seconds()
    try:
        trim_audio(source, destination, duration_seconds=duration)
    except RuntimeError as exc:
        if "FFmpeg is required for trimming" in str(exc):
            raise HTTPException(status_code=500, detail=str(exc)) from exc
        raise

    record["trimmed_audio_filename"] = destination_name
    record["trimmed_duration_seconds"] = duration
    record["trimmed_created_at"] = datetime.now(timezone.utc).isoformat()
    write_history(history)
    return {"ok": True, "song": with_urls(record)}


def kieai_callback(payload: dict[str, Any]) -> dict[str, Any]:
    event = store_callback(payload)
    logger.info(
        "KieAI callback received task_id=%s status=%s",
        event.get("task_id") or "unknown",
        event.get("status") or "unknown",
    )
    return {"ok": True, "status": "received"}


for callback_route in dict.fromkeys((get_callback_path(), "/api/kieai/callback", "/kieai/callback")):
    app.add_api_route(callback_route, kieai_callback, methods=["POST"])


@app.get("/api/kieai/callbacks")
def kieai_callbacks() -> dict[str, Any]:
    return {"callbacks": read_callbacks()}


@app.get("/song/{song_id}")
def song(song_id: str) -> dict[str, Any]:
    normalized = song_id.upper()
    for record in read_history():
        if record_code(record) == normalized:
            return {"song": with_urls(record)}
    raise HTTPException(status_code=404, detail="Song not found")


@app.get("/download/{code}")
def download(code: str) -> FileResponse:
    return download_original(code)


@app.get("/download/{code}/original")
def download_original(code: str) -> FileResponse:
    _, record = find_history_record(code)
    if not record:
        raise HTTPException(status_code=404, detail="Library item not found.")
    filename = original_filename(record)
    if not filename:
        raise HTTPException(status_code=404, detail="Original audio file not found")
    path = GENERATED_DIR / filename
    if not path.exists():
        raise HTTPException(status_code=404, detail="Original audio file not found")
    return FileResponse(path, media_type="audio/mpeg", filename=filename)


@app.get("/download/{code}/trimmed")
def download_trimmed(code: str) -> FileResponse:
    _, record = find_history_record(code)
    if not record:
        raise HTTPException(status_code=404, detail="Library item not found.")
    filename = trimmed_filename(record)
    if not filename:
        raise HTTPException(status_code=404, detail="Trimmed audio file not found")
    path = GENERATED_DIR / filename
    if not path.exists():
        raise HTTPException(status_code=404, detail="Trimmed audio file not found")
    return FileResponse(path, media_type="audio/mpeg", filename=filename)


@app.get("/favicon.ico")
def favicon() -> FileResponse:
    path = STATIC_DIR / "favicon.ico"
    if not path.exists():
        raise HTTPException(status_code=404, detail="Favicon not found")
    return FileResponse(path)


app.mount("/generated", StaticFiles(directory=GENERATED_DIR), name="generated")
app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")
app.mount("/", StaticFiles(directory=FRONTEND_DIR, html=True), name="frontend")
