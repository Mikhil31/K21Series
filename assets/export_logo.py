"""Export the K21 crest and icon set from the two stock previews in assets/source/.

Same geometry as brand-board.html: everything is laid out in a 100x100 "frame box"
(the shield-and-laurel image), with the Saraswati figure placed inside the shield.
Run from the assets/ folder:  python export_logo.py
"""
from pathlib import Path

from PIL import Image, ImageChops, ImageDraw, ImageFilter

SRC = Path("source")
OUT = Path("export")

EMERALD_DEEP = "#064E3B"
SAFFRON = "#D97B0A"
SAFFRON_LIGHT = "#F7B955"
TINT = "#F6F7F1"
WHITE = "#FFFFFF"

# Shield outline in frame-box units, traced from the source pixels.
SHIELD = [(50, 3.8), (72.4, 16.4), (72, 41), (71, 45.5), (69.2, 50), (66.2, 54), (61.2, 58.4),
          (56.7, 61.4), (50, 65.2), (43.3, 61.4), (38.8, 58.4), (33.8, 54), (30.8, 50),
          (29, 45.5), (28, 41), (27.6, 16.4)]
SHIELD_BOX = (26, 2.5, 74, 66.5)  # crop used for the shield-only icon
FIG_CREST = (28, 4.6, 44.2, 58.93)  # x, y, w, h: figure inside the full crest
FIG_BADGE = (26.5, 4, 47.2, 62.9)   # enlarged figure for the app icon, clear of the keyline


def ink_mask(path, size):
    """Black-on-white artwork -> alpha mask (white = ink), resized to `size`."""
    img = Image.open(path).convert("L").resize(size, Image.LANCZOS)
    # Same curve as the browser filter: alpha = 5.2 - 6 * luminance, clamped.
    return img.point(lambda v: max(0, min(255, int((5.2 - 6 * v / 255) * 255))))


def figure_mask(scale, box, grow_px=0):
    x, y, w, h = box
    m = ink_mask(SRC / "saraswati-figure.jpg", (round(w * scale), round(h * scale)))
    inset = (round(w * scale * 0.03), round(h * scale * 0.03))
    clip = Image.new("L", m.size, 0)
    ImageDraw.Draw(clip).rectangle([inset[0], inset[1], m.width - inset[0], m.height - inset[1]], fill=255)
    m = ImageChops.multiply(m, clip)
    if grow_px:
        m = m.filter(ImageFilter.MaxFilter(grow_px * 2 + 1))
    layer = Image.new("L", (round(100 * scale), round(100 * scale)), 0)
    layer.paste(m, (round(x * scale), round(y * scale)))
    return layer


def frame_mask(scale, shield_only=False):
    side = round(100 * scale)
    m = ink_mask(SRC / "shield-laurel-frame.jpg", (side, side))
    clip = Image.new("L", m.size, 0)
    d = ImageDraw.Draw(clip)
    if shield_only:
        d.polygon([(px * scale, py * scale) for px, py in SHIELD], fill=255)
    else:
        # Trim only the thin grey border of the preview image; the top leaves sit right at the edge.
        e = 0.35 * scale
        d.rectangle([e, e, side - e, side - e], fill=255)
    return ImageChops.multiply(m, clip)


def paint(mask, fill):
    """Fill a mask with a flat colour or a diagonal two-colour gradient."""
    if isinstance(fill, tuple):
        a, b = (Image.new("RGB", (1, 1), c).getpixel((0, 0)) for c in fill)
        v = Image.linear_gradient("L")
        grad = Image.blend(v, v.rotate(90), 0.5).transpose(Image.FLIP_LEFT_RIGHT).resize(mask.size, Image.BICUBIC)
        grad = grad.point(lambda p: max(0, min(255, (p - 64) * 2)))  # stretch to the full 0..255 range
        base = Image.composite(Image.new("RGB", mask.size, b), Image.new("RGB", mask.size, a), grad)
    else:
        base = Image.new("RGB", mask.size, fill)
    out = base.convert("RGBA")
    out.putalpha(mask)
    return out


def crest(scale, fill):
    mask = ImageChops.lighter(frame_mask(scale), figure_mask(scale, FIG_CREST))
    return paint(mask, fill).crop(paint(mask, fill).getbbox())


def badge(scale, shield_fill, ink_fill, grow_px):
    """Filled shield with an inner keyline and the enlarged figure knocked out on top.

    The keyline is drawn from the traced outline rather than taken from the stock frame,
    whose outline doesn't sit exactly on the fill and poked out above the shield.
    """
    side = round(100 * scale)
    pts = [(px * scale, py * scale) for px, py in SHIELD]
    shield = Image.new("L", (side, side), 0)
    ImageDraw.Draw(shield).polygon(pts, fill=255)
    out = paint(shield, shield_fill)
    cx, cy = 50 * scale, 34.5 * scale
    inner = [(cx + (x - cx) * 0.9, cy + (y - cy) * 0.92) for x, y in pts]
    ink = Image.new("L", (side, side), 0)
    ImageDraw.Draw(ink).line(inner + inner[:1], fill=255, width=round(1.1 * scale), joint="curve")
    ink = ImageChops.lighter(ink, figure_mask(scale, FIG_BADGE, grow_px))
    out.alpha_composite(paint(ink, ink_fill))
    x0, y0, x1, y1 = (round(v * scale) for v in SHIELD_BOX)
    return out.crop((x0, y0, x1, y1))


def on_tile(art, size, bg, fill_ratio):
    """Centre `art` on a square tile (bg None = transparent)."""
    tile = Image.new("RGBA", (size, size), bg or (0, 0, 0, 0))
    h = round(size * fill_ratio)
    w = round(art.width * h / art.height)
    art = art.resize((w, h), Image.LANCZOS)
    tile.alpha_composite(art, ((size - w) // 2, (size - h) // 2))
    return tile


def main():
    OUT.mkdir(exist_ok=True)

    # Full crest, transparent background. ~8 px per unit gives a 800px-wide master.
    for name, fill in [("emerald", EMERALD_DEEP), ("saffron-metallic", (SAFFRON_LIGHT, SAFFRON)), ("white", WHITE)]:
        img = crest(8, fill)
        img.save(OUT / f"crest-{name}.png")
        img.resize((400, round(img.height * 400 / img.width)), Image.LANCZOS).save(OUT / f"crest-{name}@400.png")

    # App icon master: emerald shield, saffron figure. Thicker lines so detail survives downscaling.
    master = badge(16, EMERALD_DEEP, SAFFRON_LIGHT, grow_px=2)
    master.save(OUT / "badge-master.png")

    # PWA / Apple icons: square, opaque tint background.
    for size in (512, 192, 180):
        name = "apple-touch-icon.png" if size == 180 else f"icon-{size}.png"
        on_tile(master, size, TINT, 0.80).convert("RGB").save(OUT / name)
    # Maskable icon keeps the art inside the 80% safe zone.
    on_tile(master, 512, TINT, 0.62).convert("RGB").save(OUT / "icon-512-maskable.png")

    # Browser favicons: transparent, shield fills the square.
    favs = {s: on_tile(master, s, None, 0.98) for s in (16, 32, 48)}
    for s, img in favs.items():
        img.save(OUT / f"favicon-{s}.png")
    favs[48].save(OUT / "favicon.ico", sizes=[(16, 16), (32, 32), (48, 48)])

    for p in sorted(OUT.iterdir()):
        with Image.open(p) as im:
            print(f"{p.name:32} {im.size[0]}x{im.size[1]}")


if __name__ == "__main__":
    main()
