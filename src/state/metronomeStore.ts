import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import type {
  BeatAccent,
  ClickSkipSettings,
  CountInSettings,
  MetronomeSettings,
  PlaybackPosition,
  PlaybackState,
  SubdivisionMode,
  SwingSettings,
  TempoRampSettings,
  TimeSignature,
  TrainingSettings,
} from "../types";
import { BPM_MAX, BPM_MIN, DEFAULT_PLAYBACK, DEFAULT_SETTINGS, DEFAULT_TRAINING } from "./defaults";

interface MetronomeState {
  settings: MetronomeSettings;
  training: TrainingSettings;
  playback: PlaybackState;
}

interface MetronomeActions {
  setBpm: (bpm: number) => void;
  incrementBpm: (delta: number) => void;
  setTimeSignature: (ts: TimeSignature) => void;
  setSwing: (swing: SwingSettings) => void;
  toggleSwing: () => void;
  setSwingMode: (mode: SubdivisionMode) => void;
  setBeatAccent: (beat: number, accent: BeatAccent) => void;
  toggleBeatAccent: (beat: number) => void;

  start: () => void;
  pause: () => void;
  resume: () => void;
  stop: () => void;
  tick: (position: PlaybackPosition) => void;

  setCountIn: (countIn: CountInSettings) => void;
  setClickSkip: (clickSkip: ClickSkipSettings) => void;
  setTempoRamp: (tempoRamp: TempoRampSettings) => void;
  selectExercise: (exerciseId: string | null) => void;
}

export interface MetronomeStore extends MetronomeState, MetronomeActions {}

export const useMetronomeStore = create<MetronomeStore>()(
  subscribeWithSelector((set, get) => ({
    settings: DEFAULT_SETTINGS,
    training: DEFAULT_TRAINING,
    playback: DEFAULT_PLAYBACK,

    setBpm: (bpm) => {
      const clampedBpm = Math.max(BPM_MIN, Math.min(BPM_MAX, bpm));
      set((state) => ({
        settings: { ...state.settings, bpm: clampedBpm },
        playback: { ...state.playback, currentBpm: clampedBpm },
      }));
    },

    incrementBpm: (delta) => {
      const { bpm } = get().settings;
      get().setBpm(bpm + delta);
    },

    setTimeSignature: (ts) => {
      set((state) => {
        const newBeats = ts.beats;
        const newAccents: BeatAccent[] = Array<BeatAccent>(newBeats).fill("normal");
        newAccents[0] = "accent";

        return {
          settings: {
            ...state.settings,
            timeSignature: ts,
            beatAccents: newAccents,
          },
        };
      });
    },

    setSwing: (swing) => {
      set((state) => ({
        settings: { ...state.settings, swing },
      }));
    },

    toggleSwing: () => {
      set((state) => ({
        settings: {
          ...state.settings,
          swing: {
            ...state.settings.swing,
            enabled: !state.settings.swing.enabled,
          },
        },
      }));
    },

    setSwingMode: (mode) => {
      set((state) => ({
        settings: {
          ...state.settings,
          swing: { ...state.settings.swing, mode },
        },
      }));
    },

    setBeatAccent: (beat, accent) => {
      set((state) => {
        const newAccents = [...state.settings.beatAccents];
        newAccents[beat] = accent;
        return {
          settings: { ...state.settings, beatAccents: newAccents },
        };
      });
    },

    toggleBeatAccent: (beat) => {
      set((state) => {
        const currentAccent = state.settings.beatAccents[beat];
        const accentCycle: BeatAccent[] = ["normal", "accent", "mute"];
        const currentIndex = accentCycle.indexOf(currentAccent ?? "normal");
        const nextAccent = accentCycle[(currentIndex + 1) % accentCycle.length];

        const newAccents = [...state.settings.beatAccents];
        newAccents[beat] = nextAccent ?? "normal";

        return {
          settings: { ...state.settings, beatAccents: newAccents },
        };
      });
    },

    start: () => {
      const { training, settings } = get();
      set({
        playback: {
          status: training.countIn.enabled ? "countIn" : "playing",
          position: { bar: 1, beat: 1 },
          currentBpm: settings.bpm,
          isInMutePhase: false,
          countInBeatsLeft: training.countIn.enabled
            ? training.countIn.bars * settings.timeSignature.beats
            : null,
        },
      });
    },

    pause: () => {
      set((state) => ({
        playback: { ...state.playback, status: "paused" },
      }));
    },

    resume: () => {
      set((state) => ({
        playback: { ...state.playback, status: "playing" },
      }));
    },

    stop: () => {
      const { settings } = get();
      set({
        playback: {
          ...DEFAULT_PLAYBACK,
          currentBpm: settings.bpm,
        },
      });
    },

    tick: (position) => {
      set((state) => ({
        playback: { ...state.playback, position },
      }));
    },

    setCountIn: (countIn) => {
      set((state) => ({
        training: { ...state.training, countIn },
      }));
    },

    setClickSkip: (clickSkip) => {
      set((state) => ({
        training: { ...state.training, clickSkip },
      }));
    },

    setTempoRamp: (tempoRamp) => {
      set((state) => ({
        training: { ...state.training, tempoRamp },
      }));
    },

    selectExercise: (exerciseId) => {
      set((state) => ({
        training: { ...state.training, selectedExerciseId: exerciseId },
      }));
    },
  }))
);

export const selectBpm = (state: MetronomeStore) => state.settings.bpm;
export const selectTimeSignature = (state: MetronomeStore) => state.settings.timeSignature;
export const selectSwing = (state: MetronomeStore) => state.settings.swing;
export const selectBeatAccents = (state: MetronomeStore) => state.settings.beatAccents;
export const selectPlaybackStatus = (state: MetronomeStore) => state.playback.status;
export const selectPosition = (state: MetronomeStore) => state.playback.position;
export const selectCurrentBpm = (state: MetronomeStore) => state.playback.currentBpm;

export const selectIsPlaying = (state: MetronomeStore) =>
  state.playback.status === "playing" || state.playback.status === "countIn";

export const selectIsPaused = (state: MetronomeStore) => state.playback.status === "paused";

export const selectIsStopped = (state: MetronomeStore) => state.playback.status === "stopped";

export const selectCurrentAccent = (state: MetronomeStore) =>
  state.settings.beatAccents[state.playback.position.beat - 1] ?? "normal";
