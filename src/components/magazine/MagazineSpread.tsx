import type { MouseEvent, ReactNode } from "react";

type MagazineSpreadProps = {
  spread: boolean;
  canPrev: boolean;
  canNext: boolean;
  onPrev: () => void;
  onNext: () => void;
  /** Devuelve true si el click viene de un swipe recién terminado y debe ignorarse. */
  consumeSwipe: () => boolean;
  children: ReactNode;
};

const INTERACTIVE = "a, button, video, iframe, input, select, textarea, label, [contenteditable]";

export function MagazineSpread({
  spread,
  canPrev,
  canNext,
  onPrev,
  onNext,
  consumeSwipe,
  children,
}: MagazineSpreadProps) {
  const edge = spread ? 0.14 : 0.22;

  const zoneAt = (event: MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    if (x <= edge && canPrev) return "prev";
    if (x >= 1 - edge && canNext) return "next";
    return null;
  };

  const onClick = (event: MouseEvent<HTMLDivElement>) => {
    if (consumeSwipe()) return;
    if ((event.target as HTMLElement).closest(INTERACTIVE)) return;
    if (window.getSelection()?.toString()) return;
    const zone = zoneAt(event);
    if (zone === "prev") onPrev();
    if (zone === "next") onNext();
  };

  const onMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    const overInteractive = (event.target as HTMLElement).closest(INTERACTIVE);
    event.currentTarget.dataset.edge = overInteractive ? "" : (zoneAt(event) ?? "");
  };

  return (
    <div
      className={`book-shell${spread ? " book-shell--spread" : " book-shell--single"}`}
      onClick={onClick}
      onMouseMove={onMouseMove}
      onMouseLeave={(event) => {
        event.currentTarget.dataset.edge = "";
      }}
    >
      {children}
    </div>
  );
}
