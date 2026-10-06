import { useEffect, useRef, useState } from "react";
import { usePageActive } from "./magazine/PageActiveContext";

type LoopingVideoProps = {
  src: string;
  label: string;
  /** true: va hacia adelante y vuelve hacia atrás (boomerang). false: loop común. */
  boomerang: boolean;
};

/** Cada cuánto se retrocede un cuadro: cada seek decodifica el video, así que se limita a ~30 por segundo. */
const REVERSE_STEP_MS = 33;

/**
 * Video corto, sin sonido, que se reproduce solo mientras su página se ve.
 * Un botón lo pausa o lo reanuda.
 */
export function LoopingVideo({ src, label, boomerang }: LoopingVideoProps) {
  const ref = useRef<HTMLVideoElement>(null);
  const active = usePageActive();
  const [userPaused, setUserPaused] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!active || userPaused) {
      el.pause();
      return;
    }

    let raf = 0;
    let lastStep = 0;
    let reversing = false;

    // Los navegadores no reproducen hacia atrás: se retrocede con seeks, esperando que termine cada uno.
    const stepBack = (now: number) => {
      if (!reversing) return;
      if (!el.seeking && now - lastStep >= REVERSE_STEP_MS) {
        const dt = lastStep ? (now - lastStep) / 1000 : REVERSE_STEP_MS / 1000;
        lastStep = now;
        const next = el.currentTime - dt;
        if (next <= 0.02) {
          reversing = false;
          el.currentTime = 0;
          void el.play().catch(() => undefined);
          return;
        }
        el.currentTime = next;
      }
      raf = requestAnimationFrame(stepBack);
    };

    const onEnded = () => {
      if (!boomerang) return;
      reversing = true;
      lastStep = 0;
      raf = requestAnimationFrame(stepBack);
    };

    const onVisibility = () => {
      if (document.hidden) {
        reversing = false;
        cancelAnimationFrame(raf);
        el.pause();
      } else {
        if (el.ended) el.currentTime = 0;
        void el.play().catch(() => undefined);
      }
    };

    el.addEventListener("ended", onEnded);
    document.addEventListener("visibilitychange", onVisibility);
    if (el.ended) el.currentTime = 0;
    void el.play().catch(() => setUserPaused(true));

    return () => {
      reversing = false;
      cancelAnimationFrame(raf);
      el.removeEventListener("ended", onEnded);
      document.removeEventListener("visibilitychange", onVisibility);
      el.pause();
    };
  }, [active, boomerang, src, userPaused]);

  return (
    <>
      <video
        ref={ref}
        src={src}
        muted
        playsInline
        preload={active ? "auto" : "metadata"}
        loop={!boomerang}
        aria-label={label}
        disablePictureInPicture
      />
      <button
        type="button"
        className="video__toggle"
        onClick={() => setUserPaused((value) => !value)}
        aria-label={userPaused ? `Reproducir video: ${label}` : `Pausar video: ${label}`}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          {userPaused ? (
            <path d="M8 5.5v13l10.5-6.5z" fill="currentColor" />
          ) : (
            <path d="M7.5 5.5h3v13h-3zM13.5 5.5h3v13h-3z" fill="currentColor" />
          )}
        </svg>
      </button>
    </>
  );
}
