import { useCallback, useEffect, useRef, useState } from "react";
import { PAGE_FLIP_MS } from "../content/primaryMagazineContent";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";
import { useSpreadMode } from "./useSpreadMode";

type Direction = "forward" | "back";

export function useMagazineNavigation(pageCount: number) {
  const [spreadMode, blockSpread] = useSpreadMode();
  const reducedMotion = usePrefersReducedMotion();
  const [index, setIndex] = useState(0);
  const [fromIndex, setFromIndex] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [direction, setDirection] = useState<Direction>("forward");
  const [hasInteracted, setHasInteracted] = useState(false);
  const lockRef = useRef(false);
  const wheelLockRef = useRef(false);

  const step = spreadMode ? 2 : 1;
  const maxIndex = spreadMode ? pageCount - step : pageCount - 1;

  useEffect(() => {
    setIndex((current) => {
      if (!spreadMode) return Math.min(current, pageCount - 1);
      return current - (current % 2);
    });
  }, [spreadMode, pageCount]);

  const markInteraction = useCallback(() => {
    setHasInteracted(true);
  }, []);

  const go = useCallback(
    (dir: Direction) => {
      if (lockRef.current) return false;
      const delta = dir === "forward" ? step : -step;
      const next = index + delta;
      if (next < 0 || next > maxIndex) return false;

      markInteraction();
      setDirection(dir);
      setFromIndex(index);

      if (reducedMotion) {
        setIndex(next);
        return true;
      }

      lockRef.current = true;
      setAnimating(true);
      setIndex(next);
      window.setTimeout(() => {
        lockRef.current = false;
        setAnimating(false);
      }, PAGE_FLIP_MS);
      return true;
    },
    [index, maxIndex, markInteraction, reducedMotion, step],
  );

  const next = useCallback(() => go("forward"), [go]);
  const prev = useCallback(() => go("back"), [go]);

  const onWheel = useCallback(
    (event: WheelEvent) => {
      event.preventDefault();
      if (lockRef.current || wheelLockRef.current) return;
      if (Math.abs(event.deltaY) < 18 && Math.abs(event.deltaX) < 18) return;

      const forward = Math.abs(event.deltaY) >= Math.abs(event.deltaX)
        ? event.deltaY > 0
        : event.deltaX > 0;

      wheelLockRef.current = true;
      if (forward) next();
      else prev();
      window.setTimeout(() => {
        wheelLockRef.current = false;
      }, PAGE_FLIP_MS + 80);
    },
    [next, prev],
  );

  const canPrev = index > 0;
  const canNext = index < maxIndex;

  const rangeLabel = spreadMode
    ? `${index + 1}–${index + 2} / ${pageCount}`
    : `${index + 1} / ${pageCount}`;

  return {
    index,
    fromIndex,
    step,
    spreadMode,
    blockSpread,
    reducedMotion,
    animating,
    direction,
    hasInteracted,
    markInteraction,
    next,
    prev,
    onWheel,
    canPrev,
    canNext,
    rangeLabel,
    duration: reducedMotion ? 160 : PAGE_FLIP_MS,
  };
}
