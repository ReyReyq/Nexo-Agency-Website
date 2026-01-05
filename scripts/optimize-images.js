/**
 * Image Optimization Script for Nexo Vision
 *
 * This script converts PNG/JPG images to WebP format with compression.
 *
 * BEFORE RUNNING:
 * Install sharp if not already installed:
 *   npm install sharp --save-dev
 *
 * USAGE:
 *   node scripts/optimize-images.js [options]
 *
 * OPTIONS:
 *   --dry-run           Preview what would be converted without making changes
 *   --delete-originals  Delete original files after conversion (default: rename to .original)
 *   --quality=N         Set quality 1-100 (default: 80)
 *   --max-width=N       Set max width in pixels (default: 1920)
 *   --dir=PATH          Process only a specific directory
 *
 * TARGET DIRECTORIES:
 *   - public/images/websites-pictures/ (206MB - 33 Gemini AI images)
 *   - public/portfolio/ (including sione-fullpage.png at 11MB)
 *   - public/images/blog/
 *   - public/images/gallery/
 *   - public/images/hero/
 *   - public/images/services/
 *   - public/images/sub-services/
 */

import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const CONFIG = {
  maxWidth: 1920,
  quality: 80,
  deleteOriginals: false,
  dryRun: false,
  targetDir: null, // If set, only process this directory
};

// Target directories relative to project root
const TARGET_DIRECTORIES = [
  'public/images/websites-pictures',
  'public/portfolio',
  'public/images/blog',
  'public/images/gallery',
  'public/images/hero',
  'public/images/services',
  'public/images/sub-services',
];

// Supported image extensions
const SUPPORTED_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.PNG', '.JPG', '.JPEG'];

// Statistics tracking
const stats = {
  totalFiles: 0,
  processedFiles: 0,
  skippedFiles: 0,
  errorFiles: 0,
  originalSizeTotal: 0,
  newSizeTotal: 0,
  errors: [],
};

/**
 * Parse command line arguments
 */
function parseArgs() {
  const args = process.argv.slice(2);

  for (const arg of args) {
    if (arg === '--dry-run') {
      CONFIG.dryRun = true;
    } else if (arg === '--delete-originals') {
      CONFIG.deleteOriginals = true;
    } else if (arg.startsWith('--quality=')) {
      const quality = parseInt(arg.split('=')[1], 10);
      if (quality >= 1 && quality <= 100) {
        CONFIG.quality = quality;
      }
    } else if (arg.startsWith('--max-width=')) {
      const width = parseInt(arg.split('=')[1], 10);
      if (width > 0) {
        CONFIG.maxWidth = width;
      }
    } else if (arg.startsWith('--dir=')) {
      CONFIG.targetDir = arg.split('=')[1];
    } else if (arg === '--help' || arg === '-h') {
      printHelp();
      process.exit(0);
    }
  }
}

/**
 * Print help information
 */
function printHelp() {
  console.log(`
Image Optimization Script for Nexo Vision
==========================================

Usage: node scripts/optimize-images.js [options]

Options:
  --dry-run           Preview what would be converted without making changes
  --delete-originals  Delete original files after conversion (default: rename to .original)
  --quality=N         Set quality 1-100 (default: 80)
  --max-width=N       Set max width in pixels (default: 1920)
  --dir=PATH          Process only a specific directory (relative to project root)
  --help, -h          Show this help message

Examples:
  node scripts/optimize-images.js --dry-run
  node scripts/optimize-images.js --quality=75 --delete-originals
  node scripts/optimize-images.js --dir=public/portfolio
`);
}

/**
 * Format bytes to human readable string
 */
function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Calculate percentage saved
 */
function calculateSavings(original, newSize) {
  if (original === 0) return 0;
  return ((original - newSize) / original * 100).toFixed(1);
}

/**
 * Recursively find all image files in a directory
 */
async function findImageFiles(dir) {
  const files = [];

  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        // Recursively search subdirectories
        const subFiles = await findImageFiles(fullPath);
        files.push(...subFiles);
      } else if (entry.isFile()) {
        const ext = path.extname(entry.name);
        // Check if it's a supported image and not already a backup
        if (SUPPORTED_EXTENSIONS.includes(ext) && !entry.name.endsWith('.original')) {
          files.push(fullPath);
        }
      }
    }
  } catch (error) {
    if (error.code !== 'ENOENT') {
      console.error(`Error reading directory ${dir}:`, error.message);
    }
  }

  return files;
}

/**
 * Convert a single image to WebP
 */
