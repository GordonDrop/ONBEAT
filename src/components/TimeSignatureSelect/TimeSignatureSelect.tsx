import { useMetronome } from "../../hooks/useMetronome";
import { TIME_SIGNATURE_PRESETS } from "../../state/defaults";
import styles from "./TimeSignatureSelect.module.css";

interface TimeSignatureSelectProps {
  className?: string;
}

export function TimeSignatureSelect({ className }: TimeSignatureSelectProps) {
  const { timeSignature, setTimeSignature } = useMetronome();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    const [beatsStr, noteValueStr] = e.target.value.split("/");
    const beats = Number(beatsStr);
    const noteValue = Number(noteValueStr);
    if (!Number.isNaN(beats) && !Number.isNaN(noteValue) && beats > 0 && noteValue > 0) {
      setTimeSignature(beats, noteValue);
    }
  };

  const currentValue = `${timeSignature.beats}/${timeSignature.noteValue}`;

  return (
    <div className={`${styles.container} ${className ?? ""}`}>
      <span className={styles.label} id="time-signature-label">
        Time Signature
      </span>

      <select
        className={styles.select}
        value={currentValue}
        onChange={handleChange}
        aria-label="Time signature"
        aria-labelledby="time-signature-label"
      >
        {TIME_SIGNATURE_PRESETS.map((preset) => (
          <option key={preset.label} value={`${preset.beats}/${preset.noteValue}`}>
            {preset.label}
          </option>
        ))}
      </select>
    </div>
  );
}
