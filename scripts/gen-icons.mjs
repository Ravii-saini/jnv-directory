import sharp from "sharp";
import { mkdirSync } from "node:fs";

mkdirSync("public/icons", { recursive: true });

const svg = (size, radius, bg1, bg2) => `
<svg width="${size}" height="${size}" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${bg1}"/>
      <stop offset="100%" stop-color="${bg2}"/>
    </linearGradient>
  </defs>
  <rect width="512" height="512" rx="${radius}" fill="url(#g)"/>
  <text x="256" y="300" font-family="Arial, Helvetica, sans-serif" font-weight="700"
        font-size="200" fill="#ffffff" text-anchor="middle">J20</text>
</svg>`;

const jobs = [
  { file: "public/icons/icon-192.png", size: 192, radius: 100, pad: 0 },
  { file: "public/icons/icon-512.png", size: 512, radius: 260, pad: 0 },
  { file: "public/icons/icon-maskable-512.png", size: 512, radius: 0, pad: 60 },
  { file: "public/apple-touch-icon.png", size: 180, radius: 90, pad: 0 },
  { file: "public/favicon.png", size: 64, radius: 32, pad: 0 },
];

for (const job of jobs) {
  const radius = job.pad ? 0 : 260;
  const svgStr = svg(512, radius, "#4338ca", "#7c3aed");
  let img = sharp(Buffer.from(svgStr)).resize(512, 512);
  if (job.pad) {
    // maskable: keep safe zone by padding down the logo within a full-bleed bg
    img = sharp(Buffer.from(svg(512, 0, "#4338ca", "#7c3aed")));
  }
  await img.resize(job.size, job.size).png().toFile(job.file);
  console.log("wrote", job.file);
}
