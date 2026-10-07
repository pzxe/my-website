const parallaxElements = document.querySelectorAll("[data-parallax]");
const canUsePointerParallax = window.matchMedia(
  "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)"
);
const canUseScrollParallax = window.matchMedia(
  "(max-width: 800px) and (prefers-reduced-motion: no-preference)"
);

if (parallaxElements.length > 0) {
  let animationFrame = 0;

  document.addEventListener("pointermove", (event) => {
    if (!canUsePointerParallax.matches) {
      return;
    }

    if (animationFrame) {
      cancelAnimationFrame(animationFrame);
    }

    animationFrame = requestAnimationFrame(() => {
      const pointerX = (event.clientX / window.innerWidth - 0.5) * 2;
      const pointerY = (event.clientY / window.innerHeight - 0.5) * 2;

      parallaxElements.forEach((element) => {
        const speed = Number(element.dataset.parallax);
        element.style.translate = `${pointerX * speed}px ${pointerY * speed}px`;
      });
    });
  });
  let scrollAnimationFrame = 0;

  const updateScrollParallax = () => {
    scrollAnimationFrame = 0;

    if (!canUseScrollParallax.matches) {
      return;
    }

    parallaxElements.forEach((element) => {
      const bounds = element.getBoundingClientRect();
      const distanceFromCenter = window.innerHeight / 2 - (bounds.top + bounds.height / 2);
      const speed = Number(element.dataset.parallax);
      const offsetY = Math.max(-24, Math.min(24, distanceFromCenter * speed / 100));

      element.style.translate = `0 ${offsetY}px`;
    });
  };

  const requestScrollUpdate = () => {
    if (!scrollAnimationFrame) {
      scrollAnimationFrame = requestAnimationFrame(updateScrollParallax);
    }
  };

  window.addEventListener("scroll", requestScrollUpdate, { passive: true });
  window.addEventListener("resize", requestScrollUpdate);
  canUseScrollParallax.addEventListener("change", requestScrollUpdate);
  requestScrollUpdate();
}
