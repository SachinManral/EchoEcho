from __future__ import annotations

import json
import os
from dataclasses import dataclass
from pathlib import Path
from typing import Any

import numpy as np
import soundfile as sf


TOKEN_CACHE_DIR = Path(__file__).resolve().parents[1] / "generated" / "qa_tokens"
AUDIO_JUDGE_MODEL = os.getenv("AUDIO_JUDGE_MODEL", "laion/clap-htsat-unfused")
AUDIO_INSTRUMENT_THRESHOLD = float(os.getenv("AUDIO_INSTRUMENT_THRESHOLD", "0.12"))
JUDGE_PASS_SCORE = float(os.getenv("JUDGE_PASS_SCORE", "0.80"))
COMMON_INSTRUMENT_LABELS = [
    "piano",
    "acoustic guitar",
    "electric guitar",
    "violin",
    "strings",
    "bass guitar",
    "drums",
    "synthesizer",
    "saxophone",
    "flute",
    "choir",
    "brass",
]
_AUDIO_CLASSIFIER = None


@dataclass
class CompositionJudgeResult:
    passed: bool
    score: float
    reasons: list[str]
    token_cache_file: str

    def to_dict(self) -> dict[str, Any]:
        return {
            "passed": self.passed,
            "score": self.score,
            "reasons": self.reasons,
            "token_cache_file": self.token_cache_file,
        }


def _normalize_values(values: list[str]) -> list[str]:
    return [value.strip().lower() for value in values if value and value.strip()]


def _audio_report(audio_path: Path) -> tuple[bool, list[str], dict[str, Any]]:
    reasons: list[str] = []
    metrics: dict[str, Any] = {"exists": audio_path.exists()}
    if not audio_path.exists():
        return False, ["Audio file was not created."], metrics

    audio, sample_rate = sf.read(audio_path, always_2d=True)
    duration = len(audio) / float(sample_rate or 1)
    mono = audio.mean(axis=1)
    rms = float(np.sqrt(np.mean(np.square(mono)))) if len(mono) else 0.0
    peak = float(np.max(np.abs(mono))) if len(mono) else 0.0
    metrics.update(
        {
            "sample_rate": sample_rate,
            "duration_seconds": round(duration, 2),
            "rms": round(rms, 6),
            "peak": round(peak, 6),
        }
    )

    if duration < 5:
        reasons.append("Audio is too short.")
    if rms < 0.001:
        reasons.append("Audio appears silent or nearly silent.")
    if peak > 1.02:
        reasons.append("Audio peak is outside expected range.")
    return not reasons, reasons, metrics


def _instrument_prompt_report(request_context: dict[str, Any], prompt: str) -> tuple[bool, list[str]]:
    prompt_lower = prompt.lower()
    reasons: list[str] = []
    for instrument in _normalize_values(request_context.get("instruments") or []):
        if instrument not in prompt_lower:
            reasons.append(f"Selected instrument missing from prompt context: {instrument}")
    return not reasons, reasons


def _lyrics_report(record: dict[str, Any]) -> tuple[bool, list[str]]:
    reasons: list[str] = []
    lyrics = record.get("lyrics") if isinstance(record.get("lyrics"), dict) else {}

    if not str(lyrics.get("text") or "").strip() or lyrics.get("structure") == "unavailable":
        reasons.append("Lyrics were not generated successfully.")
    return not reasons, reasons


def _classifier():
    global _AUDIO_CLASSIFIER
    if _AUDIO_CLASSIFIER is None:
        from transformers import pipeline

        _AUDIO_CLASSIFIER = pipeline(
            task="zero-shot-audio-classification",
            model=AUDIO_JUDGE_MODEL,
        )
    return _AUDIO_CLASSIFIER


def _instrument_label(instrument: str) -> str:
    name = instrument.strip().lower()
    if name == "synth":
        name = "synthesizer"
    if name == "choir pads":
        name = "choir"
    if name == "bass":
        name = "bass guitar"
    return name


