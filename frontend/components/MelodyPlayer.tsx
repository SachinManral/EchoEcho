"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { MelodyOutput } from "@/types";

interface Props { melody: MelodyOutput }

const NOTE_ORDER = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

function pitchToMidi(pitch: string): number {
  const m = pitch.match(/^([A-G]#?)(\d)$/);
  if (!m) return 60;
  const [, note, octStr] = m;
  return (parseInt(octStr) + 1) * 12 + NOTE_ORDER.indexOf(note);
}

export default function MelodyPlayer({ melody }: Props) {
  const [playing, setPlaying]       = useState(false);
  const [activeIdx, setActiveIdx]   = useState(-1);
  const stopRef = useRef<(() => void) | null>(null);

  const notes = melody.notes ?? [];
  const midis = notes.map((n) => pitchToMidi(n.pitch));
  const minMidi = midis.length ? Math.min(...midis) : 60;
  const maxMidi = midis.length ? Math.max(...midis) : 72;
  const range   = Math.max(maxMidi - minMidi, 1);

  async function handlePlay() {
    if (playing) { stopRef.current?.(); return; }
    if (!notes.length) return;
    setPlaying(true);
    notes.forEach((_, i) => setTimeout(() => setActiveIdx(i), i * 500));
    const { playMelody } = await import("@/lib/tonePlayer");
    const stop = await playMelody(notes, () => { setPlaying(false); setActiveIdx(-1); });
    stopRef.current = stop;
  }

  return (
    <div className="result-card flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <div className="card-header mb-0">
          <span className="card-icon">🎵</span>
          <span>Melody</span>
        </div>
        <div className="flex gap-2">
          {melody.rhythmic_feel    && <span className="meta-pill">{melody.rhythmic_feel}</span>}
          {melody.suggested_instrument && <span className="meta-pill">🎹 {melody.suggested_instrument}</span>}
        </div>
      </div>

      {/* Piano-roll style visualisation */}
      {notes.length > 0 ? (
        <div className="relative mb-4 bg-black/20 rounded-xl overflow-hidden border border-white/5 p-3">
          <div className="flex items-end gap-1 h-16 overflow-x-auto scrollbar-none">
            {notes.map((n, i) => {
              const midi   = midis[i];
              const height = 20 + ((midi - minMidi) / range) * 44;
              const isAct  = activeIdx === i;
              return (
                <motion.div
                  key={i}
                  title={n.pitch}
                  initial={{ opacity: 0.4 }}
                  animate={{ opacity: isAct ? 1 : 0.55, scaleY: isAct ? 1.15 : 1 }}
                  transition={{ duration: 0.15 }}
                  style={{ height }}
                  className={`w-5 shrink-0 rounded-md transition-colors origin-bottom ${
                    isAct
                      ? "bg-blue-400 shadow-lg shadow-blue-400/50"
                      : "bg-white/15"
                  }`}
                />
              );
            })}
          </div>
          {/* Note labels row */}
          <div className="flex gap-1 mt-2 overflow-x-auto scrollbar-none">
            {notes.map((n, i) => (
              <span key={i} className={`w-5 shrink-0 text-center text-[8px] font-mono truncate ${activeIdx === i ? "text-blue-300" : "text-white/20"}`}>
                {n.pitch.replace(/\d/, "")}
              </span>
            ))}
          </div>
        </div>
      ) : (
        <div className="h-24 flex items-center justify-center bg-white/[0.02] rounded-xl border border-white/5 mb-4">
          <p className="text-white/20 text-xs italic">No notes parsed</p>
        </div>
      )}

      {/* Play button */}
      {notes.length > 0 && (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={handlePlay}
          className={`flex items-center justify-center gap-2.5 py-2.5 rounded-xl font-semibold text-sm border transition-all ${
            playing
              ? "bg-red-500/15 border-red-400/25 text-red-300 hover:bg-red-500/20"
              : "bg-blue-500/15 border-blue-400/25 text-blue-300 hover:bg-blue-500/25"
          }`}
        >
          <AnimatePresence mode="wait">
            <motion.span key={playing ? "s" : "p"} initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
              {playing ? "⏹" : "▶"}
            </motion.span>
          </AnimatePresence>
          {playing ? "Stop playback" : "Play Melody"}
        </motion.button>
      )}

      {melody.contour && (
        <p className="text-white/25 text-[10px] text-center mt-3">Contour: {melody.contour}</p>
      )}
      {melody.description && (
        <p className="text-white/35 text-xs leading-relaxed border-t border-white/5 pt-3 mt-3">
          {melody.description}
        </p>
      )}
      {!melody.notes && melody.raw && (
        <p className="text-white/55 text-xs leading-relaxed whitespace-pre-wrap">{melody.raw}</p>
      )}
    </div>
  );
}
