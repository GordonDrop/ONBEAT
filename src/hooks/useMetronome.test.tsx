/**
 * @vitest-environment jsdom
 */
import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useMetronomeStore } from "../state/metronomeStore";
import { useMetronome } from "./useMetronome";

let mockEngineInstance: {
  start: ReturnType<typeof vi.fn>;
  stop: ReturnType<typeof vi.fn>;
  pause: ReturnType<typeof vi.fn>;
  resume: ReturnType<typeof vi.fn>;
  setBpm: ReturnType<typeof vi.fn>;
  setTimeSignature: ReturnType<typeof vi.fn>;
  setSwing: ReturnType<typeof vi.fn>;
  setBeatAccents: ReturnType<typeof vi.fn>;
  isPlaying: ReturnType<typeof vi.fn>;
} | null = null;

vi.mock("../audio/AudioEngine", () => {
  const MockAudioEngine = class {
    start = vi.fn();
    stop = vi.fn();
    pause = vi.fn();
    resume = vi.fn();
    setBpm = vi.fn();
    setTimeSignature = vi.fn();
    setSwing = vi.fn();
    setBeatAccents = vi.fn();
    isPlaying = vi.fn().mockReturnValue(false);

    constructor() {
      mockEngineInstance = this;
    }
  };

  return {
    AudioEngine: MockAudioEngine,
  };
});

describe("useMetronome", () => {
  beforeEach(() => {
    useMetronomeStore.setState({
      settings: {
        bpm: 120,
        timeSignature: { beats: 4, noteValue: 4 },
        swing: { enabled: false, type: "sixteenth" },
        beatAccents: ["accent", "normal", "normal", "normal"],
      },
      training: {
        countIn: { enabled: false, bars: 1 },
        clickSkip: { enabled: false, playBars: 4, muteBars: 4 },
        tempoRamp: { enabled: false, incrementBpm: 5, everyBars: 8, maxBpm: 200 },
        selectedExerciseId: null,
      },
      playback: {
        status: "stopped",
        position: { bar: 1, beat: 1 },
        currentBpm: 120,
        isInMutePhase: false,
        countInBeatsLeft: null,
      },
    });
  });

  describe("state access", () => {
    it("should return current bpm from store", () => {
      const { result } = renderHook(() => useMetronome());
      expect(result.current.bpm).toBe(120);
    });

    it("should return timeSignature from store", () => {
      const { result } = renderHook(() => useMetronome());
      expect(result.current.timeSignature).toEqual({ beats: 4, noteValue: 4 });
    });

    it("should return swing state", () => {
      const { result } = renderHook(() => useMetronome());
      expect(result.current.isSwingEnabled).toBe(false);
      expect(result.current.swingType).toBe("sixteenth");
    });

    it("should return beatAccents", () => {
      const { result } = renderHook(() => useMetronome());
      expect(result.current.beatAccents).toEqual(["accent", "normal", "normal", "normal"]);
    });
  });

  describe("actions", () => {
    it("should call setBpm action when setBpm called", () => {
      const { result } = renderHook(() => useMetronome());

      act(() => {
        result.current.setBpm(140);
      });

      expect(result.current.bpm).toBe(140);
    });

    it("should call incrementBpm action", () => {
      const { result } = renderHook(() => useMetronome());

      act(() => {
        result.current.incrementBpm(10);
      });

      expect(result.current.bpm).toBe(130);
    });

    it("should format setTimeSignature call", () => {
      const { result } = renderHook(() => useMetronome());

      act(() => {
        result.current.setTimeSignature(3, 4);
      });

      expect(result.current.timeSignature).toEqual({ beats: 3, noteValue: 4 });
    });

    it("should toggle playback from stopped to playing", () => {
      const { result } = renderHook(() => useMetronome());

      act(() => {
        result.current.togglePlayback();
      });

      expect(result.current.isPlaying).toBe(true);
    });

    it("should toggle playback from playing to paused", () => {
      const { result } = renderHook(() => useMetronome());

      act(() => {
        result.current.start();
      });

      act(() => {
        result.current.togglePlayback();
      });

      expect(result.current.isPaused).toBe(true);
    });

    it("should toggle playback from paused to playing", () => {
      const { result } = renderHook(() => useMetronome());

      act(() => {
        result.current.start();
        result.current.pause();
      });

      act(() => {
        result.current.togglePlayback();
      });

      expect(result.current.isPlaying).toBe(true);
    });
  });

  describe("AudioEngine integration", () => {
    it("should create AudioEngine on mount", () => {
      renderHook(() => useMetronome());
      expect(mockEngineInstance).not.toBeNull();
      expect(mockEngineInstance?.setBpm).toHaveBeenCalled();
    });

    it("should destroy AudioEngine on unmount", () => {
      const { unmount } = renderHook(() => useMetronome());
      mockEngineInstance?.stop.mockClear();
      unmount();
      expect(mockEngineInstance?.stop).toHaveBeenCalled();
    });
  });
});
