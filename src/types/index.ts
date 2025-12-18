export interface TimeSignature {
  beats: number;
  noteValue: number;
}

export type SubdivisionMode = "straight" | "tripletShuffle" | "sixteenthSwing";

export type SubdivisionAccent = "downbeat" | "subdivision";

export interface SwingSettings {
  enabled: boolean;
  mode: SubdivisionMode;
}

export type BeatAccent = "mute" | "normal" | "accent";
export type BeatAccents = BeatAccent[];

export interface MetronomeSettings {
  bpm: number;
  timeSignature: TimeSignature;
  swing: SwingSettings;
  beatAccents: BeatAccents;
}

export interface CountInSettings {
  enabled: boolean;
  bars: 1 | 2;
}

export interface ClickSkipSettings {
  enabled: boolean;
  playBars: number;
  muteBars: number;
}

export interface TempoRampSettings {
  enabled: boolean;
  incrementBpm: number;
  everyBars: number;
  maxBpm: number;
}

export interface RhythmExercise {
  id: string;
  name: string;
  description: string;
  settings: MetronomeSettings;
  training?: {
    clickSkip?: ClickSkipSettings;
    tempoRamp?: TempoRampSettings;
  };
}

export interface TrainingSettings {
  countIn: CountInSettings;
  clickSkip: ClickSkipSettings;
  tempoRamp: TempoRampSettings;
  selectedExerciseId: string | null;
}

export type PlaybackStatus = "stopped" | "playing" | "paused" | "countIn";

export interface PlaybackPosition {
  bar: number;
  beat: number;
}

export interface PlaybackState {
  status: PlaybackStatus;
  position: PlaybackPosition;
  currentBpm: number;
  isInMutePhase: boolean;
  countInBeatsLeft: number | null;
}

export interface AppState {
  settings: MetronomeSettings;
  training: TrainingSettings;
  playback: PlaybackState;
}

export type MetronomeAction =
  | { type: "SET_BPM"; payload: number }
  | { type: "SET_TIME_SIGNATURE"; payload: TimeSignature }
  | { type: "SET_SWING"; payload: SwingSettings }
  | { type: "SET_BEAT_ACCENT"; payload: { beat: number; accent: BeatAccent } }
  | { type: "TOGGLE_BEAT_ACCENT"; payload: number }
  | { type: "START" }
  | { type: "PAUSE" }
  | { type: "RESUME" }
  | { type: "STOP" }
  | { type: "TICK"; payload: PlaybackPosition }
  | { type: "SET_COUNT_IN"; payload: CountInSettings }
  | { type: "SET_CLICK_SKIP"; payload: ClickSkipSettings }
  | { type: "SET_TEMPO_RAMP"; payload: TempoRampSettings }
  | { type: "SELECT_EXERCISE"; payload: string | null };
