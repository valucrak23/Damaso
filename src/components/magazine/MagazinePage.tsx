import { useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { PageActiveContext } from "./PageActiveContext";

type MagazinePageProps = {
  pageNumber: number;
  label: string;
  side: "left" | "right" | "single";
  children: ReactNode;
  inert?: boolean;
  onOverflow?: (pageNumber: number, overflowing: boolean) => void;
};

/** Por debajo de esta proporción (ancho/alto) la página apila sus bloques en una columna. */
const STACK_RATIO = 0.7;
/** Escala mínima de tipografía/espaciado al ajustar; el cuerpo además nunca baja de 12.5px (CSS). */
const MIN_FIT = 0.84;
const FIT_STEP = 0.04;

function contentOverflows(element: HTMLElement) {
  const content = element.querySelector<HTMLElement>(".page");
  return (
    element.scrollHeight > element.clientHeight + 2 ||
    (content !== null && content.scrollHeight > content.clientHeight + 2)
  );
}

export function MagazinePage({
  pageNumber,
  label,
  side,
  children,
  inert = false,
  onOverflow,
}: MagazinePageProps) {
  const ref = useRef<HTMLElement>(null);
  const [size, setSize] = useState({ w: 0, h: 0, fonts: 0 });
  const [fit, setFit] = useState(1);
  const [forceStack, setForceStack] = useState(false);
  const [scrolls, setScrolls] = useState(false);

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
    setForceStack(false);
    setScrolls(false);
  }, [size]);

  const narrow = size.h > 0 && size.w / size.h < STACK_RATIO;
  const layout = side === "single" || narrow || forceStack ? "stack" : "fill";

  /* Ajuste: reduce escala hasta MIN_FIT; si la composición no entra pasa a apilada,
     y si la apilada tampoco entra, la página scrollea (nunca se corta). */
  useLayoutEffect(() => {
    const element = ref.current;
    if (!element || size.h === 0) return;
    if (side === "single" || scrolls) {
      onOverflow?.(pageNumber, scrolls);
      return;
    }
    if (!contentOverflows(element)) {
      onOverflow?.(pageNumber, false);
      return;
    }
    if (fit > MIN_FIT + 0.001) {
      setFit((current) => Math.max(MIN_FIT, Number((current - FIT_STEP).toFixed(2))));
    } else if (layout === "fill") {
      setForceStack(true);
      setFit(1);
    } else {
      setScrolls(true);
    }
  }, [fit, layout, onOverflow, pageNumber, scrolls, side, size]);

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
      style={{ "--fit": fit } as CSSProperties}
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
          <span className="scroll-cue" aria-hidden="true">
            Seguí leyendo ↓
          </span>
        ) : null}
      </div>
      {import.meta.env.DEV && scrolls ? (
        <p className="overflow-flag" role="status">
          Página {pageNumber}: no entra, pasa a scroll
        </p>
      ) : null}
    </article>
  );
}
