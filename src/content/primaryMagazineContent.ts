/**
 * Adaptador: toma los textos editables de Contenido/Información/contenido.json
 * y los convierte a la estructura que usan los componentes.
 * Las notas internas viven en notas-internas-NO-SE-PUBLICA.json y nunca se importan.
 */
import data from "../../Contenido/Información/contenido.json";
import type {
  CardLayout,
  CardTone,
  ContentStatus,
  EditorialCardData,
  EditorialParagraph,
  IconName,
  MediaKind,
  MediaSlot,
  OrganizationItem,
  Tone,
  TitleLine,
  VideoSlot,
} from "./types";

export const MAGAZINE_PAGE_COUNT = 4;
export const PAGE_FLIP_MS = 650;

type JsonParagraph = { texto: string; mostrar?: boolean };
type JsonTitlePart = { texto: string; color: string; subrayado?: boolean };
type JsonMedia = {
  tipo?: string;
  archivo?: string;
  descripcion?: string;
  textoSiFalta: string;
  etiqueta?: string;
  proporcion?: string;
  encuadre?: string;
  ajuste?: string;
  portadaEnSegundo?: number;
  mostrar?: boolean;
};
type JsonVideo = {
  archivo?: string;
  etiqueta: string;
  descripcion?: string;
  orientacion?: string;
  reproduccion?: string;
  proporcion?: string;
  encuadre?: string;
};

const PLAYBACK: Record<string, VideoSlot["playback"]> = {
  boomerang: "boomerang",
  automatica: "automatica",
  automática: "automatica",
};

const COLORS: Record<string, Tone> = {
  azul: "blue",
  celeste: "turquoise",
  naranja: "orange",
  verde: "green",
  amarillo: "yellow",
  violeta: "violet",
};

const CARD_COLORS: Record<string, CardTone> = {
  celeste: "turquoise",
  azul: "turquoise",
  naranja: "orange",
  amarillo: "yellow",
  verde: "green",
};

const ICONS: Record<string, IconName> = {
  libro: "book",
  lista: "checklist",
  dialogo: "chat",
  destello: "spark",
  reloj: "clock",
  mochila: "backpack",
  sol: "sun",
  ubicacion: "pin",
  telefono: "phone",
  escalera: "steps",
  puente: "bridge",
  personas: "people",
  cubiertos: "utensils",
  cuadricula: "grid",
};

const KINDS: Record<string, MediaKind> = {
  foto: "foto",
  video: "video",
  dibujo: "produccion-alumno",
  recorte: "recorte",
};

const CARD_LAYOUTS: CardLayout[] = ["feature", "note", "pending", "band"];

/** Archivos de Contenido/Multimedia (Vite los publica tal cual en la raíz del sitio). */
export function mediaUrl(file?: string) {
  if (!file) return undefined;
  return `${import.meta.env.BASE_URL}${encodeURIComponent(file)}`;
}

const status = (estado?: string): ContentStatus =>
  estado?.toLowerCase().includes("validar") ? "pending-validation" : "confirmed";

const paragraphs = (list: JsonParagraph[]): EditorialParagraph[] =>
  list.map((p) => ({ text: p.texto, inLayout: p.mostrar !== false }));

const titleLines = (lines: JsonTitlePart[][]): TitleLine[] =>
  lines.map((line) =>
    line.map((part) => ({
      text: part.texto,
      tone: COLORS[part.color] ?? "blue",
      underline: part.subrayado === true,
    })),
  );

function media(id: string, m: JsonMedia, kind: MediaKind = "foto"): MediaSlot {
  const ratio = (m.proporcion ?? "4:3") as MediaSlot["ratio"];
  return {
    id,
    kind: KINDS[m.tipo ?? ""] ?? kind,
    ratio,
    shortHint: m.textoSiFalta,
    suggestion: m.descripcion || m.textoSiFalta,
    label: m.etiqueta || undefined,
    enabled: m.mostrar !== false,
    src: mediaUrl(m.archivo),
    alt: m.descripcion ?? "",
    objectPosition: m.encuadre,
    fit: m.ajuste?.toLowerCase().startsWith("complet") ? "contain" : "cover",
    posterAt: m.portadaEnSegundo,
  };
}

const isVertical = (v: JsonVideo) => v.orientacion?.toLowerCase() === "vertical";

const video = (id: string, v: JsonVideo): VideoSlot => ({
  id,
  ratio: (v.proporcion as VideoSlot["ratio"] | undefined) ?? (isVertical(v) ? "9:16" : "16:9"),
  orientation: isVertical(v) ? "vertical" : "horizontal",
  objectPosition: v.encuadre || undefined,
  playback: PLAYBACK[v.reproduccion?.toLowerCase() ?? ""] ?? "controles",
  label: v.etiqueta,
  caption: v.descripcion || v.etiqueta,
  suggestion: v.descripcion || v.etiqueta,
  provider: v.archivo ? "mp4" : undefined,
  src: mediaUrl(v.archivo),
});

