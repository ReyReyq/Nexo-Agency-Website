/**
 * Nexo Vision - Standardized Animation Configuration
 *
 * This file defines the animation easings and transition configurations
 * used throughout the application for consistency.
 *
 * USAGE:
 *
 * 1. CSS Transitions (Tailwind):
 *    Use the custom timing function classes defined in tailwind.config.ts:
 *    - ease-nexo-default: Standard smooth ease-out
 *    - ease-nexo-smooth: Natural feeling ease
 *    - ease-nexo-snappy: Fast, responsive ease-out
 *    - ease-nexo-enter: Entrance animations
 *    - ease-nexo-exit: Exit animations
 *    - ease-nexo-expressive: Dramatic, expressive animations
 *
 * 2. Framer Motion:
 *    Import easings/springs directly:
 *    ```tsx
 *    import { easings, springs, transitions } from '@/lib/animation-config';
 *
 *    <motion.div transition={{ duration: 0.8, ease: easings.default }} />
 *    <motion.div transition={springs.snappy} />
 *    <motion.div transition={transitions.pageEnter} />
 *    ```
 *
 * 3. GSAP:
 *    Use the gsapEasings object:
 *    ```ts
 *    import { gsapEasings } from '@/lib/animation-config';
 *
 *    gsap.to(element, { ease: gsapEasings.default });
 *    ```
 */

// ============================================================================
// CUBIC BEZIER EASINGS
// ============================================================================

/**
 * Cubic bezier easing values for Framer Motion and CSS transitions.
 *
 * These are the standard easing curves used throughout the application.
 * Each easing has a specific purpose:
 *
 * - default: Standard smooth ease-out, good for most animations
 * - smooth: Natural feeling ease, similar to CSS "ease"
 * - snappy: Fast, responsive ease-out for interactive elements
 * - enter: Optimized for entrance animations (deceleration)
 * - exit: Optimized for exit animations (acceleration)
 * - expressive: Dramatic, expressive animations with overshoot feel
 * - gentle: Soft, subtle animations
 */
export const easings = {
  // Standard easings
  default: [0.4, 0, 0.2, 1] as const,      // Material Design standard ease-out
  smooth: [0.25, 0.1, 0.25, 1] as const,   // CSS ease equivalent
  snappy: [0.4, 0, 0, 1] as const,         // Fast ease-out, responsive

  // Entrance/exit (following animation principles)
  enter: [0, 0, 0.2, 1] as const,          // Ease-out for entrances
  exit: [0.4, 0, 1, 1] as const,           // Ease-in for exits

  // Expressive (hero sections, dramatic reveals)
  expressive: [0.16, 1, 0.3, 1] as const,  // Strong ease-out with character

  // Gentle (subtle UI changes)
  gentle: [0.22, 1, 0.36, 1] as const,     // Very soft ease-out

  // Special purpose
  ribbon: [0.2, 0.8, 0.2, 1] as const,     // For ribbon/wave animations
  gooey: [0.19, 1, 0.22, 1] as const,      // Gooey button effect
  gooeyHover: [0.32, 0.99, 0.49, 0.99] as const, // Gooey button hover state
} as const;

/**
 * CSS cubic-bezier strings for use in style attributes and inline CSS.
 * These match the easings object but as CSS-compatible strings.
 */
export const cssEasings = {
  default: 'cubic-bezier(0.4, 0, 0.2, 1)',
  smooth: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
  snappy: 'cubic-bezier(0.4, 0, 0, 1)',
  enter: 'cubic-bezier(0, 0, 0.2, 1)',
  exit: 'cubic-bezier(0.4, 0, 1, 1)',
  expressive: 'cubic-bezier(0.16, 1, 0.3, 1)',
  gentle: 'cubic-bezier(0.22, 1, 0.36, 1)',
  ribbon: 'cubic-bezier(0.2, 0.8, 0.2, 1)',
  gooey: 'cubic-bezier(0.19, 1, 0.22, 1)',
  gooeyHover: 'cubic-bezier(0.32, 0.99, 0.49, 0.99)',
} as const;

// ============================================================================
// SPRING CONFIGURATIONS (Framer Motion)
// ============================================================================

/**
 * Spring configurations for Framer Motion.
 *
 * Springs provide natural, physics-based animations that feel organic.
 * Use these for interactive elements, buttons, and responsive feedback.
 *
 * Guidelines:
 * - Higher stiffness = faster, more responsive
 * - Higher damping = less oscillation/bounce
 * - bounce property (0-1) for simpler spring control
 */
