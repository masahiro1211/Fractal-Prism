import { useState } from "react";
import ControlPanel from "../../components/ControlPanel";
import { useIsMobile } from "../../hooks/useIsMobile";
import { useTheme } from "../../styles/pageStyles";
import MandelbrotCanvas from "./MandelbrotCanvas";
import MandelbrotControls from "./MandelbrotControls";
import { INITIAL_MANDELBROT_VIEW } from "./mandelbrotMath";

export default function MandelbrotSet() {
  const { color, shape, pageStyles } = useTheme();
  const isMobile = useIsMobile();
  const [view, setView] = useState(INITIAL_MANDELBROT_VIEW);
  const [bailout, setBailout] = useState(2);

  return (
    <main style={{ width: "100vw", height: "100dvh", background: color.bgPage, overflow: "hidden" }}>
      <ControlPanel
        maxDepth={360}
        defaultDepth={120}
        defaultInterval={250}
      >
        {({ currentDepth }) => (
          <MandelbrotCanvas
            view={view}
            setView={setView}
            maxIter={Math.max(1, currentDepth || 120)}
            bailout={bailout}
            isMobile={isMobile}
            background={color.bgPage}
          />
        )}
      </ControlPanel>
      <MandelbrotControls
        color={color}
        shape={shape}
        pageStyles={pageStyles}
        isMobile={isMobile}
        bailout={bailout}
        setBailout={setBailout}
        setView={setView}
      />
    </main>
  );
}
