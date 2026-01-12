# Mobile LCP Optimization Plan

**Date:** 2026-01-07
**Project:** Nexo Vision Website
**Status:** Ready for Implementation
**Goal:** Reduce Mobile LCP from 7.87s to <2.5s

---

## Executive Summary

**Current Performance:**
| Metric | Mobile | Desktop | Target |
|--------|--------|---------|--------|
| Performance Score | 62 | 94 | 90+ |
| LCP | 7,869ms | 964ms | <2,500ms |
| FCP | 3,686ms | ~600ms | <1,800ms |
| CLS | 0 | 0.01 | <0.1 |
| TBT | 84ms | 0ms | <200ms |

**Estimated Total Improvement:** 5.5-6.5 seconds (from 7.87s to ~1.5-2.5s)

---

## Critical Issues Identified

### 1. Preloader Blocks LCP for 3.8 Seconds
**Location:** `src/components/Preloader.tsx` (Lines 117-134)

The desktop preloader animation takes 3.8 seconds before showing meaningful content. This directly adds to LCP time.

**Current Timing:**
- Phase 1: Logo 0.8s
- Phase 2: Photos 0.8s
- Phase 3: Zoom 1.6s
- Phase 4: Complete 0.6s
- **Total: 3.8 seconds of blocking**

### 2. Analytics Scripts Load Too Early
**Location:** `src/lib/analytics.ts` (Lines 94-98), `src/main.tsx` (Line 16)

GA4 and Microsoft Clarity initialize during React hydration, blocking main thread on mobile 3G/4G networks.

### 3. Framer Motion Scroll Listeners Active Immediately
**Location:** `src/components/Hero.tsx` (Lines 122-138), `src/components/GlassNavbar.tsx` (Lines 131-138)

`useScroll()` and `useSpring()` install expensive scroll listeners that fire continuously during preloader animation, wasting mobile CPU.

### 4. Hero Image Preload Not Mobile-Optimized
**Location:** `index.html` (Lines 44-62)

Single preload tag with srcset doesn't guarantee mobile variant loads first. Mobile users may start downloading 1920w image.

### 5. Lenis Smooth Scroll RAF Loop Starts Too Early
**Location:** `src/lib/lenis.tsx` (Lines 63-95)

`requestAnimationFrame` loop starts before content is visible, burning CPU/battery.

---

## Implementation Plan

### Phase 1: Critical Fixes (Week 1)
**Target: 50-70% LCP improvement (7.87s → ~3s)**

#### 1.1 Reduce Preloader Duration or Skip First Visit
**File:** `src/components/Preloader.tsx`

Option A - Reduce to 1.5 seconds:
```tsx
// Change timing constants
// Phase 1: Logo 0.3s
// Phase 2: Photos 0.4s
// Phase 3: Zoom 0.6s
// Phase 4: Complete 0.2s
// Total: 1.5 seconds

timersRef.current.push(setTimeout(() => setPhase('photos'), 300));
timersRef.current.push(setTimeout(() => setPhase('zooming'), 700));
timersRef.current.push(setTimeout(() => setPhase('complete'), 1300));
timersRef.current.push(setTimeout(() => handleComplete(), 1500));
```

Option B - Skip on first visit, show on return:
```tsx
// In Index.tsx, invert the logic
const [isLoading, setIsLoading] = useState(() => {
  // Only show preloader to RETURNING visitors
  const hasSeenPreloaderPersistent = localStorage.getItem("nexo-preloader-seen");
  return !!hasSeenPreloaderPersistent; // Show only if seen before
});
```

**Expected Impact:** 2-3.5 seconds LCP reduction

---

#### 1.2 Defer Analytics Initialization
**Files:** `src/lib/analytics.ts`, `src/main.tsx`

```tsx
// main.tsx - Remove immediate init
// DELETE: initAnalytics();

// App.tsx - Defer to after window.load
useEffect(() => {
  const loadAnalytics = () => {
    import('./lib/analytics').then(({ initAnalytics }) => {
      initAnalytics();
    });
  };

  if ('requestIdleCallback' in window) {
    requestIdleCallback(loadAnalytics, { timeout: 3000 });
  } else {
    window.addEventListener('load', () => {
      setTimeout(loadAnalytics, 2000);
    });
  }
}, []);
```

**Expected Impact:** 500-1500ms LCP reduction on slow networks

---

#### 1.3 Add fetchpriority="high" to LCP Image
**File:** `src/components/Hero.tsx`