export const springs = {
  // Quick, responsive (buttons, toggles, interactive elements)
  snappy: {
    type: 'spring' as const,
    stiffness: 400,
    damping: 25,
  },

  // Standard spring (general purpose)
  default: {
    type: 'spring' as const,
    stiffness: 350,
    damping: 40,
  },

  // Smooth, flowing (page transitions, large elements)
  smooth: {
    type: 'spring' as const,
    stiffness: 100,
    damping: 30,
  },

  // Bouncy (playful interactions, notifications)
  bouncy: {
    type: 'spring' as const,
    stiffness: 300,
    damping: 20,
  },

  // Gentle (subtle movements, ambient animations)
  gentle: {
    type: 'spring' as const,
    stiffness: 80,
    damping: 25,
  },

  // Magnetic/cursor effects
  magnetic: {
    type: 'spring' as const,
    stiffness: 150,
    damping: 15,
  },

  // Ripple/button effects
  ripple: {
    type: 'spring' as const,
    stiffness: 400,
    damping: 10,
  },

  // Menu/navigation
  nav: {
    type: 'spring' as const,
    damping: 50,
    stiffness: 180,
  },

  // Card/expandable content
  card: {
    type: 'spring' as const,
    bounce: 0.5,
  },
} as const;

// ============================================================================
// DURATION PRESETS
// ============================================================================

/**
 * Standard duration values in seconds.
 * Use these for consistent timing across animations.
 */
export const durations = {
  instant: 0.1,      // Micro-interactions, toggles
  fast: 0.2,         // Quick feedback, small UI changes
  normal: 0.3,       // Standard transitions
  medium: 0.5,       // Page element animations
  slow: 0.8,         // Hero animations, page transitions
  slower: 1,         // Dramatic reveals, loading states
  slowest: 1.5,      // Special effects, preloader
} as const;

// ============================================================================
// COMPLETE TRANSITION PRESETS
// ============================================================================

/**
 * Pre-configured transition objects for common animation patterns.
 * Import and use directly with Framer Motion components.
 */
export const transitions = {
  // Page/hero transitions
  pageEnter: {
    duration: durations.slow,
    ease: easings.expressive,
  },

  pageContent: {
    duration: durations.slow,
    delay: 0.2,
    ease: easings.expressive,
  },

  // Section reveals
  sectionReveal: {
    duration: durations.medium,
    ease: easings.smooth,
  },

  // Card/item animations
  cardHover: {
    duration: durations.normal,
    ease: easings.snappy,
  },

  // Text animations
  textReveal: {
    duration: durations.slow,
    ease: easings.smooth,
  },

  // Floating/ambient animations
  float: {
    duration: 5,
    repeat: Infinity,
    ease: 'easeInOut' as const,
  },

  // Linear/continuous animations
  continuous: {
    duration: 1,
    repeat: Infinity,
    ease: 'linear' as const,
  },

  // Accordion/collapse
  accordion: {
    duration: durations.fast,
    ease: easings.default,
  },

  // Modal/dialog
  modal: {
    type: 'spring' as const,
    duration: 0.5,
    bounce: 0.15,
  },

  // Modal exit
  modalExit: {
    duration: durations.fast,
    ease: easings.exit,
  },

  // Stagger container
  staggerContainer: {
    staggerChildren: 0.1,
    delayChildren: 0.2,
  },

  // Stagger item
  staggerItem: {
    duration: durations.medium,
    ease: easings.expressive,
  },
} as const;

// ============================================================================
// GSAP EASINGS
// ============================================================================

/**
 * GSAP-compatible easing strings.
 * Use with GSAP animations: gsap.to(el, { ease: gsapEasings.default })
 */
export const gsapEasings = {
  default: 'power2.out',
  smooth: 'power1.inOut',
  snappy: 'power3.out',
  enter: 'power2.out',
  exit: 'power2.in',
  expressive: 'power4.out',
  gentle: 'power1.out',
  elastic: 'elastic.out(1, 0.75)',
  bounce: 'bounce.out',
} as const;

// ============================================================================
// ANIMATION VARIANTS (Framer Motion)
// ============================================================================

/**
 * Common animation variants for Framer Motion.
 * Use with the variants prop on motion components.
 */
export const variants = {
  // Fade in from below
  fadeInUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
  },

  // Fade in from above
  fadeInDown: {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 10 },
  },

  // Fade in from left
  fadeInLeft: {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
  },

  // Fade in from right
  fadeInRight: {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  },

  // Scale up
  scaleIn: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
  },

  // Stagger container
  staggerContainer: {
    initial: {},
    animate: {
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  },
} as const;

// ============================================================================
// TYPE EXPORTS
// ============================================================================

export type EasingName = keyof typeof easings;
export type SpringName = keyof typeof springs;
export type DurationName = keyof typeof durations;
export type TransitionName = keyof typeof transitions;
export type VariantName = keyof typeof variants;
