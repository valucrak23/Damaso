import { useEffect, useState } from "react";

/** Doble página en pantallas horizontales desde tablet; una página en celulares y tablet vertical. */
const SPREAD_QUERY = "(min-width: 700px) and (min-height: 480px) and (orientation: landscape)";

function read() {
  return typeof window !== "undefined" && window.matchMedia(SPREAD_QUERY).matches;
}

export function useSpreadMode() {
  const [spread, setSpread] = useState(read);

  useEffect(() => {
    const media = window.matchMedia(SPREAD_QUERY);
    const update = () => setSpread(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  return spread;
}
