"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import ComposeForm   from "@/components/ComposeForm";
import ScoreCard     from "@/components/ScoreCard";
import ChordDisplay  from "@/components/ChordDisplay";
import MelodyPlayer  from "@/components/MelodyPlayer";
import LyricsDisplay from "@/components/LyricsDisplay";
import MoodBadge     from "@/components/MoodBadge";
import MusicPlayer   from "@/components/MusicPlayer";
import { compose }   from "@/lib/api";
import type { ComposeFormData, ComposeResponse } from "@/types";

const STORAGE_KEY = "muse_last_composition";

interface Saved {
  result: ComposeResponse; prompt: string; bpm: number;
  instrument: string; genre: string; timestamp: number;
}

// ── Agent pipeline definition ────────────────────────────────────────────────
const AGENTS = [
  { key: "mood",    icon: "🧠", name: "MoodAgent",   desc: "Analysing emotion & energy",   color: "from-pink-500/20 to-rose-500/20",    border: "border-pink-400/25"   },
  { key: "chords",  icon: "🎸", name: "ChordAgent",  desc: "Composing chord progression",  color: "from-orange-500/20 to-amber-500/20", border: "border-orange-400/25" },
  { key: "melody",  icon: "🎵", name: "MelodyAgent", desc: "Crafting melody notes",         color: "from-yellow-500/20 to-lime-500/20",  border: "border-yellow-400/25" },
  { key: "lyrics",  icon: "✍️", name: "LyricsAgent", desc: "Writing verse & chorus",        color: "from-emerald-500/20 to-teal-500/20", border: "border-emerald-400/25"},
  { key: "sync",    icon: "🔗", name: "SyncAgent",   desc: "Synchronising all elements",   color: "from-cyan-500/20 to-blue-500/20",    border: "border-cyan-400/25"   },
  { key: "judge",   icon: "🏆", name: "JudgeAgent",  desc: "Scoring & critiquing",         color: "from-violet-500/20 to-purple-500/20",border: "border-violet-400/25" },
];

// ── Block variants ───────────────────────────────────────────────────────────
const blockIn = {
  hidden:  { opacity: 0, y: 24, scale: 0.97 },
  visible: { opacity: 1, y: 0,  scale: 1 },
};

// ── Animated waveform used in Player placeholder ────────────────────────────
function WaveBars({ active }: { active: boolean }) {
  return (
    <div className="flex items-end gap-[2px] h-6">
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={i}
          animate={active ? { height: [4, 14 + Math.sin(i) * 8, 4], opacity: [0.4, 1, 0.4] } : { height: 3, opacity: 0.15 }}
          transition={{ duration: 0.8 + i * 0.03, repeat: Infinity, ease: "easeInOut", delay: i * 0.04 }}
          className={`w-1 rounded-full ${active ? "bg-indigo-400" : "bg-white/15"}`}
        />
      ))}
    </div>
  );
}

