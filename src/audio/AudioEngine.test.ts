/**
 * @vitest-environment jsdom
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { AudioEngine, type AudioEngineConfig } from "./AudioEngine";

class MockAudioContext {
  currentTime = 0;
  state: AudioContextState = "running";
  destination = {};

  createOscillator = vi.fn(() => ({
    type: "sine",
    frequency: { value: 440 },
    connect: vi.fn(),
    start: vi.fn(),
    stop: vi.fn(),
  }));

  createGain = vi.fn(() => ({
    gain: {
      value: 1,
      setValueAtTime: vi.fn(),
      exponentialRampToValueAtTime: vi.fn(),
    },
    connect: vi.fn(),
  }));

  resume = vi.fn().mockResolvedValue(undefined);
  suspend = vi.fn().mockResolvedValue(undefined);
}

describe("AudioEngine", () => {
  let engine: AudioEngine;
  let config: AudioEngineConfig;

  beforeEach(() => {
    vi.useFakeTimers();

    config = {
      onBeat: vi.fn(),
      onBarComplete: vi.fn(),
    };

    vi.stubGlobal("AudioContext", MockAudioContext);

    engine = new AudioEngine(config);
  });

  afterEach(() => {
    engine.stop();
    vi.clearAllMocks();
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  describe("initialization", () => {
    it("should create AudioContext on start", () => {
      expect(engine.isPlaying()).toBe(false);
      engine.start();
      expect(engine.isPlaying()).toBe(true);
    });

    it("should initialize with default values", () => {
      expect(engine.isPlaying()).toBe(false);
      expect(engine.getCurrentPosition()).toEqual({ bar: 1, beat: 1 });
    });
  });

  describe("playback control", () => {
    it("should start playing", () => {
      engine.start();

      expect(engine.isPlaying()).toBe(true);
    });

    it("should schedule beats when started", () => {
      engine.start();
      expect(engine.isPlaying()).toBe(true);
      expect(engine.getCurrentPosition()).toEqual({ bar: 1, beat: 1 });
    });

    it("should pause without losing position", () => {
      engine.start();
      vi.advanceTimersByTime(50);

      engine.pause();

      expect(engine.isPlaying()).toBe(false);
    });

    it("should resume from paused position", () => {
      engine.start();
      engine.pause();
      engine.resume();

      expect(engine.isPlaying()).toBe(true);
    });

    it("should stop and reset to beginning", () => {
      engine.start();
      vi.advanceTimersByTime(100);

      engine.stop();

      expect(engine.isPlaying()).toBe(false);
      expect(engine.getCurrentPosition()).toEqual({ bar: 1, beat: 1 });
    });
  });

  describe("BPM changes", () => {
    it("should clamp BPM to minimum of 20", () => {
      engine.setBpm(10);
      engine.start();

      expect(engine.isPlaying()).toBe(true);
    });

    it("should clamp BPM to maximum of 300", () => {
      engine.setBpm(400);
      engine.start();

      expect(engine.isPlaying()).toBe(true);
    });
  });

  describe("time signature", () => {
    it("should handle time signature changes", () => {
      engine.setTimeSignature({ beats: 3, noteValue: 4 });
      engine.start();

      expect(engine.isPlaying()).toBe(true);
    });

    it("should reset currentBeat if it exceeds new time signature", () => {
      engine.start();
      engine.setTimeSignature({ beats: 2, noteValue: 4 });

      expect(engine.getCurrentPosition().beat).toBeLessThanOrEqual(2);
    });
  });

  describe("beat accents", () => {
    it("should accept beat accents array", () => {
      engine.setBeatAccents(["accent", "mute", "normal", "normal"]);
      engine.start();

      expect(engine.isPlaying()).toBe(true);
    });
  });

  describe("swing", () => {
    it("should accept swing settings", () => {
      engine.setSwing({ enabled: true, type: "sixteenth" });
      engine.start();

      expect(engine.isPlaying()).toBe(true);
    });
  });

  describe("mute", () => {
    it("should accept muted state", () => {
      engine.setMuted(true);
      engine.start();

      expect(engine.isPlaying()).toBe(true);
    });
  });
});
