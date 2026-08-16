import sharp from "sharp";
import { mkdirSync } from "node:fs";

mkdirSync("public/avatars", { recursive: true });

const SIZE = 240;
const C = { x: 120, y: 128, r: 56 }; // face circle

function head(skin) {
  return `<circle cx="${C.x}" cy="${C.y}" r="${C.r}" fill="${skin}"/>
    <circle cx="${C.x - C.r + 6}" cy="${C.y}" r="11" fill="${skin}"/>
    <circle cx="${C.x + C.r - 6}" cy="${C.y}" r="11" fill="${skin}"/>`;
}

function eyes({ color = "#2b2130", spacing = 24, size = 13, look = 0 }) {
  const ly = C.y + 4;
  const mk = (cx) => `
    <ellipse cx="${cx}" cy="${ly}" rx="${size * 0.72}" ry="${size}" fill="#ffffff"/>
    <circle cx="${cx + look}" cy="${ly + 2}" r="${size * 0.62}" fill="${color}"/>
    <circle cx="${cx + look - 2.5}" cy="${ly - 2.5}" r="${size * 0.22}" fill="#ffffff"/>`;
  return mk(C.x - spacing) + mk(C.x + spacing);
}

function blush(color = "#ff9eb0") {
  return `<ellipse cx="${C.x - 34}" cy="${C.y + 20}" rx="9" ry="5.5" fill="${color}" opacity="0.55"/>
    <ellipse cx="${C.x + 34}" cy="${C.y + 20}" rx="9" ry="5.5" fill="${color}" opacity="0.55"/>`;
}

function mouth(d = `M ${C.x - 8} ${C.y + 34} Q ${C.x} ${C.y + 40} ${C.x + 8} ${C.y + 34}`, color = "#c65a5a") {
  return `<path d="${d}" stroke="${color}" stroke-width="3" fill="none" stroke-linecap="round"/>`;
}

function bg(from, to) {
  return `<defs><radialGradient id="bg" cx="35%" cy="30%" r="80%">
      <stop offset="0%" stop-color="${from}"/><stop offset="100%" stop-color="${to}"/>
    </radialGradient></defs>
    <rect width="${SIZE}" height="${SIZE}" fill="url(#bg)"/>`;
}

