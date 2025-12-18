import { useMetronome } from "../../hooks/useMetronome";
import type { SwingType } from "../../types";
import styles from "./SwingToggle.module.css";

interface SwingToggleProps {
  className?: string;
}

export function SwingToggle({ className }: SwingToggleProps) {
  const { isSwingEnabled, swingType, toggleSwing, setSwingType } = useMetronome();

  const handleTypeChange = (type: SwingType): void => {
    setSwingType(type);
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
              name="swingType"
              checked={swingType === "sixteenth"}
              onChange={() => handleTypeChange("sixteenth")}
            />
            <span className={styles.optionLabel}>Sixteenth</span>
          </label>
          <label className={styles.option}>
            <input
              type="radio"
              name="swingType"
              checked={swingType === "triplet"}
              onChange={() => handleTypeChange("triplet")}
            />
            <span className={styles.optionLabel}>Triplet Shuffle</span>
          </label>
        </div>
      )}
    </div>
  );
}
