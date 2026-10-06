import type { ReactNode } from "react";

type PageFlipProps = {
  spreadMode: boolean;
  flipped: boolean;
  animating: boolean;
  reducedMotion: boolean;
  direction: "forward" | "back";
  left: ReactNode;
  front: ReactNode;
  back: ReactNode;
  under: ReactNode;
  singleCurrent: ReactNode;
  singleUnder: ReactNode;
  turningFrom?: ReactNode;
};

export function PageFlip({
  spreadMode,
  flipped,
  animating,
  reducedMotion,
  left,
  front,
  back,
  under,
  singleCurrent,
  singleUnder,
  turningFrom,
  direction,
}: PageFlipProps) {
  const bookClass = [
    "book",
    spreadMode ? "book--spread" : "book--single",
    flipped ? "is-flipped" : "",
    animating ? "is-animating" : "",
    reducedMotion ? "is-reduced" : "",
  ]
    .filter(Boolean)
    .join(" ");

  if (spreadMode && reducedMotion) {
    return (
      <div className={bookClass}>
        <div className="book__spread">
          <div className="page-slot page-slot--left">{flipped ? back : left}</div>
          <div className="page-slot page-slot--under">{flipped ? under : front}</div>
          <div className="spine" aria-hidden="true" />
        </div>
      </div>
    );
  }

  if (spreadMode) {
    return (
      <div className={bookClass}>
        <div className="book__spread">
          <div className="page-slot page-slot--left">{left}</div>
          <div className="page-slot page-slot--under">{under}</div>
          <div className="leaf">
            <div className="leaf__face leaf__face--front">{front}</div>
            <div className="leaf__face leaf__face--back">{back}</div>
          </div>
          <div className="spine" aria-hidden="true" />
        </div>
      </div>
    );
  }

  return (
    <div className={bookClass}>
      <div className="book__stack">
        <div className="stack-page is-under">{singleUnder}</div>
        {animating && direction === "forward" && turningFrom ? (
          <div className="stack-page is-turning-forward">{turningFrom}</div>
        ) : null}
        <div
          className={`stack-page is-current${animating && direction === "back" ? " is-turning-back" : ""}`}
        >
          {singleCurrent}
        </div>
      </div>
    </div>
  );
}
