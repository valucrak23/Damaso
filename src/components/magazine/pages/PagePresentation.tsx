import { primaryMagazineContent } from "../../../content/primaryMagazineContent";
import { CopyStack } from "../../CopyStack";
import { Doodle } from "../../Doodle";
import { EditorialTitle } from "../../EditorialTitle";
import { Logo } from "../../Logo";
import { MediaPlaceholder } from "../../MediaPlaceholder";
import { QuoteBlock } from "../../QuoteBlock";

export function PagePresentation() {
  const page = primaryMagazineContent.pages.presentation;
  const lead = page.lead.filter((p) => p.inLayout);
  const identity = page.identity.paragraphs.filter((p) => p.inLayout);

  return (
    <div className="page page--1">
      <header className="p1-masthead">
        <Logo />
        <span className="pill pill--yellow">{page.eyebrow}</span>
      </header>

      <div className="p1-opening">
        <CopyStack
          head={
            <>
              <EditorialTitle lines={page.titleLines} label={page.title} level={1} className="p1-title" />
              <Doodle name="rays" tone="orange" className="p1-rays" />
            </>
          }
        >
          {lead.map((p) => (
            <p className="lead" key={p.text}>
              {p.text}
            </p>
          ))}
        </CopyStack>
      </div>

      <div className="p1-hero">
        <MediaPlaceholder slot={page.hero} frame="print" tape="corners" tilt={-1.5} />
        <Doodle name="star" tone="yellow" className="p1-star" />
        <Doodle name="heart" tone="orange" className="p1-heart" />
      </div>

      <section className="p1-identity" aria-labelledby="p1-identity-title">
        <div className="p1-identity__text">
          <CopyStack
            head={
              <h2 className="kicker-title" id="p1-identity-title">
                {page.identity.title}
              </h2>
            }
          >
            {identity.map((p) => (
              <p key={p.text}>{p.text}</p>
            ))}
          </CopyStack>
          <QuoteBlock
            text={page.identity.highlightedDisplay}
            emphasis={page.identity.highlightedEmphasis}
            variant="bubble"
            className="p1-quote"
          />
        </div>
        <div className="p1-art">
          <MediaPlaceholder slot={page.secondaryMedia} frame="sheet" tape="top" tilt={2} />
          <Doodle name="dots" tone="turquoise" className="p1-dots" />
        </div>
      </section>
    </div>
  );
}
