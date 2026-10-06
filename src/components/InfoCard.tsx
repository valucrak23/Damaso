import type { OrganizationItem } from "../content/types";
import { Icon } from "./Icon";

export function InfoCard({ item }: { item: OrganizationItem }) {
  const pending = item.status === "pending-validation";
  const showTag = pending && !/validar/i.test(item.display.main);

  return (
    <li className={`ficha${pending ? " ficha--pending" : ""}`} data-item={item.id}>
      <span className="ficha__icon">
        <Icon name={item.icon} />
      </span>
      <span className="ficha__label">{item.label}</span>
      <strong className="ficha__main">{item.display.main}</strong>
      {item.display.sub ? <span className="ficha__sub">{item.display.sub}</span> : null}
      {showTag ? <span className="pending-tag">A validar</span> : null}
    </li>
  );
}
