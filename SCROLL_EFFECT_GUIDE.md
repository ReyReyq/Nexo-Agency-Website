# Scroll-Over Effect Pattern Guide

This guide documents the scroll-over effect used between the Hero section and content sections in the Nexo website.

## Overview

The scroll-over effect creates the illusion that content slides up and covers a fixed background section. This is achieved through:
1. **Fixed positioning** for the background section
2. **Z-index layering** to stack content above
3. **Scroll-linked animations** using Framer Motion

---

## Architecture

### Page Structure (Index.tsx)

```jsx
<div className="min-h-screen bg-background">
  {/* Fixed Hero Container */}
  <div className="relative h-screen">
    <div className="fixed inset-0 z-0">
      <Hero />
    </div>
  </div>

  {/* Scrollable Content - scrolls OVER the hero */}
  <div className="relative z-10">
    <ServicesSection />
    <AboutSection />
    {/* ... more sections */}
  </div>
</div>
```

### Key CSS Classes

| Class | Purpose |
|-------|---------|
| `relative h-screen` | Creates a "slot" for the fixed hero (takes viewport height) |
| `fixed inset-0 z-0` | Fixes hero to viewport, behind everything |
| `relative z-10` | Content floats above hero, in normal document flow |

---

## Z-Index Layering Strategy

```
Z-INDEX LAYERS (lowest to highest):
─────────────────────────────────────
z-0    Hero section (fixed, stays behind)
z-10   Main content sections (scrolls over hero)
z-20+  UI elements (navbar, modals, overlays)
```

---

## Scroll-Linked Animations

### Using Framer Motion's useScroll + useTransform

```jsx
import { useScroll, useTransform, motion } from "framer-motion";
import { useRef } from "react";

const Hero = () => {
  const sectionRef = useRef(null);

  // Track scroll progress (0 to 1)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  // Define scroll animations
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.3]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 150]);

  return (
    <section ref={sectionRef} className="relative h-full w-full">
      {/* Background with scale animation */}
      <motion.div style={{ scale: imageScale }} className="absolute inset-0">
        <img src="image.jpg" className="w-full h-full object-cover" />
      </motion.div>

      {/* Content with fade and movement */}
      <motion.div style={{ y: contentY, opacity: contentOpacity }}>
        <h1>Your Headline</h1>
      </motion.div>
    </section>
  );
};
```

### Animation Parameters Explained

| Animation | Input Range | Output Range | Effect |
|-----------|-------------|--------------|--------|
| `imageScale` | [0, 1] | [1, 1.3] | Image zooms 30% as user scrolls |
| `contentOpacity` | [0, 0.5] | [1, 0] | Fades out in first 50% of scroll |
| `contentY` | [0, 1] | [0, 150] | Text moves down 150px |

### useScroll Offset Explained

```javascript
offset: ["start start", "end start"]
//       [element, viewport]

// "start start" = element's top reaches viewport's top
// "end start" = element's bottom reaches viewport's top
```

---

## Step-by-Step Implementation

### Step 1: Page Layout Structure

```jsx
// pages/YourPage.tsx
export default function YourPage() {
  return (
    <div className="min-h-screen">
      {/* Fixed Background Section */}
      <div className="relative h-screen">
        <div className="fixed inset-0 z-0">
          <YourFixedSection />
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="relative z-10">
        <YourContentSections />
      </div>
    </div>
  );
}
```

### Step 2: Fixed Section Component

```jsx
// components/YourFixedSection.tsx
import { useScroll, useTransform, motion } from "framer-motion";
import { useRef } from "react";

export default function YourFixedSection() {
  const sectionRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.2]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section
      ref={sectionRef}
      className="relative h-full w-full bg-gray-900 overflow-hidden"
    >
      {/* Background Layer */}
      <motion.div style={{ scale }} className="absolute inset-0">
        <img
          src="/your-image.jpg"
          alt=""
          className="w-full h-full object-cover"
        />
        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent" />
      </motion.div>

      {/* Content Layer */}
      <motion.div
        style={{ opacity }}
        className="relative z-10 flex items-center justify-center h-full"
      >
        <h1 className="text-white text-6xl font-bold">Your Title</h1>
      </motion.div>
    </section>
  );
}
```

