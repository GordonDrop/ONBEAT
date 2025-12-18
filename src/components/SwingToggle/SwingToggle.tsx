import { useMetronome } from "../../hooks/useMetronome";
import type { SubdivisionMode } from "../../types";
import styles from "./SwingToggle.module.css";

interface SwingToggleProps {
  className?: string;
}

export function SwingToggle({ className }: SwingToggleProps) {
  const { isSwingEnabled, swingMode, toggleSwing, setSwingMode } = useMetronome();

  const handleModeChange = (mode: SubdivisionMode): void => {
    setSwingMode(mode);
  };

  return (
    <div className={`${styles.container} ${className ?? ""}`}>
      <div className={styles.header}>
        <span className={styles.label}>Swing</span>
        <button
          className={`${styles.toggle} ${isSwingEnabled ? styles.active : ""}`}
          onClick={toggleSwing}
          aria-label={isSwingEnabled ? "Disable swing" : "Enable swing"}
          aria-pressed={isSwingEnabled}
          type="button"
        >
          <span className={styles.toggleIcon}>⏻</span>
        </button>
      </div>

      {isSwingEnabled && (
        <div className={styles.options}>
          <label className={styles.option}>
            <input
              type="radio"
              name="swingMode"
              checked={swingMode === "tripletShuffle"}
              onChange={() => handleModeChange("tripletShuffle")}
            />
            <span className={styles.optionLabel}>Triplet Shuffle</span>
          </label>
          <label className={styles.option}>
            <input
              type="radio"
              name="swingMode"
              checked={swingMode === "sixteenthSwing"}
              onChange={() => handleModeChange("sixteenthSwing")}
            />
            <span className={styles.optionLabel}>Sixteenth Swing</span>
          </label>
        </div>
      )}
    </div>
  );
}
