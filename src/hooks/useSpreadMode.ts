import { useCallback, useEffect, useState } from "react";

/**
 * Doble página solo con ancho suficiente; por debajo de 1280px siempre una página
 * (evita el estado mixto ~1150px donde entraba spread pero el contenido no alcanzaba).
 */
const SPREAD_QUERY = "(min-width: 1280px) and (min-height: 520px) and (orientation: landscape)";

type Size = { w: number; h: number };

function viewport(): Size {
  return { w: window.innerWidth, h: window.innerHeight };
}

/**
 * Devuelve si se muestra la doble página y una función para descartarla en el tamaño actual
 * (cuando alguna página no entra sin scroll). Se vuelve a intentar al agrandar la ventana.
 */
export function useSpreadMode() {
  const [matches, setMatches] = useState(() => window.matchMedia(SPREAD_QUERY).matches);
  const [size, setSize] = useState(viewport);
  const [blockedAt, setBlockedAt] = useState<Size | null>(null);

  useEffect(() => {
    const media = window.matchMedia(SPREAD_QUERY);
    const update = () => {
      const next = viewport();
      setMatches(media.matches);
      setSize((prev) => (prev.w === next.w && prev.h === next.h ? prev : next));
      if (!media.matches) setBlockedAt(null);
    };
    update();
    media.addEventListener("change", update);
    window.addEventListener("resize", update);
    let alive = true;
    document.fonts?.ready.then(() => {
      if (alive) setBlockedAt(null);
    });
    return () => {
      alive = false;
      media.removeEventListener("change", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  const blocked = blockedAt !== null && size.w <= blockedAt.w && size.h <= blockedAt.h;

  const blockSpread = useCallback(() => {
    setBlockedAt((prev) => {
      const next = viewport();
      return prev && prev.w >= next.w && prev.h >= next.h ? prev : next;
    });
  }, []);

  return [matches && !blocked, blockSpread] as const;
}
