import type { Inspiration, Track } from "./models";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";
const TRACK_COLORS = ["#ff5858", "#c058ff", "#3d9eff", "#f7b731"] as const;

export interface BackendSong {
  code?: string;
  song_id?: string;
  prompt?: string;
  mood?: string;
  theme?: string;
  style?: string;
  tempo?: number;
  duration?: number;
  created_at?: string;
  audio_url?: string | null;
  original_audio_url?: string | null;
  download_url?: string | null;
  original_download_url?: string | null;
  filename?: string | null;
  lyrics?: {
    text?: string;
    lyrics_pdf_url?: string | null;
  } | null;
  music_sheet?: {
    summary?: string;
    music_sheet_pdf_url?: string | null;
  } | null;
  chord_sheet?: {
    summary?: string;
    chord_sheet_pdf_url?: string | null;
  } | null;
}

export interface GenerateResponse {
  ok?: boolean;
  success?: boolean;
  song?: BackendSong;
  record?: BackendSong;
  audio_url?: string | null;
  song_id?: string;
  prompt_used?: string;
}

function absoluteUrl(url?: string | null): string | undefined {
  if (!url) return undefined;
  if (/^https?:\/\//i.test(url)) return url;
  return `${API_BASE_URL}${url.startsWith("/") ? url : `/${url}`}`;
}

async function requestJson<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
  });

  if (!response.ok) {
    let message = `Request failed with ${response.status}`;
    try {
      const body = await response.json();
      message = body.detail || body.message || message;
    } catch {
      message = response.statusText || message;
    }
    throw new Error(message);
  }

  return response.json() as Promise<T>;
}

export function generationPayload(inspo: Partial<Inspiration>) {
  const mode = inspo.generationMode || "api";
  const mood = inspo.mood || "Custom";
  const genre = inspo.genre || "Mixed";
  const theme = inspo.theme || inspo.promptText || "New inspiration";
  const instrument = inspo.instrument || "";
  const style = inspo.style || genre;
  const prompt = [inspo.promptText, mood, genre, theme, instrument, style]
    .filter(Boolean)
    .join(", ");

  return {
    mode,
    fast: mode === "api",
    prompt,
    mood,
    theme,
    style: genre,
    moods: [mood].filter(Boolean),
    genres: [genre, style].filter(Boolean),
    themes: [theme].filter(Boolean),
    instruments: [instrument].filter(Boolean),
    tempo: Number(inspo.bpm) || 90,
    energy: energyFromTempoFeel(inspo.tempoFeel),
    custom_prompt: inspo.promptText || "",
  };
}

function energyFromTempoFeel(tempoFeel?: string): number {
  const value = (tempoFeel || "").toLowerCase();
  if (value.includes("lazy")) return 2;
  if (value.includes("flowing")) return 4;
  if (value.includes("driving")) return 7;
  if (value.includes("frantic")) return 9;
  return 5;
}

export async function generateInspiration(inspo: Partial<Inspiration>): Promise<GenerateResponse> {
  return requestJson<GenerateResponse>("/generate-inspiration", {
    method: "POST",
    body: JSON.stringify(generationPayload(inspo)),
  });
}

export async function fetchSongs(): Promise<BackendSong[]> {
  const body = await requestJson<{ songs: BackendSong[] }>("/songs", { cache: "no-store" });
  return body.songs || [];
}

export function songToTrack(song: BackendSong, index = 0): Track {
  const code = song.code || song.song_id || `song-${index}`;
  const seconds = Number(song.duration) || 180;
  return {
    id: code,
    name: song.theme || song.prompt || `Echo ${code}`,
    mood: song.mood || "Custom",
    genre: song.style || "Generated",
    bpm: Number(song.tempo) || 90,
    dur: formatDuration(seconds),
    date: formatDate(song.created_at),
    color: TRACK_COLORS[index % TRACK_COLORS.length] || TRACK_COLORS[0],
    emoji: '<span data-echo-icon="music"></span>',
    fav: false,
    audioUrl: absoluteUrl(song.audio_url || song.original_audio_url),
    downloadUrl: absoluteUrl(song.download_url || song.original_download_url),
    lyricsPdfUrl: absoluteUrl(song.lyrics?.lyrics_pdf_url),
    musicSheetPdfUrl: absoluteUrl(song.music_sheet?.music_sheet_pdf_url),
    chordSheetPdfUrl: absoluteUrl(song.chord_sheet?.chord_sheet_pdf_url),
    backendSong: song,
  };
}

export function responseToSong(response: GenerateResponse): BackendSong | undefined {
  const song = response.song || response.record;
  if (!song) return undefined;
  return {
    ...song,
    audio_url: song.audio_url || response.audio_url,
    song_id: song.song_id || response.song_id,
    prompt: song.prompt || response.prompt_used,
  };
}

export function formatDuration(seconds: number): string {
  const total = Math.max(0, Math.round(seconds));
  const minutes = Math.floor(total / 60);
  const remainder = total % 60;
  return `${minutes}:${String(remainder).padStart(2, "0")}`;
}

function formatDate(value?: string): string {
  if (!value) return "Just now";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Just now";
  const diff = Date.now() - date.getTime();
  if (diff < 60_000) return "Just now";
  if (diff < 3_600_000) return `${Math.max(1, Math.floor(diff / 60_000))} min ago`;
  if (diff < 86_400_000) return `${Math.max(1, Math.floor(diff / 3_600_000))} hr ago`;
  return date.toLocaleDateString();
}
