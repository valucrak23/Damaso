import type { ReactNode } from "react";

type CopyStackProps = {
  /** Cabecera del bloque: título, pill, título editorial, etc. */
  head: ReactNode;
  /** Párrafos u otro cuerpo de texto. */
  children: ReactNode;
  className?: string;
};

/** Bloque editorial: caja externa (head + body) y caja interna solo para el texto corrido. */
export function CopyStack({ head, children, className = "" }: CopyStackProps) {
  return (
    <div className={`copy-stack ${className}`.trim()}>
      <div className="copy-stack__head">{head}</div>
      <div className="copy-stack__body">{children}</div>
    </div>
  );
}
