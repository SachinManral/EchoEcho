"use client";

import { motion } from "framer-motion";
import type { ChordOutput } from "@/types";

interface Props { chords: ChordOutput }

const TILE_COLORS = [
  { bg: "bg-blue-500/20",   border: "border-blue-400/30",   text: "text-blue-200" },
  { bg: "bg-indigo-500/20", border: "border-indigo-400/30", text: "text-indigo-200" },
  { bg: "bg-violet-500/20", border: "border-violet-400/30", text: "text-violet-200" },
  { bg: "bg-purple-500/20", border: "border-purple-400/30", text: "text-purple-200" },
  { bg: "bg-sky-500/20",    border: "border-sky-400/30",    text: "text-sky-200" },
  { bg: "bg-cyan-500/20",   border: "border-cyan-400/30",   text: "text-cyan-200" },
  { bg: "bg-teal-500/20",   border: "border-teal-400/30",   text: "text-teal-200" },
  { bg: "bg-blue-400/20",   border: "border-blue-300/30",   text: "text-blue-100" },
];

export default function ChordDisplay({ chords }: Props) {
  const prog = chords.progression ?? [];

  return (
    <div className="result-card">
      <div className="flex items-center justify-between mb-4">
        <div className="card-header mb-0">
          <span className="card-icon">🎸</span>
          <span>Chord Progression</span>
        </div>
        <div className="flex gap-2">
          {chords.key  && <span className="meta-pill">Key: {chords.key}</span>}
          {chords.mode && <span className="meta-pill">{chords.mode}</span>}
        </div>
      </div>

      {prog.length > 0 ? (
        <div className="flex items-center flex-wrap gap-2 mb-4">
          {prog.map((chord, i) => {
            const c = TILE_COLORS[i % TILE_COLORS.length];
            return (
              <div key={i} className="flex items-center gap-2">
                <motion.div
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 + i * 0.06 }}
                  className={`flex flex-col items-center justify-center w-16 h-16 rounded-2xl border backdrop-blur-sm ${c.bg} ${c.border}`}
                >
                  <span className={`font-bold text-sm ${c.text}`}>{chord}</span>
                  <span className="text-white/20 text-[9px] mt-0.5">{i + 1}</span>
                </motion.div>
                {i < prog.length - 1 && (
                  <span className="text-white/15 text-lg font-light select-none">→</span>
                )}
              </div>
            );
          })}
        </div>
      ) : chords.raw ? (
        <p className="text-white/55 text-sm leading-relaxed mb-3 whitespace-pre-wrap">{chords.raw}</p>
      ) : (
        <p className="text-white/25 text-sm italic mb-3">No progression parsed</p>
      )}

      {chords.explanation && (
        <p className="text-white/35 text-xs leading-relaxed border-t border-white/5 pt-3">
          {chords.explanation}
        </p>
      )}
    </div>
  );
}
