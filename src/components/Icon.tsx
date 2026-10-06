import type { ReactNode } from "react";
import type { IconName } from "../content/types";

const PATHS: Record<IconName, ReactNode> = {
  book: (
    <>
      <path d="M3.5 5.5c2.6-1 5.4-1 8.5.8v13c-3.1-1.8-5.9-1.8-8.5-.8z" />
      <path d="M20.5 5.5c-2.6-1-5.4-1-8.5.8v13c3.1-1.8 5.9-1.8 8.5-.8z" />
      <path d="M6 9.2c1.4-.3 2.8-.1 4 .5M6 12.4c1.4-.3 2.8-.1 4 .5" />
    </>
  ),
  checklist: (
    <>
      <path d="M10 6.5h10M10 12h10M10 17.5h10" />
      <path d="m3.8 6.4 1.4 1.4 2.4-2.6M3.8 11.9l1.4 1.4 2.4-2.6M3.8 17.4l1.4 1.4 2.4-2.6" />
    </>
  ),
  chat: (
    <>
      <path d="M4 5.5h10.5a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2H9.5L6 17.5v-3H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2z" />
      <path d="M18.5 9.5H20a2 2 0 0 1 2 2v4.5a2 2 0 0 1-2 2h-1v2.5l-3-2.5h-3.5a2 2 0 0 1-1.7-1" />
    </>
  ),
  spark: (
    <path d="M12 3.5v4M12 16.5v4M3.5 12h4M16.5 12h4M6 6l2.6 2.6M15.4 15.4 18 18M6 18l2.6-2.6M15.4 8.6 18 6" />
  ),
  clock: (
    <>
      <circle cx="12" cy="12.5" r="8" />
      <path d="M12 8.5v4.2l2.8 1.8M9.5 2.8h5" />
    </>
  ),
  backpack: (
    <>
      <path d="M6.5 10a5.5 5.5 0 0 1 11 0v9.5a1.5 1.5 0 0 1-1.5 1.5H8a1.5 1.5 0 0 1-1.5-1.5z" />
      <path d="M9.5 4.8V3.5h5v1.3M9 14h6v3.5H9z" />
    </>
  ),
  sun: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2.8v2.4M12 18.8v2.4M2.8 12h2.4M18.8 12h2.4M5.5 5.5l1.7 1.7M16.8 16.8l1.7 1.7M5.5 18.5l1.7-1.7M16.8 7.2l1.7-1.7" />
    </>
  ),
  pin: (
    <>
      <path d="M12 21s-6.5-5.8-6.5-11a6.5 6.5 0 0 1 13 0c0 5.2-6.5 11-6.5 11z" />
      <circle cx="12" cy="10" r="2.4" />
    </>
  ),
  phone: (
    <path d="M6.6 3.5h3l1.6 4.2-2.1 1.4a11 11 0 0 0 5.8 5.8l1.4-2.1 4.2 1.6v3a1.6 1.6 0 0 1-1.7 1.6A16 16 0 0 1 5 5.2a1.6 1.6 0 0 1 1.6-1.7z" />
  ),
  steps: (
    <>
      <path d="M3.5 19.5h4.5v-4.5h4.5v-4.5H17V6h3.5" />
      <path d="m17.5 3.5 3 2.5-3 2.5" />
    </>
  ),
  bridge: (
    <>
      <path d="M2.5 16c3.4-5.6 15.6-5.6 19 0" />
      <path d="M2.5 16v3.5M21.5 16v3.5M8 12.4v7.1M16 12.4v7.1M2.5 19.5h19" />
    </>
  ),
  people: (
    <>
      <circle cx="9" cy="8" r="3.2" />
      <circle cx="17" cy="9.2" r="2.5" />
      <path d="M3 19.5c.6-3.4 3-5.3 6-5.3s5.4 1.9 6 5.3M15.4 14.4c2.8-.3 4.9 1.4 5.6 4.6" />
    </>
  ),
  utensils: (
    <>
      <path d="M6.5 3v7M4.5 3v4a2 2 0 0 0 4 0V3M6.5 10v11" />
      <path d="M17 21V3c-2 1.5-3 3.8-3 6.8V14h3" />
    </>
  ),
  grid: (
    <>
      <rect x="4" y="4" width="6.5" height="6.5" rx="1.5" />
      <rect x="13.5" y="4" width="6.5" height="6.5" rx="1.5" />
      <rect x="4" y="13.5" width="6.5" height="6.5" rx="1.5" />
      <rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.5" />
    </>
  ),
  arrow: <path d="M4 12h15M13.5 6.5 19 12l-5.5 5.5" />,
};

export function Icon({ name, className = "" }: { name: IconName; className?: string }) {
  return (
    <svg
      className={`icon ${className}`.trim()}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {PATHS[name]}
    </svg>
  );
}
