import type { Tone } from "../content/types";

type DoodleName =
  | "star"
  | "underline"
  | "rays"
  | "arrow"
  | "plane"
  | "dots"
  | "leaf"
  | "heart"
  | "smile";

const TONE: Record<Tone, string> = {
  turquoise: "#0171BB",
  blue: "#005090",
  orange: "#FF8D32",
  yellow: "#F8E815",
  green: "#008C24",
  violet: "#331983",
};

const VIEWBOX: Record<DoodleName, string> = {
  star: "0 0 40 40",
  underline: "0 0 200 22",
  rays: "0 0 30 30",
  arrow: "0 0 80 40",
  plane: "0 0 120 60",
  dots: "0 0 40 24",
  leaf: "0 0 40 40",
  heart: "0 0 40 36",
  smile: "0 0 40 40",
};

type DoodleProps = {
  name: DoodleName;
  tone?: Tone;
  className?: string;
};

export function Doodle({ name, tone = "orange", className = "" }: DoodleProps) {
  const c = TONE[tone];
  const stroke = {
    fill: "none",
    stroke: c,
    strokeWidth: 2.6,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  return (
    <svg
      className={`doodle doodle--${name} ${className}`.trim()}
      viewBox={VIEWBOX[name]}
      preserveAspectRatio={name === "underline" ? "none" : undefined}
      aria-hidden="true"
      focusable="false"
    >
      {name === "star" ? (
        <path
          {...stroke}
          d="M20 4.5c1.7 5 3.1 8.6 4.6 10.8 3.9.4 7.9.7 11 1.3-3.4 2.7-6.6 5-9.2 7.2 1 4 2.1 7.9 2.9 11.2-3.3-2.3-6.4-4.5-9.3-6.3-2.9 1.9-6.1 4-9.3 6.1.9-3.6 1.9-7.3 2.9-11.2C11.1 21.4 8 19 4.6 16.4c3.8-.5 7.7-.8 11.1-1.2 1.4-2.9 2.9-6.8 4.3-10.7z"
        />
      ) : null}
      {name === "underline" ? (
        <>
          <path fill="none" stroke={c} strokeWidth="7" strokeLinecap="round" d="M5 13c32-6 64-8 98-6 30 1.6 60 .6 92-4" />
          <path fill="none" stroke={c} strokeWidth="3" strokeLinecap="round" opacity="0.6" d="M22 19c40-3.5 92-4.5 156-2.5" />
        </>
      ) : null}
      {name === "rays" ? <path {...stroke} d="M6 13 2.5 7M14.5 10l-.8-7M23 13l4.2-5.5" /> : null}
      {name === "arrow" ? (
        <>
          <path {...stroke} d="M4 30c16-13 36-19 64-14" />
          <path {...stroke} d="m57 7 13 9-11 10" />
        </>
      ) : null}
      {name === "plane" ? (
        <>
          <g transform="translate(0, 9)">
            <path {...stroke} strokeDasharray="4 6" d="M4 52c14-2 22-10 30-18 10-10 24-14 42-12" />
          </g>
          <path {...stroke} d="m78 22 38-16-16 38-7-14z" />
          <path {...stroke} d="m93 30 23-24" />
        </>
      ) : null}
      {name === "dots" ? (
        <g fill={c}>
          <circle cx="6" cy="14" r="3" />
          <circle cx="18" cy="8" r="2.6" />
          <circle cx="30" cy="15" r="3.2" />
          <circle cx="36" cy="5" r="2" />
        </g>
      ) : null}
      {name === "leaf" ? (
        <>
          <path {...stroke} d="M7 35C15 25 23 16 34 5" />
          <path fill={c} d="M16 26c-6.5-.8-9.8-5.8-9-12.5 6.6.2 10.5 4.6 9 12.5zM24.5 17.5c0-6.5 4-10.6 10.6-10.8.2 6.6-4 10.8-10.6 10.8zM13 31c-5 .8-8.6-1.4-10.4-5.6 4.6-1 8.4.9 10.4 5.6z" />
        </>
      ) : null}
      {name === "heart" ? (
        <path {...stroke} d="M20 32S5 22.5 5 13a7.6 7.6 0 0 1 15-2 7.6 7.6 0 0 1 15 2c0 9.5-15 19-15 19z" />
      ) : null}
      {name === "smile" ? (
        <>
          <circle {...stroke} cx="20" cy="20" r="15" />
          <path {...stroke} d="M13.5 23.5c3.6 4 9.4 4 13 0" />
          <circle fill={c} cx="14.5" cy="16" r="1.8" />
          <circle fill={c} cx="25.5" cy="16" r="1.8" />
        </>
      ) : null}
    </svg>
  );
}
