type QuoteBlockProps = {
  text: string;
  /** Fragmento a resaltar con marcador amarillo. */
  emphasis?: string;
  variant?: "bubble" | "blob" | "hand";
  className?: string;
};

function withEmphasis(text: string, emphasis?: string) {
  if (!emphasis) return text;
  const at = text.indexOf(emphasis);
  if (at < 0) return text;
  return (
    <>
      {text.slice(0, at)}
      <mark>{emphasis}</mark>
      {text.slice(at + emphasis.length)}
    </>
  );
}

export function QuoteBlock({ text, emphasis, variant = "bubble", className = "" }: QuoteBlockProps) {
  return (
    <blockquote className={`quote quote--${variant} ${className}`.trim()}>
      <p>{withEmphasis(text, emphasis)}</p>
    </blockquote>
  );
}
