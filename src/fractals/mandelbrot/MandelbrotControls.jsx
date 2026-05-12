import { INITIAL_MANDELBROT_VIEW } from "./mandelbrotMath";

export default function MandelbrotControls({
  color,
  shape,
  pageStyles,
  isMobile,
  bailout,
  setBailout,
  setView,
}) {
  const panelStyle = {
    position: "absolute",
    top: isMobile ? "auto" : 16,
    bottom: isMobile ? 12 : "auto",
    right: isMobile ? 12 : 16,
    left: isMobile ? 12 : "auto",
    width: isMobile ? "auto" : 300,
    maxWidth: "calc(100vw - 24px)",
    padding: isMobile ? "10px 12px" : "12px 14px",
    background: color.cpOverlay,
    color: color.cpText,
    border: `1px solid ${color.cpBorder}`,
    borderRadius: shape.radiusMd,
    fontFamily: "sans-serif",
    zIndex: 10,
  };

  const labelStyle = {
    display: "flex",
    justifyContent: "space-between",
    gap: 12,
    color: color.cpText,
    fontSize: isMobile ? 11 : 12,
  };

  const sliderStyle = {
    width: "100%",
    marginTop: 4,
    accentColor: color.accent1,
  };

  const compactButton = {
    padding: isMobile ? "6px 10px" : "7px 12px",
    fontSize: isMobile ? 11 : 12,
    textDecoration: "none",
  };

  return (
    <section style={panelStyle}>
      <div>
        <div style={labelStyle}>
          <span>発散判定半径</span>
          <strong>{bailout.toFixed(1)}</strong>
        </div>
        <input
          type="range"
          min="1.2"
          max="2"
          step="0.1"
          value={bailout}
          onChange={(event) => setBailout(Number(event.target.value))}
          style={sliderStyle}
        />
        <p style={{ margin: "8px 0 0", color: color.cpText, fontSize: isMobile ? 10 : 11, lineHeight: 1.45 }}>
          標準は2です。小さくすると判定が厳しくなります。
        </p>
      </div>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 12 }}>
        <button
          type="button"
          onClick={() => setView((view) => ({ ...view, width: Math.max(0.0008, view.width * 0.75) }))}
          style={{ ...pageStyles.primaryButton, ...compactButton }}
        >
          拡大
        </button>
        <button
          type="button"
          onClick={() => setView((view) => ({ ...view, width: Math.min(8, view.width * 1.3) }))}
          style={{ ...pageStyles.outlineButton, ...compactButton }}
        >
          縮小
        </button>
        <button
          type="button"
          onClick={() => setView(INITIAL_MANDELBROT_VIEW)}
          style={{ ...pageStyles.outlineButton, ...compactButton }}
        >
          表示リセット
        </button>
      </div>

      <p style={{ margin: "12px 0 0", color: color.cpText, fontSize: isMobile ? 10 : 11, lineHeight: 1.45 }}>
        ドラッグで移動、ホイールで拡大縮小できます。
      </p>
    </section>
  );
}
