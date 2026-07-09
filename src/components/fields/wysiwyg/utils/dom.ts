export function focusNextElement() {
  const focusableSelectors = [
    "button:not([disabled])",
    "[href]",
    "input:not([disabled])",
    "select:not([disabled])",
    "textarea:not([disabled])",
    '[tabindex]:not([tabindex="-1"])',
  ];

  const focusableElements = Array.from(
    document.querySelectorAll<HTMLElement>(focusableSelectors.join(",")),
  ).filter((el) => el.offsetParent !== null);

  const currentIndex = focusableElements.indexOf(document.activeElement as HTMLElement);
  const nextElement = focusableElements[currentIndex + 1];

  if (nextElement) {
    nextElement.focus();
  }
}
