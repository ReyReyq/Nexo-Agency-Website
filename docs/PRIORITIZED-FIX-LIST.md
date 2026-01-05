# Nexo Vision - Prioritized Fix List

**Generated:** January 5, 2026
**Total Issues:** 28
**Estimated Total Effort:** 4 weeks

---

## 🔴 CRITICAL - Fix Immediately (7 items)

### 1. Add Security Headers to vercel.json
**Impact:** Security | **Effort:** Low (30 min)
**File:** `vercel.json`

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "Strict-Transport-Security", "value": "max-age=31536000; includeSubDomains" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" },
        { "key": "Permissions-Policy", "value": "camera=(), microphone=(), geolocation=()" }
      ]
    }
  ]
}
```

---

### 2. Implement DOMPurify for XSS Prevention
**Impact:** Security | **Effort:** Low (1 hour)
**Files:** `BlogArticle.tsx`, `FallingText.tsx`

```bash
npm install dompurify @types/dompurify
```

```typescript
// BlogArticle.tsx:315
import DOMPurify from 'dompurify';

<div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(article.content) }} />
```

---

### 3. Restrict CORS Origins
**Impact:** Security | **Effort:** Low (30 min)
**File:** `api/submit-form.ts`

```typescript
// Replace line 290
const allowedOrigins = ['https://nexo.agency', 'https://www.nexo.agency'];
const origin = req.headers.origin;
if (origin && allowedOrigins.includes(origin)) {
  res.setHeader('Access-Control-Allow-Origin', origin);
}
```

---

### 4. Create sitemap.xml
**Impact:** SEO | **Effort:** Medium (2 hours)
**File:** `public/sitemap.xml`

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaporg/schemas/sitemap/0.9">
  <url><loc>https://nexo.agency/</loc><priority>1.0</priority></url>
  <url><loc>https://nexo.agency/services</loc><priority>0.9</priority></url>
  <url><loc>https://nexo.agency/about</loc><priority>0.8</priority></url>
  <url><loc>https://nexo.agency/blog</loc><priority>0.8</priority></url>
  <url><loc>https://nexo.agency/portfolio</loc><priority>0.8</priority></url>
  <url><loc>https://nexo.agency/contact</loc><priority>0.7</priority></url>
  <!-- Add all service pages -->
  <!-- Add all blog articles -->
</urlset>
```

Update `public/robots.txt`:
```
Sitemap: https://nexo.agency/sitemap.xml
```

---

### 5. Add Helmet Meta Tags to All Pages
**Impact:** SEO | **Effort:** Medium (3 hours)
**Files:** All page components

```typescript
// Example for Index.tsx
import { Helmet } from 'react-helmet-async';

<Helmet>
  <title>נקסו - סוכנות דיגיטל לעסקים | עיצוב אתרים ושיווק</title>
  <meta name="description" content="נקסו - סוכנות דיגיטל מובילה בישראל. שירותי עיצוב אתרים, פיתוח, שיווק דיגיטלי ומיתוג." />
  <link rel="canonical" href="https://nexo.agency/" />
  <meta property="og:url" content="https://nexo.agency/" />
  <meta property="og:title" content="נקסו - סוכנות דיגיטל לעסקים" />
</Helmet>
```

---

### 6. Fix Color Contrast (Primary Pink)
**Impact:** Accessibility | **Effort:** Medium (2 hours)
**File:** `tailwind.config.ts`

Current: `#FF1493` (3.1:1 contrast)
Required: 4.5:1 minimum

Options:
- Darken to `#E6007E` (4.6:1)
- Use on dark backgrounds only
- Add text shadow for legibility

---

### 7. Add Form Labels
**Impact:** Accessibility | **Effort:** Low (1 hour)
**Files:** `Contact.tsx`, `ContactPage.tsx`

```tsx
<label htmlFor="name" className="sr-only">שם מלא</label>
<input id="name" name="name" ... />
```

---

## 🟠 HIGH PRIORITY - Fix Soon (8 items)

### 8. Enable TypeScript Strict Mode
**Impact:** Code Quality | **Effort:** High (1 day)
**File:** `tsconfig.app.json`

```json
{
  "compilerOptions": {
    "strict": true
  }
}
```

*Note: Will surface type errors that need fixing*

---

### 9. Lazy Load Three.js Bundle
**Impact:** Performance | **Effort:** Medium (3 hours)
**File:** `vite.config.ts`

Three.js is 820KB. Only pages using 3D need it:
- Move Globe, Ballpit to dynamic imports
- Use React.lazy() for 3D components

---

