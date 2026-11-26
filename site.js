(() => {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Lenis provides the smooth, eased scroll used on lenis.dev. Native scrolling
  // remains available when the library is blocked or reduced motion is enabled.
  function startSmoothScroll() {
    if (reducedMotion || !window.Lenis) return;
    const lenis = new window.Lenis({
      duration: 1.15,
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.15,
      anchors: true,
    });
    const raf = (time) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);
  }
  if (document.readyState === "complete") startSmoothScroll();
  else window.addEventListener("load", startSmoothScroll, { once: true });

  const menuButton = document.querySelector(".menu-toggle");
  const menu = document.querySelector(".nav-links");
  if (menuButton && menu) {
    menuButton.addEventListener("click", () => {
      const expanded = menuButton.getAttribute("aria-expanded") === "true";
      menuButton.setAttribute("aria-expanded", String(!expanded));
      menuButton.setAttribute("aria-label", expanded ? "Open navigation" : "Close navigation");
      menuButton.textContent = expanded ? "☰" : "×";
      menu.classList.toggle("open", !expanded);
    });
    menu.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => {
      menu.classList.remove("open");
      menuButton.setAttribute("aria-expanded", "false");
      menuButton.setAttribute("aria-label", "Open navigation");
      menuButton.textContent = "☰";
    }));
  }

  document.querySelectorAll("[data-carousel]").forEach((carousel) => {
    const track = carousel.querySelector("[data-track]");
    const progress = carousel.querySelector("[data-progress]");
    const previous = carousel.querySelector("[data-prev]");
    const next = carousel.querySelector("[data-next]");
    if (!track) return;
    const amount = () => Math.max(track.clientWidth * 0.78, 250);
    previous?.addEventListener("click", () => track.scrollBy({ left: -amount(), behavior: reducedMotion ? "instant" : "smooth" }));
    next?.addEventListener("click", () => track.scrollBy({ left: amount(), behavior: reducedMotion ? "instant" : "smooth" }));
    const update = () => {
      if (!progress) return;
      const maximum = track.scrollWidth - track.clientWidth;
      progress.style.width = maximum <= 0 ? "100%" : `${Math.max(25, 25 + (track.scrollLeft / maximum) * 75)}%`;
    };
    track.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    update();
  });
})();
