/* K21 Series home page motion (GSAP + ScrollTrigger). The shared header, menu, buttons,
   smooth scroll, reveals and counters are in site.js, which loads first. */
(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const clamp01 = v => Math.max(0, Math.min(1, v));
  const ease3 = t => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  const easeOut = t => 1 - Math.pow(1 - t, 3);
  const rand = (a, b) => a + Math.random() * (b - a);
  const isTouch = matchMedia('(hover: none)').matches;

  // ---------- flags marquee content (12 flags from the poster) ----------
  const flags = ['us', 'gb', 'ca', 'au', 'de', 'fr', 'ae', 'sg', 'jp', 'in', 'za', 'br'];
  $('.marquee--flags .marquee__track').innerHTML = [...flags, ...flags, ...flags, ...flags]
    .map(c => `<img src="https://flagcdn.com/w80/${c}.png" alt="" loading="lazy" width="56" height="38">`).join('');

  // ---------- era: split paragraph into words ----------
  const era = $('[data-words]');
  const hl = new Set(['one', 'centralized', 'global', 'system:', 'same', 'thing', 'everywhere.']);
  era.innerHTML = era.textContent.trim().split(/\s+/).map(w => `<span class="w${hl.has(w.toLowerCase()) ? ' hl' : ''}">${w}</span>`).join(' ');

  // No GSAP (offline / blocked CDN) or reduced motion: show everything in its final state.
  if (!window.gsap || !window.ScrollTrigger || reduce) {
    $$('.era__text .w').forEach(w => w.classList.add('on'));
    $$('.journey__steps li').forEach(li => li.classList.add('on'));
    $$('.tick').forEach(t => t.classList.add('on'));
    $('.orbit').classList.add('is-static');
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  // =====================================================================
  // HERO "193 → 1": photos and the 12 poster flags float around the hero like balls.
  // Grab any of them (mouse or finger) and throw it: it bounces off the edges, the
  // headline and the other tiles, and never leaves the hero. Scrolling then pulls
  // every tile into the arch while the counter runs 193 systems down to 1.
  // =====================================================================
  const hero = $('.hero');
  hero.classList.add('is-anim');
  const stage = $('.hero__stage'), field = $('.hero__field'), media = $('.hero__media'), heroText = $('.hero__text');
  const arch = $('.hero__arch'), count = $('.hero__count'), countNum = $('.hero__count b');
  const lines = $$('.hero__title .line > span');
  const chips = $$('.chip');
  const photoIds = ['1642140076947-7d410aaaa911', '1659985281435-d8d3ea55b55c', '1623303366639-0e330d7c3d9f', '1604177091072-b7b677a077f6',
    '1623863568368-69e4cbe6cc0b', '1692269726203-fa0d613eec37', '1774437561669-de9e9c523baa', '1522661067900-ab829854a57f',
    '1637589316488-6d4c41b335cd', '1692269725911-87697c558be1', '1629306262232-1f854b4b0b13', '1692269725827-699e04a11cdf'];
  const unsplash = (id, w) => `https://images.unsplash.com/photo-${id}?w=${w}&q=60&auto=format&fit=crop`;
  const sqColors = ['#F7B955', '#059669', '#B8914A', '#F7B955', '#047857', '#EAD9A6'];
  const tiles = [];
  const addTile = (el, kind) => {
    el.className = `h-tile h-tile--${kind}`; el.draggable = false; field.appendChild(el);
    tiles.push({ el, kind, spin: rand(-7, 7), wob: rand(0, 6.3), x: 0, y: 0, vx: 0, vy: 0, da: rand(0, 6.3), ds: rand(10, 22), placed: false });
  };
  photoIds.forEach(id => { const im = new Image(); im.alt = ''; im.decoding = 'async'; im.src = unsplash(id, 260); addTile(im, 'photo'); });
  flags.forEach(c => { const im = new Image(); im.alt = ''; im.src = `https://flagcdn.com/w80/${c}.png`; addTile(im, 'flag'); });
  sqColors.forEach(col => { const s = document.createElement('i'); s.style.background = col; addTile(s, 'sq'); });
  tiles.sort(() => Math.random() - 0.5);

  // play area (stage coordinates) and the headline block the tiles bounce off
  let hcx = 0, hcy = 0, hphone = false;
  // solid blocks the tiles bounce off: the headline column and the big counter
  const box = { l: 0, t: 0, r: 0, b: 0 }, walls = [];
  const inWall = (t, w, m = 0) => t.x + t.rad + m > w.l && t.x - t.rad - m < w.r && t.y + t.rad + m > w.t && t.y - t.rad - m < w.b;
  const hitsWall = (t, m = 0) => walls.some(w => inWall(t, w, m));
  const measureWalls = () => {
    const sr = stage.getBoundingClientRect(), pad = hphone ? 6 : 14;
    walls.length = 0;
    [[heroText, pad], [countNum, pad], [$('.hero__count-label'), 4]].forEach(([el, pd]) => {
      const r = el.getBoundingClientRect();
      walls.push({ l: r.left - sr.left - pd, t: r.top - sr.top - pd, r: r.right - sr.left + pd, b: r.bottom - sr.top + pd });
    });
  };
  const keepIn = t => { t.x = Math.max(box.l + t.rad, Math.min(box.r - t.rad, t.x)); t.y = Math.max(box.t + t.rad, Math.min(box.b - t.rad, t.y)); };
  const sizeHero = () => {
    hphone = innerWidth < 760;
    const sr = stage.getBoundingClientRect(), mr = media.getBoundingClientRect();
    hcx = mr.left - sr.left + mr.width / 2;
    hcy = mr.top - sr.top + mr.height / 2;
    const headerH = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header-h')) || 80;
    box.l = 6; box.r = sr.width - 6; box.t = headerH + 10; box.b = sr.height - (hphone ? 74 : 50);
    measureWalls();
    tiles.forEach((t, k) => {
      if (t.kind === 'photo') { t.w = (hphone ? rand(50, 66) : rand(76, 118)) | 0; t.h = (t.w * (k % 3 ? 0.75 : 1)) | 0; }
      else if (t.kind === 'flag') { t.w = hphone ? 32 : 44; t.h = hphone ? 21 : 29; }
      else { t.w = (hphone ? rand(12, 20) : rand(16, 28)) | 0; t.h = (t.w * 0.8) | 0; }
      t.rad = (t.w + t.h) / 4;
      t.el.style.width = t.w + 'px'; t.el.style.height = t.h + 'px';
    });
    // first layout: drop every tile somewhere free, outside the headline
    tiles.forEach(t => {
      if (t.placed) return keepIn(t);
      for (let tries = 0; tries < 80; tries++) {
        t.x = rand(box.l + t.rad, box.r - t.rad); t.y = rand(box.t + t.rad, box.b - t.rad);
        if (!hitsWall(t, 4) && !tiles.some(o => o !== t && o.placed && Math.hypot(o.x - t.x, o.y - t.y) < o.rad + t.rad + 4)) break;
      }
      t.placed = true;
    });
  };

  // grab + throw (pointer events cover mouse and touch)
  let hDrag = null, heroP = 0;
  const stageXY = e => { const r = stage.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; };
  tiles.forEach(t => t.el.addEventListener('pointerdown', e => {
    if (heroP > 0.03 || hDrag) return;
    e.preventDefault();
    try { t.el.setPointerCapture(e.pointerId); } catch (err) { /* capture is optional */ }
    const p = stageXY(e);
    hDrag = { t, id: e.pointerId, ox: p.x - t.x, oy: p.y - t.y, lx: p.x, ly: p.y, lt: performance.now() };
    t.vx = t.vy = 0; t.el.classList.add('is-drag'); hero.classList.add('has-thrown');
  }));
  addEventListener('pointermove', e => {
    if (!hDrag || e.pointerId !== hDrag.id) return;
    const p = stageXY(e), now = performance.now(), dt = Math.max(8, now - hDrag.lt) / 1000, t = hDrag.t;
    t.vx = t.vx * 0.4 + ((p.x - hDrag.lx) / dt) * 0.6; t.vy = t.vy * 0.4 + ((p.y - hDrag.ly) / dt) * 0.6;
    t.x = p.x - hDrag.ox; t.y = p.y - hDrag.oy; keepIn(t);
    hDrag.lx = p.x; hDrag.ly = p.y; hDrag.lt = now;
  }, { passive: true });
  const hDrop = e => {
    if (!hDrag || (e && e.pointerId !== hDrag.id)) return;
    const t = hDrag.t, sp = Math.hypot(t.vx, t.vy), max = hphone ? 1800 : 2600;
    if (performance.now() - hDrag.lt > 90) { t.vx = 0; t.vy = 0; } // held still before letting go: just place it
    else if (sp > max) { t.vx *= max / sp; t.vy *= max / sp; }
    t.el.classList.remove('is-drag'); hDrag = null;
  };
  addEventListener('pointerup', hDrop); addEventListener('pointercancel', hDrop);

  const stepPhysics = (dt, time) => {
    const bounce = 0.72;
    tiles.forEach(t => {
      if (hDrag && hDrag.t === t) return;
      // a slow, wandering float that throws gradually settle back into
      t.da += Math.sin(time * 0.35 + t.wob) * dt * 0.6;
      const k = 1 - Math.exp(-dt * 0.9);
      t.vx += (Math.cos(t.da) * t.ds - t.vx) * k; t.vy += (Math.sin(t.da) * t.ds - t.vy) * k;
      t.x += t.vx * dt; t.y += t.vy * dt;
      if (t.x - t.rad < box.l) { t.x = box.l + t.rad; t.vx = Math.abs(t.vx) * bounce; t.da = Math.PI - t.da; }
      if (t.x + t.rad > box.r) { t.x = box.r - t.rad; t.vx = -Math.abs(t.vx) * bounce; t.da = Math.PI - t.da; }
      if (t.y - t.rad < box.t) { t.y = box.t + t.rad; t.vy = Math.abs(t.vy) * bounce; t.da = -t.da; }
      if (t.y + t.rad > box.b) { t.y = box.b - t.rad; t.vy = -Math.abs(t.vy) * bounce; t.da = -t.da; }
      // solid blocks: push out along the shallowest side
      for (const wall of walls) {
        if (!inWall(t, wall)) continue;
        // only sides with room for the tile between the block and the hero edge count
        const fit = 2 * t.rad, no = Infinity;
        const dl = wall.l - box.l >= fit ? t.x + t.rad - wall.l : no, dr = box.r - wall.r >= fit ? wall.r - (t.x - t.rad) : no;
        const dtp = wall.t - box.t >= fit ? t.y + t.rad - wall.t : no, db = box.b - wall.b >= fit ? wall.b - (t.y - t.rad) : no;
        const m = Math.min(dl, dr, dtp, db);
        if (m === no) continue;
        if (m === dl) { t.x -= dl; t.vx = -Math.abs(t.vx) * bounce; }
        else if (m === dr) { t.x += dr; t.vx = Math.abs(t.vx) * bounce; }
        else if (m === dtp) { t.y -= dtp; t.vy = -Math.abs(t.vy) * bounce; }
        else { t.y += db; t.vy = Math.abs(t.vy) * bounce; }
        t.da = Math.atan2(t.vy, t.vx);
      }
    });
    // tile against tile: equal-mass bounce; a held tile acts like a solid paddle
    for (let i = 0; i < tiles.length; i++) for (let j = i + 1; j < tiles.length; j++) {
      const a = tiles[i], b = tiles[j];
      const dx = b.x - a.x, dy = b.y - a.y, min = a.rad + b.rad, d2 = dx * dx + dy * dy;
      if (d2 >= min * min || d2 === 0) continue;
      const d = Math.sqrt(d2), nx = dx / d, ny = dy / d, over = min - d;
      const aHeld = hDrag && hDrag.t === a, bHeld = hDrag && hDrag.t === b;
      const wa = aHeld ? 0 : bHeld ? 1 : 0.5, wb = bHeld ? 0 : aHeld ? 1 : 0.5;
      a.x -= nx * over * wa; a.y -= ny * over * wa; b.x += nx * over * wb; b.y += ny * over * wb;
      const rel = (b.vx - a.vx) * nx + (b.vy - a.vy) * ny;
      if (rel < 0) {
        const imp = -(1 + 0.85) * rel;
        if (!aHeld) { a.vx -= nx * imp * wa; a.vy -= ny * imp * wa; }
        if (!bHeld) { b.vx += nx * imp * wb; b.vy += ny * imp * wb; }
      }
    }
  };

  let heroVisible = true, lastNum = 193, chipsOn = false;
  const t0 = performance.now();
  let hLast = t0;
  ScrollTrigger.create({ trigger: hero, start: 'top top', end: 'bottom bottom', scrub: true, onUpdate: s => { heroP = s.progress; hero.classList.toggle('is-gathering', heroP > 0.03); } });
  new IntersectionObserver(([e]) => (heroVisible = e.isIntersecting)).observe(hero);

  gsap.from(lines, { yPercent: 115, duration: 1.2, stagger: 0.12, ease: 'power4.out' });
  gsap.from('.hero .eyebrow, .hero__sub, .hero__btns, .hero__cue', { y: 20, opacity: 0, duration: 1, stagger: 0.1, delay: 0.4, ease: 'power3.out' });
  gsap.from('.hero__count', { scale: 0.6, opacity: 0, duration: 1.2, delay: 0.3, ease: 'expo.out', onComplete: measureWalls });
  gsap.set(chips, { scale: 0, opacity: 0 });
  const cue = $('.hero__cue'), hint = $('.hero__hint');
  sizeHero();

  const heroFrame = now => {
    requestAnimationFrame(heroFrame);
    const dt = Math.min(0.033, (now - hLast) / 1000); hLast = now;
    if (!heroVisible) return;
    const time = (now - t0) / 1000;
    const introT = clamp01((time - 0.2) / 1.4);
    stepPhysics(dt, time);
    const p = heroP;
    const conv = ease3(clamp01((p - 0.04) / 0.48));
    tiles.forEach((t, k) => {
      const enter = easeOut(clamp01(introT * 1.6 - k * 0.022));
      const ci = clamp01(conv * 1.35 - (k / tiles.length) * 0.35);
      const x = t.x + (hcx - t.x) * ci, y = t.y + (hcy - t.y) * ci;
      const held = hDrag && hDrag.t === t;
      const rot = held ? Math.max(-18, Math.min(18, t.vx * 0.01)) : t.spin + Math.max(-10, Math.min(10, t.vx * 0.012));
      const sc = (0.6 + enter * 0.4) * (1 - ci * 0.85) * (held ? 1.12 : 1);
      t.el.style.transform = `translate(${(x - t.w / 2).toFixed(1)}px, ${(y - t.h / 2).toFixed(1)}px) rotate(${(rot * (1 - ci)).toFixed(1)}deg) scale(${sc.toFixed(3)})`;
      t.el.style.opacity = (enter * (1 - clamp01((ci - 0.7) / 0.3))).toFixed(3);
    });
    const n = Math.max(1, Math.round(193 - 192 * conv));
    if (n !== lastNum) { countNum.textContent = n; lastNum = n; count.classList.toggle('is-one', n === 1); }
    const countFade = clamp01((p - 0.6) / 0.08);
    count.style.opacity = (1 - countFade).toFixed(3);
    count.style.scale = (1 + countFade * 0.25).toFixed(3);
    const open = ease3(clamp01((p - 0.67) / 0.22));
    arch.style.clipPath = `circle(${(open * 78).toFixed(2)}% at 50% 50%)`;
    arch.firstElementChild.style.transform = `scale(${(1.25 - open * 0.25).toFixed(3)})`;
    if (open > 0.85 !== chipsOn) {
      chipsOn = !chipsOn;
      gsap.to(chips, { scale: chipsOn ? 1 : 0, opacity: chipsOn ? 1 : 0, duration: chipsOn ? 0.7 : 0.3, stagger: chipsOn ? 0.1 : 0, ease: chipsOn ? 'back.out(2.2)' : 'power2.in', overwrite: true });
    }
    const early = 1 - clamp01(p / 0.06);
    cue.style.opacity = early.toFixed(3);
    hint.style.opacity = (time > 2.2 && !hero.classList.contains('has-thrown') ? early : 0).toFixed(3);
  };
  requestAnimationFrame(heroFrame);
  chips.forEach((c, i) => gsap.to(c, { translate: `0 ${i % 2 ? 8 : -8}px`, duration: 2.4 + i * 0.4, yoyo: true, repeat: -1, ease: 'sine.inOut' }));
  // the watermark crest stays put and warms from emerald to saffron as you scroll
  gsap.fromTo('.hero__crest-alt', { opacity: 0 }, { opacity: 1, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom bottom', scrub: true } });

  // ---------- stacked cards: each one arrives tilted, lands square and fully covers the one below
  // (dims with an overlay, never a filter) ----------
  const cards = $$('.card');
  const tilts = [-4, 4.5, -3.5, 4];
  cards.forEach((c, i) => {
    gsap.fromTo(c, { rotate: tilts[i % tilts.length], y: 90 }, { rotate: 0, y: 0, ease: 'power1.out', scrollTrigger: { trigger: c, start: 'top bottom', end: 'top 22%', scrub: true } });
    const next = cards[i + 1];
    if (next) gsap.fromTo(c, { scale: 1, '--dim': 0 }, { scale: 0.94, '--dim': 0.3, ease: 'none', scrollTrigger: { trigger: next, start: 'top 85%', end: 'top 22%', scrub: true } });
  });
  gsap.from('.stack__lead', { y: 30, opacity: 0, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: '.stack__lead', start: 'top 88%' } });

  // ---------- era: words light up as you read ----------
  const words = $$('.era__text .w');
  ScrollTrigger.create({ trigger: era, start: 'top 80%', end: 'bottom 45%', scrub: true, onUpdate: s => { const n = Math.round(s.progress * words.length); words.forEach((w, i) => w.classList.toggle('on', i < n)); } });

  // ---------- facts: photos drift, word sits still and swaps at the seam ----------
  $$('.fact').forEach(f => {
    gsap.fromTo($('img', f), { scale: 1.18 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: f, start: 'top bottom', end: 'bottom top', scrub: true } });
    gsap.fromTo($('small', f), { opacity: 0, y: 20 }, { opacity: 1, y: 0, ease: 'none', scrollTrigger: { trigger: f, start: 'top 60%', end: 'top 20%', scrub: true } });
  });

  // ---------- open to anyone ----------
  gsap.fromTo('.open__a', { xPercent: -14 }, { xPercent: 0, ease: 'none', scrollTrigger: { trigger: '.open', start: 'top bottom', end: 'top 25%', scrub: true } });
  gsap.fromTo('.open__b', { xPercent: 14 }, { xPercent: 0, ease: 'none', scrollTrigger: { trigger: '.open', start: 'top bottom', end: 'top 25%', scrub: true } });
  gsap.fromTo('.open__photo img', { yPercent: -12 }, { yPercent: 0, ease: 'none', scrollTrigger: { trigger: '.open__photo', start: 'top bottom', end: 'bottom top', scrub: true } });
  gsap.from('.open__photo', { clipPath: 'inset(100% 0 0 0 round 200px 200px 20px 20px)', duration: 1.4, ease: 'expo.out', scrollTrigger: { trigger: '.open__photo', start: 'top 85%' } });

  // ---------- who: a deck that deals out (desktop), a swipeable carousel (phone) ----------
  const whoCards = $$('.who__card');
  whoCards.forEach(c => c.insertAdjacentHTML('beforeend', '<span class="shine" aria-hidden="true"></span>'));
  const mmWho = gsap.matchMedia();
  mmWho.add('(min-width: 1100px)', () => {
    const rail = $('.who__rail');
    const tl = gsap.timeline({ scrollTrigger: { trigger: rail, start: 'top 85%', end: 'top 30%', scrub: 0.8 } });
    whoCards.forEach((c, i) => {
      tl.fromTo(c, {
        x: () => rail.getBoundingClientRect().left + rail.offsetWidth / 2 - (c.getBoundingClientRect().left + c.offsetWidth / 2),
        y: 60 + i * 6, rotate: (i - 1.5) * 7, scale: 0.92,
      }, { x: 0, y: 0, rotate: 0, scale: 1, ease: 'power2.out' }, 0);
    });
    // 3D tilt + light that follows the cursor
    const off = [];
    whoCards.forEach(c => {
      const move = e => {
        const r = c.getBoundingClientRect();
        const nx = (e.clientX - r.left) / r.width - 0.5, ny = (e.clientY - r.top) / r.height - 0.5;
        gsap.to(c, { rotationY: nx * 12, rotationX: -ny * 10, transformPerspective: 900, duration: 0.5, ease: 'power3.out' });
        c.style.setProperty('--mx', `${(nx + 0.5) * 100}%`); c.style.setProperty('--my', `${(ny + 0.5) * 100}%`);
      };
      const leave = () => gsap.to(c, { rotationY: 0, rotationX: 0, duration: 0.8, ease: 'elastic.out(1, .5)' });
      c.addEventListener('pointermove', move); c.addEventListener('pointerleave', leave);
      off.push(() => { c.removeEventListener('pointermove', move); c.removeEventListener('pointerleave', leave); });
    });
    return () => off.forEach(f => f());
  });
  mmWho.add('(min-width: 761px) and (max-width: 1099px)', () => {
    gsap.from(whoCards, { y: 70, opacity: 0, rotate: i => (i % 2 ? 3 : -3), duration: 1, stagger: 0.12, ease: 'power3.out', scrollTrigger: { trigger: '.who__rail', start: 'top 85%' } });
  });
  mmWho.add('(max-width: 760px)', () => {
    const rail = $('.who__rail'), dots = $$('.who__dots i');
    const onRail = () => {
      const rc = rail.getBoundingClientRect(), mid = rc.left + rc.width / 2;
      let best = 0, bestD = 1e9;
      whoCards.forEach((c, i) => {
        const r = c.getBoundingClientRect();
        const d = (r.left + r.width / 2 - mid) / r.width;
        const ad = Math.min(Math.abs(d), 1.2);
        c.style.transform = `perspective(900px) rotateY(${(-d * 16).toFixed(2)}deg) scale(${(1 - ad * 0.09).toFixed(3)})`;
        c.style.opacity = (1 - ad * 0.35).toFixed(3);
        if (Math.abs(d) < bestD) { bestD = Math.abs(d); best = i; }
      });
      whoCards.forEach((c, i) => c.classList.toggle('is-active', i === best));
      dots.forEach((d, i) => d.classList.toggle('on', i === best));
    };
    rail.addEventListener('scroll', onRail, { passive: true });
    onRail();
    gsap.from(whoCards, { x: 160, opacity: 0, rotate: 6, duration: 1, stagger: 0.1, ease: 'power3.out', scrollTrigger: { trigger: rail, start: 'top 85%' }, onComplete: onRail });
    return () => rail.removeEventListener('scroll', onRail);
  });

  // ---------- Sir MV ----------
  gsap.from('.mv__frame img', { clipPath: 'inset(100% 0 0 0)', scale: 1.15, duration: 1.6, ease: 'expo.out', scrollTrigger: { trigger: '.mv__fig', start: 'top 80%' } });
  gsap.fromTo('.mv__fig', { y: 60 }, { y: -30, ease: 'none', scrollTrigger: { trigger: '.mv', start: 'top bottom', end: 'bottom top', scrub: true } });
  gsap.from('.mv__facts li', { y: 24, opacity: 0, duration: 0.8, stagger: 0.12, ease: 'power3.out', scrollTrigger: { trigger: '.mv__facts', start: 'top 90%' } });

  // ---------- compare: one graduation cord hangs from the first row down to the active row ----------
  const rows = $$('.crow:not(.crow--head)');
  const table = $('.compare__table');
  table.insertAdjacentHTML('beforeend', '<i class="rope" aria-hidden="true"><i class="rope__cord"></i><i class="rope__tassel"></i></i>');
  const rope = $('.rope'), ropeTassel = $('.rope__tassel');
  let activeRow = null;
  const setRow = r => {
    if (r === activeRow) return;
    if (activeRow) activeRow.classList.remove('is-on');
    activeRow = r;
    rope.classList.toggle('is-on', !!r);
    if (!r) { rope.style.height = '0px'; return; }
    r.classList.add('is-on');
    rope.style.top = rows[0].offsetTop + 'px';
    rope.style.height = (r.offsetTop + r.offsetHeight - rows[0].offsetTop - 6) + 'px';
    ropeTassel.classList.remove('swing'); void ropeTassel.offsetWidth; ropeTassel.classList.add('swing');
  };
  ScrollTrigger.batch(rows, { start: 'top 92%', onEnter: b => gsap.from(b, { y: 26, opacity: 0, duration: 0.8, stagger: 0.07, ease: 'power3.out' }) });
  if (!isTouch) {
    const tag = $('.compare__tag'), tagText = $('.compare__tag-text'), sec = $('.compare');
    // GSAP owns the tag's whole transform (position and pop), so CSS never fights it
    gsap.set(tag, { scale: 0.6 });
    const pop = on => gsap.to(tag, { scale: on ? 1 : 0.6, duration: on ? 0.4 : 0.25, ease: on ? 'back.out(2)' : 'power2.in', overwrite: 'auto' });
    rows.forEach(r => r.addEventListener('pointerenter', () => { setRow(r); tagText.textContent = r.dataset.tag; if (!tag.classList.contains('is-on')) pop(true); tag.classList.add('is-on'); }));
    table.addEventListener('pointerleave', () => { setRow(null); tag.classList.remove('is-on'); pop(false); });
    const tagX = gsap.quickTo(tag, 'x', { duration: 0.45, ease: 'power3.out' }), tagY = gsap.quickTo(tag, 'y', { duration: 0.45, ease: 'power3.out' });
    sec.addEventListener('pointermove', e => { const r = sec.getBoundingClientRect(); tagX(e.clientX - r.left + 18); tagY(e.clientY - r.top + 18); });
  } else {
    // phones: the row crossing the middle of the screen is the active one
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) setRow(e.target); }), { rootMargin: '-46% 0px -46% 0px' });
    rows.forEach(r => io.observe(r));
    ScrollTrigger.create({ trigger: table, start: 'top 54%', end: 'bottom 46%', onLeaveBack: () => setRow(null), onLeave: () => setRow(null) });
  }

  // ---------- numbers band ----------
  gsap.fromTo('.numbers__crest', { rotate: -12, scale: 0.85 }, { rotate: 8, scale: 1, ease: 'none', scrollTrigger: { trigger: '.numbers', start: 'top bottom', end: 'bottom top', scrub: true } });

  // ---------- journey: horizontal on desktop, vertical line on phone ----------
  const steps = $$('.journey__steps li');
  const mm = gsap.matchMedia();
  mm.add('(min-width: 1000px)', () => {
    const list = $('.journey__steps');
    const dist = () => list.scrollWidth - innerWidth + 80;
    gsap.to(list, {
      x: () => -dist(), ease: 'none',
      scrollTrigger: {
        trigger: '.journey__track', start: 'top top', end: () => '+=' + dist(), pin: true, scrub: 0.6, invalidateOnRefresh: true,
        onUpdate: s => { gsap.set('.journey__line i', { scaleX: s.progress }); steps.forEach((li, i) => li.classList.toggle('on', s.progress >= i / (steps.length - 1) - 0.02)); }
      }
    });
  });
  mm.add('(max-width: 999px)', () => {
    gsap.fromTo('.journey__line i', { scaleY: 0 }, { scaleY: 1, ease: 'none', scrollTrigger: { trigger: '.journey__steps', start: 'top 65%', end: 'bottom 65%', scrub: true } });
    steps.forEach(li => {
      ScrollTrigger.create({ trigger: li, start: 'top 66%', onEnter: () => li.classList.add('on'), onLeaveBack: () => li.classList.remove('on') });
      gsap.from(li.children, { x: 24, opacity: 0, duration: 0.8, stagger: 0.06, ease: 'power3.out', scrollTrigger: { trigger: li, start: 'top 80%' } });
    });
  });

  // =====================================================================
  // ORBIT: two rings turning slowly in opposite directions, packed with photos, flags
  // and little bits of knowledge. Look-only: throwing things lives in the hero.
  // =====================================================================
  const orbit = $('.orbit'), oStage = $('.orbit__stage'), ring = $('.orbit__ring');
  const gOut = $('.orbit__guides .g-out'), gIn = $('.orbit__guides .g-in');
  const oPhotos = ['1642140076947-7d410aaaa911', '1659985281435-d8d3ea55b55c', '1623303366639-0e330d7c3d9f', '1604177091072-b7b677a077f6',
    '1623863568368-69e4cbe6cc0b', '1692269726203-fa0d613eec37', '1774437561669-de9e9c523baa', '1692269725911-87697c558be1',
    '1637589316488-6d4c41b335cd', '1629306262232-1f854b4b0b13'];
  const oChips = [['π', ''], ['E = mc²', ''], ['∑', 'display'], ['H₂O', ''], ['√2', ''], ['∞', 'display'], ['F = ma', ''], ['</>', ''],
    ['A+', 'display'], ['नमस्ते', 'accent'], ['Hello!', 'accent'], ['Bonjour', 'accent'], ['DNA', ''], ['₹ ¥ $ €', ''], ['IQ ↑', 'accent']];
  const oItems = [];
  const mk = (el, cls, ringNo) => { el.classList.add('o-item', cls); el.draggable = false; ring.appendChild(el); const it = { el, ring: ringNo, spin: rand(-8, 8), wob: rand(0, 6.3) }; oItems.push(it); return it; };
  oPhotos.forEach((id, i) => { const im = new Image(); im.alt = ''; im.src = unsplash(id, 280); mk(im, 'o-photo', i % 3 === 0 ? 1 : 0); });
  flags.forEach((c, i) => { const im = new Image(); im.alt = ''; im.src = `https://flagcdn.com/w80/${c}.png`; mk(im, 'o-flag', i % 2); });
  sqColors.concat(['#F7B955', '#059669']).forEach((col, i) => { const s = document.createElement('i'); s.style.background = col; mk(s, 'o-sq', i % 2); });
  oChips.forEach(([txt, kind], i) => { const s = document.createElement('span'); s.textContent = txt; if (kind) s.classList.add('o-chip--' + kind); mk(s, 'o-chip', i % 3 ? 1 : 0); });
  // spread each ring's members evenly, mixing the kinds
  [0, 1].forEach(rn => {
    const members = oItems.filter(t => t.ring === rn).sort(() => Math.random() - 0.5);
    members.forEach((t, k) => { t.a = (k / members.length) * Math.PI * 2 + rand(-0.12, 0.12); t.rr = 1 + rand(-0.06, 0.06); });
  });

  const skills = $$('.skill');
  const sk = skills.map((el, i) => ({ el, i, bx: 0, by: 0, wob: rand(0, 6.3) }));
  let ow = 0, oh = 0, ocx = 0, ocy = 0, orx = [0, 0], ory = [0, 0], ophone = false;
  const sizeOrbit = () => {
    ophone = innerWidth < 760;
    ow = oStage.clientWidth; oh = oStage.clientHeight; ocx = ow / 2; ocy = oh / 2;
    orx = ophone ? [ow * 0.56, ow * 0.4] : [Math.min(ow * 0.45, 680), Math.min(ow * 0.3, 450)];
    ory = ophone ? [oh * 0.44, oh * 0.31] : [oh * 0.42, oh * 0.29];
    [[gOut, 0], [gIn, 1]].forEach(([g, n]) => { g.setAttribute('cx', ocx); g.setAttribute('cy', ocy); g.setAttribute('rx', orx[n]); g.setAttribute('ry', ory[n]); });
    oItems.forEach(t => {
      const c = t.el.classList;
      if (c.contains('o-photo')) { t.w = ophone ? (rand(54, 74) | 0) : (rand(86, 124) | 0); t.h = (t.w * (Math.random() > 0.5 ? 0.75 : 1)) | 0; t.el.style.width = t.w + 'px'; t.el.style.height = t.h + 'px'; }
      else if (c.contains('o-flag')) { t.w = ophone ? 32 : 46; t.h = ophone ? 21 : 31; t.el.style.width = t.w + 'px'; t.el.style.height = t.h + 'px'; }
      else if (c.contains('o-sq')) { t.w = ophone ? (rand(12, 20) | 0) : (rand(16, 30) | 0); t.h = (t.w * 0.8) | 0; t.el.style.width = t.w + 'px'; t.el.style.height = t.h + 'px'; }
      else { t.w = t.el.offsetWidth; t.h = t.el.offsetHeight; }
    });
    // skill cards sit in the four corners around the heading
    const cw = skills[0].offsetWidth, ch = skills[0].offsetHeight;
    const homes = ophone
      ? [[ow * 0.05, oh * 0.1], [ow * 0.95 - cw, oh * 0.16], [ow * 0.05, oh * 0.86 - ch], [ow * 0.95 - cw, oh * 0.92 - ch]]
      : [[ow * 0.12, oh * 0.16], [ow * 0.88 - cw, oh * 0.2], [ow * 0.16, oh * 0.84 - ch], [ow * 0.86 - cw, oh * 0.82 - ch]];
    sk.forEach((s, i) => { s.bx = homes[i][0]; s.by = homes[i][1]; });
  };
  sizeOrbit();
  addEventListener('resize', () => { sizeHero(); sizeOrbit(); });

  let orbitP = 0, orbitVisible = false, oLast = performance.now(), spinA = 0, spinVel = 0;
  const pxDots = $$('.px b');
  // a fast scroll nudges the rings a little, never a whip
  ScrollTrigger.create({ trigger: orbit, start: 'top top', end: 'bottom bottom', scrub: true, onUpdate: s => { orbitP = s.progress; spinVel = Math.max(-0.12, Math.min(0.12, spinVel + s.getVelocity() / 40000)); } });
  new IntersectionObserver(([e]) => (orbitVisible = e.isIntersecting)).observe(orbit);
  gsap.from('.orbit__center > *', { y: 30, opacity: 0, duration: 1, stagger: 0.12, ease: 'power3.out', scrollTrigger: { trigger: orbit, start: 'top 60%' } });

  const orbitFrame = now => {
    requestAnimationFrame(orbitFrame);
    const dt = Math.min(0.05, (now - oLast) / 1000); oLast = now;
    if (!orbitVisible) return;
    const time = now / 1000, p = orbitP;
    spinVel *= Math.exp(-dt * 1.5);
    spinA += (0.045 + spinVel) * dt;
    const enter = easeOut(clamp01(p / 0.3));
    oItems.forEach((t, k) => {
      const dir = t.ring ? -1.2 : 1;
      const a = t.a + spinA * dir + Math.sin(time * 0.4 + t.wob) * 0.015;
      const e = clamp01(enter * 1.2 - k * 0.006);
      const far = 1 + (1 - e) * 0.6;
      const x = ocx + Math.cos(a) * orx[t.ring] * t.rr * far - t.w / 2;
      const y = ocy + Math.sin(a) * ory[t.ring] * t.rr * far - t.h / 2;
      const rot = t.spin + Math.sin(time * 0.6 + t.wob) * 1.5;
      t.el.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px) rotate(${rot.toFixed(1)}deg)`;
      t.el.style.opacity = e.toFixed(3);
    });
    // skill cards land in the corners and float gently
    sk.forEach(s => {
      const show = easeOut(clamp01((p - 0.22 - s.i * 0.05) / 0.16));
      const y = s.by + Math.sin(time * 0.9 + s.wob) * 5 + (1 - show) * 50;
      s.el.style.transform = `translate(${s.bx.toFixed(1)}px, ${y.toFixed(1)}px) scale(${(0.7 + show * 0.3).toFixed(3)})`;
      s.el.style.opacity = show.toFixed(3);
    });
    const lit = Math.floor(clamp01((p - 0.5) / 0.25) * (pxDots.length + 1));
    pxDots.forEach((d, i) => d.classList.toggle('lit', i < lit));
    gOut.style.strokeDashoffset = (-time * 6).toFixed(1);
    gIn.style.strokeDashoffset = (time * 8).toFixed(1);
  };
  requestAnimationFrame(orbitFrame);

  // ---------- global: marquees that speed up with your scroll ----------
  const mWords = gsap.to('.marquee--words .marquee__track', { xPercent: -50, duration: 22, ease: 'none', repeat: -1 });
  const mFlags = gsap.fromTo('.marquee--flags .marquee__track', { xPercent: -50 }, { xPercent: 0, duration: 30, ease: 'none', repeat: -1 });
  ScrollTrigger.create({
    trigger: '.global', start: 'top bottom', end: 'bottom top',
    onUpdate: s => {
      const boost = 1 + Math.min(Math.abs(s.getVelocity()) / 300, 5);
      gsap.to([mWords, mFlags], { timeScale: boost * s.direction, duration: 0.2, overwrite: true });
      gsap.to([mWords, mFlags], { timeScale: s.direction, duration: 1.2, delay: 0.25, overwrite: false });
    }
  });
  gsap.fromTo('.global__photo img', { yPercent: -14 }, { yPercent: 0, ease: 'none', scrollTrigger: { trigger: '.global__photo', start: 'top bottom', end: 'bottom top', scrub: true } });

  // ---------- status: ticks land one after another ----------
  ScrollTrigger.create({
    trigger: '.status__steps', start: 'top 75%', once: true,
    onEnter: () => $$('.status__steps li').forEach((li, i) => setTimeout(() => { $('.tick', li).classList.add('on'); if (li.classList.contains('done')) li.style.setProperty('--fill', 1); }, i * 380))
  });
  gsap.from('.status__steps li', { y: 30, opacity: 0, duration: 0.9, stagger: 0.12, ease: 'power3.out', scrollTrigger: { trigger: '.status__steps', start: 'top 80%' } });

  // ---------- CTA: photos fly in from the corners ----------
  const corners = [[-1, -1], [1, -1], [-1, 1], [1, 1]];
  $$('.cta__photos img').forEach((img, i) => {
    const [cx, cy] = corners[i];
    gsap.fromTo(img, { x: cx * 220, y: cy * 160, rotate: cx * 18, opacity: 0 }, { x: 0, y: 0, rotate: cx * cy * -4, opacity: 1, ease: 'none', scrollTrigger: { trigger: '.cta', start: 'top bottom', end: 'center center', scrub: true } });
  });
  gsap.from('.cta__crest, .cta__title, .cta__sub, .cta .btn', { y: 40, opacity: 0, duration: 1, stagger: 0.12, ease: 'power3.out', scrollTrigger: { trigger: '.cta', start: 'top 65%' } });

  // fonts and images change layout heights: re-measure once everything has loaded
  addEventListener('load', () => { sizeHero(); sizeOrbit(); ScrollTrigger.refresh(); });
  document.fonts && document.fonts.ready.then(() => { sizeOrbit(); ScrollTrigger.refresh(); });
})();
