import { useMetronome } from "../../hooks/useMetronome";
import styles from "./BpmControl.module.css";

interface BpmControlProps {
  className?: string;
}

export function BpmControl({ className }: BpmControlProps) {
  const { bpm, setBpm, incrementBpm } = useMetronome();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.valueAsNumber;
    setBpm(value);
  };

  return (
    <div className={`${styles.container} ${className ?? ""}`}>
      <span className={styles.label} id="bpm-label">
        BPM
      </span>

      <input type="number" className={styles.input} value={bpm} onChange={handleInputChange} />

      <div className={styles.buttons}>
        <button
          className={styles.buttonLarge}
          onClick={() => incrementBpm(-10)}
          aria-label="Decrease BPM by 10"
          type="button"
        >
          −10
        </button>
        <button
          className={styles.button}
          onClick={() => incrementBpm(-1)}
          aria-label="Decrease BPM by 1"
          type="button"
        >
          −
        </button>
        <button
          className={styles.button}
          onClick={() => incrementBpm(1)}
          aria-label="Increase BPM by 1"
          type="button"
        >
          +
        </button>
        <button
          className={styles.buttonLarge}
          onClick={() => incrementBpm(10)}
          aria-label="Increase BPM by 10"
          type="button"
        >
          +10
        </button>
      </div>
    </div>
  );
}
