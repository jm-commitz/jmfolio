// Generates a branded 1200x630 Open Graph image for social link previews.
import sharp from 'sharp';
import { readFileSync } from 'node:fs';

const avatar = readFileSync('app/icon.png').toString('base64');

const svg = `
<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <clipPath id="c"><circle cx="300" cy="315" r="170" /></clipPath>
  </defs>
  <rect width="1200" height="630" fill="#0a0a0a" />
  <rect x="0" y="0" width="1200" height="630" fill="none" stroke="#1f1f1f" stroke-width="2" />

  <circle cx="300" cy="315" r="176" fill="none" stroke="#2a2a2a" stroke-width="4" />
  <image href="data:image/png;base64,${avatar}" x="130" y="145" width="340" height="340" clip-path="url(#c)" />

  <text x="540" y="290" font-family="Arial, Helvetica, sans-serif" font-size="74" font-weight="700" fill="#ededed">Jaymark Ancheta</text>
  <text x="542" y="350" font-family="Arial, Helvetica, sans-serif" font-size="36" fill="#a3a3a3">Full-Stack &amp; Mobile Developer</text>
  <text x="542" y="420" font-family="Arial, Helvetica, sans-serif" font-size="34" fill="#8a8a8a">Building the Next Big Thing.</text>
  <text x="542" y="500" font-family="Arial, Helvetica, sans-serif" font-size="26" fill="#5f5f5f">jmancheta.cloud</text>
</svg>
`;

await sharp(Buffer.from(svg)).png().toFile('app/opengraph-image.png');
console.log('Wrote app/opengraph-image.png (1200x630)');
