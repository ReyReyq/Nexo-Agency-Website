# Nexo Vision Animation System

This document describes the standardized animation system used throughout the Nexo Vision website.

## Overview

All animations in the application should use the standardized easings and transitions defined in `src/lib/animation-config.ts` and `tailwind.config.ts`. This ensures visual consistency and makes animations easy to maintain.

## Quick Reference

### Tailwind CSS Classes

Use these timing function classes for CSS transitions:

| Class | Use Case | Cubic Bezier |
|-------|----------|--------------|
| `ease-nexo-default` | Standard animations | `cubic-bezier(0.4, 0, 0.2, 1)` |
| `ease-nexo-smooth` | Natural, flowing | `cubic-bezier(0.25, 0.1, 0.25, 1)` |
| `ease-nexo-snappy` | Quick, responsive | `cubic-bezier(0.4, 0, 0, 1)` |
| `ease-nexo-enter` | Entrance animations | `cubic-bezier(0, 0, 0.2, 1)` |
| `ease-nexo-exit` | Exit animations | `cubic-bezier(0.4, 0, 1, 1)` |
| `ease-nexo-expressive` | Hero sections, dramatic reveals | `cubic-bezier(0.16, 1, 0.3, 1)` |
| `ease-nexo-gentle` | Subtle UI changes | `cubic-bezier(0.22, 1, 0.36, 1)` |

Example usage:
```html
<div class="transition-all duration-300 ease-nexo-snappy hover:scale-105">
  Button content
</div>
```

### Framer Motion

Import from the animation config:

```tsx
import { easings, springs, transitions, variants } from '@/lib/animation-config';

// Using cubic bezier easings
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.8, ease: easings.expressive }}
>

// Using spring animations
<motion.button
  whileHover={{ scale: 1.05 }}
  transition={springs.snappy}
>

// Using preset transitions
<motion.section
  initial={{ opacity: 0 }}
  whileInView={{ opacity: 1 }}
  transition={transitions.pageEnter}
>

// Using variants
<motion.div variants={variants.fadeInUp} initial="initial" animate="animate">
```

### GSAP

```ts
import { gsapEasings } from '@/lib/animation-config';

gsap.to(element, {
  y: 0,
  opacity: 1,
  duration: 0.8,
  ease: gsapEasings.expressive
});
```

## Easing Categories

### Standard Easings

- **default**: Material Design standard ease-out. Good for most UI animations.
- **smooth**: Natural feeling ease, similar to CSS "ease". Good for flowing movements.
- **snappy**: Fast, responsive ease-out. Good for interactive elements like buttons.

### Entrance/Exit

- **enter**: Optimized for elements entering the viewport (deceleration focus).
- **exit**: Optimized for elements leaving the viewport (acceleration focus).

### Special Purpose

- **expressive**: Dramatic, characterful animations. Use for hero sections, page transitions, and feature reveals.
- **gentle**: Very subtle ease. Use for minor UI state changes.
- **ribbon**: Specialized for wave/ribbon animations.
- **gooey/gooeyHover**: Specialized for gooey button effects.

## Spring Configurations

Springs provide physics-based, natural-feeling animations. They're especially good for interactive elements.

| Spring | Stiffness | Damping | Use Case |
|--------|-----------|---------|----------|
| `snappy` | 400 | 25 | Buttons, toggles, quick interactions |
| `default` | 350 | 40 | General purpose |
| `smooth` | 100 | 30 | Page transitions, large elements |
| `bouncy` | 300 | 20 | Playful interactions, notifications |
| `gentle` | 80 | 25 | Ambient animations |
| `magnetic` | 150 | 15 | Cursor effects, magnetic elements |
| `ripple` | 400 | 10 | Button ripple effects |
| `nav` | 180 (stiff), 50 (damp) | - | Navigation menus |
| `card` | bounce: 0.5 | - | Expandable cards |

## Duration Guidelines

Standard duration values (in seconds):

| Duration | Value | Use Case |
|----------|-------|----------|
| instant | 0.1s | Micro-interactions, state toggles |
| fast | 0.2s | Quick feedback, small changes |
| normal | 0.3s | Standard UI transitions |
| medium | 0.5s | Page element animations |
| slow | 0.8s | Hero animations, page transitions |
| slower | 1s | Dramatic reveals |
| slowest | 1.5s | Special effects, preloader |

## Best Practices

### Do:

1. Use `expressive` easing for hero sections and page transitions
2. Use `snappy` spring for interactive elements (buttons, cards)
3. Use `smooth` spring or easing for large page transitions
4. Use `enter`/`exit` easings for mount/unmount animations
5. Keep durations consistent within the same context
6. Use shorter durations on mobile for better perceived performance

### Don't:

1. Mix multiple easing styles in the same animation sequence
2. Use `linear` for UI elements (except continuous animations like spinners)
3. Use durations longer than 1s for common interactions
4. Create custom cubic-bezier values without good reason

## Migration Guide

When updating existing animations to use the standardized system:

### CSS Transitions

Replace:
```css
transition: all 0.3s ease-in-out;
```

With:
```css
transition: all 0.3s;
/* Then in className: */
className="... ease-nexo-smooth"
```

### Framer Motion

Replace inline easings:
```tsx
// Before
transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}

// After
import { easings } from '@/lib/animation-config';
transition={{ duration: 0.8, ease: easings.expressive }}
```

Replace inline springs:
```tsx
// Before
transition={{ type: "spring", stiffness: 400, damping: 25 }}

// After
import { springs } from '@/lib/animation-config';
transition={springs.snappy}
```

## File Locations

- **Configuration**: `src/lib/animation-config.ts`
- **Tailwind Config**: `tailwind.config.ts` (transitionTimingFunction section)
- **Documentation**: `docs/animation-system.md` (this file)
