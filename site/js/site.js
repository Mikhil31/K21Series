/* K21 Series: what every page shares. Buttons, nav, header, phone menu, booking pill,
   Lenis smooth scroll (desktop only), scroll reveals, counters, booking/contact forms.
   Page-specific motion lives in main.js (home) and pages.js (inner pages). */
(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const isTouch = matchMedia('(hover: none)').matches;

  // ---------- buttons: pixel fill layer + rolling label (+ arrow on saffron buttons) ----------
  $$('.btn').forEach(b => {
    const t = b.textContent.trim();
    const arrow = b.classList.contains('btn--saffron') ? '<i class="btn__ic" aria-hidden="true"><b>→</b><b>→</b></i>' : '';
    b.innerHTML = `<span class="btn__fill" aria-hidden="true"></span><span class="btn__label"><span>${t}</span><span aria-hidden="true">${t}</span></span>${arrow}`;
  });
  // nav links: the label rolls up into an emerald copy while a saffron rule draws underneath
  $$('.nav a').forEach(a => {
    const t = a.textContent.trim();
    a.innerHTML = `<span class="nav__roll"><span>${t}</span><span aria-hidden="true">${t}</span></span>`;
  });
  // mark the page we're on in both menus
  const here = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  $$('.nav a, .mobile-menu a').forEach(a => { if (a.getAttribute('href') === here) a.setAttribute('aria-current', 'page'); });

  // ---------- header: hide on scroll down, show on scroll up; phone booking pill ----------
  const header = $('.header'), fab = $('.book-fab');
  const fabAfter = $('[data-fab-after]'), fabHide = $$('[data-fab-hide]');
  let lastY = 0;
  const onScroll = () => {
    const y = scrollY;
    header.classList.toggle('is-scrolled', y > 10);
    header.classList.toggle('is-hidden', y > 500 && y > lastY + 2 && !document.body.classList.contains('menu-open'));
    if (y < lastY - 2) header.classList.remove('is-hidden');
    lastY = y;
    if (!fab) return;
    const start = Math.max(innerHeight * 0.6, fabAfter ? fabAfter.offsetTop + fabAfter.offsetHeight - innerHeight : 0);
    // hide it once a real booking button or the contact details are on screen
    fab.classList.toggle('is-on', y > start && fabHide.every(el => el.getBoundingClientRect().top > innerHeight));
  };
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ---------- mobile menu ----------
  const menuBtn = $('.menu-btn'), menu = $('.mobile-menu');
  const setMenu = open => {
    menuBtn.setAttribute('aria-expanded', open);
    menu.hidden = !open;
    document.body.classList.toggle('menu-open', open);
    document.body.style.overflow = open ? 'hidden' : '';
    if (open) header.classList.remove('is-hidden');
  };
  menuBtn.addEventListener('click', () => setMenu(menu.hidden));
  $$('a', menu).forEach(a => a.addEventListener('click', () => setMenu(false)));

  // ---------- booking and contact forms: no server yet, so they open a ready-written
  // email (or WhatsApp message) with everything the visitor typed ----------
  const OFFICE_MAIL = 'contactmseducationfoundation@gmail.com', OFFICE_WA = '919449904569';
  $$('form[data-mail]').forEach(form => {
    const status = $('.form__status', form);
    const compose = () => {
      const lines = $$('[name]', form).filter(f => f.value.trim()).map(f => `${f.dataset.label || f.name}: ${f.value.trim()}`);
      return lines.join('\n');
    };
    form.addEventListener('submit', e => {
      e.preventDefault();
      if (!form.reportValidity()) return;
      const via = e.submitter && e.submitter.value === 'whatsapp' ? 'whatsapp' : 'mail';
      const subject = (e.submitter && e.submitter.dataset.subject) || form.dataset.mail;
      const body = `${subject}\n\n${compose()}`;
      if (via === 'whatsapp') window.open(`https://wa.me/${OFFICE_WA}?text=${encodeURIComponent(body)}`, '_blank', 'noopener');
      else location.href = `mailto:${OFFICE_MAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(compose())}`;
      if (status) status.textContent = via === 'whatsapp'
        ? 'WhatsApp is opening with your details. Press send there to reach us.'
        : 'Your email app is opening with your details filled in. Press send there to reach us.';
    });
  });

  // ---------- counters ----------
  const fmt = (n, el) => (el.hasAttribute('data-comma') ? n.toLocaleString('en-IN') : n) + (el.dataset.suffix || '');
  const countUp = el => {
    const end = +el.dataset.count;
    if (reduce || !window.gsap) { el.textContent = fmt(end, el); return; }
    const o = { v: 0 };
    gsap.to(o, { v: end, duration: 1.8, ease: 'power3.out', onUpdate: () => (el.textContent = fmt(Math.round(o.v), el)) });
  };

  // No GSAP (offline / blocked CDN) or reduced motion: show everything in its final state.
  if (!window.gsap || !window.ScrollTrigger || reduce) {
    $$('[data-count]').forEach(el => (el.textContent = fmt(+el.dataset.count, el)));
    document.documentElement.classList.add('no-motion');
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  // ---------- Lenis smooth scroll (desktop) ----------
  if (window.Lenis && !isTouch) {
    const lenis = new Lenis({ lerp: 0.1 });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(t => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
    $$('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
      const id = a.getAttribute('href');
      if (id.length > 1 && $(id)) { e.preventDefault(); lenis.scrollTo(id, { offset: -90 }); }
    }));
    window.K21Lenis = lenis;
  }

  // ---------- generic reveals ----------
  const from = (sel, vars, trig) => { const els = typeof sel === 'string' ? $$(sel) : sel; if (els.length) gsap.from(els, { ...vars, scrollTrigger: { trigger: trig || els[0], start: 'top 86%' } }); };
  $$('[data-fade]').forEach(el => from([el], { y: 30, opacity: 0, duration: 1, ease: 'power3.out' }));
  $$('.h2, .kicker').forEach(el => {
    if (el.closest('.orbit') || el.closest('.phero')) return;
    from([el], { y: 40, opacity: 0, duration: 1.1, ease: 'power3.out' });
  });
  // groups of cards rise one after another
  $$('[data-stagger]').forEach(g => from([...g.children], { y: 40, opacity: 0, duration: 0.9, stagger: 0.09, ease: 'power3.out' }, g));
  $$('[data-count]').forEach(el => ScrollTrigger.create({ trigger: el, start: 'top 88%', once: true, onEnter: () => countUp(el) }));

  // ---------- contact cards + map, footer ----------
  if ($('.ccard')) gsap.fromTo('.ccard', { x: -30, opacity: 0 }, { x: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: 'power3.out', clearProps: 'all', scrollTrigger: { trigger: '.contact__cards', start: 'top 86%' } });
  from('.contact__map', { y: 50, rotate: 2, opacity: 0, duration: 1.2, ease: 'expo.out' });
  if ($('.footer__giant')) gsap.from('.footer__giant', { yPercent: 60, opacity: 0, duration: 1.4, ease: 'expo.out', scrollTrigger: { trigger: '.footer__giant', start: 'top 98%' } });
  gsap.from('.footer__top > *', { y: 30, opacity: 0, duration: 0.9, stagger: 0.08, ease: 'power3.out', scrollTrigger: { trigger: '.footer', start: 'top 85%' } });

  addEventListener('load', () => ScrollTrigger.refresh());
})();
