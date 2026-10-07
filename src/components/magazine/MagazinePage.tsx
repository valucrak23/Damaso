import { useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { PageActiveContext } from "./PageActiveContext";

type MagazinePageProps = {
  pageNumber: number;
  label: string;
  side: "left" | "right" | "single";
  children: ReactNode;
  inert?: boolean;
  onOverflow?: (pageNumber: number, overflowing: boolean) => void;
  /** En la doble página: la composición no entra sin scroll, hay que pasar a una página por vez. */
  onNoFit?: () => void;
};

/** Por debajo de esta proporción (ancho/alto) la doble página no se usa: queda muy angosta. */
const MIN_SPREAD_RATIO = 0.62;
/** Escala mínima de tipografía/espaciado al ajustar; el cuerpo además nunca baja de 12.5px (CSS). */
const MIN_FIT = 0.8;
const FIT_STEP = 0.04;

function contentOverflows(element: HTMLElement) {
  const page = element.querySelector<HTMLElement>(".page");
  if (element.scrollHeight > element.clientHeight + 2) return true;
  if (page !== null && page.scrollHeight > page.clientHeight + 2) return true;

  const clip = element.getBoundingClientRect();
  const clipBottom = clip.bottom - 2;

  if (page) {
    for (const block of page.querySelectorAll<HTMLElement>(".p4-aside, .p4-main, .p1-identity, .p3-side")) {
      for (const child of block.children) {
        if (!(child instanceof HTMLElement)) continue;
        if (getComputedStyle(child).display === "none") continue;
        if (child.getBoundingClientRect().bottom > clipBottom + 1) return true;
      }
    }

    for (const col of page.querySelectorAll<HTMLElement>(".p4-aside, .p4-main, .p3-side")) {
      if (getComputedStyle(col).flexDirection !== "column") continue;
      let prevBottom = -Infinity;
      for (const child of col.children) {
        if (!(child instanceof HTMLElement)) continue;
        if (getComputedStyle(child).display === "none") continue;
        const box = child.getBoundingClientRect();
        if (box.top < prevBottom - 3 && prevBottom > -Infinity) return true;
        prevBottom = Math.max(prevBottom, box.bottom);
      }
    }

    const org = page.querySelector<HTMLElement>(".p4-org");
    const videoLabel = page.querySelector<HTMLElement>(".p4-video .video__label");
    if (org && videoLabel) {
      const orgBox = org.getBoundingClientRect();
      const labelBox = videoLabel.getBoundingClientRect();
      if (orgBox.bottom > labelBox.top + 2) return true;
    }
  }

  return false;
}

export function MagazinePage({
  pageNumber,
  label,
  side,
  children,
  inert = false,
  onOverflow,
  onNoFit,
}: MagazinePageProps) {
  const ref = useRef<HTMLElement>(null);
  const [size, setSize] = useState({ w: 0, h: 0, fonts: 0 });
  const [fit, setFit] = useState(1);
  const [scrolls, setScrolls] = useState(false);
  const [atEnd, setAtEnd] = useState(false);

  const updateAtEnd = () => {
    const element = ref.current;
    if (element) setAtEnd(element.scrollTop + element.clientHeight >= element.scrollHeight - 24);
  };

  const readMore = () => {
    ref.current?.scrollBy({ top: ref.current.clientHeight * 0.8, behavior: "smooth" });
  };

  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;
    const update = () =>
      setSize((prev) =>
        prev.w === element.clientWidth && prev.h === element.clientHeight
          ? prev
          : { ...prev, w: element.clientWidth, h: element.clientHeight },
      );
    update();
    const observer = new ResizeObserver(update);
    observer.observe(element);
    let alive = true;
    document.fonts?.ready.then(() => {
      if (alive) setSize((prev) => ({ ...prev, fonts: prev.fonts + 1 }));
    });
    return () => {
      alive = false;
      observer.disconnect();
    };
  }, []);

  useLayoutEffect(() => {
    setFit(1);
    setScrolls(false);
  }, [size]);

  const layout = side === "single" ? "stack" : "fill";

  /* Doble página: reduce la escala hasta MIN_FIT y, si igual no entra, pide pasar a una página
     por vez. Una página por vez: composición apilada que scrollea si hace falta. */
  useLayoutEffect(() => {
    const element = ref.current;
    if (!element || size.h === 0) return;
    if (inert) {
      onOverflow?.(pageNumber, false);
      return;
    }
    if (side === "single") {
      const overflowing = element.scrollHeight > element.clientHeight + 2;
      setScrolls(overflowing);
      updateAtEnd();
      onOverflow?.(pageNumber, false);
      return;
    }
    if (size.w / size.h < MIN_SPREAD_RATIO) {
      onNoFit?.();
      return;
    }
    if (!contentOverflows(element)) {
      onOverflow?.(pageNumber, false);
      return;
    }
    if (fit > MIN_FIT + 0.001) {
      setFit((current) => Math.max(MIN_FIT, Number((current - FIT_STEP).toFixed(2))));
    } else {
      onOverflow?.(pageNumber, true);
      onNoFit?.();
    }
  }, [fit, inert, onNoFit, onOverflow, pageNumber, side, size]);

  return (
    <article
      ref={ref}
      className="magazine-page"
      aria-label={label}
      aria-hidden={inert || undefined}
      inert={inert}
      data-page={pageNumber}
      data-side={side}
      data-layout={layout}
      data-overflow={scrolls ? "true" : "false"}
      data-compact={side !== "single" && fit < 0.94 ? "true" : undefined}
      style={{ "--fit": fit } as CSSProperties}
      onScroll={scrolls ? updateAtEnd : undefined}
    >
      <div className="magazine-page__inner">
        <span className="page-decor" aria-hidden="true">
          <span className="page-blob page-blob--a" />
          <span className="page-blob page-blob--b" />
        </span>
        <PageActiveContext.Provider value={!inert}>{children}</PageActiveContext.Provider>
        <span className="page-number" aria-hidden="true">
          {pageNumber}
        </span>
        {scrolls ? (
          <div className={`scroll-cue${atEnd ? " is-hidden" : ""}`}>
            <button type="button" className="scroll-cue__button" onClick={readMore} tabIndex={atEnd ? -1 : 0}>
              Seguí leyendo
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 5v13m0 0-5.5-5.5M12 18l5.5-5.5" />
              </svg>
            </button>
          </div>
        ) : null}
      </div>
    </article>
  );
}
