(() => {
  const root = document.documentElement;
  const reduced = () => root.dataset.motion === 'reduced';
  const save = (key, value) => { try { localStorage.setItem(key, value); } catch {} };
  const read = key => { try { return localStorage.getItem(key); } catch { return null; } };
  const themeButton = document.getElementById('themeToggle');
  const themeLabel = () => {
    const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
    themeButton?.setAttribute('aria-label', `Switch to ${next} theme`);
  };
  themeLabel();
  themeButton?.addEventListener('click', () => {
    root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
    save('theme', root.dataset.theme);
    themeLabel();
  });
  matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
    if (!read('theme')) { root.dataset.theme = event.matches ? 'dark' : 'light'; themeLabel(); }
  });

  const nav = document.getElementById('siteNav');
  const menu = document.getElementById('menuToggle');
  const closeMenu = () => {
    nav?.classList.remove('open');
    menu?.setAttribute('aria-expanded', 'false');
    menu?.setAttribute('aria-label', 'Open navigation menu');
    document.body.classList.remove('nav-open');
  };
  menu?.addEventListener('click', () => {
    const open = !nav.classList.contains('open');
    nav.classList.toggle('open', open);
    menu.setAttribute('aria-expanded', String(open));
    menu.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');
    document.body.classList.toggle('nav-open', open);
  });
  nav?.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  window.addEventListener('resize', () => { if (innerWidth > 820) closeMenu(); });

  // Give the overview its own full-width row, preserving its original content.
  const extension = document.querySelector('.hero-extension');
  if (extension) document.querySelector('.hero-grid').append(extension);
  const animateIn = (element, delay = 0) => {
    if (reduced() || !element.animate) return;
    element.animate([
      { opacity: 0, transform: 'translateY(24px)' },
      { opacity: 1, transform: 'translateY(0)' }
    ], { duration: 850, delay, easing: 'cubic-bezier(.22,1,.36,1)', fill: 'backwards' });
  };
  function entrance() {
    const selectors = document.querySelector('.brutal-hero') ?
      '.brutal-header, .brutal-system-row, .brutal-title, .brutal-flow, .brutal-hero-footer' :
      '.nav-shell, .hero-copy, .hero-panel, .detail-gallery-header';
    document.querySelectorAll(selectors).forEach((element, i) => animateIn(element, i * 90));
  }
  entrance();
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        if (entry.target.getBoundingClientRect().top > 120) animateIn(entry.target);
        observer.unobserve(entry.target);
      });
    }, { threshold: .06 });
    document.querySelectorAll('.reveal:not(.hero-copy):not(.hero-panel):not(.detail-gallery-header)').forEach(element => observer.observe(element));
    const sectionObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        nav?.querySelectorAll('a').forEach(link => {
          const active = link.hash === `#${entry.target.id}`;
          link.classList.toggle('active', active);
          if (active) link.setAttribute('aria-current', 'location');
          else link.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-15% 0px -55% 0px' });
    document.querySelectorAll('section[id]').forEach(section => sectionObserver.observe(section));
  }

  const lightbox = document.getElementById('lightbox');
  const image = document.getElementById('lightboxImage');
  const caption = document.getElementById('lightboxCaption');
  const close = document.getElementById('lightboxClose');
  let returnFocus;
  const closeLightbox = () => {
    if (!lightbox?.classList.contains('is-open')) return;
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('lightbox-open');
    [...document.body.children].forEach(element => { if (element !== lightbox) element.inert = false; });
    returnFocus?.focus({ preventScroll: true });
  };
  if (lightbox) {
    lightbox.setAttribute('role', 'dialog');
    lightbox.setAttribute('aria-modal', 'true');
    lightbox.setAttribute('aria-label', 'Image preview');
  }
  document.querySelectorAll('[data-lightbox-src]').forEach(trigger => {
    trigger.addEventListener('click', () => {
      if (!lightbox) return;
      returnFocus = trigger;
      image.src = trigger.dataset.lightboxSrc;
      image.alt = trigger.dataset.lightboxAlt || '';
      caption.textContent = trigger.dataset.lightboxCaption || '';
      lightbox.classList.add('is-open');
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.classList.add('lightbox-open');
      [...document.body.children].forEach(element => { if (element !== lightbox) element.inert = true; });
      close.focus();
    });
  });
  close?.addEventListener('click', closeLightbox);
  lightbox?.addEventListener('click', event => { if (event.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') { closeLightbox(); closeMenu(); }
    if (event.key === 'Tab' && lightbox?.classList.contains('is-open')) { event.preventDefault(); close.focus(); }
  });

  const year = document.getElementById('currentYear');
  if (year) year.textContent = new Date().getFullYear();
  const clock = document.getElementById('landingClock');
  const updateClock = () => {
    if (clock) clock.textContent = new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Manila', hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(new Date()) + ' PHT';
  };
  if (clock) { updateClock(); setInterval(updateClock, 1000); }
  const words = ['WEBSITE_DEVELOPMENT', 'SYSTEMS_DESIGN', 'VISUAL_IDENTITY', 'ADMIN_SUPPORT'];
  const type = document.getElementById('landingTypewriter');
  let timer;
  function startWords() {
    clearTimeout(timer);
    if (!type) return;
    type.closest('[aria-live]')?.removeAttribute('aria-live');
    type.parentElement.setAttribute('aria-label', words.join(', ').replaceAll('_', ' '));
    type.setAttribute('aria-hidden', 'true');
    type.textContent = words[0];
    if (reduced()) return;
    let index = 0;
    const next = () => {
      if (document.hidden) { timer = setTimeout(next, 1000); return; }
      index = (index + 1) % words.length;
      type.textContent = words[index];
      animateIn(type);
      timer = setTimeout(next, 2800);
    };
    timer = setTimeout(next, 2800);
  }
  startWords();
})();
