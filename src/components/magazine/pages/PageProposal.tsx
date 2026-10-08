import { primaryMagazineContent } from "../../../content/primaryMagazineContent";
import { CopyStack } from "../../CopyStack";
import { Doodle } from "../../Doodle";
import { EditorialCard } from "../../EditorialCard";
import { EditorialTitle } from "../../EditorialTitle";
import { MediaPlaceholder } from "../../MediaPlaceholder";

export function PageProposal() {
  const page = primaryMagazineContent.pages.proposal;

  return (
    <div className="page page--2">
      <header className="p2-head">
        <CopyStack
          head={
            <>
              <EditorialTitle lines={page.titleLines} label={page.title} className="p2-title" />
              <Doodle name="arrow" tone="turquoise" className="p2-arrow" />
            </>
          }
        >
          <p className="kicker">{page.kicker}</p>
        </CopyStack>
      </header>

      <div className="p2-photo">
        <MediaPlaceholder
          slot={page.media}
          frame="print"
          tape="top"
          tilt={2}
          sticker={page.media.label ? { text: page.media.label, tone: "orange" } : undefined}
        />
        <Doodle name="star" tone="green" className="p2-star" />
        <Doodle name="leaf" tone="green" className="p2-leaf" />
      </div>

      <div className="p2-cards">
        {page.cards.map((card) => (
          <EditorialCard card={card} key={card.id} className={`p2-card p2-card--${card.id}`} />
        ))}
      </div>
      <Doodle name="dots" tone="orange" className="p2-dots" />
    </div>
  );
}
