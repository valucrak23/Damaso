import { primaryMagazineContent } from "../../../content/primaryMagazineContent";
import { CopyStack } from "../../CopyStack";
import { CTAButton } from "../../CTAButton";
import { Doodle } from "../../Doodle";
import { EditorialTitle } from "../../EditorialTitle";
import { Icon } from "../../Icon";
import { InfoCard } from "../../InfoCard";
import { MediaPlaceholder } from "../../MediaPlaceholder";
import { VideoPlaceholder } from "../../VideoPlaceholder";

export function PageFamilies() {
  const { pages, cta } = primaryMagazineContent;
  const page = pages.families;

  return (
    <div className="page page--4">
      <div className="p4-main">
        <header className="p4-head">
          <CopyStack head={<EditorialTitle lines={page.titleLines} label={page.title} className="p4-title" />}>
            <p className="lead">{page.lead}</p>
          </CopyStack>
          <MediaPlaceholder slot={page.familyMedia} frame="round" tape="none" />
        </header>

        {page.modules.map((module, i) => (
          <section className={`note note--${i === 0 ? "turquoise" : "green"}`} key={module.id}>
            <CopyStack
              head={
                <h3>
                  <span className="note__icon">
                    <Icon name={module.icon} />
                  </span>
                  {module.title}
                </h3>
              }
            >
              <p>{module.body}</p>
            </CopyStack>
          </section>
        ))}
      </div>

      <div className="p4-aside">
        <section className="p4-org" aria-labelledby="p4-org-title">
          <CopyStack
            head={
              <h3 className="kicker-title" id="p4-org-title">
                {page.organization.title}
              </h3>
            }
          >
            <ul className="fichas">
              {page.organization.items.map((item) => (
                <InfoCard item={item} key={item.id} />
              ))}
            </ul>
            {page.organization.email.publish ? (
              <p className="p4-email">
                <a href={`mailto:${page.organization.email.address}`}>{page.organization.email.address}</a>
              </p>
            ) : null}
          </CopyStack>
        </section>

        <div className="p4-video">
          <VideoPlaceholder video={page.video} stickerTone="orange" size="small" />
          <Doodle name="heart" tone="orange" className="p4-heart" />
        </div>

        <section className="dining" aria-labelledby="p4-dining-title">
          <span className="dining__blob" aria-hidden="true" />
          <span className="dining__icon">
            <Icon name="utensils" />
          </span>
          <CopyStack
            head={<h3 id="p4-dining-title">{page.dining.title}</h3>}
          >
            <p>
              {page.dining.status === "pending-validation" ? (
                <span className="pending-tag">Pendiente</span>
              ) : null}{" "}
              {page.dining.body}
            </p>
          </CopyStack>
        </section>
      </div>

      <div className="cta-row">
        <CTAButton href={cta.admission.href} label={cta.admission.label} variant="primary" />
        <CTAButton href={cta.contact.href} label={cta.contact.label} variant="secondary" />
      </div>

      <Doodle name="smile" tone="yellow" className="p4-smile" />
    </div>
  );
}
