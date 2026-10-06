import type { EditorialCardData } from "../content/types";
import { Icon } from "./Icon";

export function EditorialCard({ card, className = "" }: { card: EditorialCardData; className?: string }) {
  const pending = card.status === "pending-validation";

  return (
    <article
      className={`ecard ecard--${card.layout} ecard--${card.tone} ${className}`.trim()}
      data-card={card.id}
      data-status={card.status}
    >
      <header className="ecard__head">
        <span className="ecard__icon">
          <Icon name={card.icon} />
        </span>
        <h3>{card.title}</h3>
      </header>
      {pending ? (
        <p className="ecard__pending">
          <span className="pending-tag">Pendiente</span>
          {card.body}
        </p>
      ) : (
        <p className="ecard__body">{card.body}</p>
      )}
    </article>
  );
}
