import { useCallback, useEffect, useMemo, useRef, useState, type PointerEvent } from "react";
import {
  MAGAZINE_PAGE_COUNT,
  primaryMagazineContent,
} from "../../content/primaryMagazineContent";
import { useMagazineNavigation } from "../../hooks/useMagazineNavigation";
import { useMagazineViewportUi } from "../../hooks/useMagazineViewportUi";
import { getPageScrollRoot } from "./pageScroll";
import { MagazinePage } from "./MagazinePage";
import { MagazineSpread } from "./MagazineSpread";
import { PageFlip } from "./PageFlip";
import { PageNavigation } from "./PageNavigation";
import { PageExperiences } from "./pages/PageExperiences";
import { PageFamilies } from "./pages/PageFamilies";
import { PagePresentation } from "./pages/PagePresentation";
import { PageProposal } from "./pages/PageProposal";

const PAGES = [PagePresentation, PageProposal, PageExperiences, PageFamilies] as const;

function canScrollInner(page: HTMLElement | null, down: boolean) {
  if (!page) return false;
  const root = getPageScrollRoot(page);
  if (root.scrollHeight <= root.clientHeight + 1) return false;
  return down
    ? root.scrollTop + root.clientHeight < root.scrollHeight - 1
    : root.scrollTop > 0;
}

