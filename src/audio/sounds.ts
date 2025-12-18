export type ClickType = "accent" | "normal" | "subdivision";

interface SoundParams {
  freq: number;
  duration: number;
  volume: number;
}

const SOUND_PARAMS: Record<ClickType, SoundParams> = {
  accent: { freq: 880, duration: 0.05, volume: 1.0 },
  normal: { freq: 440, duration: 0.03, volume: 0.7 },
  subdivision: { freq: 330, duration: 0.02, volume: 0.35 },
};

export function playClick(audioContext: AudioContext, time: number, type: ClickType): void {
  const params = SOUND_PARAMS[type];

  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.type = "sine";
  oscillator.frequency.value = params.freq;

  gainNode.gain.setValueAtTime(params.volume, time);
  gainNode.gain.exponentialRampToValueAtTime(0.001, time + params.duration);

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  oscillator.start(time);
  oscillator.stop(time + params.duration);
}
