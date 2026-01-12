#!/usr/bin/env node
/**
 * Image Optimization Script
 * Converts images to AVIF and WebP formats with responsive variants
 * Industry standard for Core Web Vitals (LCP) optimization
 */

import sharp from 'sharp';
import { glob } from 'glob';
import path from 'path';
import fs from 'fs/promises';

const INPUT_DIR = 'public/images';
// High quality settings to preserve image quality
// AVIF 80 = visually lossless for most images
// WebP 85 = high quality with good compression
const QUALITY = {
  avif: 80,
  webp: 85,
  jpeg: 90
};

// Responsive breakpoints for srcset
const SIZES = {
  sm: 640,
  md: 1024,
  lg: 1920
};

async function optimizeImage(inputPath) {
  const ext = path.extname(inputPath).toLowerCase();
  const baseName = path.basename(inputPath, ext);
  const dirName = path.dirname(inputPath);

  // Skip if already optimized format
  if (['.avif', '.svg'].includes(ext)) return;

  // Skip if AVIF version already exists (don't re-process)
  const avifPath = path.join(dirName, `${baseName}.avif`);
  try {
    await fs.access(avifPath);
    console.log(`⏭️  Skipping ${baseName} (AVIF already exists)`);
    return;
  } catch {
    // AVIF doesn't exist, proceed with optimization
  }

  const image = sharp(inputPath);
  const metadata = await image.metadata();

  console.log(`Processing: ${inputPath} (${metadata.width}x${metadata.height})`);

  // Generate AVIF version (best compression)
  await image
    .avif({ quality: QUALITY.avif })
    .toFile(path.join(dirName, `${baseName}.avif`));

  // Generate WebP fallback
  await image
    .webp({ quality: QUALITY.webp })
    .toFile(path.join(dirName, `${baseName}.webp`));

  // Generate responsive variants for large images
  if (metadata.width > SIZES.lg) {
    for (const [suffix, width] of Object.entries(SIZES)) {
      await sharp(inputPath)
        .resize(width, null, { withoutEnlargement: true })
        .avif({ quality: QUALITY.avif })
        .toFile(path.join(dirName, `${baseName}-${suffix}.avif`));

      await sharp(inputPath)
        .resize(width, null, { withoutEnlargement: true })
        .webp({ quality: QUALITY.webp })
        .toFile(path.join(dirName, `${baseName}-${suffix}.webp`));
    }
  }

  console.log(`✓ Optimized: ${baseName}`);
}

async function main() {
  console.log('🖼️  Starting image optimization...\n');

  // Only process source formats (jpg, jpeg, png) - skip webp since those are already optimized
  const images = await glob(`${INPUT_DIR}/**/*.{jpg,jpeg,png}`, {
    ignore: ['**/node_modules/**']
  });

  console.log(`Found ${images.length} images to process\n`);

  for (const image of images) {
    try {
      await optimizeImage(image);
    } catch (error) {
      console.error(`Error processing ${image}:`, error.message);
    }
  }

  console.log('\n✅ Image optimization complete!');
}

main();
