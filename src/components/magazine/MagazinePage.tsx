import {
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type MutableRefObject,
  type ReactNode,
} from "react";
import {
  getPageScrollRoot,
  readPageScrollState,
} from "./pageScroll";
import { PageActiveContext } from "./PageActiveContext";

type ScrollApi = { scrollDown: () => void };

type MagazinePageProps = {
  pageNumber: number;
  label: string;
  side: "left" | "right" | "single";
  children: ReactNode;
  inert?: boolean;
  onOverflow?: (pageNumber: number, overflowing: boolean) => void;
  /** En la doble página: la composición no entra sin scroll, hay que pasar a una página por vez. */
  onNoFit?: () => void;
  /** Modo una hoja activa: indica si scrollea y si el lector llegó al final. */
  onScrollState?: (scrolls: boolean, atEnd: boolean) => void;
  scrollApiRef?: MutableRefObject<ScrollApi | null>;
};

/** Por debajo de esta proporción (ancho/alto) la doble página no se usa: queda muy angosta. */
const MIN_SPREAD_RATIO = 0.62;
/** Escala mínima de tipografía/espaciado al ajustar; el cuerpo además nunca baja de 12.5px (CSS). */
const MIN_FIT = 0.8;
const FIT_STEP = 0.04;
const SPREAD_MIN_WIDTH = 1370;

function contentOverflows(element: HTMLElement) {
  const page = element.querySelector<HTMLElement>(".page");
  const inner = element.querySelector<HTMLElement>(".magazine-page__inner");
  const measure = inner ?? element;

  if (measure.scrollHeight > measure.clientHeight + 2) return true;
  if (page !== null && page.scrollHeight > page.clientHeight + 2) return true;

  const clip = measure.getBoundingClientRect();
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
  onScrollState,
  scrollApiRef,
}: MagazinePageProps) {
  const ref = useRef<HTMLElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const atEndLatchRef = useRef(true);
  const [size, setSize] = useState({ w: 0, h: 0, fonts: 0 });
  const [fit, setFit] = useState(1);
  const [scrolls, setScrolls] = useState(false);

  const publishScroll = (nextScrolls: boolean, nextAtEnd: boolean) => {
    if (inert || side !== "single") return;
    onScrollState?.(nextScrolls, nextAtEnd);
  };

  const measureScroll = () => {
    const article = ref.current;
    if (!article || side !== "single" || inert) return;
    const root = getPageScrollRoot(article);
    const { scrolls: nextScrolls, atEnd: nextAtEnd } = readPageScrollState(
      root,
      atEndLatchRef.current,
    );
    atEndLatchRef.current = nextAtEnd;
    setScrolls(nextScrolls);
    publishScroll(nextScrolls, nextAtEnd);
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
    atEndLatchRef.current = true;
  }, [size]);

  const layout = side === "single" ? "stack" : "fill";

  useLayoutEffect(() => {
    const article = ref.current;
    const inner = innerRef.current;
    if (!article || side !== "single" || inert) {
      if (scrollApiRef) scrollApiRef.current = null;
      return;
    }

    const root = () => getPageScrollRoot(article);

    if (scrollApiRef) {
      scrollApiRef.current = {
        scrollDown: () => {
          root().scrollBy({ top: root().clientHeight * 0.78, behavior: "smooth" });
        },
      };
    }

    const onScroll = () => measureScroll();
    const scrollRoot = root();
    scrollRoot.addEventListener("scroll", onScroll, { passive: true });

    const ro = new ResizeObserver(() => measureScroll());
    ro.observe(scrollRoot);
    if (inner && inner !== scrollRoot) ro.observe(inner);

    const media = inner?.querySelectorAll("img, video") ?? [];
    for (const node of media) {
      node.addEventListener("load", measureScroll);
      if (node instanceof HTMLVideoElement) {
        node.addEventListener("loadedmetadata", measureScroll);
      }
    }

    measureScroll();

    return () => {
      scrollRoot.removeEventListener("scroll", onScroll);
      ro.disconnect();
      for (const node of media) {
        node.removeEventListener("load", measureScroll);
        if (node instanceof HTMLVideoElement) {
          node.removeEventListener("loadedmetadata", measureScroll);
        }
      }
      if (scrollApiRef) scrollApiRef.current = null;
    };
  }, [inert, scrollApiRef, side, size]);

  /* Doble página: reduce la escala hasta MIN_FIT; en ≥1370 no baja a una hoja. */
  useLayoutEffect(() => {
    const element = ref.current;
    if (!element || size.h === 0) return;
    if (inert) {
      onOverflow?.(pageNumber, false);
      return;
    }
    if (side === "single") {
      onOverflow?.(pageNumber, false);
      return;
    }
    if (size.w / size.h < MIN_SPREAD_RATIO) {
      if (window.innerWidth < SPREAD_MIN_WIDTH) onNoFit?.();
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
      if (window.innerWidth < SPREAD_MIN_WIDTH) onNoFit?.();
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
    >
      <span className="page-decor" aria-hidden="true">
        <span className="page-blob page-blob--a" />
        <span className="page-blob page-blob--b" />
      </span>
      <div className="magazine-page__inner" ref={innerRef}>
        <PageActiveContext.Provider value={!inert}>{children}</PageActiveContext.Provider>
      </div>
    </article>
  );
}
