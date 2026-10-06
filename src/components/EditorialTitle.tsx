import type { TitleLine } from "../content/types";
import { Doodle } from "./Doodle";

type EditorialTitleProps = {
  lines: readonly TitleLine[];
  /** Texto accesible completo, sin cortes de línea. */
  label: string;
  level?: 1 | 2;
  className?: string;
};

export function EditorialTitle({ lines, label, level = 2, className = "" }: EditorialTitleProps) {
  const Tag = level === 1 ? "h1" : "h2";

  return (
    <Tag className={`editorial-title ${className}`.trim()} aria-label={label}>
      {lines.map((line, lineIndex) => (
        <span className="editorial-title__line" key={lineIndex} aria-hidden="true">
          {line.map((part, partIndex) => (
            <span
              key={partIndex}
              className={`tone-${part.tone}${part.underline ? " editorial-title__marked" : ""}`}
            >
              {part.text}
              {part.underline ? <Doodle name="underline" tone="yellow" className="editorial-title__underline" /> : null}
            </span>
          ))}
        </span>
      ))}
    </Tag>
  );
}
