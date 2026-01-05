#!/usr/bin/env node
/**
 * Image Optimization Script using Sharp
 * Compresses WebP images and creates AVIF variants
 *
 * Usage: node scripts/optimize-images.mjs [--dry-run] [--quality=80] [--max-width=1920]
 */

import sharp from 'sharp';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = path.join(__dirname, '..', 'public', 'images');

// Configuration
const CONFIG = {
  // Quality settings (0-100)
  webpQuality: 82,      // Good balance of quality/size
  avifQuality: 65,      // AVIF is more efficient, can use lower quality

  // Max dimensions (maintains aspect ratio)
  maxWidth: 1920,
  maxHeight: 1080,

  // Only process images larger than this (bytes)
  minSizeThreshold: 100 * 1024, // 100KB

  // Target size for hero images
  heroMaxWidth: 1600,
  heroMaxHeight: 900,

  // Responsive breakpoints
  responsiveWidths: [640, 1024, 1920],

  // Skip these directories
  skipDirs: ['team', 'icons', 'logos'],
};

// Parse CLI arguments
const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const qualityArg = args.find(a => a.startsWith('--quality='));
const maxWidthArg = args.find(a => a.startsWith('--max-width='));

if (qualityArg) CONFIG.webpQuality = parseInt(qualityArg.split('=')[1]);
if (maxWidthArg) CONFIG.maxWidth = parseInt(maxWidthArg.split('=')[1]);

// Stats tracking
const stats = {
  processed: 0,
  skipped: 0,
  errors: 0,
  originalSize: 0,
  newSize: 0,
  avifCreated: 0,
};

/**
 * Get all image files recursively
 */
async function getImageFiles(dir) {
  const files = [];
  const entries = await fs.readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      // Skip certain directories
      if (CONFIG.skipDirs.includes(entry.name)) {
        console.log(`  Skipping directory: ${entry.name}`);
        continue;
      }
      files.push(...await getImageFiles(fullPath));
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name).toLowerCase();
      if (['.webp', '.jpg', '.jpeg', '.png', '.avif'].includes(ext)) {
        files.push(fullPath);
      }
    }
  }

  return files;
}

/**
 * Optimize a single image
 */
