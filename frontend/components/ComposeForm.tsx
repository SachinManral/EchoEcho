"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { ComposeFormData } from "@/types";

const MOODS = [
  { label: "Melancholic", icon: "😢" },
  { label: "Euphoric",    icon: "🌟" },
  { label: "Dreamy",      icon: "✨" },
  { label: "Peaceful",    icon: "🌿" },
  { label: "Tense",       icon: "😤" },
  { label: "Angry",       icon: "🔥" },
  { label: "Nostalgic",   icon: "🌅" },
  { label: "Romantic",    icon: "💙" },
];

const GENRES = [
  { label: "Lo-fi",       icon: "🎧" },
  { label: "Jazz",        icon: "🎷" },
  { label: "Pop",         icon: "🎤" },
  { label: "Classical",   icon: "🎻" },
  { label: "R&B",         icon: "🎹" },
  { label: "Indie",       icon: "🎸" },
  { label: "Electronic",  icon: "🎛️" },
  { label: "Folk",        icon: "🪕" },
];

const INSTRUMENTS = [
  { label: "Piano",   icon: "🎹" },
  { label: "Guitar",  icon: "🎸" },
  { label: "Flute",   icon: "🪈" },
  { label: "Violin",  icon: "🎻" },
  { label: "Synth",   icon: "🎛️" },
  { label: "Bass",    icon: "🎵" },
];

interface Props { onSubmit: (data: ComposeFormData) => void; loading: boolean; }

function TileGrid({ label, items, value, onChange, cols = 4 }: {
  label: string; items: { label: string; icon: string }[];
  value: string; onChange: (v: string) => void; cols?: number;
}) {
  return (
    <div>
      <p className="form-label">{label}</p>
      <div className={`grid gap-1.5`} style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
        {items.map((item) => {
          const active = value.toLowerCase() === item.label.toLowerCase();
          return (
            <motion.button
              key={item.label}
              type="button"
              whileTap={{ scale: 0.93 }}
              onClick={() => onChange(item.label)}
              className={`flex flex-col items-center gap-1 py-2.5 px-1 rounded-xl border text-center transition-all duration-200 ${
                active
                  ? "bg-indigo-500/20 border-indigo-400/45 shadow-lg shadow-indigo-500/15"
                  : "bg-white/[0.025] border-white/[0.06] hover:bg-white/[0.05] hover:border-white/[0.12]"
              }`}
            >
              <span className="text-base leading-none">{item.icon}</span>
              <span className={`text-[9px] font-semibold leading-tight tracking-wide ${active ? "text-indigo-200" : "text-white/40"}`}>
                {item.label}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

export default function ComposeForm({ onSubmit, loading }: Props) {
  const [form, setForm] = useState<ComposeFormData>({
    mood: "Melancholic", genre: "Lo-fi", instrument: "Piano", theme: "", bpm: 85,
  });

  function set<K extends keyof ComposeFormData>(key: K, val: ComposeFormData[K]) {
    setForm(p => ({ ...p, [key]: val }));
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="glass-card flex flex-col h-full"
    >
      {/* Header */}
      <div className="px-5 pt-5 pb-4 border-b border-white/[0.05]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500/30 to-indigo-600/30 border border-indigo-400/20 flex items-center justify-center text-base">
            🎼
          </div>
          <div>
            <h2 className="text-sm font-bold text-white/80 tracking-tight">Compose Studio</h2>
            <p className="text-[10px] text-white/25">6 AI agents · Groq Llama 3.3</p>
          </div>
        </div>
      </div>

      {/* Selectors */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5 scrollbar-none">
        <TileGrid label="Mood" items={MOODS} value={form.mood} onChange={v => set("mood", v)} cols={4} />
        <TileGrid label="Genre" items={GENRES} value={form.genre} onChange={v => set("genre", v)} cols={4} />
        <TileGrid label="Lead Instrument" items={INSTRUMENTS} value={form.instrument} onChange={v => set("instrument", v)} cols={3} />

        {/* Theme */}
        <div>
          <p className="form-label">
            Theme <span className="text-white/18 normal-case font-normal">(optional)</span>
          </p>
          <input
            type="text"
            value={form.theme}
            onChange={e => set("theme", e.target.value)}
            placeholder="e.g. missing someone at 3am"
            className="glass-input w-full text-xs"
          />
        </div>

        {/* BPM */}
        <div>
          <p className="form-label">
            <span>Tempo</span>
            <span className="text-indigo-300 font-bold normal-case text-xs">{form.bpm} BPM</span>
          </p>
          <input
            type="range" min={40} max={200} step={1}
            value={form.bpm}
            onChange={e => set("bpm", Number(e.target.value))}
            className="w-full accent-indigo-400"
          />
          <div className="flex justify-between text-[9px] text-white/20 mt-0.5">
            <span>40 · Slow</span><span>Fast · 200</span>
          </div>
        </div>
      </div>

      {/* Compose button */}
      <div className="px-5 pb-5 pt-3 border-t border-white/[0.05]">
        <motion.button
          whileHover={{ scale: 1.015 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSubmit(form)}
          disabled={loading}
          className="btn-glow w-full py-3.5 rounded-2xl text-sm text-white disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2.5"
        >
          {loading ? (
            <>
              <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
              </svg>
              Agents composing…
            </>
          ) : (
            <>
              <span className="text-base">✨</span>
              Compose Full Song
            </>
          )}
        </motion.button>
      </div>
    </motion.div>
  );
}
