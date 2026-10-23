# K21 Series: Brand Guide

Locked decisions for the website build. Visual reference: `assets/brand-board.html` (palette "White & Emerald + Saffron").

## Client taste (hard rules)

- **No dark mode.** Never use black or near-black as a section background.
- **Not plain white either.** Keep the site light, but give it colour: tinted sections and solid brand-colour bands.
- Black (`#1C2422`) is for text only.
- **No blue** as a brand colour.
- The website will lean heavily on **animation**, so the colour system stays calm. Motion carries the energy.

## Palette

| Token | Hex | Use |
|---|---|---|
| `--emerald-deep` | `#064E3B` | Crest on light, footer crest, headings accents |
| `--emerald` | `#047857` | Stats numbers, links, the one colour band per page |
| `--emerald-bright` | `#059669` | Hover states, small highlights (sparingly) |
| `--saffron` | `#D97B0A` | Primary buttons ("Book Your Seat"), key highlights |
| `--saffron-light` | `#F7B955` | Hover / focus glow, metallic gradient end |
| `--white` | `#FFFFFF` | Main page background, cards |
| `--tint` | `#F6F7F1` | Hero and alternating section backgrounds (warm off-white, barely green) |
| `--text` | `#1C2422` | Body text and headings |
| `--on-saffron` | `#1C1408` | Text on saffron buttons |

**Keep green restrained.** It goes on the crest, numbers, links and **one** solid band per page. Saffron is the action colour. Everything else is white or tint.

**Section rhythm:** white header → tint hero → white section with tinted cards → emerald band → tint footer.

**Contrast (WCAG):** body text 15.9:1 · white on emerald 9.7:1 · dark text on saffron button 5.9:1 · saffron button against white 3.1:1 · emerald links on white 5.5:1. All pass.

**Metallic gradient:** `linear-gradient(135deg, #F7B955, #D97B0A)`. Use it only inside the crest (on emerald backgrounds) and optionally for button hover. Don't use gradient backgrounds.

**Brass crest variant** (on emerald band, certificates): `#EAD9A6 → #B8914A`.

## Logo system

Built from two Vecteezy stock vectors: Saraswati figure [11880528](https://www.vecteezy.com/vector-art/11880528) inside shield-and-laurel frame [87090158](https://www.vecteezy.com/vector-art/87090158). The real vector files still need to be downloaded, and the free licence needs attribution unless the Pro licence is bought.

| Version | Where | Rule |
|---|---|---|
| **Primary (horizontal)** | Desktop header (if tall enough), letterheads, email | Full crest + "MAHASARASWATHI / — EDUCATION FOUNDATION —" |
| **Header (name only)** | Website header, sticky nav, mobile | No crest. Just "MAHASARASWATHI / — EDUCATION FOUNDATION —" in Cinzel. The crest is too detailed to shrink, so it only appears large (hero, footer feature, about page). |
| **Stacked** | Hero, certificates, posters, social covers | Crest above the name |
| **Favicon / app icon** | Browser tab, home screen | Filled shield, figure enlarged to fill it |

- The laurel is used only when the crest is large. At small sizes, use the shield only.
- On light backgrounds the crest is emerald-deep. On the emerald band it's brass or white.
- The crest is never red, never black-filled-background.

## Exported assets (`assets/export/`)

Regenerate with `python export_logo.py` from `assets/`. The sources are the two stock previews in `assets/source/`.

| File | Size | Use |
|---|---|---|
| `crest-emerald.png` / `@400` | 796 / 400px | Crest on white or tint |
| `crest-saffron-metallic.png` / `@400` | 796 / 400px | Crest on the emerald band |
| `crest-white.png` / `@400` | 796 / 400px | Crest on emerald, single colour |
| `icon-512.png`, `icon-192.png` | 512, 192 | PWA manifest icons |
| `icon-512-maskable.png` | 512 | Android maskable icon (art in safe zone) |
| `apple-touch-icon.png` | 180 | iOS home screen |
| `favicon.ico` (16/32/48), `favicon-16/32/48.png` | — | Browser tab |
| `badge-master.png` | 768×1024 | Master for any other icon size |

These come from low-res previews, so they're web-quality only (crest max ~800px). Re-export from the real Vecteezy vector files before anything goes to print.

```html
<link rel="icon" href="/favicon.ico" sizes="48x48">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<meta name="theme-color" content="#064E3B">
```

## Typography

- **Display / logo:** Cinzel (Google Fonts), 600–700, used for headings and the wordmark.
- **Body / UI:** Inter (Google Fonts), 400–700.

## Open items

- [x] Export the web asset set (crest PNGs, app icons, favicons)
- [ ] For print: download the real vector files from Vecteezy and re-export (or buy Pro to drop the attribution requirement)
- [ ] Animation direction (style, intensity, which sections)
