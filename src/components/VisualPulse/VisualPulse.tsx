import { useEffect, useRef, useState } from "react";
import { useMetronome } from "../../hooks/useMetronome";
import styles from "./VisualPulse.module.css";

const PULSE_DURATION_MS = 100;

interface VisualPulseProps {
  className?: string;
}

export function VisualPulse({ className }: VisualPulseProps) {
  const { currentPosition, currentAccent, isPlaying } = useMetronome();
  const [isPulsing, setIsPulsing] = useState(false);
  const prevBeatRef = useRef(currentPosition.beat);

  useEffect(() => {
    if (!isPlaying) {
      prevBeatRef.current = currentPosition.beat;
      return;
    }

    if (prevBeatRef.current !== currentPosition.beat) {
      setIsPulsing(true);
      const timer = setTimeout(() => setIsPulsing(false), PULSE_DURATION_MS);
      prevBeatRef.current = currentPosition.beat;
      return () => clearTimeout(timer);
    }
  }, [currentPosition.beat, isPlaying]);

  const accentClass =
    currentAccent === "accent"
      ? styles.accent
      : currentAccent === "mute"
        ? styles.mute
        : styles.normal;

  return (
    <div className={`${styles.container} ${className ?? ""}`}>
      <div
        className={`
          ${styles.pulse}
          ${isPulsing ? styles.pulsing : ""}
          ${accentClass}
          ${isPlaying ? styles.active : ""}
        `}
      >
        <span className={styles.beat}>{currentPosition.beat}</span>
      </div>

      <div className={styles.bar}>Bar {currentPosition.bar}</div>
    </div>
  );
}
