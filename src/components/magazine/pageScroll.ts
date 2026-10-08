/** Retrato ≤900px: scroll en el inner; A0 y hojas anchas: scroll en el article. */
export function getPageScrollRoot(article: HTMLElement): HTMLElement {
  if (article.dataset.layout === "stack") {
    const stage = article.closest(".magazine-stage");
    if (stage?.classList.contains("is-stack-scroll-ui")) {
      return article.querySelector<HTMLElement>(".magazine-page__inner") ?? article;
    }
  }
  return article;
}

export const SCROLL_END_ENTER_PX = 32;
export const SCROLL_END_EXIT_PX = 80;

export function readPageScrollState(root: HTMLElement, atEndLatched: boolean) {
  const scrolls = root.scrollHeight > root.clientHeight + 2;
  const distanceFromEnd = root.scrollHeight - root.scrollTop - root.clientHeight;
  const atEnd = atEndLatched
    ? distanceFromEnd <= SCROLL_END_EXIT_PX
    : distanceFromEnd <= SCROLL_END_ENTER_PX;
  return { scrolls, atEnd };
}
