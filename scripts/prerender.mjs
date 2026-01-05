#!/usr/bin/env node
/**
 * Prerender Script for Static HTML Generation
 *
 * This script generates static HTML for specified routes after the Vite build.
 * It uses Puppeteer to render each page and capture the fully-hydrated HTML,
 * improving SEO by providing content to search engine crawlers.
 *
 * Usage: node scripts/prerender.mjs
 *
 * Routes to prerender are defined in the `routes` array below.
 */

import puppeteer from 'puppeteer';
import { createServer } from 'http';
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const distDir = join(__dirname, '..', 'dist');

// Routes to prerender for SEO
// Add new static routes here as needed
// Note: Homepage (/) and Portfolio (/portfolio) are excluded because they use
// heavy WebGL components (Orb, Three.js) that crash in headless browsers.
// These pages still work fine in the browser - they just can't be prerendered.
const routes = [
  '/about',
  '/services',
  '/blog',
  '/contact',
];

// Routes that are skipped due to WebGL incompatibility
// Documented here for reference - these pages rely on client-side rendering
const skippedRoutes = [
  '/', // Uses Hero with 3D effects, Preloader animation
  '/portfolio', // Uses Orb component with WebGL shaders
];

// Configuration
const config = {
  port: 4173,
  host: 'localhost',
  renderTimeout: 5000, // Wait 5 seconds for page to fully render
  viewport: { width: 1280, height: 800 },
  userAgent: 'Mozilla/5.0 (compatible; PrerenderBot/1.0; +https://nexo.agency)',
};

/**
 * Simple static file server for the dist directory
 */
function createStaticServer() {
  return createServer((req, res) => {
    let url = req.url || '/';

    // Handle SPA routing - serve index.html for all routes
    let filePath = join(distDir, url);

    // If no extension, assume it's a route and serve index.html
    if (!url.includes('.')) {
      filePath = join(distDir, 'index.html');
    }

    try {
      const content = readFileSync(filePath);
      const ext = filePath.split('.').pop();

      const mimeTypes = {
        'html': 'text/html',
        'js': 'application/javascript',
        'css': 'text/css',
        'json': 'application/json',
        'png': 'image/png',
        'jpg': 'image/jpeg',
        'svg': 'image/svg+xml',
        'woff': 'font/woff',
        'woff2': 'font/woff2',
      };

      res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
      res.end(content);
    } catch (error) {
      // Fallback to index.html for SPA routing
      try {
        const content = readFileSync(join(distDir, 'index.html'));
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(content);
      } catch {
        res.writeHead(404);
        res.end('Not Found');
      }
    }
  });
}

/**
 * Prerender a single route
 */
async function prerenderRoute(browser, route) {
  const page = await browser.newPage();

  await page.setViewport(config.viewport);
  await page.setUserAgent(config.userAgent);

  const url = `http://${config.host}:${config.port}${route}`;

  console.log(`  Prerendering: ${route}`);

  try {
    // Set sessionStorage before navigation to skip preloader on homepage
    // This prevents the preloader from blocking content capture
    await page.evaluateOnNewDocument(() => {
      sessionStorage.setItem('nexo-preloader-shown', 'true');
    });

    // Navigate to the page
    await page.goto(url, {
      waitUntil: 'networkidle0',
      timeout: 60000
    });

    // Wait for the app to render content
    await page.waitForSelector('#root', { timeout: 15000 });

    // Wait for React to fully hydrate
    await page.waitForFunction(
      () => {
        const root = document.getElementById('root');
        if (!root) return false;
        const allElements = root.querySelectorAll('*');
        return allElements.length > 20; // Substantial content
      },
      { timeout: 20000 }
    );

    // Give animations, lazy-loaded content, and async operations time to settle
    await new Promise(resolve => setTimeout(resolve, 5000));

    // Remove any remaining preloader elements from DOM before capture
    await page.evaluate(() => {
      // Remove preloader if it exists
      const preloaders = document.querySelectorAll('[class*="preloader"], [class*="Preloader"]');
      preloaders.forEach(el => el.remove());
    });

    // Get the rendered HTML
    const html = await page.content();

    // Determine output path
    let outputPath;
    if (route === '/') {
      outputPath = join(distDir, 'index.html');
    } else {
      // Create directory structure for clean URLs
      const routeDir = join(distDir, route);
      if (!existsSync(routeDir)) {
        mkdirSync(routeDir, { recursive: true });
      }
      outputPath = join(routeDir, 'index.html');
    }

    // Write the prerendered HTML
    writeFileSync(outputPath, html);
    console.log(`    -> Saved to: ${outputPath.replace(distDir, 'dist')}`);

    return { route, success: true };
  } catch (error) {
    console.error(`    -> Error: ${error.message}`);
    return { route, success: false, error: error.message };
  } finally {
    await page.close();
  }
}

/**
 * Main prerender function
 */
async function prerender() {
  console.log('\n=== Starting Prerender Process ===\n');

  // Verify dist directory exists
  if (!existsSync(distDir)) {
    console.error('Error: dist directory not found. Run "npm run build" first.');
    process.exit(1);
  }

  // Start static server
  const server = createStaticServer();
  await new Promise(resolve => server.listen(config.port, config.host, resolve));
  console.log(`Static server running at http://${config.host}:${config.port}\n`);

  // Launch browser with WebGL support
  console.log('Launching browser...\n');
  const browser = await puppeteer.launch({
    headless: 'new', // Use new headless mode which has better WebGL support
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      // Enable WebGL for 3D components
      '--enable-webgl',
      '--enable-webgl2',
      '--use-gl=swiftshader', // Software WebGL implementation
      '--enable-features=Vulkan',
      // Increase memory limits for heavy pages
      '--disable-extensions',
      '--disable-background-networking',
      '--disable-default-apps',
      '--disable-sync',
    ],
  });

  const results = [];

  try {
    // Prerender each route
    for (const route of routes) {
      const result = await prerenderRoute(browser, route);
      results.push(result);
    }
  } finally {
    // Cleanup
    await browser.close();
    server.close();
  }

  // Summary
  console.log('\n=== Prerender Summary ===\n');
  const successful = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;

  console.log(`Total routes: ${results.length}`);
  console.log(`Successful: ${successful}`);
  console.log(`Failed: ${failed}`);

  if (failed > 0) {
    console.log('\nFailed routes:');
    results.filter(r => !r.success).forEach(r => {
      console.log(`  - ${r.route}: ${r.error}`);
    });
  }

  console.log('\n=== Prerender Complete ===\n');

  process.exit(failed > 0 ? 1 : 0);
}

// Run the prerender
prerender().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
