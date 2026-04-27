// Run with: node assets/generate-icons.js
// This creates placeholder icon files for development
// For production, replace with professionally designed icons

const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'images');
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

// Create a simple 1x1 green PNG as placeholder
// This is a minimal valid PNG file (1x1 pixel, green)
const createMinimalPNG = (r, g, b) => {
  // PNG header
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  
  // IHDR chunk
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(1, 0); // width
  ihdrData.writeUInt32BE(4, 4); // height
  ihdrData[8] = 8; // bit depth
  ihdrData[9] = 2; // color type (RGB)
  ihdrData[10] = 0; // compression
  ihdrData[11] = 0; // filter
  ihdrData[12] = 0; // interlace
  
  const ihdrCrc = crc32(Buffer.concat([Buffer.from('IHDR'), ihdrData]));
  const ihdr = Buffer.concat([
    Buffer.from([0, 0, 0, 13]),
    Buffer.from('IHDR'),
    ihdrData,
    ihdrCrc
  ]);
  
  // IDAT chunk (1x4 image, all green)
  const rawData = Buffer.from([
    0, r, g, b,
    0, r, g, b,
    0, r, g, b,
    0, r, g, b
  ]);
  const zlib = require('zlib');
  const compressed = zlib.deflateSync(rawData);
  const idatCrc = crc32(Buffer.concat([Buffer.from('IDAT'), compressed]));
  const idat = Buffer.concat([
    Buffer.from(Uint32BE(compressed.length)),
    Buffer.from('IDAT'),
    compressed,
    idatCrc
  ]);
  
  // IEND chunk
  const iendCrc = crc32(Buffer.from('IEND'));
  const iend = Buffer.concat([
    Buffer.from([0, 0, 0, 0]),
    Buffer.from('IEND'),
    iendCrc
  ]);
  
  return Buffer.concat([signature, ihdr, idat, iend]);
};

function Uint32BE(n) {
  const buf = Buffer.alloc(4);
  buf.writeUInt32BE(n, 0);
  return buf;
}

function crc32(buf) {
  let crc = 0xFFFFFFFF;
  for (let i = 0; i < buf.length; i++) {
    crc ^= buf[i];
    for (let j = 0; j < 8; j++) {
      crc = (crc >>> 1) ^ (crc & 1 ? 0xEDB88320 : 0);
    }
  }
  crc ^= 0xFFFFFFFF;
  const result = Buffer.alloc(4);
  result.writeUInt32BE(crc >>> 0, 0);
  return result;
}

const green = createMinimalPNG(27, 106, 79);
const darkGreen = createMinimalPNG(27, 67, 50);

const files = {
  'icon.png': green,
  'adaptive-icon-foreground.png': green,
  'favicon.png': green,
  'notification-icon.png': darkGreen,
  'splash-icon.png': green,
};

Object.entries(files).forEach(([name, data]) => {
  fs.writeFileSync(path.join(dir, name), data);
  console.log(`Created ${name}`);
});

console.log('Icon placeholders created. Replace with professional icons for production.');
