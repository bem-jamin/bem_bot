from PIL import Image, ImageDraw, ImageFont

FONT_BOLD = "/mnt/skills/examples/canvas-design/canvas-fonts/GeistMono-Bold.ttf"

# Colors — dark modern finance palette
BG_TOP = (10, 14, 22)      # near-black navy
BG_BOTTOM = (17, 24, 39)   # slate-900
GREEN = (52, 211, 153)     # emerald-400 (income/positive)
GREEN_DARK = (16, 122, 87)

def rounded_mask(size, radius):
    mask = Image.new("L", (size, size), 0)
    d = ImageDraw.Draw(mask)
    d.rounded_rectangle([0, 0, size - 1, size - 1], radius=radius, fill=255)
    return mask

def make_icon(size, path, maskable=False):
    img = Image.new("RGB", (size, size), BG_BOTTOM)
    d = ImageDraw.Draw(img)
    # vertical gradient background
    for y in range(size):
        t = y / size
        r = int(BG_TOP[0] + (BG_BOTTOM[0] - BG_TOP[0]) * t)
        g = int(BG_TOP[1] + (BG_BOTTOM[1] - BG_TOP[1]) * t)
        b = int(BG_TOP[2] + (BG_BOTTOM[2] - BG_TOP[2]) * t)
        d.line([(0, y), (size, y)], fill=(r, g, b))

    # subtle upward "pulse/ticker" line across the middle
    pad = size * 0.16
    pts = [
        (pad, size * 0.62),
        (size * 0.36, size * 0.62),
        (size * 0.46, size * 0.40),
        (size * 0.56, size * 0.72),
        (size * 0.68, size * 0.30),
        (size - pad, size * 0.30),
    ]
    d.line(pts, fill=GREEN_DARK, width=max(2, int(size * 0.018)), joint="curve")

    # Big $ glyph
    font_size = int(size * 0.52)
    font = ImageFont.truetype(FONT_BOLD, font_size)
    text = "$"
    bbox = d.textbbox((0, 0), text, font=font)
    tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
    tx = (size - tw) / 2 - bbox[0]
    ty = (size - th) / 2 - bbox[1] - size * 0.03
    d.text((tx, ty), text, font=font, fill=GREEN)

    if maskable:
        # keep full bleed, no rounding (platform applies its own mask)
        img.save(path, "PNG")
        return

    radius = int(size * 0.22)
    mask = rounded_mask(size, radius)
    out = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    out.paste(img, (0, 0), mask)
    out.save(path, "PNG")

sizes = [
    (180, "public/icons/apple-touch-icon.png", False),
    (192, "public/icons/icon-192.png", False),
    (512, "public/icons/icon-512.png", False),
    (512, "public/icons/maskable-512.png", True),
]

for size, path, maskable in sizes:
    make_icon(size, path, maskable)
    print("wrote", path)
