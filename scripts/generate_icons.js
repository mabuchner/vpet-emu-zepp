// Generates the 8 Tamagotchi P1 status icon PNGs from the BrickEmuPy SVG.
// Run with: npm run generate-icons
//
// Requires rsvg-convert from librsvg (brew install librsvg).
// The BrickEmuPy repository must be cloned next to this project at
// ../../BrickEmuPy.

import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, writeFileSync, unlinkSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";

const RSVG = "/opt/homebrew/bin/rsvg-convert";
const BRICKEMU_SVG = "../../BrickEmuPy/assets/TamagotchiP1.svg";
const ICON_SIZE = 48;
const PADDING = 4;

// Approximate bounding boxes for each icon group in SVG coordinate space.
// These are used to compute a square viewBox that centers the icon, so that
// rsvg-convert produces a uniformly-sized PNG without distorting the aspect
// ratio. A small padding is added on all sides for visual breathing room.
// If icons look clipped after a BrickEmuPy SVG update, adjust these values.
const ICON_BBOXES = {
  "16_0": { x: 212, y: 302, w: 40, h: 46 },
  "16_1": { x: 288, y: 303, w: 49, h: 45 },
  "16_2": { x: 366, y: 299, w: 55, h: 52 },
  "16_3": { x: 442, y: 302, w: 53, h: 45 },
  "137_0": { x: 212, y: 572, w: 54, h: 43 },
  "137_1": { x: 290, y: 575, w: 54, h: 40 },
  "137_2": { x: 367, y: 572, w: 55, h: 47 },
  "137_3": { x: 446, y: 572, w: 55, h: 48 },
};

const DEST_DIRS = [
  "assets/gt.r/image/tamagotchi_p1",
  "assets/gt.s/image/tamagotchi_p1",
];

if (!existsSync(RSVG)) {
  console.error(`rsvg-convert not found at ${RSVG}`);
  process.exit(1);
}
if (!existsSync(BRICKEMU_SVG)) {
  console.error(`SVG not found at ${BRICKEMU_SVG}`);
  process.exit(1);
}

const svgSource = readFileSync(BRICKEMU_SVG, "utf8");

for (const iconId of Object.keys(ICON_BBOXES)) {
  // Extract the <g id="...">...</g> block for this icon. The icon groups
  // contain only <path> elements (no nested groups), so a non-greedy match
  // on the first </g> is sufficient.
  const match = svgSource.match(new RegExp(`<g id="${iconId}">[\\s\\S]*?</g>`));
  if (!match) {
    console.error(`group "${iconId}" not found in SVG`);
    process.exit(1);
  }

  const bbox = ICON_BBOXES[iconId];
  const centerX = bbox.x + bbox.w / 2;
  const centerY = bbox.y + bbox.h / 2;
  const size = Math.max(bbox.w, bbox.h) + PADDING * 2;
  const viewBox = `${centerX - size / 2} ${centerY - size / 2} ${size} ${size}`;

  // Wrap the extracted paths in a standalone SVG with a square viewBox so
  // rsvg-convert scales the icon to fill ICON_SIZE×ICON_SIZE without
  // stretching. Transparent areas outside the icon shape come from the RGBA
  // PNG output format.
  const tempSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}">${match[0]}</svg>`;
  const tempPath = join(tmpdir(), `vpet_icon_${iconId}.svg`);
  writeFileSync(tempPath, tempSvg);

  for (const destDir of DEST_DIRS) {
    const outPath = join(destDir, `icon_${iconId}.png`);
    execFileSync(RSVG, [
      "-w",
      String(ICON_SIZE),
      "-h",
      String(ICON_SIZE),
      "-f",
      "png",
      "-o",
      outPath,
      tempPath,
    ]);
    console.log(`wrote ${outPath}`);
  }

  unlinkSync(tempPath);
}
