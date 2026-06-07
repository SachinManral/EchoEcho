"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { LyricsOutput } from "@/types";

interface Props { lyrics: LyricsOutput }

function extractLyrics(lyrics: LyricsOutput): { verse: string; chorus: string } {
  // If structured fields exist, use them
  if (lyrics.verse || lyrics.chorus) {
    return { verse: lyrics.verse ?? "", chorus: lyrics.chorus ?? "" };
  }

  // Try to parse raw as JSON
  if (lyrics.raw) {
    // Try direct JSON parse
    try {
      const p = JSON.parse(lyrics.raw);
      if (p.verse || p.chorus) return { verse: p.verse ?? "", chorus: p.chorus ?? "" };
    } catch {}

    // Try to find JSON block inside prose
    const jsonBlock = lyrics.raw.match(/\{[\s\S]*\}/);
    if (jsonBlock) {
      try {
        const p = JSON.parse(jsonBlock[0]);
        if (p.verse || p.chorus) return { verse: p.verse ?? "", chorus: p.chorus ?? "" };
      } catch {}
    }

    // Try to extract VERSE / CHORUS sections from plain text
    const versePat  = /(?:verse[:\s]*\n?)([\s\S]+?)(?=\n(?:chorus|bridge|pre-chorus|hook)|$)/i;
    const chorusPat = /(?:chorus[:\s]*\n?)([\s\S]+?)(?=\n(?:verse|bridge|outro|pre-chorus)|$)/i;
    const verseMatch  = lyrics.raw.match(versePat);
    const chorusMatch = lyrics.raw.match(chorusPat);

    if (verseMatch || chorusMatch) {
      return {
        verse:  verseMatch?.[1]?.trim()  ?? "",
        chorus: chorusMatch?.[1]?.trim() ?? "",
      };
    }
  }

  return { verse: "", chorus: "" };
}

export default function LyricsDisplay({ lyrics }: Props) {
  const [tab, setTab] = useState<"verse" | "chorus">("verse");
  const { verse, chorus } = extractLyrics(lyrics);
  const hasStructured = verse || chorus;

  return (
    <div className="result-card flex flex-col">
      <div className="card-header">
        <span className="card-icon">✍️</span>
        <span>Lyrics</span>
      </div>

      {lyrics.theme_summary && (
        <p className="text-blue-300/55 text-[11px] italic mb-3 leading-relaxed">
          &ldquo;{lyrics.theme_summary}&rdquo;
        </p>
      )}

      {hasStructured ? (
        <>
          {/* Tabs */}
          <div className="flex gap-1 mb-4 bg-white/[0.03] rounded-xl p-1 border border-white/[0.06]">
            {(["verse", "chorus"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`flex-1 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                  tab === t
                    ? "bg-blue-500/20 text-blue-200 border border-blue-400/25"
                    : "text-white/30 hover:text-white/50"
                }`}
              >
                {t === "verse" ? "🎵 Verse" : "🔁 Chorus"}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.15 }}
              className="flex-1 bg-white/[0.025] rounded-xl border border-white/[0.06] p-4"
            >
              {(tab === "verse" ? verse : chorus) ? (
                <p className="text-white/65 text-sm leading-8 whitespace-pre-line font-light tracking-wide">
                  {tab === "verse" ? verse : chorus}
                </p>
              ) : (
                <p className="text-white/20 text-xs italic text-center py-4">No {tab} available</p>
              )}
            </motion.div>
          </AnimatePresence>
        </>
      ) : lyrics.raw ? (
        /* Raw fallback — never show bare JSON */
        <div className="flex-1 bg-white/[0.025] rounded-xl border border-white/[0.06] p-4">
          <p className="text-white/60 text-sm leading-8 whitespace-pre-line font-light tracking-wide">
            {lyrics.raw.replace(/[{}"\\]/g, "").replace(/verse:|chorus:|theme_summary:/gi, "\n")}
          </p>
        </div>
      ) : (
        <p className="text-white/20 text-sm italic text-center py-6">No lyrics generated</p>
      )}
    </div>
  );
}
