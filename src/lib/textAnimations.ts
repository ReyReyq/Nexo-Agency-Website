import gsap from 'gsap';
import SplitType from 'split-type';

/**
 * Animation configuration constants
 */
const ANIMATION_CONFIG = {
  OUT_DURATION: 0.35,
  IN_DURATION: 0.45,
  OUT_EASE: 'power2.in',
  IN_EASE: 'power2.out',
  BLUR_AMOUNT: 8,
  Y_MOVEMENT: 40,
  STAGGER_OUT: 0.03,
  STAGGER_IN: 0.05,
  CHAR_STAGGER: 0.02,
} as const;

/**
 * Type definitions
 */
export interface CharacterRevealOptions {
  stagger?: number;
  duration?: number;
  ease?: string;
  fromY?: number;
  blur?: number;
  rtl?: boolean;
}

export interface ScrambleTextOptions {
  duration?: number;
  chars?: string;
}

export interface TextRefs {
  label: HTMLElement | null;
  title: HTMLElement | null;
  subtitle: HTMLElement | null;
  description: HTMLElement | null;
}

/**
 * Animate text elements out before content change
 * @param elements - Array of HTML elements to animate
 * @param direction - Direction of animation ('up' or 'down')
 * @param onComplete - Callback function when animation completes
 */
export const animateTextOut = (
  elements: (HTMLElement | null)[],
  direction: 'up' | 'down',
  onComplete?: () => void
): gsap.core.Timeline => {
  const timeline = gsap.timeline({
    onComplete,
  });

  const validElements = elements.filter((el): el is HTMLElement => el !== null);

  if (validElements.length === 0) {
    if (onComplete) onComplete();
    return timeline;
  }

  const yValue = direction === 'up' ? -ANIMATION_CONFIG.Y_MOVEMENT : ANIMATION_CONFIG.Y_MOVEMENT;

  timeline.to(validElements, {
    y: yValue,
    opacity: 0,
    filter: `blur(${ANIMATION_CONFIG.BLUR_AMOUNT}px)`,
    duration: ANIMATION_CONFIG.OUT_DURATION,
    ease: ANIMATION_CONFIG.OUT_EASE,
    stagger: ANIMATION_CONFIG.STAGGER_OUT,
  });

  return timeline;
};

/**
 * Animate text elements in after content change
 * @param elements - Array of HTML elements to animate
 * @param direction - Direction of animation ('up' or 'down')
 */
export const animateTextIn = (
  elements: (HTMLElement | null)[],
  direction: 'up' | 'down'
): gsap.core.Timeline => {
  const timeline = gsap.timeline();

  const validElements = elements.filter((el): el is HTMLElement => el !== null);

  if (validElements.length === 0) {
    return timeline;
  }

  const fromY = direction === 'up' ? ANIMATION_CONFIG.Y_MOVEMENT : -ANIMATION_CONFIG.Y_MOVEMENT;

  // Set initial state
  gsap.set(validElements, {
    y: fromY,
    opacity: 0,
    filter: `blur(${ANIMATION_CONFIG.BLUR_AMOUNT}px)`,
  });

  // Animate in
  timeline.to(validElements, {
    y: 0,
    opacity: 1,
    filter: 'blur(0px)',
    duration: ANIMATION_CONFIG.IN_DURATION,
    ease: ANIMATION_CONFIG.IN_EASE,
    stagger: ANIMATION_CONFIG.STAGGER_IN,
  });

  return timeline;
};

/**
 * Split text and animate characters with reveal effect
 * @param element - HTML element containing text to animate
 * @param options - Animation options including RTL support
 * @returns Cleanup function to revert split
 */
export const animateCharacterReveal = (
  element: HTMLElement,
  options: CharacterRevealOptions = {}
): (() => void) => {
  const {
    stagger = ANIMATION_CONFIG.CHAR_STAGGER,
    duration = 0.6,
    ease = 'power2.out',
    fromY = 20,
    blur = 4,
    rtl = false,
  } = options;

  // Split text into characters
  const split = new SplitType(element, { types: 'chars' });
  const chars = split.chars || [];

  if (chars.length === 0) {
    return () => {}; // No cleanup needed
  }

  // Reverse character array for RTL (Hebrew)
  const animationChars = rtl ? [...chars].reverse() : chars;

  // Set initial state
  gsap.set(chars, {
    opacity: 0,
    y: fromY,
    filter: `blur(${blur}px)`,
  });

  // Animate characters
  gsap.to(animationChars, {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    duration,
    ease,
    stagger,
  });

  // Return cleanup function
  return () => {
    if (split.revert) {
      split.revert();
    }
  };
};

/**
 * Create text scramble effect cycling through random characters
 * @param element - HTML element to apply scramble effect
 * @param newText - Final text to display after scramble
 * @param options - Scramble options
 */
