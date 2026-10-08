type PageNavigationProps = {
  label: string;
  hint: string;
  showHint: boolean;
  canPrev: boolean;
  canNext: boolean;
  onPrev: () => void;
  onNext: () => void;
  visible?: boolean;
  showScrollDown?: boolean;
  onScrollDown?: () => void;
};

export function PageNavigation({
  label,
  hint,
  showHint,
  canPrev,
  canNext,
  onPrev,
  onNext,
  visible = true,
  showScrollDown = false,
  onScrollDown,
}: PageNavigationProps) {
  return (
    <div className={`page-nav-wrap${visible ? "" : " is-hidden"}`}>
      <div className="page-nav-cluster">
        {showScrollDown ? (
          <button
            type="button"
            className="page-nav-scroll-down"
            onClick={onScrollDown}
            aria-label="Seguir leyendo hacia abajo"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 5v13m0 0-5.5-5.5M12 18l5.5-5.5" />
            </svg>
          </button>
        ) : null}
        <nav className="page-nav" aria-label="Revista">
          <button type="button" onClick={onPrev} disabled={!canPrev} aria-label="Página anterior">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M15 5.5 8.5 12l6.5 6.5" />
            </svg>
          </button>
          <p className="page-nav__status">{label}</p>
          <button type="button" onClick={onNext} disabled={!canNext} aria-label="Página siguiente">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="m9 5.5 6.5 6.5L9 18.5" />
            </svg>
          </button>
        </nav>
      </div>
      <p className={`nav-hint${showHint ? "" : " is-hidden"}`} aria-hidden={!showHint || undefined}>
        {hint}
      </p>
    </div>
  );
}
