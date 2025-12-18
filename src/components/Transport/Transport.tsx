import { useMetronome } from "../../hooks/useMetronome";
import styles from "./Transport.module.css";

interface TransportProps {
  className?: string;
}

export function Transport({ className }: TransportProps) {
  const { isPlaying, isPaused, togglePlayback, stop } = useMetronome();

  const playPauseIcon = isPlaying ? "⏸" : "▶";
  const playPauseLabel = isPlaying ? "Pause" : isPaused ? "Resume" : "Play";

  return (
    <div className={`${styles.container} ${className ?? ""}`}>
      <button className={styles.stopButton} onClick={stop} aria-label="Stop" type="button">
        <span className={styles.icon}>⏹</span>
      </button>

      <button
        className={`${styles.playButton} ${isPlaying ? styles.playing : ""}`}
        onClick={togglePlayback}
        aria-label={playPauseLabel}
        type="button"
      >
        <span className={styles.icon}>{playPauseIcon}</span>
      </button>
    </div>
  );
}