```tsx
// Line ~232 - Add fetchpriority to hero image
<motion.img
  src={heroImages[activeImageIndex].src}
  srcSet={heroImages[activeImageIndex].srcSet}
  sizes={heroImages[activeImageIndex].sizes}
  alt="..."
  fetchPriority="high"  // ADD THIS
  loading="eager"       // ADD THIS (never lazy load LCP image)
  decoding="sync"       // ADD THIS
  width={1920}
  height={1080}
  className="..."
/>
```

**Expected Impact:** 500-2000ms LCP improvement

---

#### 1.4 Optimize Hero Image Preload for Mobile
**File:** `index.html`

Replace single preload with media-query specific preloads:
```html
<!-- Mobile-first preload -->
<link
  rel="preload"
  as="image"
  type="image/avif"
  media="(max-width: 640px)"
  href="/images/hero/team-collaboration-sm.avif"
  fetchpriority="high"
>
<!-- Tablet preload -->
<link
  rel="preload"
  as="image"
  type="image/avif"
  media="(min-width: 641px) and (max-width: 1024px)"
  href="/images/hero/team-collaboration-md.avif"
  fetchpriority="high"
>
<!-- Desktop preload -->
<link
  rel="preload"
  as="image"
  type="image/avif"
  media="(min-width: 1025px)"
  href="/images/hero/team-collaboration.avif"
  fetchpriority="high"
>
```

**Expected Impact:** 500-1500ms on mobile

---

### Phase 2: High Impact Fixes (Week 2)
**Target: 20-30% additional improvement (3s → ~2s)**

#### 2.1 Disable Framer Motion Parallax on Mobile
**File:** `src/components/Hero.tsx`

```tsx
// Early in component, detect mobile
const [isMobile, setIsMobile] = useState(false);

useEffect(() => {
  setIsMobile(window.innerWidth < 768 || 'ontouchstart' in window);
}, []);

// Only enable scroll transforms on desktop
const { scrollYProgress } = useScroll({
  target: sectionRef,
  offset: ["start start", "end start"],
});

// Conditionally use transforms
const imageScale = useTransform(
  scrollYProgress,
  [0, 1],
  isMobile ? [1, 1] : [1, 1.3]  // No scale on mobile
);
const textY = useTransform(
  scrollYProgress,
  [0, 1],
  isMobile ? [0, 0] : [0, 150]  // No parallax on mobile
);
```

**Expected Impact:** 300-800ms and better scroll performance

---

#### 2.2 Defer Lenis Initialization
**File:** `src/lib/lenis.tsx`

```tsx
// Delay Lenis start until after LCP
useEffect(() => {
  let lenisInstance: Lenis | null = null;

  const initLenis = () => {
    lenisInstance = new Lenis({ ...options });
    setLenis(lenisInstance);
    startRafLoop(lenisInstance);
  };

  // Wait for LCP to complete (approximately 2.5s) or idle
  if ('requestIdleCallback' in window) {
    requestIdleCallback(initLenis, { timeout: 3000 });
  } else {
    setTimeout(initLenis, 2500);
  }

  return () => {
    lenisInstance?.destroy();
  };
}, []);
```

**Expected Impact:** 200-500ms (reduced main thread work)

---

#### 2.3 Convert All Hero/Gallery Images to AVIF
**Action:** Run image conversion script

```bash
# Install Sharp CLI
npm install -g sharp-cli

# Convert hero images
for f in public/images/hero/*.webp; do
  sharp -i "$f" -o "${f%.webp}.avif" --format avif --quality 80
done

# Convert gallery images
for f in public/images/gallery/*.webp; do
  sharp -i "$f" -o "${f%.webp}.avif" --format avif --quality 75
done
```

Update Hero.tsx to use AVIF with WebP fallback:
```tsx
const heroImages = [
  {
    src: '/images/hero/team-collaboration.avif',
    srcSet: `
      /images/hero/team-collaboration-sm.avif 640w,
      /images/hero/team-collaboration-md.avif 1024w,
      /images/hero/team-collaboration.avif 1920w
    `,
    fallbackSrc: '/images/hero/team-collaboration.webp',
    sizes: '100vw',
    alt: 'Team collaboration'
  },
  // ...
];
```

**Expected Impact:** 1000-3000ms (25-50% smaller images)

---

### Phase 3: Medium Impact Fixes (Week 3)
**Target: 10-15% additional improvement (2s → ~1.5s)**

#### 3.1 Implement Service Worker for Caching
**File:** Create `public/sw.js` or use vite-plugin-pwa

