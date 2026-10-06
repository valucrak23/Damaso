import { useRef, type CSSProperties } from "react";
import type { Tone, VideoSlot } from "../content/types";
import { LoopingVideo } from "./LoopingVideo";
import { usePauseWhenHidden } from "./magazine/PageActiveContext";

function ControlsVideo({ src, poster, label }: { src: string; poster?: string; label: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  usePauseWhenHidden(ref);
  return (
    <video ref={ref} controls preload="metadata" playsInline poster={poster} aria-label={label}>
      <source src={src} type="video/mp4" />
    </video>
  );
}

type VideoPlaceholderProps = {
  video: VideoSlot;
  stickerTone?: Tone;
  size?: "regular" | "small";
  className?: string;
};

function embedUrl(video: VideoSlot) {
  if (!video.src) return undefined;
  if (video.provider === "youtube") return `https://www.youtube-nocookie.com/embed/${video.src}`;
  if (video.provider === "vimeo") return `https://player.vimeo.com/video/${video.src}`;
  return undefined;
}

export function VideoPlaceholder({
  video,
  stickerTone = "yellow",
  size = "regular",
  className = "",
}: VideoPlaceholderProps) {
  const embed = embedUrl(video);

  return (
    <figure
      className={`video video--${size} video--${video.orientation} ${video.objectPosition ? "video--cropped" : ""} ${className}`
        .replace(/\s+/g, " ")
        .trim()}
      style={
        {
          "--ratio": video.ratio.replace(":", " / "),
          "--video-position": video.objectPosition ?? "center",
        } as CSSProperties
      }
      data-slot={video.id}
      title={import.meta.env.DEV ? video.suggestion : undefined}
    >
      <div className="video__window">
        {video.provider === "mp4" && video.src && video.playback !== "controles" ? (
          <LoopingVideo src={video.src} label={video.caption} boomerang={video.playback === "boomerang"} />
        ) : video.provider === "mp4" && video.src ? (
          <ControlsVideo src={video.src} poster={video.poster} label={video.caption} />
        ) : embed ? (
          <iframe
            src={embed}
            title={video.caption}
            loading="lazy"
            allow="encrypted-media; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <div className="video__thumb" role="img" aria-label={`Video pendiente: ${video.caption}`}>
            <span className="video__play" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <path d="M8 5.5v13l10.5-6.5z" fill="currentColor" />
              </svg>
            </span>
            <span className="video__meta">VIDEO / {video.ratio}</span>
          </div>
        )}
      </div>
      <span className={`sticker sticker--${stickerTone} video__label`}>{video.label}</span>
    </figure>
  );
}
