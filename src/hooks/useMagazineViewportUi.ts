import { useEffect, useState } from "react";

const STACK_SCROLL_UI = "(max-width: 900px) and (orientation: portrait)";
const MOBILE_LANDSCAPE = "(max-width: 900px) and (orientation: landscape)";

export function useMagazineViewportUi() {
  const [stackScrollUi, setStackScrollUi] = useState(() =>
    window.matchMedia(STACK_SCROLL_UI).matches,
  );
  const [mobileLandscape, setMobileLandscape] = useState(() =>
    window.matchMedia(MOBILE_LANDSCAPE).matches,
  );

  useEffect(() => {
    const portrait = window.matchMedia(STACK_SCROLL_UI);
    const landscape = window.matchMedia(MOBILE_LANDSCAPE);
    const update = () => {
      setStackScrollUi(portrait.matches);
      setMobileLandscape(landscape.matches);
    };
    update();
    portrait.addEventListener("change", update);
    landscape.addEventListener("change", update);
    return () => {
      portrait.removeEventListener("change", update);
      landscape.removeEventListener("change", update);
    };
  }, []);

  return { stackScrollUi, mobileLandscape };
}
