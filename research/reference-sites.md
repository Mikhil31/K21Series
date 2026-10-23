# K21 Series: reference sites (phone-checked)

How I picked them: about 85 education candidates from these sources:
- CSS Design Awards education gallery (pages 1–5)
- Awwwards Culture & Education and Institutions galleries
- Webby 2025 and 2026 (Education, School/University)
- Numiko's "Best University Websites 2026" round-up

I opened 38 of them live on a phone (390px) and on desktop (1440px). I scrolled each one and counted how many elements actually move. I also checked load time, sideways overflow, and whether videos and 3D still show on the phone. 11 passed. Everything was checked on 23 Oct 2026.

"Phone" is how many elements moved during a phone scroll. Click the Awwwards "effect video" links for short clips of the exact animation.

## Your 3 picks (all checked on a phone ✅)

| Pick | Where to see it | How it's built | On a phone | Use it in K21 for |
|---|---|---|---|---|
| **1. Tilted cards stacking over a photo** | [bettr.academy](https://bettr.academy/). Scroll about ⅔ down to "The Gold Standard in Global Certification". [Effect video](https://www.awwwards.com/inspiration/stack-cards-bettr-academy) | Webflow + GSAP ScrollTrigger + Lenis smooth scroll. Each card is pinned and the next one slides over it with a small random tilt (±2–3°). The background photo stays still behind them. | ✅ Same effect, cards stack full-width. The page is heavy (36 moving, slow to fully load). | "Why K21": Global Standards → Advanced Learning → Skill Based → Research & Innovation → Character & Values → Career Ready, one card each, on the tint with saffron or emerald cards. |
| **2. Big text that changes as photos scroll under it** | [tks.world](https://www.tks.world/). Scroll just past the "Access to mentors… Google, Microsoft, SpaceX" logos. [All TKS effects](https://www.awwwards.com/sites/tks-world) · [Photo card animation](https://www.awwwards.com/inspiration/photo-card-animation-tks-world) | Webflow + GSAP + Lenis. Full-bleed photos are stacked. Each photo carries its own big white word, clipped to that photo's edges. So when the next photo slides up, the word swaps exactly at the seam ("10 Months" → "Ages 13-17"). That's why your screenshot showed half of each. | ✅ Plays at full size, smooth, loads in 3 seconds (45 moving). | The K21 facts strip: **Every 6 Months → From 7th Standard → 193 Countries → 1,000 Seats → 600+ Courses**, over student photos. |
| **3. Skill cards floating around a big heading** | [tks.world](https://www.tks.world/). Scroll about 60% down to "Skills for the Future". | The heading is CSS `position: sticky` (I confirmed this on the page). The 6 white cards scroll past it at different speeds, and each card has small green pixel icons. | ✅ But it changes: on a phone the cards become a 2-column grid that scrolls over the sticky heading, not scattered. | "Open Your Brain Power": Creative Thinking, Focus, Memory, Analytical Thinking, IQ Power, Life Skills. The "lil bit of animation" you want: cards fade and rise in a stagger, drift slightly up and down, and the icon dots light up one by one. |

## Other sites that work on a phone

| # | Site | Award | Phone | The effect, where to see it, how it's built |
|---|---|---|---|---|
| 4 | [Why Zero (Zero University)](https://why.zero.university/) | **Awwwards Site of the Day**, Sep 2026 + CSSDA Website of the Day, Aug 2026 | ✅ 3D shows on the phone, loads in 2 seconds | **Emerald 3D landscape with a counter that ticks down** as you scroll (78 → 63…), landing on an island. Three.js + GSAP. [Effect video: 3D scroll parallax](https://www.awwwards.com/inspiration/3d-scroll-parallax-why-zero) · [Page unlock](https://www.awwwards.com/inspiration/page-unlock-why-zero). Use it for the "Only 1,000 seats" countdown. |
| 5 | [The Quaker School at Horsham](https://www.quakerschool.org/) | Awwwards Honorable Mention + CSSDA Website of the Day, Sep 2026 | ✅ 14 moving | **Light cream.** A video hero with a thin serif headline, then one giant word ("Everyday") with photos floating over it as you scroll. Next.js + Lenis. Use it for the hero or "Learn Anytime · Anywhere · Any Skill". |
| 6 | [Krackerz Learning](https://krackerz.com/) | Awwwards Honorable Mention, Sep 2026 | ✅ **272 moving**, loads in 2 seconds | Blob-shaped page reveals, torn-paper tilted cards ("The industry doesn't wait"), sticker-style tags you can drag. Framer + Lenis. [Effect video: stickers](https://www.awwwards.com/inspiration/stickers-interactions-krackerz-learning) · [Loader](https://www.awwwards.com/inspiration/loader-krackerz-learning). It's a career/skills school, so use it for the Careers page. |
| 7 | [ANZSOG](https://anzsog.edu.au/) | CSSDA Special Kudos, Jun 2026 | ✅ **284 moving**, loads in 3 seconds | Cream background, a serif headline with one coloured phrase ("Shaping the Future *of Public Service*"), and a **hand-drawn line that draws itself** around rounded photos as you scroll. Next.js + Lenis. Use it for "Educate · Empower · *Excel*". |
| 8 | [ParentSquare](https://www.parentsquare.com/) | Awwwards Honorable Mention, Sep 2026 | ✅ 11 moving | Light. Small feature chips float in around a photo, then big **stat counters** (22M+ · 40% · 99%) count up. GSAP. [Effect video: homepage hero](https://www.awwwards.com/inspiration/homepage-hero-parentsquare) · [Mobile designs](https://www.awwwards.com/inspiration/parentsquare-mobile-designs-parentsquare). Use it for "For Parents" and the stats band. |
| 9 | [Lionheart Education](https://lionheart-education.com/) | CSSDA Special Kudos, Dec 2025 | ✅ **183 moving** | A huge serif wordmark over video and the split line "Old School Values / New School Thinking". Lenis. Use the line pattern for "Character & Values / Future Ready". The hero is dark, so put ours on tint. |
| 10 | [Little Language Lessons (Google Labs)](https://labs.google/lll/en) | **Webby Winner 2026**, Education | ✅ Works, slow to fully load | Floating 3D objects around a chunky title on white. Next.js. Use it for the "Hello · नमस्ते · Bonjour · Hola · مرحبا" strip. |
| 11 | [Cornell Human Ecology](https://www.human.cornell.edu/) | Webby People's Voice 2026 | ⚠ Hero animates, little else moves | A sentence where each word is a different colour ("We are *scientists*, *educators*, *designers*…") plus an animated wave-line hero. Use the coloured words for "Creative Thinking · Focus · Memory" in emerald and saffron. Skip their purple. |

## Round 2: more animation ideas (any industry, phone-checked)

These came from the newest Awwwards winners in the Animation, GSAP, Scrolling and Site of the Day galleries, about 115 sites. I ran 79 through the phone and desktop check, and about 55 passed. Below are the 10 that best fit a light, green and saffron site. The content doesn't matter here; the animation is what to take. "Nominee" is Awwwards' first tier; "Site of the Day" is higher.

| # | Site | Award | Phone | The effect, where to see it, how it's built | K21 use |
|---|---|---|---|---|---|
| 12 | [Heron AI](https://heronaiapp.com/) | **Awwwards Site of the Day**, Oct 2026 | ✅ **402 moving** | An **architect's line drawing of a building that draws itself** as you scroll, then fills with an orange sun. Webflow + GSAP + Lenis + Barba. [Hero interaction](https://www.awwwards.com/inspiration/hero-interaction-heron-ai) · [Storytelling](https://www.awwwards.com/inspiration/story-telling-heron-ai) · [Preloader](https://www.awwwards.com/inspiration/preloader-heron-ai) | The Saraswathi crest and laurel **draw themselves in line**, then fill with saffron. Or a "Research & Innovation" section drawn as a blueprint. |
| 13 | [Where Opportunity Takes Root (Walton Family Foundation)](https://opportunity.waltonfamilyfoundation.org/) | Awwwards Nominee, Oct 2026 | ✅ **329 moving** | A **foundation site**. A huge serif title ("WHERE OPPORTUNITY TAKES ROOT") with photos bursting out and around the letters, then scattering as you scroll, on a cream background. Next.js + GSAP + Lenis + Lottie. [Page scroll](https://www.awwwards.com/inspiration/page-scroll-where-opportunity-takes-root) · [Scroll transition](https://www.awwwards.com/inspiration/scroll-transition-where-opportunity-takes-root) · [Infographics](https://www.awwwards.com/inspiration/infographics-where-opportunity-takes-root) | Hero: **"YOUR FUTURE STARTS HERE"** in Cinzel, with student photos flying out of the words. It's the closest match to Mahasaraswathi *Foundation*. |
| 14 | [Crosswalk](https://www.crosswalk.cl/en) | Awwwards Nominee, Oct 2026 | ✅ **497 moving**, the most on a phone | **Deep emerald + cream, our palette.** An animated circuit and gear line diagram in the hero, a history timeline, and an "our approach" section. Webflow + GSAP + Lenis. [Hero intro](https://www.awwwards.com/inspiration/hero-intro-crosswalk) · [History timeline](https://www.awwwards.com/inspiration/history-crosswalk) · [Our approach](https://www.awwwards.com/inspiration/our-approach-crosswalk) | The **emerald band** section, plus a "Founded → Registered → Opening shortly" timeline. |
| 15 | [Orizon](https://orizon.one/) | Awwwards Nominee, Oct 2026 | ✅ 274 moving | Light page, **a glowing green ring that pulls you in**, then "Seven stages", numbered steps that light up one by one. Next.js + GSAP + Lenis. [Ring hero](https://www.awwwards.com/inspiration/black-hole-hero-discover-protect-stay-resilient-orizon-beyond-zero-trust) · [Through the ring and back](https://www.awwwards.com/inspiration/through-the-event-horizon-and-back-orizon-beyond-zero-trust) | **The K21 journey**: Register → Exam → Score → Companies → Hired, as numbered steps. The ring in emerald could be the "Open Your Brain Power" portal. |
| 16 | [Twain](https://twain.ai/) | Awwwards Nominee, Oct 2026 | ✅ 276 moving | Light and soft. A **paper plane flies through the headline**, mode cards flip, and a **comparison table stays pinned** while you scroll. GSAP + Lenis. [Paper plane headline](https://www.awwwards.com/inspiration/paper-plane-hero-headline-twain) · [Sticky comparison table](https://www.awwwards.com/inspiration/sticky-plans-comparison-table-twain) · [Mode cards](https://www.awwwards.com/inspiration/research-modes-cards-twain) | **"12 degrees vs 1 K21 exam"** as a sticky comparison table. The paper plane could fly across "193 countries". |
| 17 | [Kelvin Music Festival](https://kelvin.8b.com/) | Awwwards Nominee, Oct 2026 | ✅ 19 moving | **Posters dealt from a pile** like playing cards, a big stat row (3 · 41 · 6 · 40), and a wordmark that melts and re-forms. GSAP + Lenis. [Cards dealt from a pile](https://www.awwwards.com/inspiration/lineup-posters-dealt-from-a-pile-kelvin-music-festival-2027) · [Wordmark re-forming](https://www.awwwards.com/inspiration/hall-scan-and-the-wordmark-re-forming-kelvin-music-festival-2027) | **600+ courses** dealt out as cards, a different way to do your card idea. Some sections are dark, so use the motion only. |
| 18 | [Varsity](https://varsity.vc/) | Awwwards Nominee, Oct 2026 | ✅ 40 moving | **Coloured blocks with labels scatter and regroup** as you scroll (Capital, Growth, Ventures…). Webflow + GSAP + Lenis. [Content section](https://www.awwwards.com/inspiration/varsity-content-submission-6aba390cac3a4978709784) · [Footer](https://www.awwwards.com/inspiration/varsity-footer-submission-6aba390cac3a4978709784) | Your **pick 3 with more motion**: the skill cards scatter, then snap into a grid. |
| 19 | [Ten Pound Feather](https://tenpoundfeather.com/) | Awwwards Nominee, Oct 2026 | ✅ 30 moving | **Old engraving / etched style** on cream, a typewriter headline, and tap-then-tilt cards. Three.js. [Tap then tilt](https://www.awwwards.com/inspiration/tap-then-tilt-ten-pound-feather) | A heritage, classical feel that suits the Saraswathi crest. Use it for the About / Foundation page. |
| 20 | [Extremists on Both Sides](https://both-sides.the7eye.org.il/en/) | Awwwards Nominee, Oct 2026 | ✅ 67 moving | White, with **hundreds of coloured dots** that rearrange into groups and a timeline. [Hero fold](https://www.awwwards.com/inspiration/hero-fold-extremists-on-both-sides) · [Timeline](https://www.awwwards.com/inspiration/timeline-extremists-on-both-sides) · [Drag and drop](https://www.awwwards.com/inspiration/drag-and-drop-interaction-extremists-on-both-sides) | **"1,000 seats in 193 countries"** as 1,000 dots that gather into a world map. It's lighter on phones than a 3D globe. |
| 21 | [Nova Dental](https://nova-dental-dev.webflow.io/) | Awwwards Nominee, Oct 2026 | ✅ 36 moving | Clean light page with serif + italic headings ("Transforming Smiles *with Modern Treatments*"), service cards that rise in, and a big footer CTA. Webflow + GSAP. [Benefits](https://www.awwwards.com/inspiration/benefits-nova-dental) · [Footer CTA](https://www.awwwards.com/inspiration/footer-cta-nova-dental) | The simple, safe version of every section. Use it for the **Book Your Seat** footer. |

## Effect demos you can open and copy

These are working demos of single effects. All links were opened on 23 Oct 2026.

| Effect | Demo | K21 section |
|---|---|---|
| Stacking cards (your pick 1) | [GSAP official: Stacking Cards](https://codepen.io/GreenSock/pen/MWmVwpX) | "Why K21" cards |
| Image mask reveal on scroll (like the TKS swap) | [Pinned image mask reveal](https://codepen.io/gridmorphic/pen/WbQPRwv) | Facts strip, hero |
| Horizontal draggable timeline | [Codrops: scrollable + draggable timeline](https://tympanus.net/codrops/2022/01/03/building-a-scrollable-and-draggable-timeline-with-gsap/) | Age 12 → career journey |
| 3D globe with country markers | [Three.js globe with SVG world map](https://codepen.io/ksenia-k/pen/zYXZGev) · [Globe with location pointers](https://codepen.io/ksenia-k/pen/NWERpmb) | 193 countries (needs a lighter phone version) |
| Numbers counting up on scroll | [GSAP number counter](https://codepen.io/phucbui/full/QWEPOwJ) | Stats band: 1,000 seats, 600+ courses, 193 countries |
| Marquee that speeds up as you scroll | [Scroll-velocity marquee](https://codepen.io/Moving-parts/details/bNqaomL) · [Draggable infinite marquee](https://codepen.io/Colin-Safranek/pen/MWxjKxG) | Country flags / "Hello · नमस्ते · Bonjour" ticker |
| Lines drawing themselves | [GSAP DrawSVG showcase](https://codepen.io/collection/DYmKKD) · [Codrops: curved path on scroll](https://tympanus.net/codrops/2025/12/17/building-responsive-scroll-triggered-curved-path-animations-with-gsap/) | Crest and laurel draw-in, a journey path |
| Cards rearranging smoothly (filter or expand) | [GSAP Flip showcase](https://codepen.io/collection/d725bcacb2f44bbdf0f44718f7ebbf55) | 600+ courses grid with filters |
| Everything scroll-based | [GSAP official scroll collection](https://codepen.io/collection/bNPYOw) | Browse for more |

## What else K21 needs (not covered by your 3 picks)

Your picks cover the cards section, the facts strip and the skills section. Still open:
- **Hero.** Quaker (#5) or the Why Zero countdown (#4).
- **"193 countries / Global Classrooms".** The Westbourne photo globe failed on the phone, so Why Zero's 3D (#4) or ParentSquare's floating chips (#8) are the phone-safe options.
- **Stats band** (emerald). ParentSquare counters (#8).
- **Book Your Seat / footer.** Bettr's [interactive landscape footer](https://www.awwwards.com/inspiration/interactive-landscape-footer-bettr-academy) or TKS's "Ready to join the next wave" wave footer.

## Dropped (phone check)
- **Effect gone on the phone:** Westbourne (globe didn't render), Korowa (4 moving vs 207 on desktop), Half the Sky (0 vs 193), SOAS, Hull, Kraemer Academy, GFI Pathways, School of Form.
- **Couldn't load on the phone:** Ocean School, Honhar, DSTU 95, Growthhungry, Fluence. The A. P. J. Abdul Kalam tribute (Awwwards Honorable Mention, Sep 2026) blocks bots (403), so it's worth opening yourself: [param.design/abdulkalam](https://param.design/abdulkalam/).
- **Static, popup-walled, dark or off-topic:** IE University, Ecole Vision, AGIKI, The Shape of Intelligence, Process Academy, Schwarzman, Michener, NMSI, Imperial, Bryanston, Genazzano, UCFB, ETH Space, SIT campus tour, Yatsumonji (too cartoonish).

## Sources
- https://www.cssdesignawards.com/website-gallery?industry=education (pages 1–5)
- https://www.awwwards.com/websites/culture-education/ (pages 1–2) and /websites/institutions/
- https://www.awwwards.com/sites/ pages for bettr-academy, tks-world, why-zero, krackerz-learning, parentsquare, a-p-j-abdul-kalam
- https://winners.webbyawards.com/winners/websites-and-mobile-sites/general-desktop-mobile-sites/education
- https://winners.webbyawards.com/winners/websites-and-mobile-sites/general-desktop-mobile-sites/schooluniversity
- https://numiko.com/insights/best-university-websites-2026
