import sharp from "sharp";
import { mkdirSync } from "node:fs";

mkdirSync("public/avatars", { recursive: true });

const SIZE = 240;
const C = { x: 120, y: 130, r: 54 };

function head(skin) {
  return `<circle cx="${C.x}" cy="${C.y}" r="${C.r}" fill="${skin}"/>
    <circle cx="${C.x - C.r + 5}" cy="${C.y + 4}" r="10" fill="${skin}"/>
    <circle cx="${C.x + C.r - 5}" cy="${C.y + 4}" r="10" fill="${skin}"/>`;
}

/** Sharp, angled almond eyes with a brow stroke — reads as focused/intense rather than cute. */
function eyes({ color = "#2b2130", spacing = 25, tilt = 7, browColor }) {
  const cy = C.y - 2;
  const mk = (cx, side) => {
    const rot = side * tilt;
    return `
    <g transform="rotate(${rot} ${cx} ${cy})">
      <path d="M ${cx - 15} ${cy} Q ${cx - 4} ${cy - 9} ${cx + 15} ${cy - 3}
               Q ${cx - 4} ${cy + 7} ${cx - 15} ${cy} Z" fill="#ffffff"/>
      <circle cx="${cx + 3 * side}" cy="${cy - 1}" r="6.4" fill="${color}"/>
      <circle cx="${cx + 1 * side}" cy="${cy - 3}" r="2" fill="#ffffff"/>
    </g>
    <path d="M ${cx - 15} ${cy - 12} Q ${cx} ${cy - 19 - side} ${cx + 16} ${cy - 11}"
          stroke="${browColor}" stroke-width="3.4" fill="none" stroke-linecap="round"
          transform="rotate(${rot * 0.6} ${cx} ${cy})"/>`;
  };
  return mk(C.x - spacing, -1) + mk(C.x + spacing, 1);
}

function mouth(kind = "smirk", color = "#8a4a42") {
  const y = C.y + 34;
  if (kind === "smirk") {
    return `<path d="M ${C.x - 10} ${y} Q ${C.x + 4} ${y + 5} ${C.x + 13} ${y - 3}"
      stroke="${color}" stroke-width="3" fill="none" stroke-linecap="round"/>`;
  }
  if (kind === "grin") {
    return `<path d="M ${C.x - 12} ${y - 2} Q ${C.x} ${y + 10} ${C.x + 12} ${y - 2}
      Q ${C.x} ${y + 4} ${C.x - 12} ${y - 2} Z" fill="${color}" opacity="0.85"/>`;
  }
  return `<path d="M ${C.x - 11} ${y} L ${C.x + 11} ${y}" stroke="${color}" stroke-width="3" stroke-linecap="round"/>`;
}

function bg(from, to) {
  return `<defs><radialGradient id="bg" cx="30%" cy="20%" r="85%">
      <stop offset="0%" stop-color="${from}"/><stop offset="100%" stop-color="${to}"/>
    </radialGradient></defs>
    <rect width="${SIZE}" height="${SIZE}" fill="url(#bg)"/>`;
}