def _audio_instrument_report(audio_path: Path, selected_instruments: list[str]) -> tuple[bool, list[str], dict[str, Any]]:
    selected = [_instrument_label(value) for value in selected_instruments if value and value.strip()]
    if not selected:
        return True, [], {"enabled": False, "reason": "No instruments were selected."}

    candidate_names = list(dict.fromkeys(selected + COMMON_INSTRUMENT_LABELS))
    candidate_labels = [f"a recording of {name}" for name in candidate_names]
    report: dict[str, Any] = {
        "enabled": True,
        "model": AUDIO_JUDGE_MODEL,
        "threshold": AUDIO_INSTRUMENT_THRESHOLD,
        "selected_instruments": selected,
    }

    try:
        results = _classifier()(str(audio_path), candidate_labels=candidate_labels)
    except Exception as exc:
        report["enabled"] = False
        report["error"] = str(exc)
        return True, [f"Audio instrument model unavailable; skipped instrument detection: {exc}"], report

    scores = {
        str(item.get("label", "")).replace("a recording of ", ""): float(item.get("score", 0.0))
        for item in results
    }
    report["scores"] = scores
    missing = [
        instrument
        for instrument in selected
        if scores.get(instrument, 0.0) < AUDIO_INSTRUMENT_THRESHOLD
    ]
    if missing:
        return (
            False,
            [
                "Selected instruments were not confidently detected in audio: "
                + ", ".join(missing)
            ],
            report,
        )
    return True, ["Selected instruments were detected by audio model."], report


def _cache_tokens(song_id: str, token_context: dict[str, Any], record: dict[str, Any]) -> str:
    TOKEN_CACHE_DIR.mkdir(parents=True, exist_ok=True)
    path = TOKEN_CACHE_DIR / f"{song_id}_tokens.json"
    payload = {
        "song_id": song_id,
        "prompt": record.get("prompt"),
        "token_context": token_context,
        "record_fields": {
            "mood": record.get("mood"),
            "theme": record.get("theme"),
            "style": record.get("style"),
            "instruments": record.get("instruments"),
            "tempo": record.get("tempo"),
            "complexity": record.get("complexity"),
            "energy": record.get("energy"),
        },
    }
    path.write_text(json.dumps(payload, indent=2), encoding="utf-8")
    return str(path)


class CompositionJudgeAgent:
    def run(
        self,
        record: dict[str, Any],
        request_context: dict[str, Any],
        token_context: dict[str, Any],
        audio_path: Path,
    ) -> CompositionJudgeResult:
        reasons: list[str] = []
        audio_ok, audio_reasons, audio_metrics = _audio_report(audio_path)
        instrument_ok, instrument_reasons, instrument_metrics = _audio_instrument_report(
            audio_path,
            request_context.get("instruments") or [],
        )
        prompt_ok, prompt_reasons = _instrument_prompt_report(request_context, str(record.get("prompt") or ""))
        lyrics_ok, lyrics_reasons = _lyrics_report(record)
        reasons.extend(audio_reasons)
        reasons.extend(instrument_reasons)
        reasons.extend(prompt_reasons)
        reasons.extend(lyrics_reasons)

        token_context = {
            **token_context,
            "audio_metrics": audio_metrics,
            "audio_instrument_metrics": instrument_metrics,
        }
        checks = {
            "audio": audio_ok,
            "instrument": instrument_ok,
            "instrument_prompt": prompt_ok,
            "lyrics": lyrics_ok,
        }
        score = sum(1 for check in checks.values() if check) / len(checks)
        passed = instrument_ok and score >= JUDGE_PASS_SCORE
        token_context = {
            **token_context,
            "judge_checks": checks,
            "judge_score": round(score, 2),
            "judge_pass_score": JUDGE_PASS_SCORE,
            "instrument_required": True,
        }
        cache_file = _cache_tokens(str(record.get("song_id") or record.get("code") or "song"), token_context, record)
        if not passed and instrument_ok and score < JUDGE_PASS_SCORE:
            reasons.append(
                f"Judge score {score:.2f} is below required {JUDGE_PASS_SCORE:.2f}."
            )
        if not passed and not instrument_ok:
            reasons.append("Instrument match is required before accepting the composition.")
        return CompositionJudgeResult(
            passed=passed,
            score=round(score, 2),
            reasons=reasons or ["Composition passed quality checks."],
            token_cache_file=cache_file,
        )