### 10. Compress Hero Images
**Impact:** Performance | **Effort:** Low (1 hour)
**Files in public/images:**
- `simply-hero-img.avif` (6MB → <500KB)
- `teenvesror-hero-img.avif` (5.2MB → <500KB)

Use: `squoosh.app` or `sharp` to compress

---

### 11. Add Skip Links
**Impact:** Accessibility | **Effort:** Low (30 min)
**File:** `GlassNavbar.tsx`

```tsx
<a href="#main-content" className="sr-only focus:not-sr-only focus:absolute ...">
  דלג לתוכן הראשי
</a>
```

---

### 12. Implement Prerendering
**Impact:** SEO | **Effort:** High (4 hours)
**File:** `vite.config.ts`

```bash
npm install vite-plugin-prerender
```

```typescript
import prerender from 'vite-plugin-prerender';

plugins: [
  prerender({
    routes: ['/', '/about', '/services', '/blog', '/contact', '/portfolio']
  })
]
```

---

### 13. Add Organization JSON-LD Schema
**Impact:** SEO | **Effort:** Medium (1 hour)
**File:** `Index.tsx`

```tsx
<script type="application/ld+json">
{JSON.stringify({
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "נקסו",
  "url": "https://nexo.agency",
  "logo": "https://nexo.agency/logo.png",
  "sameAs": ["https://instagram.com/nexo", "https://facebook.com/nexo"]
})}
</script>
```

---

### 14. Replace Hardcoded Colors with Tokens
**Impact:** Design | **Effort:** Medium (2 hours)
**Files:** Multiple

| Find | Replace With |
|------|--------------|
| `#FF1493` | `hsl(var(--primary))` |
| `#FAF9F6` | `bg-nexo-light` |
| `#1a1a1a` | `text-nexo-charcoal` |
| `#3d3d3d` | `text-nexo-slate` |

---

### 15. Fix NPM Vulnerabilities
**Impact:** Security | **Effort:** Medium (1 hour)

```bash
npm audit fix
# For breaking changes:
npm audit fix --force
```

*4 high severity in @vercel/node*

---

## 🟡 MEDIUM PRIORITY - Plan to Fix (8 items)

| # | Issue | Effort | Notes |
|---|-------|--------|-------|
| 16 | Add srcset responsive images | Medium | Use `<picture>` element |
| 17 | Increase touch targets to 44px | Low | Carousel buttons, FAQ |
| 18 | Translate 404 page to Hebrew | Low | NotFound.tsx |
| 19 | Add error boundaries | Medium | Wrap main sections |
| 20 | Implement CSRF protection | Medium | Token-based or Origin check |
| 21 | Add aria-labels to icon buttons | Low | Menu, close buttons |
| 22 | Add Breadcrumb schema | Medium | All subpages |
| 23 | Split SubServiceDetail component | High | 1,732 lines → multiple |

---

## 🟢 LOW PRIORITY - Nice to Have (5 items)

| # | Issue | Effort | Notes |
|---|-------|--------|-------|
| 24 | Standardize animation easings | Low | Define in config |
| 25 | Add Escape keyboard shortcut | Low | Close modals/nav |
| 26 | Self-host fonts | Medium | Eliminate CDN dependency |
| 27 | Add SRI to external resources | Low | Integrity hashes |
| 28 | Reduce `any` types to 0 | Medium | 10 current usages |

---

## Implementation Checklist

### Week 1: Security & SEO Critical
- [ ] #1 Security headers
- [ ] #2 DOMPurify
- [ ] #3 CORS restriction
- [ ] #4 Sitemap
- [ ] #5 Helmet on 2 pages (Index, Services)

### Week 2: Accessibility & SEO
- [ ] #5 Helmet remaining pages
- [ ] #6 Color contrast fix
- [ ] #7 Form labels
- [ ] #11 Skip links
- [ ] #13 Organization schema

### Week 3: Performance
- [ ] #9 Three.js lazy loading
- [ ] #10 Image compression
- [ ] #12 Prerendering
- [ ] #16 Responsive images

### Week 4: Code Quality
- [ ] #8 TypeScript strict mode
- [ ] #15 NPM vulnerabilities
- [ ] #19 Error boundaries
- [ ] #14 Design tokens

---

## Quick Wins (Can do in <30 min each)

1. Add sitemap directive to robots.txt
2. Add `loading="lazy"` to remaining images
3. Add `aria-label` to hamburger menu button
4. Add `rel="canonical"` to index.html
5. Update OG image from lovable.dev to nexo.agency

---

**Next Steps:**
1. Start with Critical items (#1-7)
2. Run Lighthouse after each phase
3. Re-audit security headers after deployment
