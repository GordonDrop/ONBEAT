import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { playClick } from "./sounds";

describe("playClick", () => {
  let mockAudioContext: AudioContext;
  let mockOscillator: OscillatorNode;
  let mockGainNode: GainNode;

  beforeEach(() => {
    mockOscillator = {
      type: "sine",
      frequency: { value: 440 },
      connect: vi.fn(),
      start: vi.fn(),
      stop: vi.fn(),
    } as unknown as OscillatorNode;

    mockGainNode = {
      gain: {
        value: 1,
        setValueAtTime: vi.fn(),
        exponentialRampToValueAtTime: vi.fn(),
      },
      connect: vi.fn(),
    } as unknown as GainNode;

    mockAudioContext = {
      currentTime: 0,
      state: "running",
      createOscillator: vi.fn(() => mockOscillator),
      createGain: vi.fn(() => mockGainNode),
      destination: {},
    } as unknown as AudioContext;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("accent click", () => {
    it("should create oscillator with 880Hz frequency", () => {
      playClick(mockAudioContext, 0.1, "accent");

      expect(mockOscillator.frequency.value).toBe(880);
    });

    it("should set volume to 1.0", () => {
      playClick(mockAudioContext, 0.1, "accent");

      expect(mockGainNode.gain.setValueAtTime).toHaveBeenCalledWith(1.0, 0.1);
    });

    it("should set duration to 50ms", () => {
      playClick(mockAudioContext, 0.1, "accent");

      const expectedEndTime = 0.1 + 0.05;
      expect(mockGainNode.gain.exponentialRampToValueAtTime).toHaveBeenCalledWith(
        0.001,
        expectedEndTime
      );
      expect(mockOscillator.stop).toHaveBeenCalledWith(expectedEndTime);
    });
  });

  describe("normal click", () => {
    it("should create oscillator with 440Hz frequency", () => {
      playClick(mockAudioContext, 0.1, "normal");

      expect(mockOscillator.frequency.value).toBe(440);
    });

    it("should set volume to 0.7", () => {
      playClick(mockAudioContext, 0.1, "normal");

      expect(mockGainNode.gain.setValueAtTime).toHaveBeenCalledWith(0.7, 0.1);
    });

    it("should set duration to 30ms", () => {
      playClick(mockAudioContext, 0.1, "normal");

      expect(mockGainNode.gain.exponentialRampToValueAtTime).toHaveBeenCalledWith(0.001, 0.13);
      expect(mockOscillator.stop).toHaveBeenCalledWith(0.13);
    });
  });

  describe("audio graph connections", () => {
    it("should connect oscillator to gain node", () => {
      playClick(mockAudioContext, 0.1, "normal");

      expect(mockOscillator.connect).toHaveBeenCalledWith(mockGainNode);
    });

    it("should connect gain node to destination", () => {
      playClick(mockAudioContext, 0.1, "normal");

      expect(mockGainNode.connect).toHaveBeenCalledWith(mockAudioContext.destination);
    });

    it("should schedule sound at specified time", () => {
      const scheduledTime = 0.5;
      playClick(mockAudioContext, scheduledTime, "normal");

      expect(mockOscillator.start).toHaveBeenCalledWith(scheduledTime);
    });
  });
});
