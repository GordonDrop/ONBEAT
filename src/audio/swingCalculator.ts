import type { SwingSettings, TimeSignature } from '../types';

export function calculateSwingOffset(
  currentBeat: number,
  _timeSignature: TimeSignature,
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

  const swingAmount = swing.type === 'triplet' ? 0.33 : 0.33;

  return secondsPerBeat * swingAmount;
}

