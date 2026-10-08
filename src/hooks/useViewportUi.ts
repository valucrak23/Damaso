import { useEffect, useState } from "react";

/** Retrato estrecho: scroll en inner + cue en paginado (no A0 ni spread). */
export const STACK_SCROLL_UI_QUERY = "(max-width: 900px) and (orientation: portrait)";

/** Celular apaisado: paginado flotante + flecha ↓, sin cue en la hoja. */
export const MOBILE_LANDSCAPE_QUERY = "(max-width: 900px) and (orientation: landscape)";

export function useViewportUi(spreadMode: boolean) {
  const [stackScrollUi, setStackScrollUi] = useState(() =>
    window.matchMedia(STACK_SCROLL_UI_QUERY).matches,
  );
  const [mobileLandscape, setMobileLandscape] = useState(() =>
    window.matchMedia(MOBILE_LANDSCAPE_QUERY).matches,
  );

  useEffect(() => {
    const stackMedia = window.matchMedia(STACK_SCROLL_UI_QUERY);
    const landMedia = window.matchMedia(MOBILE_LANDSCAPE_QUERY);
    const update = () => {
      setStackScrollUi(stackMedia.matches);
      setMobileLandscape(landMedia.matches);
    };
    update();
    stackMedia.addEventListener("change", update);
    landMedia.addEventListener("change", update);
    return () => {
      stackMedia.removeEventListener("change", update);
      landMedia.removeEventListener("change", update);
    };
  }, []);

  const activeStackScrollUi = !spreadMode && stackScrollUi;
  const activeMobileLandscape = !spreadMode && mobileLandscape;

  return { stackScrollUi: activeStackScrollUi, mobileLandscape: activeMobileLandscape };
}
