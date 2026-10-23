/* K21 Series inner pages: the page hero, plus one quiet signature effect per page.
   Each block only runs when its element is on the page. site.js loads first. */
(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const isTouch = matchMedia('(hover: none)').matches;

  // ---------- admissions: build the 1,000 seats ----------
  const seatGrid = $('[data-seats]');
  if (seatGrid) seatGrid.innerHTML = '<i></i>'.repeat(1000);

  // ---------- FAQ: search + topic chips (works without GSAP too) ----------
  const faqList = $('.faq');
  if (faqList) {
    const items = $$('details', faqList), input = $('.faq-search input'), chips = $$('.chips button'), empty = $('.faq__empty');
    let topic = 'all';
    const apply = () => {
      const q = (input.value || '').trim().toLowerCase();
      let shown = 0;
      items.forEach(d => {
        const ok = (topic === 'all' || d.dataset.topic === topic) && (!q || d.textContent.toLowerCase().includes(q));
        d.hidden = !ok; if (ok) shown++;
      });
      empty.hidden = shown > 0;
    };
    input.addEventListener('input', apply);
    chips.forEach(c => c.addEventListener('click', () => {
      topic = c.dataset.topic;
      chips.forEach(o => o.setAttribute('aria-pressed', o === c));
      apply();
    }));
  }

  if (!window.gsap || !window.ScrollTrigger || reduce) {
    $$('.steps li').forEach(li => li.classList.add('on'));
    $$('.seats__grid i').forEach(i => i.classList.add('on'));
    $$('.funnel__bar').forEach(b => b.style.setProperty('--f', 1));
    $$('.eligible').forEach(e => e.classList.add('is-on'));
    return;
  }
  gsap.registerPlugin(ScrollTrigger);

  // ---------- page hero: lines rise, photo opens like a door ----------
  const ph = $('.phero');
  if (ph) {
    gsap.from('.phero__title .line > span', { yPercent: 110, duration: 1.2, stagger: 0.1, ease: 'power4.out' });
    gsap.from('.phero .crumbs, .phero .kicker, .phero__sub, .phero__btns', { y: 20, opacity: 0, duration: 1, stagger: 0.08, delay: 0.3, ease: 'power3.out' });
    if ($('.phero__photo')) {
      gsap.from('.phero__photo', { clipPath: 'inset(100% 0 0 0 round 300px 300px 24px 24px)', duration: 1.6, delay: 0.2, ease: 'expo.out' });
      gsap.fromTo('.phero__photo img', { yPercent: -8 }, { yPercent: 0, ease: 'none', scrollTrigger: { trigger: ph, start: 'top top', end: 'bottom top', scrub: true } });
    }
    if ($('.phero__chip')) gsap.from('.phero__chip', { scale: 0, opacity: 0, duration: 0.8, stagger: 0.15, delay: 1, ease: 'back.out(2)' });
    $$('.phero__chip').forEach((c, i) => gsap.to(c, { y: i % 2 ? 8 : -8, duration: 2.6 + i * 0.5, yoyo: true, repeat: -1, ease: 'sine.inOut', delay: 1.8 }));
  }

  // photos inside sections drift a little as you scroll past
  $$('.split__photo img, .pcard--photo .pcard__img img').forEach(img => {
    if (img.closest('.pcard--photo')) return;
    gsap.fromTo(img, { yPercent: -10 }, { yPercent: 0, ease: 'none', scrollTrigger: { trigger: img.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } });
  });
  $$('.split__photo').forEach(p => gsap.from(p, { clipPath: 'inset(0 0 100% 0 round 22px)', duration: 1.4, ease: 'expo.out', scrollTrigger: { trigger: p, start: 'top 85%' } }));

  // ---------- numbered steps: the line fills and each number lights up ----------
  $$('.steps').forEach(list => {
    list.insertAdjacentHTML('afterbegin', '<span class="steps__fill" aria-hidden="true"></span>');
    gsap.to($('.steps__fill', list), { scaleY: 1, ease: 'none', scrollTrigger: { trigger: list, start: 'top 70%', end: 'bottom 70%', scrub: true } });
    $$('li', list).forEach(li => {
      ScrollTrigger.create({ trigger: li, start: 'top 72%', onEnter: () => li.classList.add('on'), onLeaveBack: () => li.classList.remove('on') });
      gsap.from(li.children, { x: 24, opacity: 0, duration: 0.8, stagger: 0.06, ease: 'power3.out', scrollTrigger: { trigger: li, start: 'top 82%' } });
    });
  });

  // ---------- editorial rows: on phones the row in the middle of the screen lights up ----------
  if (isTouch) {
    const io = new IntersectionObserver(es => es.forEach(e => e.target.classList.toggle('is-on', e.isIntersecting)), { rootMargin: '-45% 0px -45% 0px' });
    $$('.row').forEach(r => io.observe(r));
  }
  $$('.rows').forEach(r => gsap.from($$('.row', r), { y: 30, opacity: 0, duration: 0.8, stagger: 0.08, ease: 'power3.out', scrollTrigger: { trigger: r, start: 'top 85%' } }));

  // ---------- statement + checklists ----------
  $$('.statement').forEach(s => gsap.from(s, { y: 40, opacity: 0, duration: 1.2, ease: 'power3.out', scrollTrigger: { trigger: s, start: 'top 85%' } }));
  $$('.checks').forEach(c => gsap.from($$('li', c), { y: 24, opacity: 0, duration: 0.7, stagger: 0.07, ease: 'power3.out', scrollTrigger: { trigger: c, start: 'top 85%' } }));

  // ---------- ABOUT: the motto words rise in, the emblem settles ----------
  if ($('.motto')) gsap.from('.motto__word > span', { yPercent: 105, duration: 1.2, stagger: 0.15, ease: 'power4.out', scrollTrigger: { trigger: '.motto', start: 'top 75%' } });
  if ($('.emblem img')) gsap.from('.emblem img', { scale: 0.85, opacity: 0, duration: 1.4, ease: 'expo.out', scrollTrigger: { trigger: '.emblem', start: 'top 80%' } });

  // ---------- EXAM: the year dial draws itself; exam months light up ----------
  const dial = $('[data-dial]');
  if (dial) {
    const svg = $('svg', dial), arc = $('.d-arc', svg), len = arc.getTotalLength();
    arc.style.strokeDasharray = len; arc.style.strokeDashoffset = len;
    gsap.to(arc, { strokeDashoffset: 0, ease: 'none', scrollTrigger: { trigger: dial, start: 'top 75%', end: 'bottom 45%', scrub: true } });
    gsap.from($$('.d-mark', svg), { scale: 0, transformOrigin: '50% 50%', duration: 0.8, stagger: 0.4, ease: 'back.out(3)', scrollTrigger: { trigger: dial, start: 'top 60%' } });
  }
  const ladder = $('.ladder');
  if (ladder) gsap.from($$('.ladder__bar', ladder), { scaleY: 0, duration: 1.2, stagger: 0.18, ease: 'expo.out', scrollTrigger: { trigger: ladder, start: 'top 80%' } });

  // ---------- LEARNING: the staircase builds step by step; three big words rise ----------
  if ($('.stairs')) gsap.from('.stair', { y: 60, opacity: 0, duration: 1, stagger: 0.14, ease: 'power3.out', scrollTrigger: { trigger: '.stairs', start: 'top 80%' } });
  if ($('.anywhere')) gsap.from('.anywhere b > span', { yPercent: 105, duration: 1.1, stagger: 0.14, ease: 'power4.out', scrollTrigger: { trigger: '.anywhere', start: 'top 78%' } });

  // ---------- CAREERS: the selection funnel fills stage by stage ----------
  const funnel = $('.funnel');
  if (funnel) ScrollTrigger.create({ trigger: funnel, start: 'top 75%', once: true, onEnter: () => $$('.funnel__bar', funnel).forEach((b, i) => setTimeout(() => b.style.setProperty('--f', 1), i * 260)) });

  // ---------- ADMISSIONS: the eligibility tick draws; 1,000 seats fill as you scroll ----------
  $$('.eligible').forEach(e => ScrollTrigger.create({ trigger: e, start: 'top 80%', once: true, onEnter: () => e.classList.add('is-on') }));
  if (seatGrid) {
    const seats = $$('i', seatGrid), num = $('[data-seat-count]');
    let lit = 0;
    ScrollTrigger.create({
      trigger: seatGrid, start: 'top 80%', end: 'bottom 45%', scrub: true,
      onUpdate: s => {
        const n = Math.round(s.progress * seats.length);
        if (n === lit) return;
        for (let i = Math.min(n, lit); i < Math.max(n, lit); i++) seats[i].classList.toggle('on', i < n);
        lit = n; num.textContent = n.toLocaleString('en-IN');
      }
    });
  }

  // ---------- CONTACT: the map rises in, the pin card follows ----------
  if ($('.mapbox')) gsap.from('.mapbox__card', { y: 30, opacity: 0, duration: 1, delay: 0.2, ease: 'back.out(1.6)', scrollTrigger: { trigger: '.mapbox', start: 'top 80%' } });

  // ---------- final call to action ----------
  if ($('.pcta')) gsap.from('.pcta > *', { y: 40, opacity: 0, duration: 1, stagger: 0.1, ease: 'power3.out', scrollTrigger: { trigger: '.pcta', start: 'top 70%' } });
})();
