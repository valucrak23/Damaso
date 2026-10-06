export const AUTHOR = "Valentina Ijelchuk";
export const AUTHOR_ROLE = "Diseño y desarrollo web";
/** Palabra que, tipeada en cualquier parte del sitio, muestra la firma. */
export const SECRET_WORD = "valentina";

export function signConsole() {
  console.log(
    `%c${AUTHOR}%c\n${AUTHOR_ROLE} ✦ psst: tipeá "${SECRET_WORD}" en la revista`,
    "font: 700 30px Caveat, 'Segoe Script', cursive; color: #005090; padding: 4px 0;",
    "font: 600 12px Nunito, system-ui, sans-serif; color: #f37021;",
  );
}
