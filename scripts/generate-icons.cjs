const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

function createPng(width, height, drawFn) {
  const rowSize = width * 4;
  const rawData = Buffer.alloc(height * (rowSize + 1));

  for (let y = 0; y < height; y++) {
    const rowOffset = y * (rowSize + 1);
    rawData[rowOffset] = 0;

    for (let x = 0; x < width; x++) {
      const pixelOffset = rowOffset + 1 + x * 4;
      const [r, g, b, a] = drawFn(x, y, width, height);
      rawData[pixelOffset] = r;
      rawData[pixelOffset + 1] = g;
      rawData[pixelOffset + 2] = b;
      rawData[pixelOffset + 3] = a;
    }
  }

  const compressedData = zlib.deflateSync(rawData);
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  const ihdrChunk = createChunk('IHDR', ihdr);
  const idatChunk = createChunk('IDAT', compressedData);
  const iendChunk = createChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

function createChunk(type, data) {
  const length = data.length;
  const buffer = Buffer.alloc(8 + length + 4);
  buffer.writeUInt32BE(length, 0);
  buffer.write(type, 4, 4, 'ascii');
  data.copy(buffer, 8);

  const crcTable = getCrcTable();
  let crc = 0xffffffff;
  for (let i = 4; i < 8 + length; i++) {
    crc = crcTable[(crc ^ buffer[i]) & 0xff] ^ (crc >>> 8);
  }
  crc = crc ^ 0xffffffff;
  buffer.writeInt32BE(crc, 8 + length);

  return buffer;
}

let crcTable = null;
function getCrcTable() {
  if (crcTable) return crcTable;
  crcTable = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      if (c & 1) {
        c = 0xedb88320 ^ (c >>> 1);
      } else {
        c = c >>> 1;
      }
    }
    crcTable[n] = c;
  }
  return crcTable;
}

// Check if point is inside triangle
function isPointInTriangle(px, py, x1, y1, x2, y2, x3, y3) {
  const d1 = (px - x2) * (y1 - y2) - (x1 - x2) * (py - y2);
  const d2 = (px - x3) * (y2 - y3) - (x2 - x3) * (py - y3);
  const d3 = (px - x1) * (y3 - y1) - (x3 - x1) * (py - y1);
  const hasNeg = (d1 < 0) || (d2 < 0) || (d3 < 0);
  const hasPos = (d1 > 0) || (d2 > 0) || (d3 > 0);
  return !(hasNeg && hasPos);
}