const p1 = data.pagina1_presentacion;
const p2 = data.pagina2_propuesta;
const p3 = data.pagina3_experiencias;
const p4 = data.pagina4_familias;
const identityParagraphs = paragraphs(p1.identidad.parrafos);

export const primaryMagazineContent = {
  institution: {
    name: data.institucion.nombre,
    shortName: data.institucion.nombreCorto,
    level: data.institucion.nivel,
  },

  logo: {
    src: mediaUrl(data.logo.archivo),
    alt: data.logo.textoAlternativo,
  },

  navigation: {
    hintDesktop: data.navegacion.ayudaComputadora,
    hintMobile: data.navegacion.ayudaCelular,
  },

  cta: {
    admission: { label: data.botones.ingreso.texto, href: data.botones.ingreso.enlace },
    contact: { label: data.botones.contacto.texto, href: data.botones.contacto.enlace },
  },

  pages: {
    presentation: {
      id: 1,
      eyebrow: p1.etiqueta,
      title: p1.titulo,
      titleLines: titleLines(p1.tituloEnLineas),
      lead: paragraphs(p1.introduccion),
      hero: media("p1-hero", p1.fotoPrincipal),
      identity: {
        title: p1.identidad.titulo,
        paragraphs: identityParagraphs,
        highlightedDisplay: p1.identidad.fraseDestacada,
        highlightedEmphasis: p1.identidad.parteResaltadaEnAmarillo,
        highlightedOriginal: p1.identidad.fraseOriginalDelDocumento,
      },
      secondaryMedia: media("p1-student-art", p1.dibujo, "produccion-alumno"),
    },

    proposal: {
      id: 2,
      title: p2.titulo,
      titleLines: titleLines(p2.tituloEnLineas),
      kicker: p2.bajada,
      cards: p2.tarjetas.map(
        (card, i): EditorialCardData => ({
          id: `card-${i + 1}`,
          tone: CARD_COLORS[card.color] ?? "turquoise",
          icon: ICONS[card.icono] ?? "spark",
          layout: status(card.estado) === "pending-validation" ? "pending" : CARD_LAYOUTS[i] ?? "note",
          status: status(card.estado),
          title: card.titulo,
          body: card.texto,
        }),
      ),
      media: media("p2-media", p2.multimedia),
    },

    experiences: {
      id: 3,
      title: p3.titulo,
      titleLines: titleLines(p3.tituloEnLineas),
      lead: paragraphs(p3.introduccion),
      mosaic: p3.collage.map((m, i) => media(`p3-shot-${i + 1}`, m)),
      feria: {
        eyebrow: p3.feria.etiqueta,
        title: p3.feria.titulo,
        titleLead: p3.feria.tituloParteDestacada,
        titleRest: p3.feria.tituloResto,
        pullQuote: p3.fraseManuscrita,
        paragraphs: paragraphs(p3.feria.parrafos),
        closingDisplay: p3.feria.fraseFinal,
        closingOriginal: p3.feria.fraseFinalOriginalDelDocumento,
      },
      video: video("video-1", p3.video),
    },

    families: {
      id: 4,
      title: p4.titulo,
      titleLines: titleLines(p4.tituloEnLineas),
      lead: p4.introduccion,
      familyMedia: media("p4-family", p4.fotoFamilias),
      modules: p4.notas.map((note, i) => ({
        id: `note-${i + 1}`,
        icon: ICONS[note.icono] ?? "people",
        title: note.titulo,
        body: note.texto,
      })),
      organization: {
        title: p4.organizacion.titulo,
        kicker: p4.organizacion.bajada,
        items: p4.organizacion.datos.map(
          (item, i): OrganizationItem => ({
            id: `org-${i + 1}`,
            icon: ICONS[item.icono] ?? "grid",
            label: item.etiqueta,
            value: item.textoCompleto,
            display: { main: item.principal, sub: item.secundario || undefined },
            status: status(item.estado),
          }),
        ),
        email: {
          address: p4.organizacion.correo.direccion,
          publish: p4.organizacion.correo.publicar === true && p4.organizacion.correo.direccion !== "",
        },
      },
      dining: {
        title: p4.comedor.titulo,
        body: p4.comedor.texto,
        status: status(p4.comedor.estado),
      },
      video: video("video-2", p4.video),
    },
  },
};

export type PrimaryMagazineContent = typeof primaryMagazineContent;
