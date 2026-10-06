import { createContext, useContext, useEffect, type RefObject } from "react";

/** false cuando la página está montada pero no se ve (detrás de la hoja o fuera de la doble página). */
export const PageActiveContext = createContext(true);

export const usePageActive = () => useContext(PageActiveContext);

/** Pausa un video con controles cuando su página deja de verse. */
export function usePauseWhenHidden(ref: RefObject<HTMLVideoElement | null>) {
  const active = usePageActive();
  useEffect(() => {
    if (!active) ref.current?.pause();
  }, [active, ref]);
}
