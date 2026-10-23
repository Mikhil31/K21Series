# K21 Series website: handoff for a new chat

Paste this into the new chat, or say: "Read HANDOFF.md in C:\Users\mikhi\Desktop\k21 series and continue."

## What this is
A one-page home site for **K21 Series** by **Mahasaraswathi Education Foundation Pvt. Ltd.** (client: same person behind Meena's Club, Gully Cricket, GeeFit, MRS Aircraft, RJP). K21 is pitched as one tough global exam: every 6 months, from 7th standard, 600+ courses, 193 countries, only 1,000 seats.

**Current state:** the home page is built, but the user says it's "bad af" and still needs lots of changes. The other pages (About, Exam, Learning, Careers, Admissions, FAQ, Contact) aren't built. Nothing is committed (this folder isn't a git repo).

## Files
| Path | What |
|---|---|
| `requirements-from-client.md` | The client's 66 raw points from his poster |
| `website-content.md` | Full copy for every page (55 KB). The home page uses part of it |
| `brand-guide.md` | Locked palette, logo rules and type. **Read first** |
| `assets/export/` | Crest PNGs (emerald, white, saffron-metallic), favicons |
| `research/reference-sites.md` | Award-winning reference sites, phone-checked, with "what to steal" per site, plus effect demos (CodePen/Codrops) |
| `site/index.html` | The home page |
| `site/css/style.css` | All styles (tokens at the top) |
| `site/js/main.js` | All motion (GSAP 3.12.5 + ScrollTrigger + Lenis 1.1.13 from CDN) |
| `site/img/` | Crests, favicons, `mv-portrait.jpg`/`-640.webp` (Sir MV, copied from Meena's), `pixel-mask.svg` (button dissolve sprite) |
| `.claude/launch.json` | Dev server `k21-site`: `python -m http.server 8321 --bind 0.0.0.0 --directory site` |

**Run it:** start `k21-site` (preview_start). Laptop: http://localhost:8321 · Phone on the same Wi-Fi: http://192.168.0.16:8321. The Wi-Fi is set to "Public" in Windows, so if the phone can't connect, allow Python through the firewall.

## Hard rules from the user (don't break these)
- **Phone first.** The client reviews on his phone about 90% of the time. Every effect must look good at 390px. Test every change on phone and desktop with a scroll before showing it.
- **Only Indian people** in photos of real people.
- **No dark mode.** No black or near-black section backgrounds, and **no blue** as a brand colour. Keep it light but coloured (white, a warm tint, **one** emerald band per page, saffron for CTAs). Black is for text only.
- Don't redraw the logo. Use the exported crest PNGs.
- Pull resources from the internet (photos, Lottie and so on) instead of hand-drawing art.
- Animated, snappy, modern, but **not overwhelming**.
- Never save screenshot folders in the project (they make the editor lag). Keep QA screenshots in the session scratchpad.
- Check visuals carefully before showing (clipping, stray edges, cramped logos, unreadable small text). The user is blunt about half-done work.
- Don't use "declaration" headlines that sound mean. The user wants inviting sentences.
- Never add a Co-Authored-By/Claude line to commits.

## Brand
- **Colours:** emerald-deep #064E3B, emerald #047857, emerald-bright #059669, saffron #D97B0A, saffron-light #F7B955, tint #F6F7F1, cream #FBF3E3, text #1C2422, brass #EAD9A6 → #B8914A.
- **Fonts (five):** Cinzel for titles, Cormorant Garamond *italic* for accent words, Inter for body, IBM Plex Mono for labels and nav, Kalam (Indian handwriting) for small chalk notes. The user liked mixing fonts like Meena's did.
- **Contact:** phone **+91 94499 04569** (confirmed, the Meena's number), email contactmseducationfoundation@gmail.com, address #277/A, 1st Floor, 6th Cross, Near Madhavan Park, 1st Block, Jayanagar, Bengaluru 560011. The map is a Google Maps embed with the same query as Meena's.

## Home page sections (in order) and their effects
1. **Announcement bar** (emerald marquee) + **floating pill header** with the crest (like Gully/MRS). Phone: numbered full-screen menu, plus a floating "Book Your Seat" pill after the hero.
2. **Hero "193 → 1".** Indian student photos and the 12 poster flags drift around (mouse parallax, phone tilt). Scrolling (pinned for 240svh) pulls them into an arch while a big number counts 193 → 1 ("global standard"). Then the arch opens into a photo and the chips pop in. Headline: "Where one exam opens a global future for *you.*" with a moving emerald→saffron gradient.
3. **What is K21?** Bettr Academy-style tilted cards that stack over a sticky classroom photo (4 cards).
4. **New era:** a paragraph whose words light up as you scroll.
5. **Facts swap:** TKS-style full-bleed photos with a big fixed word that swaps exactly at the photo seam (`clip-path: inset(0)` + `position: fixed`). Words: Every 6 Months / From 7th Standard / 600+ Courses / 193 Countries / 1,000 Seats.
6. **Open to anyone. Earned by few.** Lines slide in from opposite sides, with an arch photo.
7. **Who is K21 for:** a deck that deals out on scroll with 3D tilt and shine (desktop); a swipe carousel with dots (phone).
8. **Sir M. Visvesvaraya** ("our inspiration"): the portrait from Meena's in an offset frame, a quote and three facts.
9. **K21 vs traditional table:** a Varsity-style hover where the row fills, a braided **graduation-tassel rope** drops in and swings, and a "✓ The K21 way" tag follows the cursor. Phone: the row in the middle of the screen is the active one.
10. **Numbers band** (the one emerald band) with count-up numbers.
11. **Journey:** horizontal pinned steps with big numerals (desktop); a vertical line that fills (phone).
12. **Orbit "Open your brain power"** (Walton Family Foundation inspired): two rings turning opposite ways, packed with photos, flags, squares and knowledge chips. **Everything is draggable and throwable** (mouse and touch) and springs back while the rings keep turning. The four skill cards (Creative Thinking, Focus, Memory, Analytical) are draggable too. Pixel icons light up.
13. **Global citizen:** a Hello/नमस्ते/Bonjour marquee plus a flags marquee that speed up with scroll, a photo and a 193 counter.
14. **Status:** 4 ticks that land in sequence.
15. **Final CTA** "Your future starts here.": photos fly in from the corners.
16. **Contact:** cards plus a map.
17. **Footer:** crest, columns, a "One World · One System…" marquee, and a giant gold "K21 Series" wordmark.

**Buttons everywhere:** Heron AI-style **pixel-dissolve fill** (`img/pixel-mask.svg` sprite, 20 frames, `mask-position` with `steps(19)`) plus a rolling label and a sliding arrow. JS wraps every `.btn`.

## Things the user liked / referenced
- Bettr Academy stacked cards, TKS text swap + floating skill cards, the Walton "Where Opportunity Takes Root" scatter/orbit, Heron AI buttons, the Varsity rope hover, the Meena's Club Sir MV section and its mixed fonts.
- They're fine with the hero end-state (arch photo with chips). Everything else is open to change.
- The full reference list with links is in `research/reference-sites.md`.

## Open items / known gaps
- The user's verdict: "site is bad af, still needs lots of changes". Ask what specifically is off before redoing things, and don't overcorrect.
- Photos are hotlinked from Unsplash (free licence, no attribution). Download them into `site/img/` before launch.
- Not built yet: the inner pages, a real booking form (the CTA is currently a mailto), the "A week at K21", "Seven pillars" and "Voices" sections, and the claims to confirm in `website-content.md` (CIN number, the 12-degrees wording, fees).
- Orbit drag springs items back. The user might prefer items to stay where they're dropped, so ask.
- The user never found the original "rope" request in past chats. The tassel is my reading of their Varsity reference.

## Useful tooling (from the last session)
- Skill **`reference-sites`** (`~/.claude/skills/reference-sites/`) finds award-winning, phone-checked reference sites. Its scripts `audit.js`, `sheet.js`, `effect-frames.js` and `effect-sheet.js` use headless system Chrome via `playwright-core` (install into the scratchpad: `npm i playwright-core@1.48.2`). Chrome lives at `C:/Program Files/Google/Chrome/Application/chrome.exe`.
- QA pattern that worked: headless Chrome at 390×844 (mobile UA, touch) and 1440×900, scroll in steps, screenshot to the scratchpad, build contact sheets, then actually look at them. To test touch drag, use CDP `Input.dispatchTouchEvent`.
- The Firecrawl CLI is signed in (about 900 credits left) and is the default for web research.
- `python -I` ignores `PYTHONIOENCODING`. Use `sys.stdout.reconfigure(encoding='utf-8')`.
