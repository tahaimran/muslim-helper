// One-off renderer for the Awdah icon set.
// Usage: node scripts/render-icons.mjs
// Reads SVG sources from assets/brand/ and writes PNGs to assets/images/.
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Resvg } from '@resvg/resvg-js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const brand = join(root, 'assets', 'brand');
const out = join(root, 'assets', 'images');

const targets = [
  { src: 'icon.svg', dest: 'icon.png', size: 1024 },
  { src: 'adaptive-foreground.svg', dest: 'adaptive-icon-foreground.png', size: 1024 },
  { src: 'splash.svg', dest: 'splash-icon.png', size: 1024 },
  { src: 'notification.svg', dest: 'notification-icon.png', size: 96 },
  { src: 'favicon.svg', dest: 'favicon.png', size: 48 },
];

for (const { src, dest, size } of targets) {
  const svg = readFileSync(join(brand, src), 'utf8');
  const png = new Resvg(svg, { fitTo: { mode: 'width', value: size } }).render().asPng();
  writeFileSync(join(out, dest), png);
  process.stdout.write(`${dest} ${size}x${size}\n`);
}
