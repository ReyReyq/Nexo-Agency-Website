/**
 * Scroll Depth Tracker
 * Tracks scroll progress at specified thresholds
 * Optimized for GA4 and Clarity integration
 */

export interface ScrollDepthConfig {
  thresholds: number[]; // Percentages: [25, 50, 75, 90]
  debounceMs?: number;
  trackElementWise?: boolean; // Track depth per element
}

export interface ScrollDepthData {
  depth: number; // 0-100 percentage
  isThreshold: boolean; // Hit a defined threshold
  threshold?: number; // Which threshold (if applicable)
  timeOnPage: number; // Milliseconds
  readingSpeed?: number; // Words per minute estimate
  elementVisibility?: Record<string, boolean>; // Which sections are visible
}

class ScrollDepthTracker {
  private config: ScrollDepthConfig;
  private trackedThresholds: Set<number> = new Set();
  private pageStartTime: number = Date.now();
  private maxDepthReached: number = 0;
  private debounceTimer: number | null = null;
  private resizeObserver: ResizeObserver | null = null;
  private lastScrollY: number = 0;

  constructor(config: ScrollDepthConfig = { thresholds: [25, 50, 75, 90] }) {
    this.config = config;
    this.init();
  }

  private init(): void {
    // Use passive event listeners for scroll performance
    window.addEventListener('scroll', () => this.handleScroll(), { passive: true });
    window.addEventListener('resize', () => this.handleResize(), { passive: true });

    // Initial calculation
    this.calculateScrollDepth();

    // Cleanup on page unload
    window.addEventListener('beforeunload', () => this.cleanup());
  }

  private handleScroll(): void {
    this.lastScrollY = window.scrollY;

    // Debounce scroll calculations
    if (this.debounceTimer !== null) {
      clearTimeout(this.debounceTimer);
    }

    this.debounceTimer = window.setTimeout(() => {
      this.calculateScrollDepth();
    }, this.config.debounceMs || 150);
  }

  private handleResize(): void {
    // Recalculate on window resize (affects scroll depth %)
    this.calculateScrollDepth();
  }

  private calculateScrollDepth(): void {
    const scrollPercentage = this.getScrollPercentage();
    const timeOnPage = Date.now() - this.pageStartTime;

    // Track maximum depth reached
    if (scrollPercentage > this.maxDepthReached) {
      this.maxDepthReached = scrollPercentage;
    }

    // Check for threshold hits
    for (const threshold of this.config.thresholds) {
      if (scrollPercentage >= threshold && !this.trackedThresholds.has(threshold)) {
        this.trackedThresholds.add(threshold);
        this.onThresholdReached({
          depth: scrollPercentage,
          isThreshold: true,
          threshold,
          timeOnPage,
        });
      }
    }
  }

  private getScrollPercentage(): number {
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (scrollHeight === 0) return 0;

    const scrolled = window.scrollY;
    return Math.round((scrolled / scrollHeight) * 100);
  }

  private onThresholdReached(data: ScrollDepthData): void {
    // Fire GA4 event
    if (window.gtag) {
      window.gtag('event', 'scroll_depth', {
        scroll_depth: data.threshold,
        page_title: document.title,
        scroll_trigger: `${data.threshold}%`,
        max_scroll_depth: this.maxDepthReached,
        time_to_scroll: data.timeOnPage,
      });
    }

    // Log for debugging
    if (import.meta.env.DEV) {
      console.log(`[ScrollDepth] Threshold ${data.threshold}% reached at ${data.timeOnPage}ms`);
    }
  }

  /**
   * Get current scroll depth data
   */
  public getScrollDepthData(): ScrollDepthData {
    return {
      depth: this.getScrollPercentage(),
      isThreshold: this.trackedThresholds.size > 0,
      timeOnPage: Date.now() - this.pageStartTime,
      elementVisibility: this.config.trackElementWise ? this.getVisibleElements() : undefined,
    };
  }

  /**
   * Get maximum scroll depth reached in this session
   */
  public getMaxDepth(): number {
    return this.maxDepthReached;
  }

  /**
   * Get all thresholds that have been reached
   */
  public getTrackedThresholds(): number[] {
    return Array.from(this.trackedThresholds).sort((a, b) => a - b);
  }

  /**
   * Reset tracker (useful for testing)
   */
  public reset(): void {
    this.trackedThresholds.clear();
    this.pageStartTime = Date.now();
    this.maxDepthReached = 0;
  }

  /**
   * Track visibility of specific elements
   */
  private getVisibleElements(): Record<string, boolean> {
    const visible: Record<string, boolean> = {};
    const elements = document.querySelectorAll('[data-track-visibility]');

    elements.forEach((el) => {
      const id = el.getAttribute('data-track-visibility') || '';
      const rect = el.getBoundingClientRect();
      visible[id] = rect.top < window.innerHeight && rect.bottom > 0;
    });

    return visible;
  }

  /**
   * Cleanup resources
   */
  private cleanup(): void {
    if (this.debounceTimer !== null) {
      clearTimeout(this.debounceTimer);
    }
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
  }
}

// Export singleton instance
let instance: ScrollDepthTracker | null = null;

export function getScrollDepthTracker(): ScrollDepthTracker {
  if (!instance) {
    instance = new ScrollDepthTracker();
  }
  return instance;
}

export const scrollDepthTracker = getScrollDepthTracker();
