import type { SwingSettings } from "../types";

export const TRIPLET_SWING_RATIO = 1 / 3;
export const SIXTEENTH_SWING_RATIO = 0.25;

/**
 * Calculates the timing offset for swing feel on off-beats.
 *
 * Swing delays off-beats (odd-indexed beats) by a fraction of the beat duration:
 * - Triplet swing (shuffle): off-beat falls on the 3rd triplet (1/3 ≈ 0.333 of beat)
 * - Sixteenth swing: lighter swing feel (1/4 = 0.25 of beat)
 *
 * @param currentBeat - Zero-based beat index within the bar
 * @param swing - Swing settings (enabled state and type)
 * @param secondsPerBeat - Duration of one beat in seconds (60 / BPM)
 * @returns Time offset in seconds to add to the scheduled note time
 */
export function calculateSwingOffset(
  currentBeat: number,
  swing: SwingSettings,
  secondsPerBeat: number
): number {
  if (!swing.enabled) {
    return 0;
  }

  const isOffBeat = currentBeat % 2 === 1;

  if (!isOffBeat) {
    return 0;
  }

  const swingRatio = swing.type === "triplet" ? TRIPLET_SWING_RATIO : SIXTEENTH_SWING_RATIO;

  return secondsPerBeat * swingRatio;
}
