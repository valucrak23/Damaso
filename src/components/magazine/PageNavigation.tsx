type PageNavigationProps = {
  label: string;
  hint: string;
  showHint: boolean;
  canPrev: boolean;
  canNext: boolean;
  onPrev: () => void;
  onNext: () => void;
};

export function PageNavigation({
  label,
  hint,
  showHint,
  canPrev,
  canNext,
  onPrev,
  onNext,
}: PageNavigationProps) {
  return (
    <div className="page-nav-wrap">
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
      <p className={`nav-hint${showHint ? "" : " is-hidden"}`} aria-hidden={!showHint || undefined}>
        {hint}
      </p>
    </div>
  );
}
