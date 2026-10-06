import { useEffect, useState } from "react";
import { AUTHOR, AUTHOR_ROLE, SECRET_WORD } from "./signature";

const VISIBLE_MS = 6000;

/** Tipear la palabra secreta muestra la firma manuscrita, que se dibuja sola. */
export function SignatureEasterEgg() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let typed = "";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        return;
      }
      if (event.key.length !== 1 || event.ctrlKey || event.metaKey || event.altKey) return;
      typed = (typed + event.key.toLowerCase()).slice(-SECRET_WORD.length);
      if (typed === SECRET_WORD) {
        typed = "";
        setOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (!open) return;
    const timer = window.setTimeout(() => setOpen(false), VISIBLE_MS);
    return () => window.clearTimeout(timer);
  }, [open]);

  if (!open) return null;

  return (
    <div className="signature" role="dialog" aria-label={`${AUTHOR_ROLE}: ${AUTHOR}`} onClick={() => setOpen(false)}>
      <div className="signature__card">
        <svg className="signature__svg" viewBox="0 0 560 120" aria-hidden="true">
          <text x="50%" y="78" textAnchor="middle">
            {AUTHOR}
          </text>
        </svg>
        <svg className="signature__spark" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 2l2.2 7.8L22 12l-7.8 2.2L12 22l-2.2-7.8L2 12l7.8-2.2z" fill="currentColor" />
        </svg>
        <p className="signature__role">{AUTHOR_ROLE}</p>
      </div>
    </div>
  );
}
