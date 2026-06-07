import os
from contextlib import asynccontextmanager

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

load_dotenv()

from crew import run_music_crew


class ComposeRequest(BaseModel):
    prompt: str = Field(
        ...,
        min_length=3,
        max_length=1000,
        description="Describe the music you want to compose.",
        examples=["A melancholic piano piece about missing someone at 3am"],
    )


class ComposeResponse(BaseModel):
    mood: dict
    chords: dict
    melody: dict
    lyrics: dict
    sync: dict
    score: int
    critique: dict


@asynccontextmanager
async def lifespan(app: FastAPI):
    required = ["GROQ_API_KEY", "GEMINI_API_KEY"]
    missing = [k for k in required if not os.getenv(k)]
    if missing:
        raise RuntimeError(f"Missing environment variables: {', '.join(missing)}")
    yield


app = FastAPI(
    title="MUSE – AI Music Composition Agent",
    description="Multi-agent music composition powered by CrewAI, Groq (Llama 3.3 70B), and Gemini Flash.",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
async def health():
    return {"status": "ok", "service": "muse-backend"}


@app.post("/compose", response_model=ComposeResponse)
async def compose(request: ComposeRequest):
    try:
        result = await run_music_crew(request.prompt)
        return ComposeResponse(**result)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc
