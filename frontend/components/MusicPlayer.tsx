"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { arpeggioFallback } from "@/lib/musicPlayer";
import type { ComposeResponse } from "@/types";

interface Props {
  data:        ComposeResponse;
  bpm?:        number;
  instrument?: string;
  genre?:      string;
}

export default function MusicPlayer({ data, bpm = 90, instrument = "piano", genre = "pop" }: Props) {
  const [playing,      setPlaying]      = useState(false);
  const [currentChord, setCurrentChord] = useState<string>("");
  const [activeNote,   setActiveNote]   = useState(-1);
  const [barIdx,       setBarIdx]       = useState(-1);
  const [audioErr,     setAudioErr]     = useState<string | null>(null);
  const stopRef = useRef<(() => void) | null>(null);

  const chords  = data.chords.progression ?? [];
  const aiNotes = data.melody.notes ?? [];
  const notes   = aiNotes.length ? aiNotes : arpeggioFallback(chords);

  // Pre-load tone.js so it's in the module cache before user clicks
  useEffect(() => {
    import("tone").catch(() => {});
    return () => { stopRef.current?.(); };
  }, []);

  async function handleToggle() {
    if (playing) {
      stopRef.current?.();
      return;
    }

    setAudioErr(null);

    // ── CRITICAL: resume AudioContext FIRST, still inside click gesture ──────
    // tone module is already cached from the useEffect pre-load, so this
    // import resolves synchronously and Tone.start() fires within the gesture.
    let ToneModule: typeof import("tone");
    try {
      ToneModule = await import("tone");
      await ToneModule.start();
    } catch {
      setAudioErr("Browser blocked audio. Tap the page once then try again.");
      return;
    }

    // Verify context is actually running
    const ctx = ToneModule.getContext();
    if (ctx.state !== "running") {
      try { await ctx.resume(); } catch { /* best effort */ }
    }

    setPlaying(true);
    setBarIdx(0);

    try {
      const { playFullSong } = await import("@/lib/musicPlayer");
      const stop = await playFullSong(
        chords, notes, bpm,
        { instrument, genre },
        {
          onChordChange: (chord, bar) => { setCurrentChord(chord); setBarIdx(bar); },
          onNotePlay:    (idx)        => setActiveNote(idx),
          onStop:        ()           => {
            setPlaying(false);
            setCurrentChord("");
            setBarIdx(-1);
            setActiveNote(-1);
          },
        }
      );
      stopRef.current = stop;
    } catch (e) {
      console.error("playback error:", e);
      setPlaying(false);
      setAudioErr("Playback error — check console.");
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card overflow-hidden"
    >
      {/* Title bar */}
      <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-white/5">
        <div className="flex items-center gap-2">
          <span className="text-base">🎹</span>
          <span className="text-xs font-bold text-white/50 uppercase tracking-widest">Full Song Playback</span>
        </div>
        <div className="flex items-center gap-2 text-[10px] text-white/25">
          <span>{bpm} BPM</span>
          <span>·</span>
          <span>{chords.length} bars</span>
          <span>·</span>
          <span>{notes.length} notes</span>
          <span>·</span>
          <span className="capitalize">{instrument}</span>
        </div>
      </div>

      <div className="p-5 space-y-4">

        {/* Audio error banner */}
        {audioErr && (
          <div className="text-xs text-red-300 bg-red-500/10 border border-red-400/20 px-3 py-2 rounded-lg">
            {audioErr}
          </div>
        )}

        {/* Waveform visualiser */}
        <div className="flex items-end gap-[2px] h-12 justify-center">
          {Array.from({ length: 48 }).map((_, i) => (
            <motion.div
              key={i}
              animate={{
                height:  playing ? [4, 20 + Math.abs(Math.sin(i * 0.7)) * 24, 4] : 4,
                opacity: playing ? [0.3, 0.8, 0.3] : 0.1,
              }}
              transition={{
                duration:   0.6 + (i % 5) * 0.12,
                repeat:     playing ? Infinity : 0,
                ease:       "easeInOut",
                delay:      i * 0.018,
              }}
              className={`w-1 rounded-full ${playing ? "bg-indigo-400" : "bg-white/12"}`}
            />
          ))}
        </div>

        {/* Chord strip */}
        {chords.length > 0 && (
          <div className="flex gap-1.5 flex-wrap">
            {chords.map((c, i) => (
              <motion.div
                key={i}
                animate={{
                  backgroundColor: i === barIdx && playing ? "rgba(99,102,241,0.28)" : "rgba(255,255,255,0.03)",
                  borderColor:     i === barIdx && playing ? "rgba(129,140,248,0.5)"  : "rgba(255,255,255,0.07)",
                  scale:           i === barIdx && playing ? 1.1 : 1,
                }}
                transition={{ duration: 0.18 }}
                className="px-3 py-1.5 rounded-xl border text-xs font-bold text-white/55 min-w-[44px] text-center"
              >
                {c}
              </motion.div>
            ))}
          </div>
        )}

        {/* Note strip */}
        {notes.length > 0 && (
          <div className="flex gap-1 overflow-x-auto scrollbar-none py-1">
            {notes.map((n, i) => (
              <motion.div
                key={i}
                animate={{
                  backgroundColor: i === activeNote && playing ? "rgba(99,102,241,0.45)" : "rgba(255,255,255,0.04)",
                  scale:           i === activeNote && playing ? 1.18 : 1,
                }}
                transition={{ duration: 0.1 }}
                className="shrink-0 flex flex-col items-center px-2 py-1 rounded-lg border border-white/[0.05] min-w-[30px]"
              >
                <span className="text-[9px] font-bold text-white/45">{n.pitch.replace(/\d/, "")}</span>
                <span className="text-[7px] text-white/18">{n.pitch.replace(/[A-G#b]/g, "")}</span>
              </motion.div>
            ))}
          </div>
        )}

        {/* Controls */}
        <div className="flex items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.94 }}
            onClick={handleToggle}
            className={`flex items-center gap-2.5 px-6 py-3 rounded-xl font-bold text-sm transition-all border ${
              playing
                ? "bg-red-500/12 border-red-400/25 text-red-300 hover:bg-red-500/22"
                : "bg-gradient-to-r from-indigo-500/20 to-violet-500/20 border-indigo-400/30 text-indigo-200 hover:from-indigo-500/30 hover:to-violet-500/30"
            }`}
          >
            <AnimatePresence mode="wait">
              {playing
                ? <motion.span key="s" initial={{ scale:0 }} animate={{ scale:1 }} exit={{ scale:0 }} className="text-base">⏹</motion.span>
                : <motion.span key="p" initial={{ scale:0 }} animate={{ scale:1 }} exit={{ scale:0 }} className="text-base">▶</motion.span>
              }
            </AnimatePresence>
            {playing ? "Stop" : "Play Full Song"}
          </motion.button>

          {playing && currentChord && (
            <motion.div initial={{ opacity:0, x:-8 }} animate={{ opacity:1, x:0 }} className="flex items-center gap-2">
              <span className="text-[10px] text-white/20 uppercase tracking-widest">Playing</span>
              <span className="text-lg font-black text-indigo-300">{currentChord}</span>
            </motion.div>
          )}

          {!playing && !audioErr && (
            <p className="text-white/18 text-xs">
              {instrument} · {genre} · {bpm} BPM · ~20s
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
