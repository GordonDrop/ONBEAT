import type { MetronomeSettings, PlaybackState, TrainingSettings } from "../types";

export const DEFAULT_SETTINGS: MetronomeSettings = {
  bpm: 120,
  timeSignature: { beats: 4, noteValue: 4 },
  swing: { enabled: false, type: "sixteenth" },
  beatAccents: ["accent", "normal", "normal", "normal"],
};

export const DEFAULT_TRAINING: TrainingSettings = {
  countIn: { enabled: false, bars: 1 },
  clickSkip: { enabled: false, playBars: 4, muteBars: 4 },
  tempoRamp: { enabled: false, incrementBpm: 5, everyBars: 8, maxBpm: 200 },
  selectedExerciseId: null,
};

export const DEFAULT_PLAYBACK: PlaybackState = {
  status: "stopped",
  position: { bar: 1, beat: 1 },
  currentBpm: 120,
  isInMutePhase: false,
  countInBeatsLeft: null,
};

export const TIME_SIGNATURE_PRESETS = [
  { beats: 2, noteValue: 4, label: "2/4" },
  { beats: 3, noteValue: 4, label: "3/4" },
  { beats: 4, noteValue: 4, label: "4/4" },
  { beats: 5, noteValue: 4, label: "5/4" },
  { beats: 6, noteValue: 8, label: "6/8" },
  { beats: 7, noteValue: 8, label: "7/8" },
  { beats: 9, noteValue: 8, label: "9/8" },
  { beats: 12, noteValue: 8, label: "12/8" },
] as const;

export const BPM_MIN = 20;
export const BPM_MAX = 300;
export const BPM_STEP = 1;
export const BPM_STEP_LARGE = 10;
