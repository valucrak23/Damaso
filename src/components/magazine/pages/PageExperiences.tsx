import type { Tone } from "../../../content/types";
import { primaryMagazineContent } from "../../../content/primaryMagazineContent";
import { Doodle } from "../../Doodle";
import { EditorialTitle } from "../../EditorialTitle";
import { MediaPlaceholder } from "../../MediaPlaceholder";
import { QuoteBlock } from "../../QuoteBlock";
import { VideoPlaceholder } from "../../VideoPlaceholder";

const COLLAGE: { tilt: number; tone: Tone; frame: "print" | "plain" }[] = [
  { tilt: -2, tone: "orange", frame: "print" },
  { tilt: 3, tone: "green", frame: "plain" },
  { tilt: -1.5, tone: "turquoise", frame: "plain" },
];

export function PageExperiences() {
  const page = primaryMagazineContent.pages.experiences;
  const lead = page.lead.filter((p) => p.inLayout);
  const feriaParagraphs = page.feria.paragraphs.filter((p) => p.inLayout);
  const shots = page.mosaic.filter((slot) => slot.enabled);

  return (
    <div className="page page--3">
      <header className="p3-head">
        <EditorialTitle lines={page.titleLines} label={page.title} className="p3-title" />
        {lead.map((p) => (
          <p className="lead" key={p.text}>
            {p.text}
          </p>
        ))}
      </header>

      <div className={`p3-collage p3-collage--${shots.length}`}>
        {shots.map((slot, i) => {
          const cutout = slot.kind === "recorte";
          return (
            <MediaPlaceholder
              key={slot.id}
              slot={slot}
              frame={cutout ? "cutout" : (COLLAGE[i]?.frame ?? "plain")}
              tape={cutout ? "none" : i === 0 ? "corners" : "top"}
              tilt={cutout ? 4 : (COLLAGE[i]?.tilt ?? 0)}
              sticker={slot.label ? { text: slot.label, tone: COLLAGE[i]?.tone ?? "yellow" } : undefined}
              className={`p3-shot p3-shot--${i + 1}`}
            />
          );
        })}
        <QuoteBlock text={page.feria.pullQuote} variant="hand" className="p3-hand" />
        <Doodle name="plane" tone="turquoise" className="p3-plane" />
      </div>

      <section className="p3-feria" aria-labelledby="p3-feria-title">
        <span className="pill pill--turquoise">{page.feria.eyebrow}</span>
        <h3 id="p3-feria-title" className="p3-feria__title">
          <span className="tone-orange">{page.feria.titleLead}</span> {page.feria.titleRest}
        </h3>
        {feriaParagraphs.map((p) => (
          <p key={p.text}>{p.text}</p>
        ))}
      </section>

      <div className="p3-side">
        <VideoPlaceholder video={page.video} stickerTone="yellow" />
        <QuoteBlock text={page.feria.closingDisplay} variant="blob" className="p3-closing" />
        <Doodle name="star" tone="orange" className="p3-star" />
      </div>
    </div>
  );
}