### Step 3: Scrollable Content Section

```jsx
// components/YourContentSection.tsx
export default function YourContentSection() {
  return (
    <section className="min-h-screen py-20 bg-white relative">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold">Content Section</h2>
        <p>This section scrolls over the fixed background.</p>
      </div>
    </section>
  );
}
```

---

## Advanced Techniques

### Multiple Gradient Overlays for Depth

```jsx
{/* Three layers create rich depth */}
<div className="absolute inset-0">
  <img src="image.jpg" className="w-full h-full object-cover" />
</div>
<div className="absolute inset-0 bg-gradient-to-t from-hero-bg/80 via-hero-bg/30 to-transparent" />
<div className="absolute inset-0 bg-gradient-to-r from-hero-bg/60 to-transparent" />
```

### Staggered Text Reveal

```jsx
{["Line 1", "Line 2", "Line 3"].map((line, index) => (
  <div key={index} className="overflow-hidden">
    <motion.h1
      initial={{ y: 200, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{
        duration: 1,
        delay: index * 0.1,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {line}
    </motion.h1>
  </div>
))}
```

### Magnetic Button Effect

```jsx
const mouseX = useMotionValue(0);
const mouseY = useMotionValue(0);
const springX = useSpring(mouseX, { stiffness: 150, damping: 15 });
const springY = useSpring(mouseY, { stiffness: 150, damping: 15 });

<motion.button
  style={{ x: springX, y: springY }}
  onMouseMove={(e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left - rect.width / 2) * 0.3);
    mouseY.set((e.clientY - rect.top - rect.height / 2) * 0.3);
  }}
  onMouseLeave={() => {
    mouseX.set(0);
    mouseY.set(0);
  }}
>
  Hover Me
</motion.button>
```

---

## Customization Options

| Parameter | Default | Effect |
|-----------|---------|--------|
| Scale range | `[1, 1.3]` | Zoom intensity (use `[1, 1.1]` for subtle) |
| Opacity range | `[0, 0.5]` | Fade speed (use `[0, 1]` for slower fade) |
| Y translation | `[0, 150]` | Text movement distance |
| Section height | `h-screen` | Change to `h-[150vh]` for longer scroll area |

---

## Sticky vs Fixed: When to Use Each

### Fixed Positioning (Hero Pattern)
- **Use for**: Main hero backgrounds that should stay completely static
- **Behavior**: Element stays anchored to viewport
- **Best for**: First section of page

### Sticky Positioning (Section Pattern)
- **Use for**: Sections that should stick temporarily then scroll away
- **Behavior**: Sticks within parent container bounds
- **Best for**: Mid-page feature sections

```jsx
{/* Sticky example */}
<div className="relative z-20">
  <div className="sticky top-0 h-[70vh]">
    {/* Content sticks while scrolling through parent */}
  </div>
</div>
```

---

## Performance Tips

1. **Use transform-based animations** (`scale`, `x`, `y`, `opacity`) - GPU accelerated
2. **Avoid layout animations** (`width`, `height`, `top`, `left`) - causes reflow
3. **Fixed positioning** prevents constant layout recalculation
4. **`will-change: transform`** - Framer Motion handles this automatically

---

## Browser Support

- Framer Motion: Modern browsers (Chrome, Firefox, Safari, Edge)
- Fixed/Sticky positioning: All modern browsers
- CSS transforms: Full support

---

## Files Reference

| File | Purpose |
|------|---------|
| `pages/Index.tsx` | Page layout with fixed hero + scrollable content |
| `components/Hero.tsx` | Scroll-linked animations implementation |
| `components/ServicesSection.tsx` | Example content section |
| `src/index.css` | Global styles and CSS variables |
