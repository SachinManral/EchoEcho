import os
import json
import re
from crewai import Crew, Process, LLM

from agents import (
    create_mood_agent, create_chord_agent, create_melody_agent,
    create_lyrics_agent, create_sync_agent, create_judge_agent,
)
from tasks import (
    create_mood_task, create_chord_task, create_melody_task,
    create_lyrics_task, create_sync_task, create_judge_task,
)

# ── JSON helpers ──────────────────────────────────────────────────────────────

def _extract_json(text: str) -> dict:
    """Parse JSON from agent output — tries multiple strategies."""
    text = text.strip()
    # Strip markdown fences
    text = re.sub(r"^```(?:json)?\s*", "", text, flags=re.MULTILINE)
    text = re.sub(r"\s*```$", "", text, flags=re.MULTILINE)
    text = text.strip()

    # 1. Direct parse
    try:
        return json.loads(text)
    except (json.JSONDecodeError, ValueError):
        pass

    # 2. Find first complete {...} block in prose
    match = re.search(r'\{[\s\S]*\}', text)
    if match:
        try:
            return json.loads(match.group())
        except (json.JSONDecodeError, ValueError):
            pass

    return {"raw": text}


# ── Domain-specific rescue extractors ────────────────────────────────────────

_NOTE_RE   = re.compile(r'\b([A-G][#b]?[2-6])\b')
_DUR_RE    = re.compile(r'\b(whole|half|quarter|eighth|sixteenth)\b', re.I)
_CHORD_RE  = re.compile(
    r'\b([A-G][#b]?(?:m(?:aj)?[679]?|maj[79]|[679]|dim[7]?|aug|sus[24]|add9|m[679])?)\b'
)


def _rescue_melody(out: dict) -> dict:
    """If notes[] is missing/empty, try to extract pitches from raw text."""
    if out.get("notes"):
        return out
    raw = out.get("raw", "")
    if not raw:
        return out
    pitches = _NOTE_RE.findall(raw)
    if not pitches:
        return out
    durations = _DUR_RE.findall(raw)
    notes = []
    for i, pitch in enumerate(pitches[:16]):
        dur = durations[i].lower() if i < len(durations) else "quarter"
        notes.append({"pitch": pitch, "duration": dur})
    out["notes"] = notes
    return out


def _rescue_chords(out: dict) -> dict:
    """If progression[] is missing/empty, try to extract chord names from raw text."""
    if out.get("progression"):
        return out
    raw = out.get("raw", "")
    if not raw:
        return out
    found = _CHORD_RE.findall(raw)
    # Deduplicate while preserving order, skip single bare letters that are likely prose
    seen, unique = set(), []
    for c in found:
        key = c.lower()
        if key not in seen and (len(c) > 1 or c in list("CDEFGAB")):
            seen.add(key)
            unique.append(c)
        if len(unique) == 8:
            break
    if unique:
        out["progression"] = unique
    return out


def _rescue_lyrics(out: dict) -> dict:
    """If verse/chorus are missing, try to extract from raw text."""
    if out.get("verse") or out.get("chorus"):
        return out
    raw = out.get("raw", "")
    if not raw:
        return out
    verse_m  = re.search(r'(?:verse\s*[:\-]?\s*\n?)([\s\S]+?)(?=\n\s*(?:chorus|bridge|hook|$))', raw, re.I)
    chorus_m = re.search(r'(?:chorus\s*[:\-]?\s*\n?)([\s\S]+?)(?=\n\s*(?:verse|bridge|outro|$))', raw, re.I)
    if verse_m:  out["verse"]  = verse_m.group(1).strip()
    if chorus_m: out["chorus"] = chorus_m.group(1).strip()
    return out


# ── LLM factories ─────────────────────────────────────────────────────────────

# Groq-only fallback chain — all currently active models (June 2025)
# TPD: llama-3.3-70b=100K, llama-3.1-8b=500K, gemma2-9b=500K, deepseek-r1=100K
GROQ_MODELS = [
    "groq/llama-3.3-70b-versatile",
    "groq/llama-3.1-8b-instant",
    "groq/gemma2-9b-it",
    "groq/deepseek-r1-distill-llama-70b",
    "groq/llama3-groq-70b-8192-tool-use-preview",
    "groq/llama3-groq-8b-8192-tool-use-preview",
    "groq/llama-3.2-3b-preview",
]

def build_groq_llm(temperature: float = 0.7, model: str = GROQ_MODELS[0]) -> LLM:
    return LLM(
        model=model,
        api_key=os.getenv("GROQ_API_KEY"),
        temperature=temperature,
    )


