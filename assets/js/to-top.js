// The button markup is only rendered on post pages
const toTopButton = document.querySelector(".to-top");

if (toTopButton) {
  const documentElement = document.documentElement;
  const brandLink = document.querySelector(".header__brand a");

  // Respect the OS-level reduced motion preference
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  const isScrollable = () => documentElement.scrollHeight > window.innerHeight;

  // Keep the hidden button out of the tab order
  const updateButtonVisibility = () => {
    const shouldShow = isScrollable();

    toTopButton.classList.toggle("show", shouldShow);
    toTopButton.tabIndex = shouldShow ? 0 : -1;
  };

  window.addEventListener("resize", updateButtonVisibility);

  toTopButton.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: reducedMotion.matches ? "auto" : "smooth" });

    // Move focus to the top so tabbing continues from the header
    brandLink?.focus({ preventScroll: true });
  });

  updateButtonVisibility();
}
