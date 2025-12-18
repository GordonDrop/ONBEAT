import type { BeatAccent, SubdivisionAccent, SubdivisionMode } from "../types";

export const SUBDIVISION_TIMINGS: Record<SubdivisionMode, number[]> = {
  straight: [0, 0.25, 0.5, 0.75],
  tripletShuffle: [0, 2 / 3],
  sixteenthSwing: [0, 1 / 3, 0.5, 5 / 6],
};

export const SUBDIVISION_COUNTS: Record<SubdivisionMode, number> = {
  straight: 4,
  tripletShuffle: 2,
  sixteenthSwing: 4,
};

export function calculateSubdivisionTime(
  beatStartTime: number,
  subdivisionIndex: number,
  mode: SubdivisionMode,
  secondsPerBeat: number
): number {
  const timings = SUBDIVISION_TIMINGS[mode];
  const normalizedOffset = timings[subdivisionIndex % timings.length];
  return beatStartTime + normalizedOffset * secondsPerBeat;
}

export function getSubdivisionAccent(
  subdivisionIndex: number,
  beatAccent: BeatAccent
): SubdivisionAccent {
  if (beatAccent === "mute") {
    return "subdivision";
  }

  if (subdivisionIndex === 0) {
    return "downbeat";
  }

  return "subdivision";
}

