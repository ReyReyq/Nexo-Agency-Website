/**
 * Content Visibility Tracker
 * Uses Intersection Observer API for performance-optimized visibility tracking
 * Tracks which content sections users actually see
 */

export interface VisibilityConfig {
  threshold?: number | number[]; // Visibility % to trigger (0.5 = 50%)
  rootMargin?: string; // Margin around viewport (default: "0px")
  trackVisibility?: boolean; // Use v2 API for actual visibility
  visibilityDelay?: number; // Min delay between tracking (v2)
}

export interface VisibilityData {
  elementId: string;
  isVisible: boolean;
  intersectionRatio: number; // 0-1 percentage visible
  timeToVisible?: number; // ms until element became visible
  timeVisible?: number; // ms that element was visible
}

class ContentVisibilityTracker {
  private config: VisibilityConfig;
  private observer: IntersectionObserver | null = null;
  private trackedElements: Map<string, VisibilityData> = new Map();
  private visibilityStartTime: Map<string, number> = new Map();
  private hasBeenTracked: Set<string> = new Set();
  private initialized: boolean = false;

  constructor(config: VisibilityConfig = {}) {
    this.config = {
      threshold: [0, 0.25, 0.5, 0.75, 1], // Track multiple visibility levels
      rootMargin: '-50px 0px', // Consider visible if 50px into viewport
      trackVisibility: true,
      visibilityDelay: 100, // 100ms min between checks (for v2)
      ...config,
    };
  }

  /**
   * Initialize the tracker (call once when page loads)
   */
  public init(): void {
    if (this.initialized) return;

    const observerOptions: IntersectionObserverInit = {
      threshold: this.config.threshold,
      rootMargin: this.config.rootMargin,
    };

    // Add trackVisibility for v2 API
    if (this.config.trackVisibility && this.isIntersectionObserverV2Supported()) {
      (observerOptions as any).trackVisibility = true;
      (observerOptions as any).delay = this.config.visibilityDelay;
    }

    this.observer = new IntersectionObserver(
      (entries) => this.handleIntersection(entries),
      observerOptions
    );

    // Find and observe all tracked elements
    this.observeAllTrackedElements();
    this.initialized = true;

    if (import.meta.env.DEV) {
      console.log('[VisibilityTracker] Initialized');
    }
  }

  private observeAllTrackedElements(): void {
    if (!this.observer) return;

    const trackedElements = document.querySelectorAll('[data-track-visibility]');

    trackedElements.forEach((element) => {
      const id = element.getAttribute('data-track-visibility');
      if (id) {
        this.observer!.observe(element);

        // Record initial state
        this.trackedElements.set(id, {
          elementId: id,
          isVisible: false,
          intersectionRatio: 0,
        });
      }
    });

    if (import.meta.env.DEV) {
      console.log(`[VisibilityTracker] Observing ${trackedElements.length} elements`);
    }
  }

  private handleIntersection(entries: IntersectionObserverEntry[]): void {
    entries.forEach((entry) => {
      const elementId = (entry.target as HTMLElement).getAttribute('data-track-visibility');
      if (!elementId) return;

      const isVisible = entry.isIntersecting;
      const ratio = entry.intersectionRatio;

      // Track visibility changes
      if (isVisible && !this.hasBeenTracked.has(elementId)) {
        this.hasBeenTracked.add(elementId);
        this.onElementVisible(elementId, ratio);
      }

      // Update visibility data
      const visibilityData = this.trackedElements.get(elementId) || {
        elementId,
        isVisible: false,
        intersectionRatio: 0,
      };

      visibilityData.isVisible = isVisible;
      visibilityData.intersectionRatio = ratio;
      this.trackedElements.set(elementId, visibilityData);

      // Track visibility milestones (25%, 50%, 75%, 100%)
      this.trackVisibilityMilestones(elementId, ratio);
    });
  }

  private trackVisibilityMilestones(elementId: string, ratio: number): void {
    const milestones = [0.25, 0.5, 0.75, 1.0];

    milestones.forEach((milestone) => {
      const key = `${elementId}_${milestone}`;
      if (ratio >= milestone && !this.hasBeenTracked.has(key)) {
        this.hasBeenTracked.add(key);

        // Fire GA4 event
        if (window.gtag) {
          window.gtag('event', 'content_visibility_milestone', {
            content_id: elementId,
            visibility_percentage: Math.round(milestone * 100),
          });
        }
      }
    });
  }

  private onElementVisible(elementId: string, ratio: number): void {
    const startTime = Date.now();
    this.visibilityStartTime.set(elementId, startTime);

    // Fire GA4 event
    if (window.gtag) {
      window.gtag('event', 'content_visible', {
        content_id: elementId,
        initial_visibility: Math.round(ratio * 100),
      });
    }

    if (import.meta.env.DEV) {
      console.log(`[VisibilityTracker] Element "${elementId}" became visible (${Math.round(ratio * 100)}%)`);
    }
  }

  private isIntersectionObserverV2Supported(): boolean {
    try {
      new IntersectionObserver(
        () => {},
        { trackVisibility: true, delay: 0 } as any
      );
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get visibility data for all tracked elements
   */
  public getVisibilityData(): VisibilityData[] {
    return Array.from(this.trackedElements.values());
  }

  /**
   * Check if a specific element is visible
   */
  public isElementVisible(elementId: string): boolean {
    return this.trackedElements.get(elementId)?.isVisible ?? false;
  }

  /**
   * Get visibility ratio for a specific element (0-1)
   */
  public getVisibilityRatio(elementId: string): number {
    return this.trackedElements.get(elementId)?.intersectionRatio ?? 0;
  }

  /**
   * Get count of visible sections
   */
  public getVisibleElementCount(): number {
    return Array.from(this.trackedElements.values()).filter((data) => data.isVisible).length;
  }

  /**
   * Observe a new element (useful for dynamically added content)
   */
  public observeElement(element: HTMLElement): void {
    if (!this.observer) return;

    const id = element.getAttribute('data-track-visibility');
    if (id && !this.trackedElements.has(id)) {
      this.observer.observe(element);
      this.trackedElements.set(id, {
        elementId: id,
        isVisible: false,
        intersectionRatio: 0,
      });
    }
  }

  /**
   * Stop observing an element
   */
  public unobserveElement(elementId: string): void {
    if (!this.observer) return;

    const element = document.querySelector(`[data-track-visibility="${elementId}"]`);
    if (element) {
      this.observer.unobserve(element);
      this.trackedElements.delete(elementId);
    }
  }

  /**
   * Cleanup resources
   */
  public cleanup(): void {
    if (this.observer) {
      this.observer.disconnect();
    }
    this.trackedElements.clear();
    this.visibilityStartTime.clear();
    this.hasBeenTracked.clear();
    this.initialized = false;
  }

  /**
   * Reset tracker (useful for testing)
   */
  public reset(): void {
    this.hasBeenTracked.clear();
    this.visibilityStartTime.clear();
    this.trackedElements.forEach((data) => {
      data.isVisible = false;
      data.intersectionRatio = 0;
    });
  }
}

// Export singleton instance
let instance: ContentVisibilityTracker | null = null;

export function getContentVisibilityTracker(): ContentVisibilityTracker {
  if (!instance) {
    instance = new ContentVisibilityTracker();
  }
  return instance;
}

export const contentVisibilityTracker = getContentVisibilityTracker();
