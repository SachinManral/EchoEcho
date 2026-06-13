from __future__ import annotations

import os
import time
from typing import Any

import httpx

try:
    from sheet_generator.lyrics_sheet import generate_lyrics_pdf
except ImportError:  # Allows imports through the backend package.
    from ..sheet_generator.lyrics_sheet import generate_lyrics_pdf

try:
    from dotenv import load_dotenv
except ImportError:  # pragma: no cover - python-dotenv is a normal backend dependency.
    load_dotenv = None

if load_dotenv is not None:
    from pathlib import Path

    BACKEND_DIR = Path(__file__).resolve().parents[1]
    PROJECT_DIR = BACKEND_DIR.parent
    load_dotenv(BACKEND_DIR / ".env")
    load_dotenv(PROJECT_DIR / ".env")


GROQ_CHAT_URL = "https://api.groq.com/openai/v1/chat/completions"
GROQ_MODEL = os.getenv("GROQ_MODEL", "llama-3.1-8b-instant").strip()
GROQ_RETRIES = 3
GROQ_TIMEOUT_SECONDS = 30


class LyricsGenerationError(RuntimeError):
    pass


def _crewai_components() -> tuple[Any, Any, Any, Any]:
    try:
        from crewai import Agent, Crew, LLM, Task
    except ImportError:  # pragma: no cover - depends on optional local install.
        return None, None, None, None
    return Agent, Crew, LLM, Task


def create_lyrics_agent(llm: Any) -> Any:
    Agent, _, _, _ = _crewai_components()
    if Agent is None:
        raise LyricsGenerationError("CrewAI is not installed.")

    return Agent(
        role="Lyricist",
        goal=(
            "Write lyrics that complement the mood, melody, and chord progression. "
            "Include a verse and a chorus. Lyrics should match the rhythmic feel of the melody."
        ),
        backstory=(
            "You are an award-winning lyricist who has written songs across pop, indie, "
            "R&B, and folk. You craft words that feel natural to sing and deepen the "
            "emotional impact of the music."
        ),
        llm=llm,
        verbose=True,
        allow_delegation=False,
    )


def _default_model() -> str | None:
    if os.getenv("GROQ_API_KEY"):
        return f"groq/{GROQ_MODEL}"
    return None


def _create_llm() -> Any:
    _, _, LLM, _ = _crewai_components()
    if LLM is None:
        raise LyricsGenerationError("CrewAI is not installed.")

    model = _default_model()
    if not model:
        raise LyricsGenerationError("No lyrics LLM API key is configured.")
    return LLM(model=model)


def _lyrics_prompt(context: dict[str, Any]) -> str:
    mood = context.get("mood") or "the selected mood"
    genre = context.get("genre") or context.get("style") or "the selected style"
    theme = context.get("theme") or context.get("prompt") or "the song idea"
    tempo = context.get("tempo") or context.get("bpm") or "the chosen"
    prompt = context.get("prompt") or ""
    instruments = context.get("instruments") or []
    instrument_text = ", ".join(instruments) if isinstance(instruments, list) else str(instruments)

    return (
        "Write original, singable lyrics for this generated music idea.\n"
        f"Mood: {mood}\n"
        f"Genre/style: {genre}\n"
        f"Theme: {theme}\n"
        f"Tempo: {tempo} BPM\n"
        f"Instruments: {instrument_text or 'selected instrumentation'}\n"
        f"Music prompt: {prompt}\n\n"
        "Use this structure exactly: [Verse 1], [Chorus], [Verse 2], [Chorus]. "
        "Avoid quoting or imitating existing songs. Return only the lyrics."
    )


def _song_title(context: dict[str, Any]) -> str:
    return str(
        context.get("song_title")
        or context.get("title")
        or context.get("theme")
        or "EchoEcho Lyrics"
    )


def _with_optional_pdf(
    context: dict[str, Any],
    text: str,
    create_pdf: bool,
) -> dict[str, str]:
    result = {"text": text, "structure": "verse/chorus"}
    if create_pdf:
        try:
            result["lyrics_pdf"] = generate_lyrics_pdf(_song_title(context), text)
        except Exception as exc:
            result["lyrics_pdf_error"] = str(exc)
    return result


def _generate_lyrics_with_groq(context: dict[str, Any], create_pdf: bool) -> dict[str, str]:
    api_key = os.getenv("GROQ_API_KEY", "").strip()
    if not api_key:
        raise LyricsGenerationError("No lyrics LLM API key is configured.")

    payload = {
        "model": GROQ_MODEL,
        "messages": [
            {
                "role": "system",
                "content": (
                    "You are an award-winning lyricist. Write concise, original lyrics "
                    "that feel natural to sing and fit the supplied musical mood."
                ),
            },
            {"role": "user", "content": _lyrics_prompt(context)},
        ],
        "temperature": 0.8,
    }
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
    }
    last_error: Exception | None = None

    for attempt in range(1, GROQ_RETRIES + 1):
        try:
            response = httpx.post(
                GROQ_CHAT_URL,
                headers=headers,
                json=payload,
                timeout=GROQ_TIMEOUT_SECONDS,
            )
            response.raise_for_status()
            body = response.json()
            text = str(body["choices"][0]["message"]["content"]).strip()
            if not text:
                raise LyricsGenerationError("Groq returned an empty lyrics response.")
            return _with_optional_pdf(context, text, create_pdf)
        except Exception as exc:
            last_error = exc
            if attempt < GROQ_RETRIES:
                time.sleep(min(2 ** (attempt - 1), 4))

    raise LyricsGenerationError(f"Groq lyrics generation failed: {last_error}")


def generate_lyrics(context: dict[str, Any], create_pdf: bool = True) -> dict[str, str]:
    _, Crew, _, Task = _crewai_components()
    if Crew is None or Task is None:
        return _generate_lyrics_with_groq(context, create_pdf)

    llm = _create_llm()
    agent = create_lyrics_agent(llm)
    task = Task(
        description=_lyrics_prompt(context),
        expected_output=(
            "Original lyrics with section labels [Verse 1], [Chorus], [Verse 2], [Chorus]."
        ),
        agent=agent,
    )
    result = Crew(agents=[agent], tasks=[task], verbose=False).kickoff()
    text = str(result).strip()
    if not text:
        raise LyricsGenerationError("Lyrics agent returned an empty response.")
    return _with_optional_pdf(context, text, create_pdf)
