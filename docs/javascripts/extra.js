// Sherpa docs — custom enhancements layered on top of the mkdocs-shadcn theme.
// Restores image zoom (glightbox) and the "Was this page helpful?" feedback widget.

(function () {
  "use strict";

  function gaEvent(action, label) {
    if (typeof window.gtag === "function") {
      window.gtag("event", action, {
        event_category: "feedback",
        event_label: label,
      });
    }
  }

  // ── Image zoom (glightbox) ────────────────────────────────
  function initLightbox() {
    if (typeof GLightbox === "undefined") return;
    var content = document.querySelector("article .typography");
    if (!content) return;

    content.querySelectorAll("img").forEach(function (img) {
      // Skip inline iconify SVGs / tiny decorative images.
      if (img.closest("a")) return;
      if (img.classList.contains("iconify")) return;
      var link = document.createElement("a");
      link.href = img.getAttribute("src");
      link.className = "glightbox";
      link.setAttribute("data-type", "image");
      img.parentNode.insertBefore(link, img);
      link.appendChild(img);
    });

    GLightbox({ selector: ".glightbox", touchNavigation: true, loop: false });
  }

  // ── Feedback widget ───────────────────────────────────────
  function initFeedback() {
    var content = document.querySelector("article .typography");
    if (!content || document.getElementById("page-feedback")) return;

    var wrap = document.createElement("div");
    wrap.id = "page-feedback";
    wrap.className = "page-feedback";
    wrap.innerHTML =
      '<span class="page-feedback__title">Was this page helpful?</span>' +
      '<div class="page-feedback__buttons">' +
      '<button type="button" data-value="1" aria-label="This page was helpful">👍</button>' +
      '<button type="button" data-value="0" aria-label="This page could be improved">👎</button>' +
      "</div>";

    content.appendChild(wrap);

    wrap.querySelectorAll("button").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var helpful = btn.getAttribute("data-value") === "1";
        gaEvent(helpful ? "helpful" : "not_helpful", location.pathname);
        wrap.querySelector(".page-feedback__title").textContent = helpful
          ? "Thanks for your feedback!"
          : "Thanks — help us improve by opening an issue.";
        wrap.querySelector(".page-feedback__buttons").remove();
      });
    });
  }

  // ── Accessibility: hide decorative Material Icons from screen readers ──
  // The icon ligatures (e.g. "track_changes") would otherwise be read aloud.
  function hideDecorativeIcons() {
    document.querySelectorAll(".material-icons").forEach(function (el) {
      if (!el.hasAttribute("aria-hidden")) el.setAttribute("aria-hidden", "true");
    });
  }

  function keepStargazerFallback() {
    var stargazers = document.getElementById("stargazers");
    if (!stargazers) return;

    var fallback = stargazers.getAttribute("data-fallback") || "21";
    var restore = function () {
      var value = stargazers.textContent.trim();
      if (!/^\d+$/.test(value)) stargazers.textContent = fallback;
    };

    restore();
    new MutationObserver(restore).observe(stargazers, {
      childList: true,
      characterData: true,
      subtree: true,
    });
  }

  function init() {
    initLightbox();
    initFeedback();
    hideDecorativeIcons();
    keepStargazerFallback();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
