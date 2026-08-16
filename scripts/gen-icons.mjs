import sharp from "sharp";
import { mkdirSync } from "node:fs";

mkdirSync("public/icons", { recursive: true });

const SOURCE = "logo.png";

async function makeIcon({ file, size, padFraction }) {
  const inner = Math.round(size * (1 - padFraction * 2));
  const logo = await sharp(SOURCE)
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

await makeIcon({ file: "public/icons/icon-192.png", size: 192, padFraction: 0.08 });
await makeIcon({ file: "public/icons/icon-512.png", size: 512, padFraction: 0.08 });
// Maskable needs extra safe-zone padding since OS shells crop toward a circle.
await makeIcon({ file: "public/icons/icon-maskable-512.png", size: 512, padFraction: 0.18 });
await makeIcon({ file: "public/apple-touch-icon.png", size: 180, padFraction: 0.1 });
await makeIcon({ file: "public/favicon.png", size: 64, padFraction: 0.06 });
