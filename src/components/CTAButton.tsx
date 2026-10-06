import { Icon } from "./Icon";

type CTAButtonProps = {
  href: string;
  label: string;
  variant?: "primary" | "secondary";
};

export function CTAButton({ href, label, variant = "primary" }: CTAButtonProps) {
  return (
    <a className={`cta cta--${variant}`} href={href}>
      <span>{label}</span>
      <Icon name="arrow" className="cta__arrow" />
    </a>
  );
}