export function PrimaryMagazine() {
  const stageRef = useRef<HTMLElement>(null);
  const pointerRef = useRef<{ x: number; y: number } | null>(null);
  const swipedRef = useRef(false);
  const scrollApiRef = useRef<{ scrollDown: () => void } | null>(null);
  const [overflowPages, setOverflowPages] = useState<number[]>([]);
  const [pageScroll, setPageScroll] = useState({ scrolls: false, atEnd: true });
  const nav = useMagazineNavigation(MAGAZINE_PAGE_COUNT);
  const { blockSpread } = nav;
  const { stackScrollUi, mobileLandscape } = useMagazineViewportUi();
  const content = primaryMagazineContent;

  const onOverflow = useCallback((pageNumber: number, overflowing: boolean) => {
    setOverflowPages((current) => {
      const has = current.includes(pageNumber);
      if (overflowing && !has) return [...current, pageNumber].sort((a, b) => a - b);
      if (!overflowing && has) return current.filter((item) => item !== pageNumber);
      return current;
    });
  }, []);

  const onPageScrollState = useCallback((scrolls: boolean, atEnd: boolean) => {
    setPageScroll({ scrolls, atEnd });
  }, []);

  useEffect(() => {
    setPageScroll({ scrolls: false, atEnd: true });
  }, [nav.index, nav.spreadMode]);

  useEffect(() => {
    if (import.meta.env.DEV && overflowPages.length > 0) {
      console.info(
        "[Dámaso · dev] La página",
        overflowPages.join(", "),
        "no entra entera en doble página a este tamaño de pantalla (se ajusta escala o modo una página). No es un error de red.",
      );
    }
  }, [overflowPages]);

  const pageNode = useCallback(
    (
      pageIndex: number,
      inert: boolean,
      side: "left" | "right" | "single",
      options?: { scrollActive?: boolean },
    ) => {
      const Page = PAGES[pageIndex];
      const scrollActive = options?.scrollActive === true;
      return (
        <MagazinePage
          key={`${side}-${pageIndex}`}
          pageNumber={pageIndex + 1}
          label={`Página ${pageIndex + 1}`}
          side={side}
          inert={inert}
          onOverflow={onOverflow}
          onNoFit={side === "single" ? undefined : blockSpread}
          onScrollState={scrollActive ? onPageScrollState : undefined}
          scrollApiRef={scrollActive ? scrollApiRef : undefined}
        >
          <Page />
        </MagazinePage>
      );
    },
    [blockSpread, onOverflow, onPageScrollState],
  );

  const spreadFlipped = nav.index >= 2;

  const pages = useMemo(
    () => ({
      left: pageNode(0, spreadFlipped, "left"),
      front: pageNode(1, spreadFlipped, "right"),
      back: pageNode(2, !spreadFlipped, "left"),
      under: pageNode(3, !spreadFlipped, "right"),
    }),
    [pageNode, spreadFlipped],
  );

  const mobileUnderIndex = Math.min(nav.index + 1, MAGAZINE_PAGE_COUNT - 1);

  const singleModeScrollUi = !nav.spreadMode && stackScrollUi;
  const hasPageScroll = singleModeScrollUi && pageScroll.scrolls;

  const paginationVisible =
    nav.spreadMode ||
    mobileLandscape ||
    !pageScroll.scrolls ||
    pageScroll.atEnd;

  const showScrollCue =
    singleModeScrollUi && pageScroll.scrolls && !pageScroll.atEnd;

  const showScrollDown =
    !nav.spreadMode && mobileLandscape && pageScroll.scrolls;

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const handleWheel = (event: WheelEvent) => {
      const page = nav.spreadMode
        ? (event.target as Element).closest?.('.magazine-page[data-layout="stack"]')
        : stage.querySelector<HTMLElement>(".stack-page.is-current .magazine-page");
      const vertical = Math.abs(event.deltaY) >= Math.abs(event.deltaX);
      if (page instanceof HTMLElement && vertical && canScrollInner(page, event.deltaY > 0)) {
        return;
      }
      nav.onWheel(event);
    };
    stage.addEventListener("wheel", handleWheel, { passive: false });
    return () => stage.removeEventListener("wheel", handleWheel);
  }, [nav.onWheel, nav.spreadMode]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") {
        event.preventDefault();
        nav.next();
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        nav.prev();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [nav.next, nav.prev]);

  const onPointerDown = (event: PointerEvent<HTMLElement>) => {
    const target = event.target as HTMLElement;
    if (target.closest("a, button, video")) return;
    pointerRef.current = { x: event.clientX, y: event.clientY };
  };

  const onPointerUp = (event: PointerEvent<HTMLElement>) => {
    if (!pointerRef.current) return;
    const dx = event.clientX - pointerRef.current.x;
    const dy = event.clientY - pointerRef.current.y;
    pointerRef.current = null;
    if (Math.abs(dx) < 48 || Math.abs(dx) < Math.abs(dy)) return;
    swipedRef.current = true;
    window.setTimeout(() => {
      swipedRef.current = false;
    }, 120);
    if (dx < 0) nav.next();
    else nav.prev();
  };

  const consumeSwipe = useCallback(() => {
    const swiped = swipedRef.current;
    swipedRef.current = false;
    return swiped;
  }, []);

  const stageClass = [
    "magazine-stage",
    nav.spreadMode ? "is-spread" : "is-single",
    singleModeScrollUi ? "is-stack-scroll-ui" : "",
    mobileLandscape ? "is-mobile-landscape" : "",
    hasPageScroll ? "has-page-scroll" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const scrollDown = () => scrollApiRef.current?.scrollDown();

  return (
    <div className="app-shell">
      <a className="skip-link visually-hidden" href="#revista">
        Saltar a la revista
      </a>
      <header className="visually-hidden">
        <p>{content.institution.name}</p>
      </header>
      <main
        id="revista"
        ref={stageRef}
        className={stageClass}
        tabIndex={-1}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerCancel={() => {
          pointerRef.current = null;
        }}
      >
        <p className="visually-hidden magazine-stage__live" aria-live="polite">
          {nav.spreadMode
            ? `Páginas ${nav.index + 1} y ${nav.index + 2} de ${MAGAZINE_PAGE_COUNT}`
            : `Página ${nav.index + 1} de ${MAGAZINE_PAGE_COUNT}`}
        </p>

        <MagazineSpread
          spread={nav.spreadMode}
          canPrev={nav.canPrev}
          canNext={nav.canNext}
          onPrev={nav.prev}
          onNext={nav.next}
          consumeSwipe={consumeSwipe}
        >
          <PageFlip
            spreadMode={nav.spreadMode}
            flipped={spreadFlipped}
            animating={nav.animating}
            reducedMotion={nav.reducedMotion}
            direction={nav.direction}
            left={pages.left}
            front={pages.front}
            back={pages.back}
            under={pages.under}
            singleCurrent={pageNode(nav.index, false, "single", { scrollActive: true })}
            singleUnder={pageNode(mobileUnderIndex, true, "single")}
            turningFrom={
              !nav.reducedMotion && nav.animating && nav.direction === "forward"
                ? pageNode(nav.fromIndex, true, "single")
                : null
            }
          />
        </MagazineSpread>

        <PageNavigation
          label={nav.rangeLabel}
          hint={nav.spreadMode ? content.navigation.hintDesktop : content.navigation.hintMobile}
          showHint={!nav.hasInteracted}
          canPrev={nav.canPrev}
          canNext={nav.canNext}
          onPrev={nav.prev}
          onNext={nav.next}
          visible={paginationVisible}
          showScrollCue={showScrollCue}
          onScrollCue={scrollDown}
          showScrollDown={showScrollDown}
          onScrollDown={scrollDown}
        />
      </main>
    </div>
  );
}