const AVATARS = [
  {
    file: "spark",
    skin: "#ffdcb8",
    bg: ["#a8f0d1", "#4fd9a8"],
    hairColor: "#2c2430",
    hairBack: "",
    hairFront: `<path d="M62 118 C58 60 90 40 120 40 C150 40 182 60 178 118
      L164 100 L150 116 L136 96 L120 112 L104 96 L90 116 L76 100 Z" fill="${"#2c2430"}"/>`,
    eyes: { color: "#3a2a20" },
    mouth: mouth(),
  },
  {
    file: "willow",
    skin: "#ffe3c9",
    bg: ["#ffd6e7", "#ff9ec7"],
    hairColor: "#4a2e22",
    hairBack: `<path d="M60 130 C50 190 56 224 70 236 L86 236 C76 200 78 160 82 132 Z" fill="#4a2e22"/>
      <path d="M180 130 C190 190 184 224 170 236 L154 236 C164 200 162 160 158 132 Z" fill="#4a2e22"/>`,
    hairFront: `<path d="M60 122 C56 66 86 38 120 38 C154 38 184 66 180 122
      C170 96 150 108 120 100 C90 108 70 96 60 122 Z" fill="#4a2e22"/>`,
    eyes: { color: "#5a3a2a" },
    mouth: mouth(),
  },
  {
    file: "plum",
    skin: "#ffdcb8",
    bg: ["#e6ccff", "#b98af0"],
    hairColor: "#7a3fb0",
    hairBack: `<ellipse cx="56" cy="150" rx="20" ry="34" fill="#7a3fb0"/>
      <ellipse cx="184" cy="150" rx="20" ry="34" fill="#7a3fb0"/>`,
    hairFront: `<path d="M62 120 C58 62 90 38 120 38 C150 38 182 62 178 120
      C168 90 146 104 120 96 C94 104 72 90 62 120 Z" fill="#7a3fb0"/>`,
    eyes: { color: "#4a2a5a" },
    mouth: mouth(),
    accessory: `<path d="M56 128 l10 -10 l10 10 l-10 10 Z" fill="#ffe45e"/>`,
  },
  {
    file: "cove",
    skin: "#f6c9a0",
    bg: ["#bfe8ff", "#5ec3ef"],
    hairColor: "#1f3a52",
    hairBack: "",
    hairFront: `<path d="M60 116 C54 54 88 34 120 34 C152 34 186 54 180 116
      C178 92 168 78 120 78 C72 78 62 92 60 116 Z" fill="#1f3a52"/>
      <path d="M96 40 C90 52 88 64 90 76" stroke="#16283a" stroke-width="4" fill="none" stroke-linecap="round"/>`,
    eyes: { color: "#20303f" },
    mouth: mouth(`M ${C.x - 9} ${C.y + 33} Q ${C.x} ${C.y + 29} ${C.x + 9} ${C.y + 33}`),
  },
  {
    file: "amber",
    skin: "#ffdcb8",
    bg: ["#fff2b0", "#ffcf5e"],
    hairColor: "#caa227",
    hairBack: `<path d="M172 116 C204 128 208 168 188 190 C196 160 182 136 166 128 Z" fill="#caa227"/>`,
    hairFront: `<path d="M60 118 C56 60 88 38 120 38 C152 38 184 60 180 118
      C170 92 148 104 120 98 C92 104 70 92 60 118 Z" fill="#caa227"/>`,
    eyes: { color: "#5a4620" },
    mouth: mouth(),
    accessory: `<circle cx="96" cy="132" r="14" fill="none" stroke="#7a5c10" stroke-width="3.2"/>
      <circle cx="144" cy="132" r="14" fill="none" stroke="#7a5c10" stroke-width="3.2"/>
      <path d="M110 132 h10 M82 130 h-8 M158 130 h8" stroke="#7a5c10" stroke-width="3.2" stroke-linecap="round"/>`,
  },
  {
    file: "rosewood",
    skin: "#f3c19a",
    bg: ["#ffd7cf", "#ff8e7a"],
    hairColor: "#8a2f22",
    hairBack: "",
    hairFront: `<path d="M60 122 C56 60 90 36 120 36 C150 36 184 60 180 122
      C186 108 182 84 168 78 C172 62 148 48 120 50 C92 48 68 62 72 78
      C58 84 54 108 60 122 Z" fill="#8a2f22"/>`,
    eyes: { color: "#4a2318" },
    mouth: mouth(),
  },
  {
    file: "frost",
    skin: "#ffe3c9",
    bg: ["#dbe9ff", "#9db8ff"],
    hairColor: "#c9d3e0",
    hairBack: `<ellipse cx="70" cy="176" rx="16" ry="26" fill="#c9d3e0"/>
      <ellipse cx="170" cy="176" rx="16" ry="26" fill="#c9d3e0"/>`,
    hairFront: `<path d="M60 118 C56 58 90 36 120 36 C150 36 184 58 180 118
      C172 94 150 106 120 100 C90 106 68 94 60 118 Z" fill="#c9d3e0"/>`,
    eyes: { color: "#3a4a5a" },
    mouth: mouth(),
    accessory: `<path d="M120 40 l4 8 l9 1 l-6.5 6.5 l1.5 9 L120 60 l-8 4.5 l1.5 -9 L107 49 l9 -1 Z" fill="#ffe45e"/>`,
  },
  {
    file: "clover",
    skin: "#f6c9a0",
    bg: ["#d7f5cf", "#8fdc8a"],
    hairColor: "#2e4a2a",
    hairBack: "",
    hairFront: `<path d="M60 116 C50 60 86 34 120 34 C154 34 190 60 180 116
      C182 96 172 78 160 82 C166 66 150 56 138 62 C130 50 110 50 102 62
      C90 56 74 66 80 82 C68 78 58 96 60 116 Z" fill="#2e4a2a"/>`,
    eyes: { color: "#2a3a20" },
    mouth: mouth(),
  },
];

for (const a of AVATARS) {
  const svg = `<svg width="${SIZE}" height="${SIZE}" viewBox="0 0 ${SIZE} ${SIZE}" xmlns="http://www.w3.org/2000/svg">
    ${bg(a.bg[0], a.bg[1])}
    ${a.hairBack}
    ${head(a.skin)}
    ${a.hairFront}
    ${eyes(a.eyes)}
    ${blush()}
    ${a.mouth}
    ${a.accessory ?? ""}
  </svg>`;

  await sharp(Buffer.from(svg)).png().toFile(`public/avatars/${a.file}.png`);
  console.log("wrote", `public/avatars/${a.file}.png`);
}
