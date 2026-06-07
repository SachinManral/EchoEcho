"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const AGENTS = [
  { icon: "🧠", name: "MoodAgent",   desc: "Emotion & energy",     gradient: "from-pink-500/25 to-rose-600/10",     border: "border-pink-400/20"   },
  { icon: "🎸", name: "ChordAgent",  desc: "Harmony & chords",     gradient: "from-orange-500/25 to-amber-600/10",  border: "border-orange-400/20" },
  { icon: "🎵", name: "MelodyAgent", desc: "Note composition",      gradient: "from-yellow-500/25 to-lime-600/10",   border: "border-yellow-400/20" },
  { icon: "✍️", name: "LyricsAgent", desc: "Verse & chorus",        gradient: "from-emerald-500/25 to-teal-600/10",  border: "border-emerald-400/20"},
  { icon: "🔗", name: "SyncAgent",   desc: "Element sync",          gradient: "from-cyan-500/25 to-blue-600/10",     border: "border-cyan-400/20"   },
  { icon: "🏆", name: "JudgeAgent",  desc: "Quality scoring",       gradient: "from-violet-500/25 to-purple-600/10", border: "border-violet-400/20" },
];

const FEATURES = [
  { icon: "⚡", title: "Groq Speed",      desc: "Llama 3.3 70B — sub-second tokens" },
  { icon: "🤖", title: "CrewAI Pipeline", desc: "6 agents working in sequence"       },
  { icon: "🎹", title: "Live Playback",   desc: "Full song in your browser via Tone.js" },
  { icon: "💾", title: "Auto-Saved",      desc: "Persists across browser sessions"   },
];

const stagger = { visible: { transition: { staggerChildren: 0.08 } } };
const fadeUp  = { hidden: { opacity:0, y:20 }, visible: { opacity:1, y:0 } };

