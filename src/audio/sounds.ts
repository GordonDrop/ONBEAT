export type ClickType = 'accent' | 'normal';

export function playClick(
  audioContext: AudioContext,
  time: number,
  type: ClickType
): void {
  const isAccent = type === 'accent';

  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.type = 'sine';
  oscillator.frequency.value = isAccent ? 880 : 440;

  const volume = isAccent ? 1.0 : 0.7;
  const duration = isAccent ? 0.05 : 0.03;

  gainNode.gain.setValueAtTime(volume, time);
  gainNode.gain.exponentialRampToValueAtTime(0.001, time + duration);

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  oscillator.start(time);
  oscillator.stop(time + duration);
}