```typescript
// vite.config.ts
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webp,avif,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/.*\.(avif|webp|png|jpg)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'images',
              expiration: { maxEntries: 100, maxAgeSeconds: 30 * 24 * 60 * 60 },
            },
          },
        ],
      },
    }),
  ],
});
```

**Expected Impact:** 1500-3000ms on repeat visits (42-48% faster)

---

#### 3.2 Remove Unused Font Files
**File:** `index.html`, font declarations

Remove Roboto Flex (82KB) if not essential:
```html
<!-- Remove this preload if VariableProximity not used -->
<!-- <link rel="preload" href="/fonts/roboto-flex-latin.woff2" .../> -->
```

Reduce Clash Display to 2 weights (400 + 700):
```html
<!-- Keep only 400 and 700 weights -->
<link rel="preload" href="/fonts/clash-display-400.woff2" .../>
<link rel="preload" href="/fonts/clash-display-700.woff2" .../>
```

**Expected Impact:** 44-96KB font savings, 100-300ms faster load

---

#### 3.3 Audit and Reduce Radix UI Bundle
**File:** `vite.config.ts`

Move unused Radix components to lazy chunks:
```typescript
// In manualChunks
if (id.includes('@radix-ui/react-dialog') ||
    id.includes('@radix-ui/react-toast') ||
    id.includes('@radix-ui/react-tooltip')) {
  return 'radix-lazy';  // Load only when modal/toast needed
}
```

**Expected Impact:** 10-20KB initial bundle reduction

---

### Phase 4: Polish (Week 4)

#### 4.1 CSS Code Splitting per Route
Configure Vite to extract route-specific CSS:
```typescript
// vite.config.ts
build: {
  cssCodeSplit: true,  // Already enabled
  rollupOptions: {
    output: {
      assetFileNames: (assetInfo) => {
        if (assetInfo.name?.endsWith('.css')) {
          return 'css/[name]-[hash][extname]';
        }
        return 'assets/[name]-[hash][extname]';
      },
    },
  },
},
```

#### 4.2 Implement prefers-reduced-motion
**File:** `src/components/Hero.tsx`, others

```tsx
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Skip all animations if user prefers reduced motion
if (prefersReducedMotion) {
  return <StaticHero />;
}
```

---

## Quick Wins Checklist

### Immediate (< 30 minutes each):

- [ ] Add `fetchpriority="high"` to Hero image
- [ ] Remove `loading="lazy"` from Hero image
- [ ] Add `defer` attribute to any remaining scripts
- [ ] Add explicit `width` and `height` to all images
- [ ] Preload hero image with media queries

### Short Term (1-2 hours each):

- [ ] Reduce preloader duration to 1.5s or skip first visit
- [ ] Defer analytics initialization
- [ ] Add mobile-specific hero preload
- [ ] Disable Framer Motion parallax on mobile

### Medium Term (Half day each):

- [ ] Convert all images to AVIF format
- [ ] Implement Service Worker caching
- [ ] Remove unused font files
- [ ] Audit Radix UI usage

---

## Expected Results

| Phase | LCP Target | Score Target |
|-------|------------|--------------|
| Current | 7,869ms | 62 |
| After Phase 1 | ~3,000ms | 75-80 |
| After Phase 2 | ~2,200ms | 80-85 |
| After Phase 3 | ~1,800ms | 85-90 |
| After Phase 4 | <1,500ms | 90+ |

---

## Files to Modify (Priority Order)

### Critical:
1. `src/components/Preloader.tsx` - Reduce timing
2. `src/main.tsx` - Remove initAnalytics()
3. `src/App.tsx` - Add deferred analytics
4. `src/components/Hero.tsx` - Add fetchpriority, disable mobile parallax
5. `index.html` - Mobile-specific preloads

### High Priority:
6. `src/lib/lenis.tsx` - Defer initialization
7. `vite.config.ts` - Add PWA plugin
8. Image files - Convert to AVIF

### Medium Priority:
9. Font files - Remove unused
10. `tailwind.config.ts` - CSS optimization
11. Package.json - Audit dependencies

---

## Monitoring

After implementation, verify improvements using:

1. **PageSpeed Insights** - Run mobile test
2. **Lighthouse CI** - `npm run lighthouse-scan`
3. **Web Vitals** - Monitor real user data in GA4
4. **Chrome DevTools** - Performance tab for detailed waterfall

---

**Document prepared by:** Claude Code Analysis
**Ready for implementation:** Yes
**Estimated total time:** 2-3 weeks
