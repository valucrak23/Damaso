import { primaryMagazineContent } from "../content/primaryMagazineContent";

export function Logo() {
  const { logo } = primaryMagazineContent;

  if (logo.src) {
    // El logo con nombre tiene letras claras: va sobre una banda azul, sin alterar el archivo.
    return (
      <span className="brand-logo brand-logo--band">
        <img src={logo.src} alt={logo.alt} />
      </span>
    );
  }

  return (
    <div className="brand-logo" role="img" aria-label={logo.alt}>
      <span className="brand-logo__placeholder">[LOGO OFICIAL DÁMASO CENTENO]</span>
    </div>
  );
}
