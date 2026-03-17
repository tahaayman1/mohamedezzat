import sharp from 'sharp';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

async function generateOGImage() {
  const profilePath = resolve(root, 'src/assets/profile.jpg');
  const outputPath = resolve(root, 'public/og-image.jpg');

  const profileBuffer = readFileSync(profilePath);

  const circleSize = 280;
  const circleRadius = circleSize / 2;

  const resizedProfile = await sharp(profileBuffer)
    .resize(circleSize, circleSize, { fit: 'cover' })
    .toBuffer();

  const circleMask = Buffer.from(
    `<svg width="${circleSize}" height="${circleSize}">
      <circle cx="${circleRadius}" cy="${circleRadius}" r="${circleRadius}" fill="white"/>
    </svg>`
  );

  const circularProfile = await sharp(resizedProfile)
    .composite([{ input: circleMask, blend: 'dest-in' }])
    .png()
    .toBuffer();

  const width = 1200;
  const height = 630;

  const svgBackground = Buffer.from(`
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="g1" cx="20%" cy="30%" r="60%">
          <stop offset="0%" stop-color="#1a1a2e" />
          <stop offset="100%" stop-color="#000000" />
        </radialGradient>
        <radialGradient id="g2" cx="80%" cy="70%" r="50%">
          <stop offset="0%" stop-color="#16213e" stop-opacity="0.5"/>
          <stop offset="100%" stop-color="transparent" />
        </radialGradient>
        <radialGradient id="blob" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#ffffff" stop-opacity="0.06"/>
          <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <rect width="${width}" height="${height}" fill="url(#g1)"/>
      <rect width="${width}" height="${height}" fill="url(#g2)"/>
      <ellipse cx="900" cy="200" rx="300" ry="250" fill="url(#blob)"/>
      <ellipse cx="200" cy="500" rx="250" ry="200" fill="url(#blob)"/>

      <!-- Subtle border -->
      <rect x="40" y="40" width="1120" height="550" rx="24" ry="24"
            fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="1"/>

      <!-- Glass card background -->
      <rect x="40" y="40" width="1120" height="550" rx="24" ry="24"
            fill="rgba(255,255,255,0.03)"/>

      <!-- Text content -->
      <text x="520" y="240" font-family="system-ui, -apple-system, Segoe UI, sans-serif"
            font-size="56" font-weight="700" fill="white" letter-spacing="1">
        Mohamed Ezzat
      </text>

      <line x1="520" y1="270" x2="780" y2="270" stroke="rgba(255,255,255,0.2)" stroke-width="1"/>

      <text x="520" y="320" font-family="system-ui, -apple-system, Segoe UI, sans-serif"
            font-size="24" fill="rgba(255,255,255,0.7)" letter-spacing="2">
        Business Development Consultant
      </text>

      <text x="520" y="380" font-family="system-ui, -apple-system, Segoe UI, sans-serif"
            font-size="18" fill="rgba(255,255,255,0.4)" letter-spacing="1">
        Strategic Growth · Market Expansion · Client Relations
      </text>

      <!-- Bottom accent line -->
      <rect x="520" y="440" width="60" height="3" rx="1.5" fill="rgba(255,255,255,0.3)"/>

      <!-- Subtle website URL -->
      <text x="520" y="490" font-family="system-ui, -apple-system, Segoe UI, sans-serif"
            font-size="16" fill="rgba(255,255,255,0.25)" letter-spacing="3">
        PORTFOLIO
      </text>
    </svg>
  `);

  const background = await sharp(svgBackground).png().toBuffer();

  await sharp(background)
    .composite([
      {
        input: circularProfile,
        top: Math.round((height - circleSize) / 2) - 10,
        left: 120,
      }
    ])
    .jpeg({ quality: 90 })
    .toFile(outputPath);

  console.log('OG image created: public/og-image.jpg (1200x630)');
}

async function generateAppleTouchIcon() {
  const outputPath = resolve(root, 'public/apple-touch-icon.png');
  const size = 180;

  const svg = Buffer.from(`
    <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#1a1a2e"/>
          <stop offset="100%" stop-color="#0a0a0a"/>
        </linearGradient>
      </defs>
      <rect width="${size}" height="${size}" rx="36" fill="url(#bg)"/>
      <text x="50%" y="52%" dominant-baseline="middle" text-anchor="middle"
            font-family="system-ui, -apple-system, Segoe UI, sans-serif"
            font-size="72" font-weight="700" fill="white" letter-spacing="2">
        ME
      </text>
      <text x="50%" y="78%" dominant-baseline="middle" text-anchor="middle"
            font-family="system-ui, -apple-system, Segoe UI, sans-serif"
            font-size="14" fill="rgba(255,255,255,0.4)" letter-spacing="4">
        PORTFOLIO
      </text>
    </svg>
  `);

  await sharp(svg)
    .png()
    .toFile(outputPath);

  console.log('Apple touch icon created: public/apple-touch-icon.png (180x180)');
}

async function main() {
  try {
    await generateOGImage();
    await generateAppleTouchIcon();
    console.log('All assets generated successfully!');
  } catch (err) {
    console.error('Error generating assets:', err);
    process.exit(1);
  }
}

main();
