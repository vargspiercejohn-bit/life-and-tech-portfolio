const body = document.body;
const themeToggle = document.getElementById("themeToggle");
const menuToggle = document.getElementById("menuToggle");
const siteNav = document.getElementById("siteNav");
const navLinks = siteNav ? [...siteNav.querySelectorAll('a[href^="#"]')] : [];
const revealItems = [...document.querySelectorAll(".reveal")];
const sections = navLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);
const currentYear = document.getElementById("currentYear");
const mediaQuery = window.matchMedia("(prefers-color-scheme: light)");
const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");
const lightboxCaption = document.getElementById("lightboxCaption");
const lightboxClose = document.getElementById("lightboxClose");
const lightboxTriggers = [...document.querySelectorAll("[data-lightbox-src]")];

function applyTheme(theme, persist = true) {
  const isDark = theme === "dark";

  body.classList.toggle("light-mode", isDark);

  if (themeToggle) {
    themeToggle.setAttribute("aria-label", isDark ? "Switch to light theme" : "Switch to dark theme");
    const themeToggleText = themeToggle.querySelector(".theme-toggle-text");

    if (themeToggleText) {
      themeToggleText.textContent = isDark ? "Light" : "Dark";
    }
  }

  if (persist) {
    localStorage.setItem("theme", theme);
  }
}

function loadTheme() {
  const savedTheme = localStorage.getItem("theme");

  if (savedTheme === "light" || savedTheme === "dark") {
    applyTheme(savedTheme, false);
    return;
  }

  applyTheme(mediaQuery.matches ? "light" : "dark", false);
}

function closeMenu() {
  if (!siteNav || !menuToggle) {
    return;
  }

  siteNav.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
  body.classList.remove("nav-open");
}

function openMenu() {
  if (!siteNav || !menuToggle) {
    return;
  }

  siteNav.classList.add("open");
  menuToggle.setAttribute("aria-expanded", "true");
  body.classList.add("nav-open");
}

function toggleMenu() {
  if (!siteNav || !menuToggle) {
    return;
  }

  const isOpen = siteNav.classList.contains("open");

  if (isOpen) {
    closeMenu();
  } else {
    openMenu();
  }
}

function highlightActiveLink(id) {
  navLinks.forEach((link) => {
    const isMatch = link.getAttribute("href") === `#${id}`;
    link.classList.toggle("active", isMatch);
  });
}

function setupReveal() {
  if (!("IntersectionObserver" in window)) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
    return;
  }

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      });
    },
    {
      threshold: 0.18,
      rootMargin: "0px 0px -48px 0px",
    }
  );

  revealItems.forEach((item) => revealObserver.observe(item));
}

function setupSectionObserver() {
  if (!sections.length || !("IntersectionObserver" in window)) {
    return;
  }

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          highlightActiveLink(entry.target.id);
        }
      });
    },
    {
      threshold: 0.45,
      rootMargin: "-15% 0px -40% 0px",
    }
  );

  sections.forEach((section) => sectionObserver.observe(section));
}

function openLightbox(src, alt, caption) {
  if (!lightbox || !lightboxImage || !lightboxCaption) {
    return;
  }

  lightboxImage.src = src;
  lightboxImage.alt = alt || "";
  lightboxCaption.textContent = caption || "";
  lightbox.classList.add("is-open");
  lightbox.setAttribute("aria-hidden", "false");
  body.classList.add("lightbox-open");
}

function closeLightbox() {
  if (!lightbox || !lightboxImage || !lightboxCaption) {
    return;
  }

  lightbox.classList.remove("is-open");
  lightbox.setAttribute("aria-hidden", "true");
  lightboxImage.src = "";
  lightboxImage.alt = "";
  lightboxCaption.textContent = "";
  body.classList.remove("lightbox-open");
}

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const nextTheme = body.classList.contains("light-mode") ? "light" : "dark";
    applyTheme(nextTheme);
  });
}

if (menuToggle) {
  menuToggle.addEventListener("click", toggleMenu);
}

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    closeMenu();
    highlightActiveLink(link.getAttribute("href").slice(1));
  });
});

lightboxTriggers.forEach((trigger) => {
  trigger.addEventListener("click", () => {
    openLightbox(
      trigger.dataset.lightboxSrc,
      trigger.dataset.lightboxAlt,
      trigger.dataset.lightboxCaption
    );
  });
});

if (lightboxClose) {
  lightboxClose.addEventListener("click", closeLightbox);
}

if (lightbox) {
  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) {
      closeLightbox();
    }
  });
}

mediaQuery.addEventListener("change", (event) => {
  if (!localStorage.getItem("theme")) {
    applyTheme(event.matches ? "light" : "dark", false);
  }
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 820) {
    closeMenu();
  }
});

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeLightbox();
    closeMenu();
  }
});

if (currentYear) {
  currentYear.textContent = new Date().getFullYear();
}

loadTheme();
setupReveal();
setupSectionObserver();
