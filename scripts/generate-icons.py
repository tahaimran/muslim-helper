#!/usr/bin/env python3
"""Generates the Nafs app icons and Play Store graphics.

WARNING: pre-rebrand. Running this OVERWRITES the current Awdah icons in
assets/images/ with the old Nafs artwork. Kept for reference only.

Run: python3 scripts/generate-icons.py   (needs Pillow)
Everything is drawn at 4x and downsampled for clean edges.
"""
import math
import os
from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
IMAGES = os.path.join(ROOT, 'assets', 'images')
STORE = os.path.join(ROOT, 'store-listing')

BG_TOP = (82, 112, 91)
BG_BOTTOM = (52, 80, 63)
BG_SOLID = (62, 90, 72)  # keep in sync with android.adaptiveIcon.backgroundColor
CREAM = (249, 251, 249)
GOLD = (212, 180, 131)
SS = 4


def gradient(size):
    w, h = size
    img = Image.new('RGB', size)
    px = img.load()
    for y in range(h):
        t = y / max(h - 1, 1)
        row = tuple(round(BG_TOP[i] + (BG_BOTTOM[i] - BG_TOP[i]) * t) for i in range(3))
        for x in range(w):
            px[x, y] = row
    return img


def crescent_mask(size, cx, cy, r):
    mask = Image.new('L', size, 0)
    d = ImageDraw.Draw(mask)
    d.ellipse((cx - r, cy - r, cx + r, cy + r), fill=255)
    off, r2 = r * 0.38, r * 0.82
    d.ellipse((cx + off - r2, cy - r2 - r * 0.05, cx + off + r2, cy + r2 - r * 0.05), fill=0)
    return mask


def star_mask(size, cx, cy, r):
    """Eight-pointed star (two overlapping squares), a classic Islamic motif."""
    mask = Image.new('L', size, 0)
    d = ImageDraw.Draw(mask)
    sx, sy, sr = cx + r * 0.36, cy - r * 0.02, r * 0.34
    for rot in (0, math.pi / 4):
        pts = [(sx + sr * math.cos(rot + math.pi / 4 + k * math.pi / 2),
                sy + sr * math.sin(rot + math.pi / 4 + k * math.pi / 2)) for k in range(4)]
        d.polygon(pts, fill=255)
    return mask


def center_of(n, r):
    # the crescent+star group spans roughly [-r, +0.76r] horizontally; centre it
    return n * 0.5 + r * 0.12, n * 0.5


def layers(n, r):
    cx, cy = center_of(n, r)
    return crescent_mask((n, n), cx, cy, r), star_mask((n, n), cx, cy, r)


def on_background(bg, n, r):
    cres, star = layers(n, r)
    bg.paste(Image.new('RGB', (n, n), CREAM), (0, 0), cres)
    bg.paste(Image.new('RGB', (n, n), GOLD), (0, 0), star)
    return bg


def transparent(n, r):
    cres, star = layers(n, r)
    out = Image.new('RGBA', (n, n), (0, 0, 0, 0))
    out.paste(Image.new('RGBA', (n, n), CREAM + (255,)), (0, 0), cres)
    out.paste(Image.new('RGBA', (n, n), GOLD + (255,)), (0, 0), star)
    return out


def save(img, path, size):
    img.resize(size, Image.LANCZOS).save(path, optimize=True)
    print('wrote', os.path.relpath(path, ROOT), size)


def square_icon():
    n = 1024 * SS
    return on_background(gradient((n, n)), n, n * 0.27)


def adaptive_foreground():
    n = 1024 * SS
    return transparent(n, n * 0.19)  # inside the 66% safe zone


def splash_icon():
    n = 1024 * SS
    return transparent(n, n * 0.30)


def notification_icon():
    # Android renders this as a monochrome mask: white shape on transparent.
    n = 96 * 8
    cres, star = layers(n, n * 0.40)
    mask = Image.new('L', (n, n), 0)
    mask.paste(255, (0, 0), cres)
    mask.paste(255, (0, 0), star)
    out = Image.new('RGBA', (n, n), (255, 255, 255, 0))
    out.putalpha(mask)
    out.paste((255, 255, 255, 255), (0, 0), mask)
    return out


def feature_graphic():
    w, h = 1024 * 2, 500 * 2
    img = gradient((w, h))
    r = h * 0.30
    cx, cy = w * 0.20, h * 0.5
    img.paste(Image.new('RGB', (w, h), CREAM), (0, 0), crescent_mask((w, h), cx, cy, r))
    img.paste(Image.new('RGB', (w, h), GOLD), (0, 0), star_mask((w, h), cx, cy, r))
    d = ImageDraw.Draw(img)
    bold = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSerif-Bold.ttf', 150)
    sub = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', 62)
    d.text((w * 0.38, h * 0.30), 'Nafs', font=bold, fill=CREAM)
    d.text((w * 0.38, h * 0.62), '30-Day Islamic Journey', font=sub, fill=GOLD)
    return img


if __name__ == '__main__':
    os.makedirs(IMAGES, exist_ok=True)
    os.makedirs(STORE, exist_ok=True)
    icon = square_icon()
    save(icon, os.path.join(IMAGES, 'icon.png'), (1024, 1024))
    save(icon, os.path.join(IMAGES, 'favicon.png'), (48, 48))
    save(icon, os.path.join(STORE, 'play-icon-512.png'), (512, 512))
    save(adaptive_foreground(), os.path.join(IMAGES, 'adaptive-icon-foreground.png'), (1024, 1024))
    save(splash_icon(), os.path.join(IMAGES, 'splash-icon.png'), (1024, 1024))
    save(notification_icon(), os.path.join(IMAGES, 'notification-icon.png'), (96, 96))
    save(feature_graphic(), os.path.join(STORE, 'feature-graphic-1024x500.png'), (1024, 500))
