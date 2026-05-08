import { useIsMobile } from "../hooks/useIsMobile";
import { color } from "../styles/pageStyles";

/**
 * ControlPanel の extraControls スロットなどに差し込む、ラベル付きチェックボックス。
 * isMobile に応じてフォントサイズを揃える。
 *
 * @param {{ label: string, checked: boolean, onChange: (next: boolean) => void }} props
 */
export default function PanelCheckbox({ label, checked, onChange }) {
  const isMobile = useIsMobile();
  return (
    <label
      style={{
        display: "flex",
        alignItems: "center",
        gap: 6,
        cursor: "pointer",
        color: color.textSecondary,
        fontSize: isMobile ? 11 : 12,
      }}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      {label}
    </label>
  );
}
