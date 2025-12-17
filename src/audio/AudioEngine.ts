import type {
  BeatAccent,
  BeatAccents,
  PlaybackPosition,
  SwingSettings,
  TimeSignature,
} from "../types";
import { calculateSwingOffset } from "./swingCalculator";
import { type ClickType, playClick } from "./sounds";

export interface AudioEngineConfig {
  onBeat: (position: PlaybackPosition, accent: BeatAccent) => void;
  onBarComplete: (barNumber: number) => void;
}

export class AudioEngine {
  private config: AudioEngineConfig;
  private audioContext: AudioContext | null = null;
  private schedulerTimerId: number | null = null;

  private bpm = 120;
  private timeSignature: TimeSignature = { beats: 4, noteValue: 4 };
  private swing: SwingSettings = { enabled: false, type: "sixteenth" };
  private beatAccents: BeatAccents = ["accent", "normal", "normal", "normal"];
  private isMuted = false;

  private currentBeat = 0;
  private currentBar = 1;
  private nextNoteTime = 0;

  private readonly LOOKAHEAD_MS = 25;
  private readonly SCHEDULE_AHEAD_SEC = 0.1;

  constructor(config: AudioEngineConfig) {
    this.config = config;
  }

  start(): void {
    if (!this.audioContext) {
      this.audioContext = new AudioContext();
    }

    if (this.audioContext.state === "suspended") {
      this.audioContext.resume();
    }

    this.currentBeat = 0;
    this.currentBar = 1;
    this.nextNoteTime = this.audioContext.currentTime + 0.05;

    this.schedulerTimerId = window.setInterval(() => this.scheduler(), this.LOOKAHEAD_MS);
  }

  pause(): void {
    if (this.schedulerTimerId !== null) {
      clearInterval(this.schedulerTimerId);
      this.schedulerTimerId = null;
    }
    this.audioContext?.suspend();
  }

  resume(): void {
    if (!this.audioContext) return;

    this.audioContext.resume();
    this.nextNoteTime = this.audioContext.currentTime + 0.05;

    this.schedulerTimerId = window.setInterval(() => this.scheduler(), this.LOOKAHEAD_MS);
  }

  stop(): void {
    if (this.schedulerTimerId !== null) {
      clearInterval(this.schedulerTimerId);
      this.schedulerTimerId = null;
    }

    this.currentBeat = 0;
    this.currentBar = 1;
  }

  setBpm(bpm: number): void {
    this.bpm = Math.max(20, Math.min(300, bpm));
  }

  setTimeSignature(ts: TimeSignature): void {
    this.timeSignature = ts;
    if (this.currentBeat >= ts.beats) {
      this.currentBeat = 0;
    }
  }

  setBeatAccents(accents: BeatAccents): void {
    this.beatAccents = accents;
  }

  setSwing(swing: SwingSettings): void {
    this.swing = swing;
  }

  setMuted(muted: boolean): void {
    this.isMuted = muted;
  }

  getCurrentPosition(): PlaybackPosition {
    return {
      bar: this.currentBar,
      beat: this.currentBeat + 1,
    };
  }

  isPlaying(): boolean {
    return this.schedulerTimerId !== null;
  }

  private scheduler(): void {
    if (!this.audioContext) return;

    while (this.nextNoteTime < this.audioContext.currentTime + this.SCHEDULE_AHEAD_SEC) {
      this.scheduleNote(this.nextNoteTime);
      this.advanceNote();
    }
  }

  private scheduleNote(time: number): void {
    const accent = this.beatAccents[this.currentBeat] ?? "normal";

    if (!this.isMuted && accent !== "mute") {
      this.playClick(time, accent as ClickType);
    }

    this.scheduleUICallback(
      time,
      {
        bar: this.currentBar,
        beat: this.currentBeat + 1,
      },
      accent
    );
  }

  private advanceNote(): void {
    const secondsPerBeat = 60.0 / this.bpm;
    let swingOffset = 0;

    if (this.swing.enabled) {
      swingOffset = calculateSwingOffset(
        this.currentBeat,
        this.timeSignature,
        this.swing,
        secondsPerBeat
      );
    }

    this.nextNoteTime += secondsPerBeat + swingOffset;
    this.currentBeat++;

    if (this.currentBeat >= this.timeSignature.beats) {
      this.currentBeat = 0;
      this.config.onBarComplete(this.currentBar);
      this.currentBar++;
    }
  }

  private scheduleUICallback(
    audioTime: number,
    position: PlaybackPosition,
    accent: BeatAccent
  ): void {
    if (!this.audioContext) return;

    const delayMs = (audioTime - this.audioContext.currentTime) * 1000;

    setTimeout(
      () => {
        this.config.onBeat(position, accent);
      },
      Math.max(0, delayMs)
    );
  }

  private playClick(time: number, type: ClickType): void {
    if (!this.audioContext) return;
    playClick(this.audioContext, time, type);
  }
}
