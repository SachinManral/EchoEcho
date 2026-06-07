import type { MelodyNote } from "@/types";

// ── Note / chord math ─────────────────────────────────────────────────────────

const SEMITONES: Record<string, number> = {
  C: 0, "C#": 1, Db: 1, D: 2, "D#": 3, Eb: 3,
  E: 4, F: 5, "F#": 6, Gb: 6, G: 7, "G#": 8,
  Ab: 8, A: 9, "A#": 10, Bb: 10, B: 11,
};
const NOTE_NAMES = ["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"];

const QUALITY_INTERVALS: Record<string, number[]> = {
  "": [0,4,7], m: [0,3,7], "7": [0,4,7,10], maj7: [0,4,7,11],
  M7: [0,4,7,11], m7: [0,3,7,10], dim: [0,3,6], dim7: [0,3,6,9],
  aug: [0,4,8], sus2: [0,2,7], sus4: [0,5,7], add9: [0,4,7,14],
  "6": [0,4,7,9], m6: [0,3,7,9], "9": [0,4,7,10,14],
  m9: [0,3,7,10,14], maj9: [0,4,7,11,14],
};

export function parseChordToNotes(chord: string, octave = 3): string[] {
  const clean = chord.trim().replace(/[()[\]]/g, "");
  const rootMatch = clean.match(/^([A-G][#b]?)/);
  if (!rootMatch) return [`C${octave}`, `E${octave}`, `G${octave}`];
  const root = rootMatch[1];
  const quality = clean.slice(root.length).replace(/\/.*$/, "");
  const rootSemi = SEMITONES[root] ?? 0;
  const intervals = QUALITY_INTERVALS[quality] ?? QUALITY_INTERVALS[""];
  return intervals.map(iv => {
    const semi = (rootSemi + iv) % 12;
    const oct  = octave + Math.floor((rootSemi + iv) / 12);
    return `${NOTE_NAMES[semi]}${oct}`;
  });
}

export function arpeggioFallback(chords: string[], octave = 4): MelodyNote[] {
  const durs: Array<"quarter"|"eighth"> = ["eighth","eighth","quarter","eighth","eighth","quarter"];
  const out: MelodyNote[] = [];
  chords.forEach(chord => {
    const cn = parseChordToNotes(chord, octave);
    const pattern = [...cn, ...cn.slice(1).reverse()];
    pattern.forEach((pitch, i) => {
      out.push({ pitch, duration: durs[i % durs.length] });
    });
  });
  return out;
}

// ── Duration helpers ──────────────────────────────────────────────────────────

const DURATION_MAP: Record<string, string> = {
  whole: "1n", half: "2n", quarter: "4n", eighth: "8n", sixteenth: "16n",
  "dotted half": "2n.", "dotted quarter": "4n.", "dotted eighth": "8n.",
};
function mapDur(d: string): string { return DURATION_MAP[d.toLowerCase().trim()] ?? "4n"; }

// Tone.js duration string → beats (1 beat = 1 quarter note)
const DUR_BEATS: Record<string, number> = {
  "1n": 4, "2n.": 3, "2n": 2, "4n.": 1.5, "4n": 1, "8n.": 0.75, "8n": 0.5, "16n": 0.25,
};
function durToSec(toneDur: string, secPerBeat: number): number {
  return (DUR_BEATS[toneDur] ?? 1) * secPerBeat;
}

function shiftOctave(pitch: string, shift: number): string {
  return pitch.replace(/(\d)$/, (_, n) => String(Math.max(1, Math.min(7, +n + shift))));
}

// ── Instrument presets ────────────────────────────────────────────────────────

interface SynthCfg {
  oscillator: { type: string };
  envelope: { attack: number; decay: number; sustain: number; release: number };
  volume: number;
}
interface InstrumentPreset {
  melody: SynthCfg; chord: SynthCfg;
  octaveShift: number; chordOctave: number;
  reverbWet: number; reverbDecay: number;
  delayTime: string | null; delayFeed: number;
  distortion: number;
}

const PRESETS: Record<string, InstrumentPreset> = {
  piano: {
    melody: { oscillator:{ type:"triangle8" }, envelope:{ attack:0.005, decay:0.5, sustain:0.45, release:1.6 }, volume:-7 },
    chord:  { oscillator:{ type:"triangle8" }, envelope:{ attack:0.01,  decay:0.6, sustain:0.55, release:2.2 }, volume:-13 },
    octaveShift:0, chordOctave:3, reverbWet:0.35, reverbDecay:2.5, delayTime:null, delayFeed:0, distortion:0,
  },
  guitar: {
    melody: { oscillator:{ type:"sawtooth" }, envelope:{ attack:0.003, decay:0.28, sustain:0.22, release:1.0 }, volume:-9 },
    chord:  { oscillator:{ type:"sawtooth" }, envelope:{ attack:0.004, decay:0.35, sustain:0.25, release:1.2 }, volume:-14 },
    octaveShift:0, chordOctave:3, reverbWet:0.25, reverbDecay:2.0, delayTime:"16n", delayFeed:0.18, distortion:0.07,
  },
  sitar: {
    melody: { oscillator:{ type:"fatsawtooth" }, envelope:{ attack:0.004, decay:0.55, sustain:0.3, release:1.4 }, volume:-8 },
    chord:  { oscillator:{ type:"fatsawtooth" }, envelope:{ attack:0.006, decay:0.55, sustain:0.35,release:1.6 }, volume:-14 },
    octaveShift:0, chordOctave:3, reverbWet:0.55, reverbDecay:3.0, delayTime:"8n.", delayFeed:0.28, distortion:0.04,
  },
  flute: {
    melody: { oscillator:{ type:"sine" }, envelope:{ attack:0.1, decay:0.06, sustain:0.92, release:0.55 }, volume:-6 },
    chord:  { oscillator:{ type:"triangle" }, envelope:{ attack:0.12, decay:0.2, sustain:0.65, release:1.8 }, volume:-16 },
    octaveShift:1, chordOctave:4, reverbWet:0.6, reverbDecay:3.5, delayTime:null, delayFeed:0, distortion:0,
  },
  violin: {
    melody: { oscillator:{ type:"sawtooth4" }, envelope:{ attack:0.14, decay:0.1, sustain:0.88, release:0.9 }, volume:-8 },
    chord:  { oscillator:{ type:"sawtooth4" }, envelope:{ attack:0.18, decay:0.1, sustain:0.82, release:1.4 }, volume:-13 },
    octaveShift:0, chordOctave:3, reverbWet:0.68, reverbDecay:3.8, delayTime:null, delayFeed:0, distortion:0,
  },
  strings: {
    melody: { oscillator:{ type:"sawtooth8" }, envelope:{ attack:0.2, decay:0.1, sustain:0.9, release:1.5 }, volume:-9 },
    chord:  { oscillator:{ type:"sawtooth8" }, envelope:{ attack:0.25, decay:0.1, sustain:0.88,release:2.0 }, volume:-13 },
    octaveShift:0, chordOctave:3, reverbWet:0.75, reverbDecay:4.0, delayTime:null, delayFeed:0, distortion:0,
  },
  synth: {
    melody: { oscillator:{ type:"sawtooth" }, envelope:{ attack:0.01, decay:0.18, sustain:0.68, release:0.55 }, volume:-8 },
    chord:  { oscillator:{ type:"square" },   envelope:{ attack:0.01, decay:0.22, sustain:0.62, release:0.9  }, volume:-14 },
    octaveShift:0, chordOctave:3, reverbWet:0.22, reverbDecay:1.8, delayTime:"8n", delayFeed:0.38, distortion:0,
  },
  bass: {
    melody: { oscillator:{ type:"triangle" }, envelope:{ attack:0.02, decay:0.38, sustain:0.58, release:0.65 }, volume:-5 },
    chord:  { oscillator:{ type:"triangle" }, envelope:{ attack:0.02, decay:0.42, sustain:0.52, release:1.1  }, volume:-13 },
    octaveShift:-1, chordOctave:2, reverbWet:0.12, reverbDecay:1.5, delayTime:null, delayFeed:0, distortion:0,
  },
};

function getPreset(instrument: string): InstrumentPreset {
  return PRESETS[instrument.toLowerCase()] ?? PRESETS.piano;
}

// ── Genre → drum pattern ──────────────────────────────────────────────────────

interface DrumPattern { kick: number[]; snare: number[]; hihat: number[]; vol: number; }

const DRUM_PATTERNS: Record<string, DrumPattern> = {
  classical:  { kick:[],           snare:[],      hihat:[],                         vol:0  },
  jazz:       { kick:[0,2.5],      snare:[1,3],   hihat:[0,0.5,1,1.5,2,2.5,3,3.5], vol:-4 },
  "lo-fi":    { kick:[0,2],        snare:[1,3],   hihat:[0,1,2,3],                  vol:-5 },
  lofi:       { kick:[0,2],        snare:[1,3],   hihat:[0,1,2,3],                  vol:-5 },
  electronic: { kick:[0,1,2,3],    snare:[1,3],   hihat:[0,0.5,1,1.5,2,2.5,3,3.5], vol:-2 },
  pop:        { kick:[0,2],        snare:[1,3],   hihat:[0,0.5,1,1.5,2,2.5,3,3.5], vol:-3 },
  rock:       { kick:[0,0.5,2],    snare:[1,3],   hihat:[0,0.5,1,1.5,2,2.5,3,3.5], vol:-2 },
  folk:       { kick:[0],          snare:[2],     hihat:[0,1,2,3],                  vol:-8 },
  indie:      { kick:[0,2],        snare:[1,3],   hihat:[0,1,2,3],                  vol:-4 },
  "r&b":      { kick:[0,1.5,2],    snare:[1,3],   hihat:[0,0.5,1,1.5,2,2.5,3,3.5], vol:-3 },
  "hip-hop":  { kick:[0,1.5,2],    snare:[1,3],   hihat:[0,0.5,1,1.5,2,2.5,3,3.5], vol:-2 },
  hiphop:     { kick:[0,1.5,2],    snare:[1,3],   hihat:[0,0.5,1,1.5,2,2.5,3,3.5], vol:-2 },
};
const DEFAULT_DRUMS: DrumPattern = { kick:[0,2], snare:[1,3], hihat:[0,0.5,1,1.5,2,2.5,3,3.5], vol:-4 };
function getDrums(genre: string): DrumPattern {
  return DRUM_PATTERNS[genre.toLowerCase()] ?? DEFAULT_DRUMS;
}

// ── Public interfaces ─────────────────────────────────────────────────────────

export interface SongConfig { instrument?: string; genre?: string; mood?: string; }
export interface PlayerCallbacks {
  onChordChange?: (chord: string, barIdx: number) => void;
  onNotePlay?:    (noteIdx: number) => void;
  onStop?:        () => void;
}

// ── Main player ───────────────────────────────────────────────────────────────

export async function playFullSong(
  chords:  string[],
  notes:   MelodyNote[],
  bpm = 90,
  config:  SongConfig = {},
  cbs:     PlayerCallbacks = {}
): Promise<() => void> {
  const Tone = await import("tone");
  await Tone.start();

  const transport = Tone.getTransport();
  transport.stop();
  transport.cancel();
  transport.bpm.value = bpm;

  const preset     = getPreset(config.instrument ?? "piano");
  const drums      = getDrums(config.genre ?? "pop");
  const secPerBeat = 60 / bpm;
  const secPerBar  = secPerBeat * 4;

  // ── Ensure at least 20 seconds ────────────────────────────────────────────
  const MIN_SEC    = 20;
  const progression = chords.length ? chords : ["Am7","Dm7","Fmaj7","G"];
  const loopsNeeded = Math.max(1, Math.ceil(MIN_SEC / (progression.length * secPerBar)));
  const allChords   = Array.from({ length: loopsNeeded }, () => progression).flat();
  const totalDuration = allChords.length * secPerBar;

  // ── Effects ───────────────────────────────────────────────────────────────
  const masterVol = new Tone.Volume(-2).toDestination();
  const reverb = new Tone.Reverb({ decay: preset.reverbDecay, wet: preset.reverbWet });
  await reverb.generate();
  reverb.connect(masterVol);

  let delay: InstanceType<typeof Tone.FeedbackDelay> | null = null;
  if (preset.delayTime) {
    delay = new Tone.FeedbackDelay(preset.delayTime, preset.delayFeed);
    delay.wet.value = 0.25;
    delay.connect(masterVol);
  }

  let dist: InstanceType<typeof Tone.Distortion> | null = null;
  if (preset.distortion > 0) {
    dist = new Tone.Distortion(preset.distortion);
    dist.connect(reverb);
  }

  // ── Melody synth ──────────────────────────────────────────────────────────
  const melodySynth = new Tone.Synth({
    oscillator: { type: preset.melody.oscillator.type as "sine" },
    envelope:   preset.melody.envelope,
    volume:     preset.melody.volume,
  });
  const melodyDst = dist ?? reverb;
  melodySynth.connect(melodyDst);
  if (delay) melodySynth.connect(delay);

  // ── Chord synth ───────────────────────────────────────────────────────────
  const chordSynth = new Tone.PolySynth(Tone.Synth, {
    oscillator: { type: preset.chord.oscillator.type as "sine" },
    envelope:   preset.chord.envelope,
    volume:     preset.chord.volume,
  });
  chordSynth.connect(reverb);

  // ── Bass synth ────────────────────────────────────────────────────────────
  const bassVol = config.instrument?.toLowerCase() === "bass" ? -8 : -15;
  const bassSynth = new Tone.Synth({
    oscillator: { type: "triangle" },
    envelope:   { attack:0.01, decay:0.25, sustain:0.5, release:0.55 },
    volume: bassVol,
  });
  bassSynth.connect(masterVol);

  // ── Drums ─────────────────────────────────────────────────────────────────
  const dv = drums.vol;
  const kick  = drums.kick.length  ? new Tone.MembraneSynth({ pitchDecay:0.06, octaves:7, envelope:{attack:0.001,decay:0.35,sustain:0,release:0.2}, volume:-8+dv }).connect(masterVol) : null;
  const snare = drums.snare.length ? new Tone.NoiseSynth({ noise:{type:"white"}, envelope:{attack:0.001,decay:0.14,sustain:0,release:0.07}, volume:-18+dv }).connect(masterVol) : null;
  const hihat = drums.hihat.length ? new Tone.MetalSynth({ envelope:{attack:0.001,decay:0.04,release:0.01}, harmonicity:5.1, modulationIndex:32, resonance:4000, octaves:1.5, volume:-26+dv }).connect(masterVol) : null;

  // ── Schedule chords — full bar sustain, no gaps ───────────────────────────
  allChords.forEach((chord, barIdx) => {
    const t = barIdx * secPerBar;
    transport.schedule(time => {
      const cn = parseChordToNotes(chord, preset.chordOctave);
      chordSynth.triggerAttackRelease(cn, "1n", time);          // full bar = no gap
      cbs.onChordChange?.(chord, barIdx % progression.length);
    }, t);

    // Walking bass: root → 5th → root → 5th every beat
    const bassNotes = parseChordToNotes(chord, Math.max(1, preset.chordOctave - 1));
    const r = bassNotes[0];
    const fifth = bassNotes[2] ?? r;
    [r, fifth, r, fifth].forEach((n, beat) => {
      transport.schedule(tm => bassSynth.triggerAttackRelease(n, "4n", tm), t + beat * secPerBeat);
    });
  });

  // ── Schedule drums — loop over all bars ──────────────────────────────────
  for (let bar = 0; bar < allChords.length; bar++) {
    const bt = bar * secPerBar;
    drums.kick.forEach(b  => transport.schedule(tm => kick?.triggerAttackRelease("C1","16n",tm),  bt + b * secPerBeat));
    drums.snare.forEach(b => transport.schedule(tm => snare?.triggerAttackRelease("16n",tm),      bt + b * secPerBeat));
    drums.hihat.forEach(b => transport.schedule(tm => hihat?.triggerAttackRelease("32n",tm),      bt + b * secPerBeat));
  }

  // ── Schedule melody — sequential (NO gaps), loop to fill song ────────────
  // Each note starts exactly when the previous one ends.
  // The melody loops continuously until totalDuration.
  const melodyNotes = notes.length ? notes : arpeggioFallback(progression, 4 + preset.octaveShift);

  let noteT   = 0;
  let loopIdx = 0;
  const MAX_NOTES = 2000;  // hard safety cap

  while (noteT < totalDuration - 0.05 && loopIdx < MAX_NOTES) {
    const idx    = loopIdx % melodyNotes.length;
    const note   = melodyNotes[idx];
    const toneDur = mapDur(note.duration);
    const noteSec = durToSec(toneDur, secPerBeat);
    const shifted = shiftOctave(note.pitch.trim(), preset.octaveShift);

    // capture loop variables for the closure
    const schedT  = noteT;
    const cbIdx   = idx;
    transport.schedule(time => {
      melodySynth.triggerAttackRelease(shifted, toneDur, time);
      cbs.onNotePlay?.(cbIdx);
    }, schedT);

    noteT  += noteSec;
    loopIdx++;
  }

  // ── Auto-stop ─────────────────────────────────────────────────────────────
  transport.schedule(() => {
    transport.stop();
    dispose();
    cbs.onStop?.();
  }, totalDuration + 1.8);

  function dispose() {
    [melodySynth, chordSynth, bassSynth, kick, snare, hihat, reverb, delay, dist, masterVol]
      .forEach(n => { try { (n as { dispose(): void } | null)?.dispose(); } catch {} });
  }

  transport.start();
  return () => { transport.stop(); transport.cancel(); dispose(); cbs.onStop?.(); };
}
