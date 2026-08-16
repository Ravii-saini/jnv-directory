import sharp from "sharp";
import { mkdirSync } from "node:fs";

mkdirSync("public/icons", { recursive: true });

const SOURCE = "logo.png";

// Source PNG has a lot of built-in white margin around the emblem — trim it
// once so every derived asset is tightly cropped to the actual artwork.
const trimmed = await sharp(SOURCE).trim().toBuffer();

async function makeIcon({ file, size, padFraction }) {
  const inner = Math.round(size * (1 - padFraction * 2));
  const logo = await sharp(trimmed)
    .resize(inner, inner, { fit: "contain", background: "#ffffff" })
    .toBuffer();

  await sharp({
    create: {
      width: size,
      height: size,
      channels: 3,
      background: "#ffffff",
    },
  })
    .composite([{ input: logo, gravity: "center" }])
    .png()
    .toFile(file);

  console.log("wrote", file);
}

await makeIcon({ file: "public/icons/icon-192.png", size: 192, padFraction: 0.04 });
await makeIcon({ file: "public/icons/icon-512.png", size: 512, padFraction: 0.04 });
// Maskable needs extra safe-zone padding since OS shells crop toward a circle.
await makeIcon({ file: "public/icons/icon-maskable-512.png", size: 512, padFraction: 0.14 });
await makeIcon({ file: "public/apple-touch-icon.png", size: 180, padFraction: 0.05 });
await makeIcon({ file: "public/favicon.png", size: 64, padFraction: 0.03 });

// Web-UI copy used directly by the app (Landing / Add-to-Home-Screen), kept
// tightly trimmed with a small margin so it reads clearly at small sizes.
await sharp(trimmed)
  .resize(600, 600, { fit: "contain", background: "#ffffff" })
  .png()
  .toFile("public/logo-navodaya.png");
console.log("wrote public/logo-navodaya.png");
