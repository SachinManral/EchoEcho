"use client";

import { motion } from "framer-motion";
import type { MoodOutput } from "@/types";

interface Props { mood: MoodOutput }

export default function MoodBadge({ mood }: Props) {
  const fields = [
    { label: "Emotion",   val: mood.emotion,         icon: "💫" },
    { label: "Energy",    val: mood.energy,           icon: "⚡" },
    { label: "Tempo",     val: mood.tempo_bpm_range,  icon: "🥁" },
    { label: "Key Feel",  val: mood.key_feel,         icon: "🎼" },
  ].filter((f) => f.val);

  return (
    <div className="result-card">
      <div className="card-header">
        <span className="card-icon">🧠</span>
        <span>Mood Analysis</span>
      </div>

      {fields.length > 0 ? (
        <div className="grid grid-cols-2 gap-2 mb-4">
          {fields.map(({ label, val, icon }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className="flex items-start gap-2.5 p-3 rounded-xl bg-white/[0.04] border border-white/8"
            >
              <span className="text-base mt-0.5">{icon}</span>
              <div>
                <p className="text-[9px] text-white/30 font-semibold uppercase tracking-wider">{label}</p>
                <p className="text-white/75 text-xs font-medium mt-0.5 leading-snug">{val}</p>
              </div>
            </motion.div>
          ))}
        </div>
      ) : null}

      {mood.genre_influences && mood.genre_influences.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {mood.genre_influences.map((g, i) => (
            <span key={i} className="px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-300 text-[10px] font-medium">
              {g}
            </span>
          ))}
        </div>
      )}

      {mood.description && (
        <p className="text-white/35 text-xs leading-relaxed italic">&ldquo;{mood.description}&rdquo;</p>
      )}
      {!fields.length && mood.raw && (
        <p className="text-white/55 text-xs leading-relaxed whitespace-pre-wrap">{mood.raw}</p>
      )}
    </div>
  );
}
