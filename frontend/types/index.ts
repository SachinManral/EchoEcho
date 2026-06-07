export interface ComposeFormData {
  mood: string;
  genre: string;
  instrument: string;
  theme: string;
  bpm: number;
}

export interface MoodOutput {
  emotion?: string;
  energy?: string;
  tempo_bpm_range?: string;
  key_feel?: string;
  genre_influences?: string[];
  description?: string;
  raw?: string;
}

export interface ChordOutput {
  key?: string;
  mode?: string;
  progression?: string[];
  explanation?: string;
  raw?: string;
}

export interface MelodyNote {
  pitch: string;
  duration: string;
}

export interface MelodyOutput {
  notes?: MelodyNote[];
  contour?: string;
  rhythmic_feel?: string;
  suggested_instrument?: string;
  description?: string;
  raw?: string;
}

export interface LyricsOutput {
  verse?: string;
  chorus?: string;
  theme_summary?: string;
  raw?: string;
}

export interface SyncOutput {
  mood_summary?: string;
  chord_progression?: string;
  melody_description?: string;
  lyrics?: { verse?: string; chorus?: string };
  arrangement_structure?: string;
  coherence_notes?: string;
  raw?: string;
}

export interface CritiqueOutput {
  score?: number;
  emotional_impact?: string;
  harmonic_quality?: string;
  melodic_quality?: string;
  lyrical_quality?: string;
  overall_cohesion?: string;
  strengths?: string[];
  improvements?: string[];
  final_verdict?: string;
  raw?: string;
}

export interface ComposeResponse {
  mood: MoodOutput;
  chords: ChordOutput;
  melody: MelodyOutput;
  lyrics: LyricsOutput;
  sync: SyncOutput;
  score: number;
  critique: CritiqueOutput;
}
