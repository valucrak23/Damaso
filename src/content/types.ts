export type ContentStatus = "confirmed" | "pending-validation";

export type Tone = "turquoise" | "blue" | "orange" | "yellow" | "green" | "violet" | "ink";

export type CardTone = "turquoise" | "orange" | "yellow" | "green";

export type IconName =
  | "book"
  | "checklist"
  | "chat"
  | "spark"
  | "clock"
  | "backpack"
  | "sun"
  | "pin"
  | "phone"
  | "steps"
  | "bridge"
  | "people"
  | "utensils"
  | "grid"
  | "arrow";

/** "recorte" = PNG con fondo transparente (por ejemplo la mascota), sin marco. */
export type MediaKind = "foto" | "video" | "produccion-alumno" | "simbolo" | "recorte";

export type VideoProvider = "youtube" | "vimeo" | "mp4";

export interface TitlePart {
  text: string;
  tone: Tone;
  underline?: boolean;
}

export type TitleLine = TitlePart[];

export interface EditorialParagraph {
  text: string;
  /** false = se conserva en datos pero no se muestra en la página. */
  inLayout: boolean;
  note?: string;
}

export interface MediaSlot {
  id: string;
  kind: MediaKind;
  ratio: `${number}:${number}`;
  /** Texto corto visible en el placeholder. */
  shortHint: string;
  /** Recomendación completa: solo como tooltip/metadata en desarrollo. */
  suggestion: string;
  /** Texto del sticker que acompaña la imagen. */
  label?: string;
  enabled: boolean;
  src?: string;
  alt?: string;
  objectPosition?: string;
  /** "cover" recorta para llenar el marco; "contain" muestra la foto completa. */
  fit?: "cover" | "contain";
  /** Videos: segundo del video que se muestra como portada antes de darle play. */
  posterAt?: number;
}

export interface VideoSlot {
  id: string;
  ratio: `${number}:${number}`;
  orientation: "horizontal" | "vertical";
  /** Si está, el video llena el marco recortándose y esta posición elige qué parte se ve. */
  objectPosition?: string;
  /** "controles": el usuario le da play. "automatica"/"boomerang": arranca solo y sin sonido. */
  playback: "controles" | "automatica" | "boomerang";
  label: string;
  caption: string;
  suggestion: string;
  provider?: VideoProvider;
  src?: string;
  poster?: string;
}

export type CardLayout = "feature" | "note" | "band" | "pending";

export interface EditorialCardData {
  id: string;
  tone: CardTone;
  icon: IconName;
  layout: CardLayout;
  status: ContentStatus;
  title: string;
  body: string;
}

export interface OrganizationItem {
  id: string;
  icon: IconName;
  label: string;
  /** Texto completo del dato. */
  value: string;
  display: { main: string; sub?: string };
  status: ContentStatus;
}