const AVATARS = [
  {
    // fierce, red spiky hair, confident grin, cheek scar — hot-blooded fighter archetype
    file: "kaen",
    skin: "#f0c39a",
    bg: ["#ffb199", "#e6483f"],
    hairFront: `<path d="M58 112 C50 48 84 26 120 26 C158 26 192 48 184 112
      L172 62 L158 100 L142 56 L120 96 L98 56 L82 100 L68 62 Z" fill="#c0281f"/>
      <path d="M74 66 L86 96 L92 78 Z" fill="#e6483f" opacity="0.8"/>`,
    eyes: { color: "#3a1410", browColor: "#8a1f16" },
    mouth: mouth("grin", "#7a2018"),
    accessory: `<path d="M150 118 l14 14" stroke="#a83226" stroke-width="2.5" stroke-linecap="round" opacity="0.8"/>`,
  },
  {
    // calm silver/white messy hair, sharp cool stare — genius strategist archetype
    file: "sui",
    skin: "#f6d3ad",
    bg: ["#c9d9ff", "#5c7fd6"],
    hairFront: `<path d="M56 110 C48 46 86 24 120 24 C156 24 192 46 184 110
      C176 82 168 96 150 74 C140 92 128 68 120 90 C112 68 100 92 90 74
      C72 96 64 82 56 110 Z" fill="#e7ecf5"/>`,
    eyes: { color: "#26456e", browColor: "#3a5a86" },
    mouth: mouth("neutral", "#5a4038"),
    accessory: `<circle cx="164" cy="150" r="3.5" fill="#5c7fd6"/>`,
  },
  {
    // sleek black hair swept back, single ear cuff, smirk — rival archetype
    file: "kuro",
    skin: "#e6b98d",
    bg: ["#d8d8e8", "#4a4a66"],
    hairFront: `<path d="M58 108 C52 44 86 22 120 22 C156 22 190 44 184 108
      C182 78 176 52 120 56 C64 52 58 78 58 108 Z" fill="#17141c"/>
      <path d="M182 100 C196 108 200 128 190 146" stroke="#17141c" stroke-width="10" fill="none" stroke-linecap="round"/>`,
    eyes: { color: "#241c14", browColor: "#17141c" },
    mouth: mouth("smirk", "#6a3a30"),
    accessory: `<circle cx="66" cy="146" r="5" fill="none" stroke="#c9a227" stroke-width="2.5"/>`,
  },
  {
    // dark choppy hair, headscarf-style band, determined eyes — fierce fighter girl archetype
    file: "ren",
    skin: "#f3c9a3",
    bg: ["#ffd4e0", "#e0577e"],
    hairBack: `<path d="M62 128 C56 168 62 196 76 210 L90 208 C80 180 80 150 84 130 Z" fill="#3a2420"/>
      <path d="M178 128 C184 168 178 196 164 210 L150 208 C160 180 160 150 156 130 Z" fill="#3a2420"/>`,
    hairFront: `<path d="M60 114 C54 50 88 26 120 26 C154 26 188 50 182 114
      C170 88 148 100 120 92 C92 100 70 88 60 114 Z" fill="#3a2420"/>`,
    eyes: { color: "#4a1c18", browColor: "#3a2420" },
    mouth: mouth("smirk", "#8a3a3a"),
    accessory: `<path d="M62 90 Q120 68 178 90" stroke="#e0577e" stroke-width="8" fill="none" stroke-linecap="round"/>`,
  },
  {
    // long straight hair sharp bangs, calm elegant stare — composed strategist archetype
    file: "aiko",
    skin: "#f6d3ad",
    bg: ["#d3f0e6", "#3fa889"],
    hairBack: `<path d="M62 132 C50 190 58 224 72 236 L88 236 C78 200 80 158 84 132 Z" fill="#1e2a28"/>
      <path d="M178 132 C190 190 182 224 168 236 L152 236 C162 200 160 158 156 132 Z" fill="#1e2a28"/>`,
    hairFront: `<path d="M60 118 C54 54 88 30 120 30 C154 30 188 54 182 118
      C176 96 162 84 120 84 C78 84 64 96 60 118 Z" fill="#1e2a28"/>`,
    eyes: { color: "#1c3a32", browColor: "#1e2a28" },
    mouth: mouth("neutral", "#5a4038"),
    accessory: `<path d="M96 40 l6 -10 l6 10 Z" fill="#3fa889"/>`,
  },
  {
    // deep violet spiky hair, narrow sharp eyes, faint scar — mysterious sorcerer archetype
    file: "kage",
    skin: "#e6b98d",
    bg: ["#e0d2ff", "#6a3fb0"],
    hairFront: `<path d="M58 114 C50 46 86 24 120 24 C156 24 192 46 184 114
      L168 66 L154 104 L136 60 L120 100 L104 60 L86 104 L72 66 Z" fill="#3d2166"/>`,
    eyes: { color: "#2a1440", browColor: "#3d2166" },
    mouth: mouth("smirk", "#5a3a6a"),
    accessory: `<path d="M104 108 L112 122" stroke="#8a6ab0" stroke-width="2" stroke-linecap="round" opacity="0.7"/>`,
  },
  {
    // rose-pink high ponytail, sharp determined eyes — energetic fighter girl archetype
    file: "hana",
    skin: "#f3c9a3",
    bg: ["#ffe0ea", "#e0699a"],
    hairBack: `<path d="M150 66 C176 58 200 78 196 112 C193 138 176 150 168 148
      C182 132 182 100 160 82 Z" fill="#c94f7c"/>`,
    hairFront: `<path d="M60 116 C54 52 88 28 120 28 C154 28 188 52 182 116
      C172 90 150 102 120 94 C90 102 68 90 60 116 Z" fill="#c94f7c"/>`,
    eyes: { color: "#5a1c30", browColor: "#a0345a" },
    mouth: mouth("grin", "#8a2a48"),
    accessory: `<circle cx="150" cy="68" r="7" fill="#e0699a" stroke="#8a2a48" stroke-width="2"/>`,
  },
  {
    // teal messy hair, goggles pushed up, wide confident grin — adventurer archetype
    file: "izu",
    skin: "#f0c39a",
    bg: ["#c2f0e8", "#1f9e8a"],
    hairFront: `<path d="M58 116 C52 50 86 26 120 26 C156 26 190 50 184 116
      C178 94 166 76 152 88 C158 70 140 58 120 62 C100 58 82 70 88 88
      C74 76 62 94 58 116 Z" fill="#0f6b5c"/>`,
    eyes: { color: "#0a3a30", browColor: "#0f6b5c" },
    mouth: mouth("grin", "#1a5a48"),
    accessory: `<rect x="88" y="40" width="64" height="16" rx="8" fill="none" stroke="#1f9e8a" stroke-width="4"/>
      <circle cx="100" cy="48" r="7" fill="#c2f0e8" stroke="#1f9e8a" stroke-width="2.5"/>
      <circle cx="140" cy="48" r="7" fill="#c2f0e8" stroke="#1f9e8a" stroke-width="2.5"/>`,
  },
];

for (const a of AVATARS) {
  const svg = `<svg width="${SIZE}" height="${SIZE}" viewBox="0 0 ${SIZE} ${SIZE}" xmlns="http://www.w3.org/2000/svg">
    ${bg(a.bg[0], a.bg[1])}
    ${a.hairBack ?? ""}
    ${head(a.skin)}
    ${a.hairFront}
    ${eyes(a.eyes)}
    ${a.mouth}
    ${a.accessory ?? ""}
  </svg>`;

  await sharp(Buffer.from(svg)).png().toFile(`public/avatars/${a.file}.png`);
  console.log("wrote", `public/avatars/${a.file}.png`);
}