async function convertImage(inputPath) {
  const dir = path.dirname(inputPath);
  const ext = path.extname(inputPath);
  const baseName = path.basename(inputPath, ext);
  const outputPath = path.join(dir, `${baseName}.webp`);

  try {
    // Get original file stats
    const originalStats = await fs.stat(inputPath);
    const originalSize = originalStats.size;
    stats.originalSizeTotal += originalSize;

    // Check if WebP already exists
    try {
      await fs.access(outputPath);
      console.log(`  [SKIP] ${path.relative(process.cwd(), outputPath)} already exists`);
      stats.skippedFiles++;
      return;
    } catch {
      // WebP doesn't exist, proceed with conversion
    }

    if (CONFIG.dryRun) {
      console.log(`  [DRY-RUN] Would convert: ${path.relative(process.cwd(), inputPath)}`);
      console.log(`            Original size: ${formatBytes(originalSize)}`);
      stats.processedFiles++;
      return;
    }

    // Get image metadata to check dimensions
    const metadata = await sharp(inputPath).metadata();

    // Build the sharp pipeline
    let pipeline = sharp(inputPath);

    // Resize if width exceeds maxWidth
    if (metadata.width && metadata.width > CONFIG.maxWidth) {
      pipeline = pipeline.resize(CONFIG.maxWidth, null, {
        withoutEnlargement: true,
        fit: 'inside',
      });
    }

    // Convert to WebP with specified quality
    pipeline = pipeline.webp({
      quality: CONFIG.quality,
      effort: 6, // Higher effort = better compression but slower
    });

    // Write the output file
    await pipeline.toFile(outputPath);

    // Get new file stats
    const newStats = await fs.stat(outputPath);
    const newSize = newStats.size;
    stats.newSizeTotal += newSize;

    const savings = calculateSavings(originalSize, newSize);
    const resized = metadata.width && metadata.width > CONFIG.maxWidth
      ? ` (resized from ${metadata.width}px to ${CONFIG.maxWidth}px)`
      : '';

    console.log(`  [OK] ${path.relative(process.cwd(), inputPath)}`);
    console.log(`       ${formatBytes(originalSize)} -> ${formatBytes(newSize)} (${savings}% saved)${resized}`);

    // Handle original file
    if (CONFIG.deleteOriginals) {
      await fs.unlink(inputPath);
      console.log(`       [DELETED] Original file removed`);
    } else {
      const backupPath = `${inputPath}.original`;
      await fs.rename(inputPath, backupPath);
      console.log(`       [BACKUP] Renamed to ${path.basename(backupPath)}`);
    }

    stats.processedFiles++;

  } catch (error) {
    console.error(`  [ERROR] ${path.relative(process.cwd(), inputPath)}: ${error.message}`);
    stats.errors.push({ file: inputPath, error: error.message });
    stats.errorFiles++;
  }
}

/**
 * Main function
 */
async function main() {
  console.log('='.repeat(60));
  console.log('Nexo Vision Image Optimization Script');
  console.log('='.repeat(60));

  parseArgs();

  // Display configuration
  console.log('\nConfiguration:');
  console.log(`  Max Width: ${CONFIG.maxWidth}px`);
  console.log(`  Quality: ${CONFIG.quality}%`);
  console.log(`  Delete Originals: ${CONFIG.deleteOriginals}`);
  console.log(`  Dry Run: ${CONFIG.dryRun}`);
  if (CONFIG.targetDir) {
    console.log(`  Target Directory: ${CONFIG.targetDir}`);
  }
  console.log('');

  // Get project root (parent of scripts directory)
  const projectRoot = path.resolve(__dirname, '..');

  // Determine which directories to process
  let dirsToProcess;
  if (CONFIG.targetDir) {
    dirsToProcess = [path.resolve(projectRoot, CONFIG.targetDir)];
  } else {
    dirsToProcess = TARGET_DIRECTORIES.map(dir => path.resolve(projectRoot, dir));
  }

  // Find all image files
  console.log('Scanning for images...\n');
  const allFiles = [];

  for (const dir of dirsToProcess) {
    const relDir = path.relative(projectRoot, dir);
    const files = await findImageFiles(dir);

    if (files.length > 0) {
      console.log(`Found ${files.length} images in ${relDir}/`);
      allFiles.push(...files);
    }
  }

  stats.totalFiles = allFiles.length;

  if (allFiles.length === 0) {
    console.log('\nNo PNG/JPG images found to convert.');
    return;
  }

  console.log(`\nTotal: ${allFiles.length} images to process\n`);
  console.log('-'.repeat(60));

  // Process each file
  for (const file of allFiles) {
    await convertImage(file);
  }

  // Print summary
  console.log('\n' + '='.repeat(60));
  console.log('Summary');
  console.log('='.repeat(60));
  console.log(`Total files found:    ${stats.totalFiles}`);
  console.log(`Successfully processed: ${stats.processedFiles}`);
  console.log(`Skipped (WebP exists):  ${stats.skippedFiles}`);
  console.log(`Errors:                 ${stats.errorFiles}`);

  if (!CONFIG.dryRun && stats.processedFiles > 0) {
    console.log('');
    console.log(`Original total size:  ${formatBytes(stats.originalSizeTotal)}`);
    console.log(`New total size:       ${formatBytes(stats.newSizeTotal)}`);
    console.log(`Total space saved:    ${formatBytes(stats.originalSizeTotal - stats.newSizeTotal)}`);
    console.log(`Overall savings:      ${calculateSavings(stats.originalSizeTotal, stats.newSizeTotal)}%`);
  }

  if (stats.errors.length > 0) {
    console.log('\nErrors encountered:');
    for (const err of stats.errors) {
      console.log(`  - ${path.relative(projectRoot, err.file)}: ${err.error}`);
    }
  }

  if (CONFIG.dryRun) {
    console.log('\n[DRY-RUN] No files were modified. Remove --dry-run to perform conversion.');
  }

  console.log('');
}

// Run the script
main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