export default function HeroPage() {
  return (
    <main className="min-h-screen relative overflow-x-hidden">
      <div className="mesh-bg" />
      <div className="fixed inset-0 -z-10">
        <div className="orb orb-1" /><div className="orb orb-2" /><div className="orb orb-3" />
      </div>

      {/* ── Nav ── */}
      <nav className="flex items-center justify-between px-6 py-5 max-w-6xl mx-auto">
        <motion.span
          initial={{ opacity:0, x:-10 }} animate={{ opacity:1, x:0 }}
          className="font-black text-xl bg-gradient-to-r from-blue-400 via-indigo-400 to-violet-400 bg-clip-text text-transparent tracking-tight"
        >
          MUSE
        </motion.span>
        <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.3 }}>
          <Link href="/compose">
            <button className="px-5 py-2 rounded-full text-sm font-semibold border border-white/[0.1] text-white/60 hover:text-white/90 hover:border-white/20 hover:bg-white/[0.04] transition-all">
              Open Studio →
            </button>
          </Link>
        </motion.div>
      </nav>

      {/* ── Hero ── */}
      <section className="max-w-5xl mx-auto px-6 pt-14 pb-20 text-center">
        <motion.div initial="hidden" animate="visible" variants={stagger} className="space-y-6">

          {/* Badge */}
          <motion.div variants={fadeUp} className="flex justify-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-medium"
              style={{ background:"rgba(99,102,241,0.1)", borderColor:"rgba(99,102,241,0.25)", color:"rgba(165,180,252,0.9)" }}>
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
              Hackathon #33 · AI Music Composition Agent
            </div>
          </motion.div>

          {/* Title */}
          <motion.div variants={fadeUp}>
            <h1 className="text-[96px] sm:text-[128px] font-black tracking-[-0.05em] leading-none select-none">
              <span style={{
                background: "linear-gradient(135deg, #ffffff 0%, #bfdbfe 30%, #818cf8 60%, #a78bfa 100%)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                filter: "drop-shadow(0 0 60px rgba(99,102,241,0.4))"
              }}>
                MUSE
              </span>
            </h1>
          </motion.div>

          {/* Sub */}
          <motion.div variants={fadeUp} className="space-y-3">
            <p className="text-xl sm:text-2xl font-light leading-relaxed max-w-2xl mx-auto"
              style={{ color:"rgba(199,210,254,0.7)" }}>
              Describe a feeling. Get a complete original song.
            </p>
            <p className="text-sm max-w-lg mx-auto" style={{ color:"rgba(255,255,255,0.28)" }}>
              Six AI agents collaborate — analysing mood, composing chords, crafting melody,
              writing lyrics, syncing everything, then scoring the result.
            </p>
          </motion.div>

          {/* CTA */}
          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link href="/compose">
              <motion.button
                whileHover={{ scale: 1.04, y: -1 }}
                whileTap={{ scale: 0.97 }}
                className="btn-glow inline-flex items-center gap-3 px-8 py-4 rounded-2xl text-base text-white"
              >
                <span className="text-lg">✨</span>
                Start Composing
                <span style={{ color:"rgba(196,181,253,0.8)" }}>→</span>
              </motion.button>
            </Link>
            <div className="flex items-center gap-2 text-xs" style={{ color:"rgba(255,255,255,0.25)" }}>
              <span className="w-1 h-1 rounded-full bg-emerald-400" />
              ~30s · No sign-up · Free
            </div>
          </motion.div>

          {/* Feature pills */}
          <motion.div variants={fadeUp} className="flex flex-wrap justify-center gap-2.5 pt-4">
            {FEATURES.map(f => (
              <div key={f.title}
                className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl"
                style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)" }}>
                <span className="text-base">{f.icon}</span>
                <div className="text-left">
                  <p className="text-[11px] font-semibold" style={{ color:"rgba(255,255,255,0.7)" }}>{f.title}</p>
                  <p className="text-[10px]" style={{ color:"rgba(255,255,255,0.28)" }}>{f.desc}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* ── Agent pipeline ── */}
      <section className="max-w-5xl mx-auto px-6 pb-20">
        <motion.div
          initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }}
          transition={{ delay:0.7, duration:0.6 }}
        >
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-5">
              <p className="text-[10px] font-bold uppercase tracking-[0.14em]" style={{ color:"rgba(255,255,255,0.25)" }}>
                CrewAI Agent Pipeline
              </p>
              <div className="flex items-center gap-1.5">
                {AGENTS.map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{ opacity:[0.3,1,0.3] }}
                    transition={{ duration:1.5, repeat:Infinity, delay:i*0.25 }}
                    className="w-1 h-1 rounded-full bg-indigo-400"
                  />
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
              {AGENTS.map((a, i) => (
                <motion.div
                  key={a.name}
                  initial={{ opacity:0, scale:0.8, y:10 }}
                  animate={{ opacity:1, scale:1, y:0 }}
                  transition={{ delay:0.75 + i*0.07, duration:0.4, ease:"easeOut" }}
                  whileHover={{ y:-3, scale:1.02 }}
                  className={`relative flex flex-col items-center text-center p-4 rounded-xl bg-gradient-to-br ${a.gradient} border ${a.border} cursor-default transition-all duration-200`}
                >
                  {/* connector line */}
                  {i < AGENTS.length - 1 && (
                    <div className="hidden lg:block absolute -right-[5px] top-1/2 w-[10px] h-px bg-white/10 z-10" />
                  )}
                  <span className="text-2xl mb-2">{a.icon}</span>
                  <p className="text-[11px] font-bold leading-tight" style={{ color:"rgba(255,255,255,0.75)" }}>{a.name}</p>
                  <p className="text-[9px] mt-0.5 leading-snug" style={{ color:"rgba(255,255,255,0.28)" }}>{a.desc}</p>
                </motion.div>
              ))}
            </div>

            {/* Stack labels */}
            <div className="flex items-center justify-center gap-4 mt-5 pt-4"
              style={{ borderTop:"1px solid rgba(255,255,255,0.05)" }}>
              {[["Groq","Llama 3.3 70B"], ["Framework","CrewAI 0.80"], ["Audio","Tone.js 15"], ["UI","Next.js 14"]].map(([k,v]) => (
                <div key={k} className="text-center">
                  <p className="text-[9px] font-bold uppercase tracking-widest" style={{ color:"rgba(255,255,255,0.2)" }}>{k}</p>
                  <p className="text-[10px] font-semibold" style={{ color:"rgba(165,180,252,0.7)" }}>{v}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── Bottom CTA ── */}
      <section className="text-center pb-24 px-6">
        <motion.div
          initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
          transition={{ delay:1.1 }}
          className="glass-card inline-block px-12 py-9 max-w-md"
          style={{ boxShadow:"0 0 60px rgba(99,102,241,0.08)" }}
        >
          <div className="text-4xl mb-3">🎼</div>
          <h2 className="text-2xl font-black mb-2" style={{ color:"rgba(255,255,255,0.85)" }}>
            Ready to compose?
          </h2>
          <p className="text-sm mb-6" style={{ color:"rgba(255,255,255,0.35)" }}>
            Takes ~30 seconds. Fully in-browser playback.
          </p>
          <Link href="/compose">
            <motion.button
              whileHover={{ scale:1.03 }} whileTap={{ scale:0.97 }}
              className="btn-glow w-full py-3.5 rounded-xl text-sm text-white"
            >
              ✨ Open Compose Studio
            </motion.button>
          </Link>
        </motion.div>
      </section>
    </main>
  );
}