async function optimizeImage(filePath) {
  const relativePath = path.relative(PUBLIC_DIR, filePath);
  const ext = path.extname(filePath).toLowerCase();
  const fileName = path.basename(filePath, ext);
  const dirPath = path.dirname(filePath);

  try {
    // Get file stats
    const fileStat = await fs.stat(filePath);
    const originalSize = fileStat.size;
    stats.originalSize += originalSize;

    // Skip small files
    if (originalSize < CONFIG.minSizeThreshold) {
      console.log(`  ⏭️  Skip (small): ${relativePath} (${(originalSize / 1024).toFixed(0)}KB)`);
      stats.skipped++;
      stats.newSize += originalSize;
      return;
    }

    // Skip already optimized files (with -opt suffix)
    if (fileName.endsWith('-opt') || fileName.endsWith('-sm') || fileName.endsWith('-md')) {
      console.log(`  ⏭️  Skip (already processed): ${relativePath}`);
      stats.skipped++;
      stats.newSize += originalSize;
      return;
    }

    // Read image
    const image = sharp(filePath);
    const metadata = await image.metadata();

    // Determine max dimensions based on folder
    let maxWidth = CONFIG.maxWidth;
    let maxHeight = CONFIG.maxHeight;

    if (relativePath.includes('hero')) {
      maxWidth = CONFIG.heroMaxWidth;
      maxHeight = CONFIG.heroMaxHeight;
    }

    // Check if resize needed
    const needsResize = metadata.width > maxWidth || metadata.height > maxHeight;

    // Create optimized WebP
    let pipeline = sharp(filePath);

    if (needsResize) {
      pipeline = pipeline.resize(maxWidth, maxHeight, {
        fit: 'inside',
        withoutEnlargement: true,
      });
    }

    // Optimize WebP
    const webpBuffer = await pipeline
      .webp({
        quality: CONFIG.webpQuality,
        effort: 6, // Higher effort = better compression
        smartSubsample: true,
      })
      .toBuffer();

    const newSize = webpBuffer.length;
    const savings = originalSize - newSize;
    const savingsPercent = ((savings / originalSize) * 100).toFixed(1);

    // Only save if we actually reduced size
    if (newSize < originalSize) {
      if (!dryRun) {
        await fs.writeFile(filePath, webpBuffer);
      }
      console.log(`  ✅ Optimized: ${relativePath}`);
      console.log(`     ${(originalSize / 1024).toFixed(0)}KB → ${(newSize / 1024).toFixed(0)}KB (-${savingsPercent}%)`);
      stats.processed++;
      stats.newSize += newSize;
    } else {
      console.log(`  ⏭️  Skip (already optimal): ${relativePath}`);
      stats.skipped++;
      stats.newSize += originalSize;
    }

    // Create AVIF version for large images (if not exists)
    const avifPath = path.join(dirPath, `${fileName}.avif`);
    try {
      await fs.access(avifPath);
      // AVIF exists, skip
    } catch {
      // AVIF doesn't exist, create it
      if (originalSize > 150 * 1024) { // Only for images > 150KB
        const avifBuffer = await sharp(filePath)
          .resize(maxWidth, maxHeight, { fit: 'inside', withoutEnlargement: true })
          .avif({
            quality: CONFIG.avifQuality,
            effort: 6,
          })
          .toBuffer();

        // Only save if AVIF is smaller
        if (avifBuffer.length < newSize * 0.9) {
          if (!dryRun) {
            await fs.writeFile(avifPath, avifBuffer);
          }
          console.log(`     + Created AVIF: ${(avifBuffer.length / 1024).toFixed(0)}KB`);
          stats.avifCreated++;
        }
      }
    }

  } catch (error) {
    console.error(`  ❌ Error: ${relativePath} - ${error.message}`);
    stats.errors++;
  }
}

/**
 * Main function
 */
async function main() {
  console.log('\n🖼️  Image Optimization Script\n');
  console.log(`Configuration:`);
  console.log(`  WebP Quality: ${CONFIG.webpQuality}`);
  console.log(`  Max Dimensions: ${CONFIG.maxWidth}x${CONFIG.maxHeight}`);
  console.log(`  Min Size Threshold: ${CONFIG.minSizeThreshold / 1024}KB`);
  console.log(`  Dry Run: ${dryRun}\n`);

  console.log('Scanning for images...\n');

  const files = await getImageFiles(PUBLIC_DIR);
  console.log(`Found ${files.length} images\n`);

  console.log('Processing...\n');

  for (const file of files) {
    await optimizeImage(file);
  }

  // Print summary
  console.log('\n' + '='.repeat(50));
  console.log('📊 Summary\n');
  console.log(`  Processed: ${stats.processed}`);
  console.log(`  Skipped: ${stats.skipped}`);
  console.log(`  Errors: ${stats.errors}`);
  console.log(`  AVIF created: ${stats.avifCreated}`);
  console.log('');
  console.log(`  Original total: ${(stats.originalSize / 1024 / 1024).toFixed(2)} MB`);
  console.log(`  New total: ${(stats.newSize / 1024 / 1024).toFixed(2)} MB`);
  console.log(`  Savings: ${((stats.originalSize - stats.newSize) / 1024 / 1024).toFixed(2)} MB`);
  console.log(`  Reduction: ${(((stats.originalSize - stats.newSize) / stats.originalSize) * 100).toFixed(1)}%`);
  console.log('');

  if (dryRun) {
    console.log('⚠️  This was a dry run. No files were modified.\n');
  }
}

main().catch(console.error);
