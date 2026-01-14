# CLAUDE.md - Project Context for AI Assistants

## Project Overview
Nexo Agency Website - A React/Vite SPA for a digital agency based in Israel.

## Git Branch Structure

**IMPORTANT: Deployment Branches**
- `main` branch → **Production** (nexo.agency)
- `master` branch → **Preview** environment

When deploying to production, always push to the `main` branch:
```bash
git push origin master:main
```

## Tech Stack
- React 18 + TypeScript
- Vite 7
- Tailwind CSS
- Framer Motion
- Three.js / React Three Fiber (3D effects)
- GSAP (animations)
- Deployed on Vercel

## Key Scripts
- `npm run dev` - Start development server
- `npm run build` - Production build
- `npm run build:full` - Build + sitemap generation + prerender
- `npm run generate-sitemap` - Generate sitemap.xml from routes
- `npm run prerender` - Prerender static HTML for SEO

## SEO Files (in /public)
- `robots.txt` - Crawler directives (includes AI crawlers)
- `sitemap.xml` - Auto-generated sitemap (139+ URLs)
- `llms.txt` - AI/LLM readable site summary (AEO)

## Vercel Configuration
The `vercel.json` file has rewrite rules for SPA routing. Static files like robots.txt, sitemap.xml, llms.txt are excluded from SPA rewrites.

## Directory Structure
- `/src/pages/` - Page components
- `/src/components/` - Reusable components
- `/src/data/` - Static data files (services, landing pages)
- `/public/` - Static assets
- `/scripts/` - Build scripts (sitemap, prerender)
- `/api/` - Serverless API functions

## Production Domains
- **Primary:** https://nexoagency.org
- **Secondary:** https://nexo-agency.co.il (redirects to www)
- All canonical URLs should use `nexo.agency` (not nexo.co.il)

Note: `nexo.agency` points to a different (Framer) site - the Vercel project uses `nexoagency.org` and `nexo-agency.co.il`.
