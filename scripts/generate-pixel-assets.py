#!/usr/bin/env python3
"""Generate the pixel-art image assets used by the website.

The portrait, project thumbnails and the Apple touch icon are derived from
existing photographs/screenshots so the pixel look stays consistent with the
rest of the design. This script is reproducible and uses only Pillow:

    python3 scripts/generate-pixel-assets.py

It writes:
  public/me-pixel-light.png, public/me-pixel-dark.png   (512×512)
  src/assets/projects/*-pixel.webp                     (10× chunky screenshots)
  src/app/apple-icon.png                               (180×180)

The 4-tone ordered dithering uses a Bayer 8×8 matrix, which is what gives the
portrait its printed, newsprint-like texture instead of smooth gradients.
"""

from pathlib import Path

from PIL import Image, ImageDraw, ImageEnhance, ImageOps

ROOT = Path(__file__).resolve().parents[1]

BAYER_8 = [
    [0, 32, 8, 40, 2, 34, 10, 42],
    [48, 16, 56, 24, 50, 18, 58, 26],
    [12, 44, 4, 36, 14, 46, 6, 38],
    [60, 28, 52, 20, 62, 30, 54, 22],
    [3, 35, 11, 43, 1, 33, 9, 41],
    [51, 19, 59, 27, 49, 17, 57, 25],
    [15, 47, 7, 39, 13, 45, 5, 37],
    [63, 31, 55, 23, 61, 29, 53, 21],
]

# Palette order: shadows → highlights.
LIGHT_PALETTE = [(5, 3, 16), (61, 84, 112), (159, 185, 217), (242, 236, 219)]
DARK_PALETTE = [(5, 3, 16), (27, 37, 58), (111, 143, 183), (242, 236, 219)]
PAPER = (242, 236, 219)


def ordered_dither(gray: Image.Image, palette, spread: float = 0.9) -> Image.Image:
    """Map an 8-bit grayscale image onto a 4-tone palette with Bayer dithering."""
    width, height = gray.size
    source = gray.load()
    output = Image.new("RGB", (width, height))
    target = output.load()

    for y in range(height):
        for x in range(width):
            value = source[x, y] / 255.0
            threshold = (BAYER_8[y % 8][x % 8] + 0.5) / 64.0
            level = round(value * (len(palette) - 1) + (threshold - 0.5) * spread)
            level = max(0, min(len(palette) - 1, level))
            target[x, y] = palette[level]

    return output


def generate_portraits() -> None:
    """Crop to head and shoulders, then render two theme-aware pixel plates."""
    portrait = Image.open(ROOT / "public/me.jpg").convert("RGB")
    width, height = portrait.size
    crop = portrait.crop(
        (int(width * 0.26), int(height * 0.08), int(width * 0.74), int(height * 0.56))
    )

    gray = ImageOps.autocontrast(ImageOps.grayscale(crop), cutoff=1)
    gray = ImageEnhance.Contrast(gray).enhance(1.18)

    # 128×128 pixel grid scaled ×4 with nearest-neighbour keeps pixels crisp.
    small = gray.resize((128, 128), Image.LANCZOS)

    for filename, palette in (
        ("me-pixel-light.png", LIGHT_PALETTE),
        ("me-pixel-dark.png", DARK_PALETTE),
    ):
        ordered_dither(small, palette).resize((512, 512), Image.NEAREST).save(
            ROOT / "public" / filename, optimize=True
        )
        print("wrote", Path("public") / filename)


def generate_project_thumbnails() -> None:
    """Posterize each project screenshot into a chunky pixel preview."""
    for desktop in sorted((ROOT / "src/assets/projects").glob("*-desktop.*")):
        stem = desktop.stem.replace("-desktop", "")
        image = Image.open(desktop).convert("RGBA")

        # Flatten transparency onto paper so the pixels read as a print.
        background = Image.new("RGBA", image.size, (*PAPER, 255))
        image = Image.alpha_composite(background, image).convert("RGB")

        target_width = 96
        target_height = max(1, round(image.height * target_width / image.width))
        small = image.resize((target_width, target_height), Image.LANCZOS)
        quantized = small.convert(
            "P", palette=Image.ADAPTIVE, colors=14, dither=Image.FLOYDSTEINBERG
        )
        upscaled = quantized.convert("RGB").resize(
            (target_width * 10, target_height * 10), Image.NEAREST
        )

        output = desktop.with_name(f"{stem}-pixel.webp")
        upscaled.save(output, "WEBP", quality=82, method=6)
        print("wrote", output.relative_to(ROOT))


def generate_apple_icon() -> None:
    """180×180 touch icon: cream four-point star on ink."""
    icon = Image.new("RGB", (180, 180), (5, 3, 16))
    draw = ImageDraw.Draw(icon)
    scale = 180 / 16
    star = [(8, 1), (9, 6), (14, 8), (9, 9), (8, 14), (7, 9), (2, 8), (7, 6)]
    draw.polygon([(x * scale, y * scale) for x, y in star], fill=(242, 236, 219))
    draw.rectangle(
        [7 * scale, 7 * scale, 9 * scale - 1, 9 * scale - 1], fill=(159, 185, 217)
    )
    icon.save(ROOT / "src/app/apple-icon.png", optimize=True)
    print("wrote src/app/apple-icon.png")


if __name__ == "__main__":
    generate_portraits()
    generate_project_thumbnails()
    generate_apple_icon()
