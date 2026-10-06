import { useRef, useState, type CSSProperties } from "react";
import type { MediaSlot, Tone } from "../content/types";
import { usePauseWhenHidden } from "./magazine/PageActiveContext";

/** Muestra como portada el cuadro del segundo `posterAt`; al darle play arranca desde el principio. */
function PosterFrameVideo({ src, posterAt, label }: { src: string; posterAt?: number; label: string }) {
  const played = useRef(false);
  const ref = useRef<HTMLVideoElement>(null);
  usePauseWhenHidden(ref);

  return (
    <video
      ref={ref}
      controls
      preload="metadata"
      playsInline
      aria-label={label}
      onLoadedMetadata={(e) => {
        if (posterAt && !played.current) e.currentTarget.currentTime = posterAt;
      }}
      onPlay={(e) => {
        if (played.current) return;
        played.current = true;
        if (posterAt) e.currentTarget.currentTime = 0;
      }}
    >
      <source src={src} type="video/mp4" />
    </video>
  );
}

type MediaFrame = "print" | "plain" | "sheet" | "round" | "cutout";

type MediaPlaceholderProps = {
  slot: MediaSlot;
  frame?: MediaFrame;
  tape?: "top" | "corners" | "none";
  sticker?: { text: string; tone: Tone };
  /** Rotación estática en grados. */
  tilt?: number;
  className?: string;
};

const KIND_LABEL: Record<MediaSlot["kind"], string> = {
  foto: "FOTO",
  video: "VIDEO",
  "produccion-alumno": "DIBUJO",
  recorte: "IMAGEN",
};

export function MediaPlaceholder({
  slot,
  frame = "print",
  tape = "top",
  sticker,
  tilt = 0,
  className = "",
}: MediaPlaceholderProps) {
  const [naturalRatio, setNaturalRatio] = useState<string>();

  if (!slot.enabled) return null;

  const [w, h] = slot.ratio.split(":").map(Number);
  const style = {
    "--ratio": naturalRatio ?? `${w} / ${h}`,
    "--tilt": `${tilt}deg`,
  } as CSSProperties;

  return (
    <figure
      className={`media media--${frame} ${slot.fit === "contain" ? "media--whole" : ""} ${className}`.replace(/\s+/g, " ").trim()}
      style={style}
      data-slot={slot.id}
      data-suggestion={import.meta.env.DEV ? slot.suggestion : undefined}
      title={import.meta.env.DEV ? slot.suggestion : undefined}
    >
      {tape === "top" ? <span className="tape tape--top" aria-hidden="true" /> : null}
      {tape === "corners" ? (
        <>
          <span className="tape tape--tl" aria-hidden="true" />
          <span className="tape tape--br" aria-hidden="true" />
        </>
      ) : null}

      <div className="media__window">
        {slot.src && slot.kind === "video" ? (
          <PosterFrameVideo src={slot.src} posterAt={slot.posterAt} label={slot.alt || slot.shortHint} />
        ) : slot.src ? (
          <img
            src={slot.src}
            alt={slot.alt ?? ""}
            loading="lazy"
            decoding="async"
            style={{
              objectPosition: slot.objectPosition,
              objectFit: slot.fit === "contain" ? "contain" : undefined,
            }}
            onLoad={(e) => {
              const img = e.currentTarget;
              if (slot.fit === "contain" && img.naturalHeight) {
                setNaturalRatio(`${img.naturalWidth} / ${img.naturalHeight}`);
              }
            }}
          />
        ) : (
          <div className="media__empty" role="img" aria-label={`Espacio para imagen: ${slot.shortHint}`}>
            <span className="media__kind">
              {KIND_LABEL[slot.kind]} <span aria-hidden="true">/</span> {slot.ratio}
            </span>
            <span className="media__hint">{slot.shortHint}</span>
          </div>
        )}
      </div>

      {sticker ? <span className={`sticker sticker--${sticker.tone}`}>{sticker.text}</span> : null}
    </figure>
  );
}
