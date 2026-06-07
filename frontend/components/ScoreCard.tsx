"use client";

import { motion } from "framer-motion";
import type { CritiqueOutput } from "@/types";

interface Props {
  score: number;
  critique: CritiqueOutput;
}

function grade(s: number) {
  if (s >= 90) return { label: "Masterpiece", color: "text-emerald-400" };
  if (s >= 78) return { label: "Excellent",   color: "text-blue-400" };
  if (s >= 65) return { label: "Good",         color: "text-indigo-400" };
  if (s >= 50) return { label: "Decent",       color: "text-yellow-400" };
  return               { label: "Needs Work",  color: "text-red-400" };
}

const DIMENSIONS = [
  { key: "emotional_impact", label: "Emotional" },
  { key: "harmonic_quality", label: "Harmonic" },
  { key: "melodic_quality",  label: "Melodic" },
  { key: "lyrical_quality",  label: "Lyrical" },
] as const;

function extractScore(text: string | undefined): number {
  if (!text) return 0;
  const m = text.match(/\b([1-9][0-9]?|100)\b/);
  return m ? Math.min(100, parseInt(m[1])) : 65;
}

export default function ScoreCard({ score, critique }: Props) {
  const s = Math.max(0, Math.min(100, score));
  const { label, color } = grade(s);
  const circum = 2 * Math.PI * 42;
  const offset = circum - (s / 100) * circum;

  return (
    <div className="result-card h-full flex flex-col">
      {/* Header */}
      <div className="card-header">
        <span className="card-icon">🏆</span>
        <span>Judge Score</span>
      </div>

      {/* Gauge */}
      <div className="flex flex-col items-center py-5">
        <div className="relative w-32 h-32">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
            <motion.circle
              cx="50" cy="50" r="42"
              fill="none"
              stroke="url(#sg)"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circum}
              initial={{ strokeDashoffset: circum }}
              animate={{ strokeDashoffset: offset }}
              transition={{ duration: 1.4, ease: "easeOut", delay: 0.2 }}
            />
            <defs>
              <linearGradient id="sg" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%"   stopColor="#60a5fa" />
                <stop offset="100%" stopColor="#818cf8" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.span
              className="text-4xl font-black text-white leading-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              {s}
            </motion.span>
            <span className="text-white/30 text-xs">/ 100</span>
          </div>
        </div>
        <span className={`text-xl font-bold mt-2 ${color}`}>{label}</span>
        {critique.final_verdict && (
          <p className="text-white/40 text-xs text-center mt-2 leading-relaxed max-w-[200px]">
            {critique.final_verdict}
          </p>
        )}
      </div>

      {/* Dimension bars */}
      <div className="space-y-2.5 px-1 mb-4">
        {DIMENSIONS.map(({ key, label: dl }) => {
          const raw = critique[key];
          const dimScore = extractScore(raw as string);
          return (
            <div key={key}>
              <div className="flex justify-between text-[10px] mb-1">
                <span className="text-white/40 font-medium">{dl}</span>
                <span className="text-white/30">{dimScore}/100</span>
              </div>
              <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${dimScore}%` }}
                  transition={{ duration: 1, ease: "easeOut", delay: 0.4 }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Strengths & improvements */}
      <div className="mt-auto space-y-3">
        {critique.strengths && critique.strengths.length > 0 && (
          <div>
            <p className="text-[10px] text-emerald-400/70 font-semibold uppercase tracking-wider mb-1.5">Strengths</p>
            <ul className="space-y-1">
              {critique.strengths.slice(0, 3).map((s, i) => (
                <li key={i} className="flex gap-1.5 text-xs text-white/50">
                  <span className="text-emerald-400 shrink-0 mt-0.5">✓</span>
                  <span className="leading-snug">{s}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        {critique.improvements && critique.improvements.length > 0 && (
          <div>
            <p className="text-[10px] text-yellow-400/70 font-semibold uppercase tracking-wider mb-1.5">Suggestions</p>
            <ul className="space-y-1">
              {critique.improvements.slice(0, 2).map((s, i) => (
                <li key={i} className="flex gap-1.5 text-xs text-white/50">
                  <span className="text-yellow-400 shrink-0 mt-0.5">→</span>
                  <span className="leading-snug">{s}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
