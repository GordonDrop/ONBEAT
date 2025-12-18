import { describe, expect, it } from "vitest";
import type { SwingSettings } from "../types";
import {
  calculateSwingOffset,
  SIXTEENTH_SWING_RATIO,
  TRIPLET_SWING_RATIO,
} from "./swingCalculator";

describe("calculateSwingOffset", () => {
  const secondsPerBeat = 0.5;

  describe("when swing is disabled", () => {
    it("should return 0", () => {
      const swing: SwingSettings = { enabled: false, type: "sixteenth" };

      expect(calculateSwingOffset(0, swing, secondsPerBeat)).toBe(0);
      expect(calculateSwingOffset(1, swing, secondsPerBeat)).toBe(0);
      expect(calculateSwingOffset(2, swing, secondsPerBeat)).toBe(0);
      expect(calculateSwingOffset(3, swing, secondsPerBeat)).toBe(0);
    });
  });

  describe("when swing is enabled", () => {
    describe("on-beats (even indices)", () => {
      it("should return 0 for on-beats with sixteenth swing", () => {
        const swing: SwingSettings = { enabled: true, type: "sixteenth" };

        expect(calculateSwingOffset(0, swing, secondsPerBeat)).toBe(0);
        expect(calculateSwingOffset(2, swing, secondsPerBeat)).toBe(0);
      });

      it("should return 0 for on-beats with triplet shuffle", () => {
        const swing: SwingSettings = { enabled: true, type: "triplet" };

        expect(calculateSwingOffset(0, swing, secondsPerBeat)).toBe(0);
        expect(calculateSwingOffset(2, swing, secondsPerBeat)).toBe(0);
      });
    });

    describe("off-beats (odd indices)", () => {
      it("should return positive offset for off-beats with sixteenth swing", () => {
        const swing: SwingSettings = { enabled: true, type: "sixteenth" };
        const expectedOffset = secondsPerBeat * SIXTEENTH_SWING_RATIO;

        expect(calculateSwingOffset(1, swing, secondsPerBeat)).toBeCloseTo(expectedOffset);
        expect(calculateSwingOffset(3, swing, secondsPerBeat)).toBeCloseTo(expectedOffset);
      });

      it("should return positive offset for off-beats with triplet shuffle", () => {
        const swing: SwingSettings = { enabled: true, type: "triplet" };
        const expectedOffset = secondsPerBeat * TRIPLET_SWING_RATIO;

        expect(calculateSwingOffset(1, swing, secondsPerBeat)).toBeCloseTo(expectedOffset);
        expect(calculateSwingOffset(3, swing, secondsPerBeat)).toBeCloseTo(expectedOffset);
      });

      it("should have different offsets for sixteenth vs triplet", () => {
        const sixteenth: SwingSettings = { enabled: true, type: "sixteenth" };
        const triplet: SwingSettings = { enabled: true, type: "triplet" };

        const sixteenthOffset = calculateSwingOffset(1, sixteenth, secondsPerBeat);
        const tripletOffset = calculateSwingOffset(1, triplet, secondsPerBeat);

        expect(tripletOffset).toBeGreaterThan(sixteenthOffset);
      });
    });
  });
});