def build_gemini_llm(temperature: float = 0.4) -> LLM:
    return LLM(
        model="gemini/gemini-1.5-flash-latest",
        api_key=os.getenv("GEMINI_API_KEY"),
        temperature=temperature,
    )


def get_best_llm(temperature: float = 0.7) -> LLM:
    """Try each Groq model in order; fall back to Gemini if no Groq key."""
    groq_key = os.getenv("GROQ_API_KEY")
    if not groq_key:
        return build_gemini_llm(temperature)
    # Always start from first model — actual fallback happens in run_music_crew
    return build_groq_llm(temperature, GROQ_MODELS[0])


def get_judge_llm() -> LLM:
    return get_best_llm(temperature=0.4)


def _build_crew(llm: LLM, user_prompt: str):
    """Build a fresh crew with the given LLM."""
    mood_agent   = create_mood_agent(llm)
    chord_agent  = create_chord_agent(llm)
    melody_agent = create_melody_agent(llm)
    lyrics_agent = create_lyrics_agent(llm)
    sync_agent   = create_sync_agent(llm)
    judge_agent  = create_judge_agent(llm)

    mood_task   = create_mood_task(mood_agent, user_prompt)
    chord_task  = create_chord_task(chord_agent, "")
    melody_task = create_melody_task(melody_agent, "")
    lyrics_task = create_lyrics_task(lyrics_agent, "")
    sync_task   = create_sync_task(sync_agent, "")
    judge_task  = create_judge_task(judge_agent, "")

    chord_task.context  = [mood_task]
    melody_task.context = [chord_task]
    lyrics_task.context = [mood_task, melody_task]
    sync_task.context   = [mood_task, chord_task, melody_task, lyrics_task]
    judge_task.context  = [sync_task]

    return Crew(
        agents=[mood_agent, chord_agent, melody_agent, lyrics_agent, sync_agent, judge_agent],
        tasks=[mood_task, chord_task, melody_task, lyrics_task, sync_task, judge_task],
        process=Process.sequential,
        verbose=True,
    )


# ── Main crew runner ──────────────────────────────────────────────────────────

async def run_music_crew(user_prompt: str) -> dict:
    groq_key = os.getenv("GROQ_API_KEY")

    # Build fallback list — Groq only
    if not groq_key:
        raise RuntimeError("GROQ_API_KEY is not set in .env")
    candidates: list[LLM] = [build_groq_llm(temperature=0.7, model=m) for m in GROQ_MODELS]

    crew = None
    last_err = None
    used_model = "unknown"

    for llm in candidates:
        used_model = getattr(llm, "model", "unknown")
        try:
            crew = _build_crew(llm, user_prompt)
            crew.kickoff()
            print(f"[MUSE] Composed with model: {used_model}")
            break  # success
        except Exception as e:
            err_str = str(e).lower()
            if any(k in err_str for k in ("rate_limit", "ratelimit", "429", "tokens per day",
                                           "decommissioned", "deprecated", "model_not_found",
                                           "does not exist", "invalid model")):
                print(f"[MUSE] Skipping {used_model} ({err_str[:80]}), trying next…")
                last_err = e
                continue
            # Non-rate-limit error — re-raise immediately
            raise

    if crew is None:
        raise RuntimeError(
            "All Groq models are currently rate-limited or unavailable. "
            "Wait a few minutes and try again, or check https://console.groq.com/settings/billing "
            f"(last error: {last_err})"
        )

    raw_outputs = [t.output.raw if t.output else "" for t in crew.tasks]

    mood_out   = _extract_json(raw_outputs[0]) if len(raw_outputs) > 0 else {}
    chord_out  = _rescue_chords(_extract_json(raw_outputs[1]) if len(raw_outputs) > 1 else {})
    melody_out = _rescue_melody(_extract_json(raw_outputs[2]) if len(raw_outputs) > 2 else {})
    lyrics_out = _rescue_lyrics(_extract_json(raw_outputs[3]) if len(raw_outputs) > 3 else {})
    sync_out   = _extract_json(raw_outputs[4]) if len(raw_outputs) > 4 else {}
    judge_out  = _extract_json(raw_outputs[5]) if len(raw_outputs) > 5 else {}

    # Score extraction with fallback
    score = judge_out.get("score")
    if not isinstance(score, int):
        m = re.search(r'\b([1-9][0-9]?|100)\b', str(judge_out.get("score", judge_out.get("raw", ""))))
        score = int(m.group(1)) if m else 0

    return {
        "mood":     mood_out,
        "chords":   chord_out,
        "melody":   melody_out,
        "lyrics":   lyrics_out,
        "sync":     sync_out,
        "score":    score,
        "critique": judge_out,
    }