// Draw Light Mode 4-Layer Tray Icon with 3 Triangle Drill Heads
function drawIcon(x, y, w, h, isMaskable) {
  const cx = w / 2;
  const cy = h / 2;
  const dx = x - cx;
  const dy = y - cy;
  const dist = Math.sqrt(dx * dx + dy * dy);
  const maxR = w / 2;

  // Background
  let bgR = 248, bgG = 250, bgB = 252, bgA = 255; // #f8fafc Light

  if (isMaskable) {
    // Solid clean background for full-bleed maskable
    bgR = 241; bgG = 244; bgB = 249; // One UI 8 Light background
  } else {
    // Rounded squircle container
    const squircleDist = Math.pow(Math.abs(dx / (maxR * 0.94)), 4) + Math.pow(Math.abs(dy / (maxR * 0.94)), 4);
    if (squircleDist <= 1.0) {
      bgR = 255; bgG = 255; bgB = 255;
    } else {
      return [0, 0, 0, 0];
    }
  }

  const plateR = maxR * (isMaskable ? 0.72 : 0.75);
  const rimWidth = Math.max(2, w * 0.045);

  // 1. Three Triangle Heads (pointing outwards)
  // Head 1 (Top / Cyan):
  const t1_apex = [cx, cy - plateR * 1.25];
  const t1_b1 = [cx - plateR * 0.18, cy - plateR * 0.96];
  const t1_b2 = [cx + plateR * 0.18, cy - plateR * 0.96];
  if (isPointInTriangle(x, y, t1_apex[0], t1_apex[1], t1_b1[0], t1_b1[1], t1_b2[0], t1_b2[1])) {
    return [6, 182, 212, 255]; // Cyan #06b6d4
  }

  // Head 2 (Bottom-Left / Orange):
  const angle2 = (150 * Math.PI) / 180;
  const h2_apex = [cx + plateR * 1.25 * Math.cos(angle2), cy + plateR * 1.25 * Math.sin(angle2)];
  const h2_baseCenter = [cx + plateR * 0.96 * Math.cos(angle2), cy + plateR * 0.96 * Math.sin(angle2)];
  const perp2 = [Math.sin(angle2) * plateR * 0.18, -Math.cos(angle2) * plateR * 0.18];
  const h2_b1 = [h2_baseCenter[0] + perp2[0], h2_baseCenter[1] + perp2[1]];
  const h2_b2 = [h2_baseCenter[0] - perp2[0], h2_baseCenter[1] - perp2[1]];
  if (isPointInTriangle(x, y, h2_apex[0], h2_apex[1], h2_b1[0], h2_b1[1], h2_b2[0], h2_b2[1])) {
    return [249, 115, 22, 255]; // Orange #f97316
  }

  // Head 3 (Bottom-Right / Emerald):
  const angle3 = (30 * Math.PI) / 180;
  const h3_apex = [cx + plateR * 1.25 * Math.cos(angle3), cy + plateR * 1.25 * Math.sin(angle3)];
  const h3_baseCenter = [cx + plateR * 0.96 * Math.cos(angle3), cy + plateR * 0.96 * Math.sin(angle3)];
  const perp3 = [Math.sin(angle3) * plateR * 0.18, -Math.cos(angle3) * plateR * 0.18];
  const h3_b1 = [h3_baseCenter[0] + perp3[0], h3_baseCenter[1] + perp3[1]];
  const h3_b2 = [h3_baseCenter[0] - perp3[0], h3_baseCenter[1] - perp3[1]];
  if (isPointInTriangle(x, y, h3_apex[0], h3_apex[1], h3_b1[0], h3_b1[1], h3_b2[0], h3_b2[1])) {
    return [16, 185, 129, 255]; // Emerald #10b981
  }

  // 2. Outer Solid Tray Rim (Blue Gradient)
  if (Math.abs(dist - plateR) < rimWidth / 2) {
    return [37, 99, 235, 255]; // One UI Royal Blue #2563eb
  }

  // 3. Four Concentric Dashed Layers
  const angleDeg = (Math.atan2(dy, dx) * 180 / Math.PI + 360) % 360;
  const layerWidth = Math.max(1.5, w * 0.022);

  // Layer 1 (Amber #f59e0b)
  const r1 = plateR * 0.80;
  if (Math.abs(dist - r1) < layerWidth / 2) {
    if (Math.floor(angleDeg / 10) % 2 === 0) return [245, 158, 11, 255];
  }

  // Layer 2 (Emerald #10b981)
  const r2 = plateR * 0.61;
  if (Math.abs(dist - r2) < layerWidth / 2) {
    if (Math.floor(angleDeg / 12) % 2 === 0) return [16, 185, 129, 255];
  }

  // Layer 3 (Cyan #06b6d4)
  const r3 = plateR * 0.44;
  if (Math.abs(dist - r3) < layerWidth / 2) {
    if (Math.floor(angleDeg / 15) % 2 === 0) return [6, 182, 212, 255];
  }

  // Layer 4 (Inner Blue #3b82f6 - The 4th Layer!)
  const r4 = plateR * 0.28;
  if (Math.abs(dist - r4) < layerWidth / 2) {
    if (Math.floor(angleDeg / 18) % 2 === 0) return [59, 130, 246, 255];
  }

  // 4. Center Rose Hub
  if (dist < plateR * 0.15) {
    if (dist < plateR * 0.05) return [255, 255, 255, 255]; // center white dot
    return [244, 63, 94, 255]; // Rose #f43f5e
  }

  return [bgR, bgG, bgB, bgA];
}

const iconsDir = path.join(__dirname, '..', 'public', 'icons');
const publicDir = path.join(__dirname, '..', 'public');

if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

console.log('Generating updated Light 4-layer PWA icons...');

// 192x192
const icon192 = createPng(192, 192, (x, y, w, h) => drawIcon(x, y, w, h, false));
fs.writeFileSync(path.join(iconsDir, 'icon-192.png'), icon192);

// 512x512
const icon512 = createPng(512, 512, (x, y, w, h) => drawIcon(x, y, w, h, false));
fs.writeFileSync(path.join(iconsDir, 'icon-512.png'), icon512);

// 512x512 Maskable
const icon512Maskable = createPng(512, 512, (x, y, w, h) => drawIcon(x, y, w, h, true));
fs.writeFileSync(path.join(iconsDir, 'icon-512-maskable.png'), icon512Maskable);

// Apple touch icon 180x180
const appleTouchIcon = createPng(180, 180, (x, y, w, h) => drawIcon(x, y, w, h, false));
fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), appleTouchIcon);

// Favicon
fs.writeFileSync(path.join(publicDir, 'favicon.ico'), icon192);

console.log('All icons generated successfully with 4 layers and 3 triangle drill heads.');
