import type { MelodyNote } from "@/types";

const DURATION_MAP: Record<string, string> = {
  whole: "1n",
  half: "2n",
  quarter: "4n",
  eighth: "8n",
  sixteenth: "16n",
  "dotted half": "2n.",
  "dotted quarter": "4n.",
  "dotted eighth": "8n.",
};

function mapDuration(d: string): string {
  return DURATION_MAP[d.toLowerCase().trim()] ?? "4n";
}

export async function playMelody(
  notes: MelodyNote[],
  onStop?: () => void
): Promise<() => void> {
  const Tone = await import("tone");

  await Tone.start();
  Tone.getTransport().stop();
  Tone.getTransport().cancel();

  const synth = new Tone.Synth({
    oscillator: { type: "triangle" },
    envelope: { attack: 0.02, decay: 0.1, sustain: 0.5, release: 0.8 },
  }).toDestination();

  const indexedNotes: Array<[number, MelodyNote]> = notes.map((n, i) => [
    i * 0.5,
    n,
  ]);

  const part = new Tone.Part(
    (time: number, note: MelodyNote) => {
      synth.triggerAttackRelease(note.pitch.trim(), mapDuration(note.duration), time);
    },
    indexedNotes
  );

  part.start(0);

  const totalBeats = notes.length * 0.5 + 1;
  Tone.getTransport().schedule(() => {
    Tone.getTransport().stop();
    synth.dispose();
    part.dispose();
    onStop?.();
  }, totalBeats);

  Tone.getTransport().start();

  return () => {
    Tone.getTransport().stop();
    Tone.getTransport().cancel();
    synth.dispose();
    part.dispose();
    onStop?.();
  };
}