export const animateScrambleText = (
  element: HTMLElement,
  newText: string,
  options: ScrambleTextOptions = {}
): gsap.core.Timeline => {
  const {
    duration = 0.6,
    chars = '0123456789',
  } = options;

  const timeline = gsap.timeline();
  const originalText = element.textContent || '';
  const steps = 12;
  const stepDuration = duration / steps;

  // Create scramble frames
  for (let i = 0; i < steps; i++) {
    const progress = i / steps;
    const revealCount = Math.floor(newText.length * progress);

    timeline.to(element, {
      duration: stepDuration,
      onStart: () => {
        let scrambled = '';
        for (let j = 0; j < newText.length; j++) {
          if (j < revealCount) {
            scrambled += newText[j];
          } else {
            scrambled += chars[Math.floor(Math.random() * chars.length)];
          }
        }
        element.textContent = scrambled;
      },
    });
  }

  // Final reveal
  timeline.to(element, {
    duration: 0,
    onStart: () => {
      element.textContent = newText;
    },
  });

  return timeline;
};

/**
 * Create a complete text transition timeline
 * Animates out -> triggers content change -> animates in
 * @param refs - Object containing text element references
 * @param direction - Direction of animation ('up' or 'down')
 * @param onMidpoint - Callback when content should change
 */
export const createTextTimeline = (
  refs: TextRefs,
  direction: 'up' | 'down',
  onMidpoint: () => void
): gsap.core.Timeline => {
  const masterTimeline = gsap.timeline();

  const elements = [
    refs.label,
    refs.title,
    refs.subtitle,
    refs.description,
  ];

  // Phase 1: Animate out
  const outTimeline = animateTextOut(
    elements,
    direction,
    () => {
      // Content change happens at midpoint
      onMidpoint();
    }
  );

  masterTimeline.add(outTimeline);

  // Phase 2: Animate in (after content change)
  const inTimeline = animateTextIn(elements, direction);
  masterTimeline.add(inTimeline);

  return masterTimeline;
};

/**
 * Utility: Kill all GSAP animations on specific elements
 * @param elements - Array of elements to kill animations on
 */
export const killTextAnimations = (elements: (HTMLElement | null)[]): void => {
  const validElements = elements.filter((el): el is HTMLElement => el !== null);
  validElements.forEach((el) => {
    gsap.killTweensOf(el);
  });
};

/**
 * Utility: Reset text element transforms and filters
 * @param elements - Array of elements to reset
 */
export const resetTextElements = (elements: (HTMLElement | null)[]): void => {
  const validElements = elements.filter((el): el is HTMLElement => el !== null);
  gsap.set(validElements, {
    y: 0,
    opacity: 1,
    filter: 'blur(0px)',
    clearProps: 'all',
  });
};

/**
 * Utility: Create staggered fade animation
 * @param elements - Array of elements to animate
 * @param options - Animation options
 */
export const staggerFade = (
  elements: (HTMLElement | null)[],
  options: {
    from?: { opacity?: number; y?: number };
    to?: { opacity?: number; y?: number };
    duration?: number;
    stagger?: number;
    ease?: string;
  } = {}
): gsap.core.Timeline => {
  const {
    from = { opacity: 0, y: 20 },
    to = { opacity: 1, y: 0 },
    duration = 0.6,
    stagger = 0.1,
    ease = 'power2.out',
  } = options;

  const timeline = gsap.timeline();
  const validElements = elements.filter((el): el is HTMLElement => el !== null);

  if (validElements.length === 0) {
    return timeline;
  }

  gsap.set(validElements, from);

  timeline.to(validElements, {
    ...to,
    duration,
    stagger,
    ease,
  });

  return timeline;
};

/**
 * Utility: Create text wave animation
 * @param element - Element containing text
 * @param options - Wave animation options
 */
export const animateTextWave = (
  element: HTMLElement,
  options: {
    duration?: number;
    stagger?: number;
    yoyo?: boolean;
    repeat?: number;
    rtl?: boolean;
  } = {}
): (() => void) => {
  const {
    duration = 0.3,
    stagger = 0.05,
    yoyo = true,
    repeat = -1,
    rtl = false,
  } = options;

  const split = new SplitType(element, { types: 'chars' });
  const chars = split.chars || [];

  if (chars.length === 0) {
    return () => {};
  }

  const animationChars = rtl ? [...chars].reverse() : chars;

  gsap.to(animationChars, {
    y: -10,
    duration,
    ease: 'power1.inOut',
    stagger,
    yoyo,
    repeat,
  });

  return () => {
    gsap.killTweensOf(chars);
    if (split.revert) {
      split.revert();
    }
  };
};

export default {
  animateTextOut,
  animateTextIn,
  animateCharacterReveal,
  animateScrambleText,
  createTextTimeline,
  killTextAnimations,
  resetTextElements,
  staggerFade,
  animateTextWave,
};