// ── Single agent card shown during loading ───────────────────────────────────
function AgentCard({ agent, state }: { agent: typeof AGENTS[0]; state: "waiting" | "active" | "done" }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className={`agent-line ${state === "active" ? "active" : state === "done" ? "done" : ""}`}
    >
      <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm shrink-0 bg-gradient-to-br ${agent.color} border ${agent.border}`}>
        {state === "done" ? "✅" : agent.icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className={`text-xs font-bold truncate ${state === "done" ? "text-emerald-300/80" : state === "active" ? "text-white/80" : "text-white/35"}`}>
          {agent.name}
        </p>
        <p className={`text-[10px] truncate ${state === "active" ? "text-indigo-300/70" : "text-white/20"}`}>
          {state === "done" ? "Complete" : state === "active" ? agent.desc : "Waiting…"}
        </p>
      </div>
      {state === "active" && (
        <motion.div
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1, repeat: Infinity }}
          className="w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0"
        />
      )}
      {state === "done" && <span className="text-emerald-400/60 text-[10px] shrink-0">✓</span>}
    </motion.div>
  );
}

// ── Main page ────────────────────────────────────────────────────────────────
export default function ComposePage() {
  const [loading,    setLoading]    = useState(false);
  const [result,     setResult]     = useState<ComposeResponse | null>(null);
  const [error,      setError]      = useState<string | null>(null);
  const [prompt,     setPrompt]     = useState("");
  const [bpm,        setBpm]        = useState(90);
  const [instrument, setInstrument] = useState("piano");
  const [genre,      setGenre]      = useState("pop");
  const [savedAt,    setSavedAt]    = useState<Date | null>(null);
  const [restored,   setRestored]   = useState(false);
  const [agentStep,  setAgentStep]  = useState(-1);  // 0-5 during loading
  const stepTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  // ── Restore from localStorage ────────────────────────────────────────────
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved: Saved = JSON.parse(raw);
        setResult(saved.result);
        setPrompt(saved.prompt);
        setBpm(saved.bpm ?? 90);
        setInstrument(saved.instrument ?? "piano");
        setGenre(saved.genre ?? "pop");
        setSavedAt(new Date(saved.timestamp));
        setRestored(true);
      }
    } catch {}
  }, []);

  // ── Persist to localStorage ───────────────────────────────────────────────
  useEffect(() => {
    if (result && prompt) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(
        { result, prompt, bpm, instrument, genre, timestamp: Date.now() } satisfies Saved
      ));
      setSavedAt(new Date());
    }
  }, [result, prompt, bpm, instrument, genre]);

  // ── Agent step animation during loading ──────────────────────────────────
  useEffect(() => {
    if (loading) {
      setAgentStep(0);
      let step = 0;
      stepTimer.current = setInterval(() => {
        step++;
        if (step < AGENTS.length) setAgentStep(step);
        else { if (stepTimer.current) clearInterval(stepTimer.current); }
      }, 4800);
    } else {
      if (stepTimer.current) clearInterval(stepTimer.current);
      setAgentStep(-1);
    }
    return () => { if (stepTimer.current) clearInterval(stepTimer.current); };
  }, [loading]);

  async function handleCompose(data: ComposeFormData) {
    setLoading(true);
    setError(null);
    setResult(null);
    setRestored(false);
    setBpm(data.bpm);
    setInstrument(data.instrument.toLowerCase());
    setGenre(data.genre.toLowerCase());

    const p = [
      `Create a ${data.mood} ${data.genre} piece`,
      data.instrument && `featuring ${data.instrument}`,
      data.theme      && `with themes of "${data.theme}"`,
      `at approximately ${data.bpm} BPM`,
    ].filter(Boolean).join(", ") + ".";

    setPrompt(p);
    try {
      setResult(await compose(data));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Composition failed");
    } finally {
      setLoading(false);
    }
  }

  function handleClear() {
    setResult(null); setPrompt(""); setSavedAt(null);
    setRestored(false); setInstrument("piano"); setGenre("pop");
    localStorage.removeItem(STORAGE_KEY);
  }

  return (
    <main className="min-h-screen relative">
      <div className="mesh-bg" />
      <div className="fixed inset-0 -z-10">
        <div className="orb orb-1" /><div className="orb orb-2" /><div className="orb orb-3" />
      </div>

      {/* ── Nav ── */}
      <nav className="sticky top-0 z-50 flex items-center justify-between px-6 py-3.5 border-b border-white/[0.05]"
        style={{ backdropFilter:"blur(20px)", background:"rgba(5,7,17,0.7)" }}>
        <Link href="/">
          <span className="font-black text-lg bg-gradient-to-r from-blue-400 via-indigo-400 to-violet-400 bg-clip-text text-transparent tracking-tight cursor-pointer">
            MUSE
          </span>
        </Link>
        <div className="flex items-center gap-3">
          {savedAt && (
            <span className="hidden sm:flex items-center gap-1.5 text-[10px] text-white/25">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              {restored ? "Restored · " : "Auto-saved · "}
              {savedAt.toLocaleTimeString([], { hour:"2-digit", minute:"2-digit" })}
            </span>
          )}
          {result && (
            <button onClick={handleClear}
              className="text-[10px] text-white/20 hover:text-white/50 transition-colors px-2 py-1">
              Clear
            </button>
          )}
          <Link href="/">
            <button className="px-3 py-1.5 rounded-full text-[11px] font-medium bg-white/[0.04] border border-white/[0.07] text-white/35 hover:text-white/55 transition-all">
              ← Home
            </button>
          </Link>
        </div>
      </nav>

      {/* ── 30 / 70 Layout ── */}
      <div className="h-[calc(100vh-53px)] flex overflow-hidden">

        {/* ══ LEFT 30% — Form ══ */}
        <div className="w-[30%] min-w-[260px] max-w-[360px] h-full p-4 shrink-0">
          <div className="h-full">
            <ComposeForm onSubmit={handleCompose} loading={loading} />
          </div>
        </div>

        {/* Vertical divider */}
        <div className="w-px bg-gradient-to-b from-transparent via-white/[0.06] to-transparent shrink-0" />

        {/* ══ RIGHT 70% — Results ══ */}
        <div className="flex-1 h-full overflow-y-auto px-5 py-4 space-y-4 scrollbar-none">

          {/* ── Header row ── */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-black text-white/80 tracking-tight">Composition Output</h1>
              <p className="text-[10px] text-white/25 mt-0.5">
                {result ? (restored ? "Restored from last session" : "Just generated") : "Your composition will appear here"}
              </p>
            </div>
            {result && (
              <motion.div
                initial={{ scale: 0 }} animate={{ scale: 1 }}
                className={`px-3.5 py-1.5 rounded-full text-sm font-black border ${
                  result.score >= 75
                    ? "bg-emerald-500/15 border-emerald-400/25 text-emerald-300"
                    : result.score >= 55
                    ? "bg-blue-500/15 border-blue-400/25 text-blue-300"
                    : "bg-yellow-500/15 border-yellow-400/25 text-yellow-300"
                }`}>
                {result.score}/100
              </motion.div>
            )}
          </div>

          {/* ── Loading — Agent pipeline blocks ── */}
          <AnimatePresence>
            {loading && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="glass-card p-5 space-y-2">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-[10px] text-white/30 uppercase tracking-widest font-bold">AI Pipeline Running</p>
                  <WaveBars active />
                </div>
                <div className="space-y-1.5">
                  {AGENTS.map((agent, i) => (
                    <AgentCard
                      key={agent.key}
                      agent={agent}
                      state={i < agentStep ? "done" : i === agentStep ? "active" : "waiting"}
                    />
                  ))}
                </div>
                <p className="text-[10px] text-white/18 text-center pt-2">
                  Running CrewAI with Groq Llama 3.3 · ~30–60s
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Error ── */}
          <AnimatePresence>
            {error && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="glass-card p-4 border border-red-400/20">
                <p className="text-red-300 text-sm"><span className="font-semibold">Error:</span> {error}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Empty state ── */}
          {!loading && !result && !error && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="glass-card flex flex-col items-center justify-center py-24 gap-4">
              <motion.div
                animate={{ y: [0,-8,0], rotate: [-3,3,-3] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="text-6xl">
                🎵
              </motion.div>
              <div className="text-center space-y-1">
                <p className="text-white/30 text-base font-light">Your masterpiece starts here</p>
                <p className="text-white/15 text-sm">Select your preferences and hit Compose</p>
              </div>
              <div className="flex gap-2 mt-2">
                {["Mood", "Genre", "Instrument"].map(t => (
                  <span key={t} className="meta-pill">{t}</span>
                ))}
              </div>
            </motion.div>
          )}

          {/* ── Results ── */}
          <AnimatePresence>
            {result && !loading && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4 pb-8">

                {/* Prompt banner */}
                <motion.div variants={blockIn} initial="hidden" animate="visible"
                  className="glass-card px-4 py-3 flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0 animate-pulse" />
                  <p className="text-white/55 text-xs font-medium flex-1 truncate">{prompt}</p>
                  <WaveBars active={false} />
                </motion.div>

                {/* ① LYRICS — full width, first block */}
                <motion.div variants={blockIn} initial="hidden" animate="visible" transition={{ delay: 0.05 }}>
                  <LyricsDisplay lyrics={result.lyrics} />
                </motion.div>

                {/* ② FULL SONG PLAYER */}
                <motion.div variants={blockIn} initial="hidden" animate="visible" transition={{ delay: 0.12 }}>
                  <MusicPlayer data={result} bpm={bpm} instrument={instrument} genre={genre} />
                </motion.div>

                {/* ③ SCORE + MOOD — 2 col */}
                <motion.div variants={blockIn} initial="hidden" animate="visible" transition={{ delay: 0.18 }}
                  className="grid grid-cols-2 gap-4 items-start">
                  <ScoreCard score={result.score} critique={result.critique} />
                  <MoodBadge mood={result.mood} />
                </motion.div>

                {/* ④ CHORDS — full width */}
                <motion.div variants={blockIn} initial="hidden" animate="visible" transition={{ delay: 0.24 }}>
                  <ChordDisplay chords={result.chords} />
                </motion.div>

                {/* ⑤ MELODY — full width */}
                <motion.div variants={blockIn} initial="hidden" animate="visible" transition={{ delay: 0.3 }}>
                  <MelodyPlayer melody={result.melody} />
                </motion.div>

              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>
    </main>
  );
}
