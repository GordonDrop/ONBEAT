import { useMetronome } from "../../hooks/useMetronome";
import type { BeatAccent } from "../../types";
import styles from "./BeatGrid.module.css";

interface BeatGridProps {
  className?: string;
}

const accentStyles: Record<BeatAccent, string | undefined> = {
  accent: styles.accent,
  normal: styles.normal,
  mute: styles.mute,
};

const ACCENT_ICONS: Record<BeatAccent, string> = {
  accent: "●",
  normal: "○",
  mute: "×",
};

export function BeatGrid({ className }: BeatGridProps) {
  const { beatAccents, toggleBeatAccent, currentPosition, isPlaying } = useMetronome();

  return (
    <div className={`${styles.container} ${className ?? ""}`}>
      {beatAccents.map((accent, index) => {
        const beatNumber = index + 1;
        const isActive = isPlaying && currentPosition.beat === beatNumber;

        return (
          <button
            key={beatNumber}
            className={`
              ${styles.beat}
              ${accentStyles[accent] ?? ""}
              ${isActive ? styles.active : ""}
            `}
            onClick={() => toggleBeatAccent(index)}
            aria-label={`Beat ${beatNumber}, ${accent}. Click to change.`}
            type="button"
          >
            <span className={styles.icon}>{ACCENT_ICONS[accent]}</span>
            <span className={styles.number}>{beatNumber}</span>
          </button>
        );
      })}
    </div>
  );
}
