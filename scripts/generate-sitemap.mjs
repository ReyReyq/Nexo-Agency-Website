#!/usr/bin/env node
/**
 * Sitemap Generator for nexo.agency
 *
 * Automatically generates sitemap.xml from:
 * - Static routes defined in App.tsx
 * - Blog articles from blog-index.json
 * - Services and sub-services from data files
 * - Landing pages and portfolio case studies
 *
 * Usage: node scripts/generate-sitemap.mjs
 *
 * Add to build process: npm run build && node scripts/generate-sitemap.mjs
 */

import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');

// Configuration
const config = {
  baseUrl: 'https://nexo.agency',
  outputPath: join(rootDir, 'public', 'sitemap.xml'),
};

/**
 * Get today's date in YYYY-MM-DD format
 */
function getToday() {
  return new Date().toISOString().split('T')[0];
}

/**
 * Load JSON file safely
 */
function loadJSON(filePath) {
  try {
    const content = readFileSync(filePath, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    console.warn(`Warning: Could not load ${filePath}: ${error.message}`);
    return null;
  }
}

/**
 * Extract slugs from TypeScript data files using regex
 */
function extractSlugsFromTS(filePath) {
  try {
    const content = readFileSync(filePath, 'utf-8');
    const slugMatches = content.match(/slug:\s*["']([^"']+)["']/g);
    if (!slugMatches) return [];
    return slugMatches.map(match => {
      const slug = match.match(/slug:\s*["']([^"']+)["']/);
      return slug ? slug[1] : null;
    }).filter(Boolean);
  } catch (error) {
    console.warn(`Warning: Could not read ${filePath}: ${error.message}`);
    return [];
  }
}

/**
 * Get all static routes
 */
function getStaticRoutes() {
  return [
    '/',
    '/about',
    '/services',
    '/portfolio',
    '/blog',
    '/contact',
    '/privacy',
    '/terms',
  ];
}

/**
 * Get all landing page routes
 */
function getLandingPageRoutes() {
  return [
    '/lp/lawyers-website',
    '/lp/business-websites',
    '/lp/website-building',
    '/lp/website-design',
    '/lp/portfolio-website',
    '/lp/website-builder',
    '/lp/online-store',
    '/lp/website-company',
    '/lp/wordpress-website',
    '/lp/website-setup',
    '/lp/portfolio-site',
    '/lp/free-website',
    '/lp/internet-website',
    '/lp/sales-website',
    '/lp/website-development',
  ];
}

/**
 * Get service routes with sub-services
 */
function getServiceRoutes() {
  const routes = [];

  // Main services and their sub-services
  const servicesConfig = {
    'web-development': ['landing-pages', 'wordpress', 'web-apps', 'corporate-sites', 'catalog-sites'],
    'ecommerce': ['shopify', 'woocommerce', 'payments', 'inventory'],
    'branding': ['logo-design', 'visual-identity', 'brand-book', 'copywriting'],
    'ai-automation': ['chatbots', 'automation', 'ai-content'],
    'digital-marketing': ['google-ads', 'meta-ads', 'email-marketing', 'influencer'],
    'seo': ['technical-seo', 'local-seo', 'content-seo', 'link-building'],
    'social-media': ['instagram-marketing', 'facebook-marketing', 'linkedin-marketing', 'tiktok-marketing'],
    'strategy': ['market-research', 'digital-audit', 'growth-strategy', 'conversion-optimization'],
    'app-development': ['ios-apps', 'android-apps', 'cross-platform', 'pwa'],
    'custom-development': ['saas-development', 'api-development', 'dashboard-systems', 'automation-systems'],
  };

  for (const [service, subServices] of Object.entries(servicesConfig)) {
    // Main service page
    routes.push(`/services/${service}`);

    // Sub-service pages
    for (const sub of subServices) {
      routes.push(`/services/${service}/${sub}`);
    }
  }

  return routes;
}

/**
 * Get blog article routes from blog-index.json
 */
function getBlogRoutes() {
  const blogIndexPath = join(rootDir, 'public', 'data', 'blog-index.json');
  const blogIndex = loadJSON(blogIndexPath);

  if (!blogIndex || !Array.isArray(blogIndex)) {
    console.warn('Warning: Could not load blog index');
    return [];
  }

  // Get unique slugs (some might be duplicated)
  const slugs = [...new Set(blogIndex.map(post => post.slug).filter(Boolean))];
  return slugs.map(slug => `/blog/${slug}`);
}

/**
 * Get portfolio case study routes
 */
function getPortfolioRoutes() {
  // These are the known case studies
  return [
    '/portfolio/simplyhebrew',
    '/portfolio/teenvestsor',
    '/portfolio/sione',
    '/portfolio/fashion-hub',
    '/portfolio/techconnect',
    '/portfolio/finflow',
  ];
}

/**
 * Generate XML for a single URL entry
 */
function generateUrlEntry(path, lastmod) {
  const loc = `${config.baseUrl}${path}`;
  return `  <url><loc>${loc}</loc><lastmod>${lastmod}</lastmod></url>`;
}

/**
 * Generate the complete sitemap XML
 */
function generateSitemap() {
  const today = getToday();
  const urls = [];

  console.log('Generating sitemap for nexo.agency...\n');

  // Static routes
  const staticRoutes = getStaticRoutes();
  console.log(`  Static pages: ${staticRoutes.length}`);
  urls.push('\n  <!-- Main Pages -->');
  staticRoutes.forEach(route => urls.push(generateUrlEntry(route, today)));

  // Service routes
  const serviceRoutes = getServiceRoutes();
  console.log(`  Service pages: ${serviceRoutes.length}`);
  urls.push('\n  <!-- Service Pages -->');
  serviceRoutes.forEach(route => urls.push(generateUrlEntry(route, today)));

  // Portfolio routes
  const portfolioRoutes = getPortfolioRoutes();
  console.log(`  Portfolio pages: ${portfolioRoutes.length}`);
  urls.push('\n  <!-- Portfolio Case Studies -->');
  portfolioRoutes.forEach(route => urls.push(generateUrlEntry(route, today)));

  // Landing page routes
  const landingRoutes = getLandingPageRoutes();
  console.log(`  Landing pages: ${landingRoutes.length}`);
  urls.push('\n  <!-- Landing Pages -->');
  landingRoutes.forEach(route => urls.push(generateUrlEntry(route, today)));

  // Blog routes
  const blogRoutes = getBlogRoutes();
  console.log(`  Blog articles: ${blogRoutes.length}`);
  urls.push('\n  <!-- Blog Articles -->');
  blogRoutes.forEach(route => urls.push(generateUrlEntry(route, today)));

  const totalUrls = staticRoutes.length + serviceRoutes.length + portfolioRoutes.length + landingRoutes.length + blogRoutes.length;
  console.log(`\n  Total URLs: ${totalUrls}\n`);

  // Build XML
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>
`;

  return xml;
}

/**
 * Main function
 */
function main() {
  console.log('\n=== Sitemap Generator ===\n');

  try {
    const sitemap = generateSitemap();
    writeFileSync(config.outputPath, sitemap);
    console.log(`Sitemap written to: ${config.outputPath}`);
    console.log('\n=== Complete ===\n');
  } catch (error) {
    console.error('Error generating sitemap:', error);
    process.exit(1);
  }
}

main();
