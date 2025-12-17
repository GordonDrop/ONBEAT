import { describe, expect, it } from 'vitest';
import type { SwingSettings, TimeSignature } from '../types';
import { calculateSwingOffset } from './swingCalculator';

describe('calculateSwingOffset', () => {
  const timeSignature: TimeSignature = { beats: 4, noteValue: 4 };
  const secondsPerBeat = 0.5;

  describe('when swing is disabled', () => {
    it('should return 0', () => {
      const swing: SwingSettings = { enabled: false, type: 'sixteenth' };

      expect(calculateSwingOffset(0, timeSignature, swing, secondsPerBeat)).toBe(0);
      expect(calculateSwingOffset(1, timeSignature, swing, secondsPerBeat)).toBe(0);
      expect(calculateSwingOffset(2, timeSignature, swing, secondsPerBeat)).toBe(0);
      expect(calculateSwingOffset(3, timeSignature, swing, secondsPerBeat)).toBe(0);
    });
  });

  describe('when swing is enabled', () => {
    describe('on-beats (even indices)', () => {
      it('should return 0 for on-beats with sixteenth swing', () => {
        const swing: SwingSettings = { enabled: true, type: 'sixteenth' };

        expect(calculateSwingOffset(0, timeSignature, swing, secondsPerBeat)).toBe(0);
        expect(calculateSwingOffset(2, timeSignature, swing, secondsPerBeat)).toBe(0);
      });

      it('should return 0 for on-beats with triplet shuffle', () => {
        const swing: SwingSettings = { enabled: true, type: 'triplet' };

        expect(calculateSwingOffset(0, timeSignature, swing, secondsPerBeat)).toBe(0);
        expect(calculateSwingOffset(2, timeSignature, swing, secondsPerBeat)).toBe(0);
      });
    });

    describe('off-beats (odd indices)', () => {
      it('should return positive offset for off-beats with sixteenth swing', () => {
        const swing: SwingSettings = { enabled: true, type: 'sixteenth' };
        const expectedOffset = secondsPerBeat * 0.33;

        expect(calculateSwingOffset(1, timeSignature, swing, secondsPerBeat)).toBeCloseTo(expectedOffset);
        expect(calculateSwingOffset(3, timeSignature, swing, secondsPerBeat)).toBeCloseTo(expectedOffset);
      });

      it('should return positive offset for off-beats with triplet shuffle', () => {
        const swing: SwingSettings = { enabled: true, type: 'triplet' };
        const expectedOffset = secondsPerBeat * 0.33;

        expect(calculateSwingOffset(1, timeSignature, swing, secondsPerBeat)).toBeCloseTo(expectedOffset);
        expect(calculateSwingOffset(3, timeSignature, swing, secondsPerBeat)).toBeCloseTo(expectedOffset);
      });
    });
  });
});

