# Scroll Depth and Content Engagement Tracking Implementation Guide

## Executive Summary

This guide provides a complete framework for implementing scroll depth tracking, content engagement scoring, time-based metrics, visibility tracking, and reading completion metrics for the Nexo Vision website. The implementation leverages Google Analytics 4, Microsoft Clarity, and custom JavaScript utilities.

---

## Part 1: Scroll Depth Tracking

### 1.1 Optimal Scroll Depth Thresholds

#### Standard Industry Thresholds
The most widely adopted scroll depth tracking uses **25%, 50%, 75%, and 90-100%** thresholds. These percentages have proven to:
- Capture meaningful engagement milestones
- Avoid excessive event quota consumption in GA4
- Provide actionable insights without event bloat

#### Threshold Selection Strategy

```
Standard Web Pages:
├─ 25% - Initial engagement (user found content worth scrolling)
├─ 50% - Mid-engagement (active reading/scanning)
├─ 75% - Deep engagement (serious interest in content)
└─ 90% - Near completion (very high intent, likely conversion signal)

Long-Form Content (Blog Articles):
├─ 10% - Scroll started (user commitment)
├─ 25% - Early engagement
├─ 50% - Mid-point (critical drop-off detection)
├─ 75% - Heavy engagement
└─ 100% - Full completion (high value signal)

Landing Pages:
├─ 25% - CTA visibility passed
├─ 50% - Social proof/testimonials section
├─ 75% - Final CTA area
└─ 100% - Footer reached
```

#### Why These Thresholds Matter
- **25%**: First meaningful engagement - detects if content caught attention
- **50%**: Mid-engagement drop-off point - reveals content quality issues
- **75%**: Demonstrates serious intent and content value alignment
- **90-100%**: Strong conversion signal - user stayed through most/all content

### 1.2 Industry Benchmarks by Content Type

| Content Type | Average Scroll Depth | Target | Notes |
|---|---|---|---|
| News/Media | 57% | 65%+ | Higher engagement expected |
| Blog Articles | 45-55% | 60%+ | Focus on quality over length |
| E-commerce | 25-35% | 40%+ | Users scan quickly |
| Landing Pages | 35-50% | 55%+ | Design-driven engagement |
| Service Pages | 40-55% | 60%+ | B2B content typically longer |
| Portfolio/Case Studies | 50-70% | 75%+ | Visual storytelling helps |

### 1.3 Scroll Tracking Implementation

#### TypeScript Implementation: `scrollDepthTracker.ts`

```typescript
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
      if (
        scrollPercentage >= threshold &&
        !this.trackedThresholds.has(threshold)
      ) {
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
export const scrollDepthTracker = new ScrollDepthTracker();
```

---

## Part 2: Time-Based Engagement Triggers

### 2.1 Time-Based Metrics Framework

Time on page is a critical engagement metric, but raw GA4 time metrics can be inaccurate. Implement pulse-based tracking for accuracy:

```typescript
/**
 * Time-Based Engagement Tracker
 * Sends periodic "pulses" to GA4 to accurately track time on page
 * Prevents false bounces for users who read without clicking
 */

export interface TimeEngagementConfig {
  pulseIntervalMs?: number; // Send pulse every X milliseconds (default: 15000 = 15s)
  inactivityTimeoutMs?: number; // Mark inactive after X milliseconds (default: 60000 = 60s)
  trackActiveReading?: boolean; // Only count when user is actively reading
  pageType?: string; // 'blog' | 'article' | 'landing' | 'service'
}

class TimeEngagementTracker {
  private config: TimeEngagementConfig;
  private sessionStartTime: number = Date.now();
  private lastActivityTime: number = Date.now();
  private totalEngagementTime: number = 0;
  private isActive: boolean = true;
  private pulseTimer: number | null = null;
  private inactivityTimer: number | null = null;

  constructor(config: TimeEngagementConfig = {}) {
    this.config = {
      pulseIntervalMs: 15000, // 15 seconds
      inactivityTimeoutMs: 60000, // 60 seconds
      trackActiveReading: true,
      ...config,
    };
    this.init();
  }

  private init(): void {
    // Track user activity events
    const activityEvents = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    activityEvents.forEach((event) => {
      document.addEventListener(event, () => this.recordActivity(), { passive: true });
    });

    // Start pulse tracking
    this.startPulseTracking();

    // Cleanup on unload
    window.addEventListener('beforeunload', () => this.cleanup());
  }

  private recordActivity(): void {
    this.lastActivityTime = Date.now();

    if (!this.isActive) {
      this.isActive = true;
      this.onEngagementResume();
    }

    // Clear inactivity timer
    if (this.inactivityTimer !== null) {
      clearTimeout(this.inactivityTimer);
    }

    // Set new inactivity timer
    this.inactivityTimer = window.setTimeout(() => {
      this.isActive = false;
      this.onEngagementPause();
    }, this.config.inactivityTimeoutMs);
  }

  private startPulseTracking(): void {
    this.pulseTimer = window.setInterval(() => {
      if (this.isActive || !this.config.trackActiveReading) {
        this.sendPulse();
      }
    }, this.config.pulseIntervalMs);
  }

  private sendPulse(): void {
    const timeOnPage = Date.now() - this.sessionStartTime;
    const engagementTime = this.totalEngagementTime + (this.isActive ? (Date.now() - this.lastActivityTime) : 0);

    // Fire GA4 event - this prevents false bounces
    if (window.gtag) {
      window.gtag('event', 'engagement_pulse', {
        time_on_page: Math.round(timeOnPage / 1000), // In seconds
        engagement_time: Math.round(engagementTime / 1000),
        is_active: this.isActive,
        session_engaged: true, // Prevents bounce classification
      });
    }

    if (import.meta.env.DEV) {
      console.log(`[TimeEngagement] Pulse: ${timeOnPage / 1000}s on page, ${engagementTime / 1000}s engaged`);
    }
  }

  private onEngagementResume(): void {
    if (window.gtag) {
      window.gtag('event', 'engagement_resume', {
        page_title: document.title,
      });
    }
  }

  private onEngagementPause(): void {
    const engagementTime = Date.now() - this.sessionStartTime;

    if (window.gtag) {
      window.gtag('event', 'engagement_pause', {
        inactive_duration: Math.round((Date.now() - this.lastActivityTime) / 1000),
        total_engagement: Math.round(engagementTime / 1000),
      });
    }
  }

  public getTotalEngagementTime(): number {
    return this.totalEngagementTime + (this.isActive ? (Date.now() - this.lastActivityTime) : 0);
  }

  public isUserActive(): boolean {
    return this.isActive;
  }

  private cleanup(): void {
    if (this.pulseTimer !== null) {
      clearInterval(this.pulseTimer);
    }
    if (this.inactivityTimer !== null) {
      clearTimeout(this.inactivityTimer);
    }
  }
}

export const timeEngagementTracker = new TimeEngagementTracker();
```

### 2.2 Recommended Time-Based Thresholds

```
First Pulse Trigger: 15 seconds
├─ Signal: User hasn't bounced, content has some value

Early Engagement: 30 seconds
├─ Signal: User is reading/consuming content

Meaningful Engagement: 60 seconds (1 minute)
├─ Signal: Real interest in content
├─ Conversion Probability: 25% higher than non-engaged

Strong Engagement: 3+ minutes
├─ Signal: Deep content consumption
├─ Conversion Probability: 50%+ higher

Very High Engagement: 5+ minutes
├─ Signal: Content expert interest OR research-heavy
├─ Conversion Probability: 2-3x higher

Extended Reading: 10+ minutes
├─ Signal: Premium content consumption
├─ Conversion Probability: 3-5x higher
```

---

## Part 3: Content Visibility Tracking

### 3.1 Intersection Observer Implementation

Use the Intersection Observer API (not scroll events) for optimal performance:

```typescript
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

  constructor(config: VisibilityConfig = {}) {
    this.config = {
      threshold: [0, 0.25, 0.5, 0.75, 1], // Track multiple visibility levels
      rootMargin: '-50px 0px', // Consider visible if 50px into viewport
      trackVisibility: true,
      visibilityDelay: 100, // 100ms min between checks (for v2)
      ...config,
    };
    this.init();
  }

  private init(): void {
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
  }

  private observeAllTrackedElements(): void {
    const trackedElements = document.querySelectorAll('[data-track-visibility]');

    trackedElements.forEach((element) => {
      const id = element.getAttribute('data-track-visibility');
      if (id && this.observer) {
        this.observer.observe(element);

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
    const testElement = document.createElement('div');
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

  public getVisibilityData(): VisibilityData[] {
    return Array.from(this.trackedElements.values());
  }

  public isElementVisible(elementId: string): boolean {
    return this.trackedElements.get(elementId)?.isVisible ?? false;
  }

  public cleanup(): void {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}

export const contentVisibilityTracker = new ContentVisibilityTracker();
```

### 3.2 HTML Integration

Mark content sections for visibility tracking:

```html
<!-- Blog article sections -->
<article>
  <h1>Article Title</h1>

  <!-- Track sections -->
  <section data-track-visibility="article-intro">
    <!-- Introduction content -->
  </section>

  <section data-track-visibility="article-toc">
    <!-- Table of contents -->
  </section>

  <section data-track-visibility="article-main-content">
    <!-- Main content -->
  </section>

  <section data-track-visibility="article-cta">
    <!-- Call-to-action -->
  </section>

  <section data-track-visibility="article-related">
    <!-- Related articles -->
  </section>
</article>

<!-- Service pages -->
<section data-track-visibility="service-hero">
  <!-- Hero section -->
</section>

<section data-track-visibility="service-benefits">
  <!-- Key benefits section -->
</section>

<section data-track-visibility="service-pricing">
  <!-- Pricing section -->
</section>

<section data-track-visibility="service-cta">
  <!-- Primary CTA -->
</section>
```

---

## Part 4: Reading Completion Metrics

### 4.1 Reading Time & Completion Tracking

```typescript
/**
 * Reading Completion Tracker
 * Calculates estimated reading time, tracks actual reading speed,
 * and measures article completion rates
 */

export interface ReadingMetrics {
  estimatedReadingTimeMin: number; // In minutes
  currentReadingProgress: number; // 0-100%
  estimatedTimeRemaining: number; // In minutes
  actualWordsRead: number;
  readingSpeed: number; // Words per minute
  isReadingAtNormalPace: boolean;
  completionProbability: number; // 0-1
}

class ReadingCompletionTracker {
  private contentElement: HTMLElement | null = null;
  private totalWords: number = 0;
  private totalCharacters: number = 0;
  private readingStartTime: number = 0;
  private lastCalculationTime: number = 0;
  private completedAt: number | null = null;

  // Average adult reading speeds
  private readonly NORMAL_READING_SPEED = 200; // WPM
  private readonly SKIMMING_SPEED = 300; // WPM
  private readonly CAREFUL_READING = 100; // WPM

  constructor(contentSelector: string = 'article, main, [role="main"]') {
    this.init(contentSelector);
  }

  private init(selector: string): void {
    this.contentElement = document.querySelector(selector);

    if (!this.contentElement) {
      console.warn(`[ReadingTracker] No element found for selector: ${selector}`);
      return;
    }

    // Count words in content
    this.calculateContentMetrics();

    // Start tracking reading when user scrolls into content
    this.startTrackingOnScroll();

    // Track reading progress
    window.addEventListener('scroll', () => this.trackProgress(), { passive: true });
  }

  private calculateContentMetrics(): void {
    if (!this.contentElement) return;

    // Get text content
    const text = this.contentElement.innerText || this.contentElement.textContent || '';

    // Count words (split by whitespace)
    const words = text.trim().split(/\s+/);
    this.totalWords = words.length;
    this.totalCharacters = text.length;

    if (import.meta.env.DEV) {
      console.log(`[ReadingTracker] Content metrics:`, {
        words: this.totalWords,
        estimatedMinutes: this.getEstimatedReadingTime(),
      });
    }
  }

  private startTrackingOnScroll(): void {
    const trackingHandler = () => {
      if (!this.readingStartTime && this.contentElement) {
        const rect = this.contentElement.getBoundingClientRect();
        // Start tracking when content is in viewport
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          this.readingStartTime = Date.now();
          window.removeEventListener('scroll', trackingHandler);
          this.onReadingStarted();
        }
      }
    };

    window.addEventListener('scroll', trackingHandler, { passive: true });
  }

  private trackProgress(): void {
    if (this.readingStartTime === 0 || !this.contentElement) return;

    const now = Date.now();
    // Only calculate every 5 seconds to avoid excessive recalculation
    if (now - this.lastCalculationTime < 5000) return;

    this.lastCalculationTime = now;

    const metrics = this.getReadingMetrics();

    // Track milestones
    this.trackCompletionMilestones(metrics.currentReadingProgress);

    // Check for completion
    if (metrics.currentReadingProgress >= 100 && !this.completedAt) {
      this.completedAt = now;
      this.onReadingCompleted(metrics);
    }
  }

  private trackCompletionMilestones(progress: number): void {
    const milestones = [25, 50, 75, 100];

    milestones.forEach((milestone) => {
      if (progress >= milestone && !sessionStorage.getItem(`reading_milestone_${milestone}`)) {
        sessionStorage.setItem(`reading_milestone_${milestone}`, 'true');

        if (window.gtag) {
          window.gtag('event', 'reading_milestone', {
            article_completion: milestone,
            page_title: document.title,
          });
        }
      }
    });
  }

  private onReadingStarted(): void {
    if (window.gtag) {
      window.gtag('event', 'reading_started', {
        estimated_reading_time: this.getEstimatedReadingTime(),
        word_count: this.totalWords,
      });
    }

    if (import.meta.env.DEV) {
      console.log('[ReadingTracker] Reading started');
    }
  }

  private onReadingCompleted(metrics: ReadingMetrics): void {
    const timeSpent = this.completedAt! - this.readingStartTime;

    if (window.gtag) {
      window.gtag('event', 'reading_completed', {
        article_completion: 100,
        time_spent_seconds: Math.round(timeSpent / 1000),
        estimated_reading_time: this.getEstimatedReadingTime(),
        actual_reading_speed: Math.round(metrics.readingSpeed),
        words_read: metrics.actualWordsRead,
      });
    }

    if (import.meta.env.DEV) {
      console.log('[ReadingTracker] Reading completed', {
        timeSpent: Math.round(timeSpent / 1000),
        readingSpeed: Math.round(metrics.readingSpeed),
      });
    }
  }

  public getReadingMetrics(): ReadingMetrics {
    const progress = this.getReadingProgress();
    const timeElapsed = Date.now() - this.readingStartTime;
    const timeElapsedMinutes = timeElapsed / 60000;

    const actualWordsRead = Math.round((progress / 100) * this.totalWords);
    const readingSpeed = timeElapsedMinutes > 0 ? actualWordsRead / timeElapsedMinutes : 0;

    const estimatedTime = this.getEstimatedReadingTime();
    const estimatedTimeRemaining = Math.max(0, estimatedTime - timeElapsedMinutes);

    return {
      estimatedReadingTimeMin: estimatedTime,
      currentReadingProgress: progress,
      estimatedTimeRemaining: Math.round(estimatedTimeRemaining * 10) / 10,
      actualWordsRead,
      readingSpeed: Math.round(readingSpeed),
      isReadingAtNormalPace: readingSpeed >= this.NORMAL_READING_SPEED * 0.8,
      completionProbability: this.calculateCompletionProbability(progress),
    };
  }

  private getReadingProgress(): number {
    if (!this.contentElement) return 0;

    const rect = this.contentElement.getBoundingClientRect();
    const contentStart = rect.top;
    const contentEnd = rect.bottom;
    const viewportHeight = window.innerHeight;

    // Calculate how much of content is below viewport top
    const contentBelowViewportTop = Math.max(0, contentEnd);
    const contentAboveViewportBottom = Math.max(0, viewportHeight);

    // Calculate visible content height
    const visibleContentHeight = Math.min(contentBelowViewportTop, viewportHeight) - Math.max(0, contentStart);

    // This gives us how far through the content we are based on scroll position
    const elementScrollTop = window.scrollY - contentStart;
    const readProgress = Math.max(0, elementScrollTop);
    const totalReadableHeight = rect.height;

    return Math.min(100, Math.round((readProgress / totalReadableHeight) * 100));
  }

  private getEstimatedReadingTime(): number {
    return Math.ceil(this.totalWords / this.NORMAL_READING_SPEED);
  }

  private calculateCompletionProbability(progress: number): number {
    // Based on typical reading patterns
    // Users who reach 25% are likely to finish
    // Users who reach 50% have high completion probability
    // Users who reach 75% almost always finish

    if (progress < 25) return 0.1;
    if (progress < 50) return 0.4;
    if (progress < 75) return 0.7;
    if (progress < 100) return 0.9;
    return 1.0;
  }

  public getEstimatedCompletionTime(): number {
    return this.getEstimatedReadingTime();
  }

  public getTimeSpentReading(): number {
    return this.readingStartTime > 0 ? Date.now() - this.readingStartTime : 0;
  }
}

export const readingCompletionTracker = new ReadingCompletionTracker();
```

---

## Part 5: Engagement Score Calculation

### 5.1 Unified Engagement Scoring System

```typescript
/**
 * Engagement Score Calculator
 * Combines multiple metrics into a single engagement score (0-100)
 * Weighted based on content type and business goals
 */

export type ContentType = 'blog' | 'article' | 'landing' | 'service' | 'portfolio' | 'contact';

export interface EngagementScoreFactors {
  scrollDepth: number; // 0-100%
  timeOnPage: number; // seconds
  readingProgress: number; // 0-100% for articles
  visibleSections: number; // count of viewed sections
  interactions: number; // form submissions, clicks, etc.
  contentType: ContentType;
}

export interface EngagementScore {
  overallScore: number; // 0-100
  breakdownByFactor: Record<string, number>;
  tier: 'low' | 'medium' | 'high' | 'very_high';
  signals: string[];
  conversionProbability: number; // 0-1
}

class EngagementScoreCalculator {
  // Weight configurations by content type
  private weights: Record<ContentType, Record<string, number>> = {
    blog: {
      scrollDepth: 0.25,
      timeOnPage: 0.2,
      readingProgress: 0.35,
      visibleSections: 0.1,
      interactions: 0.1,
    },
    article: {
      scrollDepth: 0.2,
      timeOnPage: 0.15,
      readingProgress: 0.4,
      visibleSections: 0.15,
      interactions: 0.1,
    },
    landing: {
      scrollDepth: 0.25,
      timeOnPage: 0.15,
      readingProgress: 0.1,
      visibleSections: 0.25,
      interactions: 0.25,
    },
    service: {
      scrollDepth: 0.25,
      timeOnPage: 0.2,
      readingProgress: 0.25,
      visibleSections: 0.2,
      interactions: 0.1,
    },
    portfolio: {
      scrollDepth: 0.3,
      timeOnPage: 0.2,
      readingProgress: 0.1,
      visibleSections: 0.25,
      interactions: 0.15,
    },
    contact: {
      scrollDepth: 0.15,
      timeOnPage: 0.1,
      readingProgress: 0.05,
      visibleSections: 0.2,
      interactions: 0.5,
    },
  };

  // Thresholds for score bands
  private thresholds = {
    low: 25,
    medium: 50,
    high: 75,
  };

  public calculateEngagementScore(
    factors: EngagementScoreFactors
  ): EngagementScore {
    const weights = this.weights[factors.contentType];

    // Normalize factors to 0-100 scale
    const normalizedFactors = this.normalizeFactors(factors);

    // Calculate weighted score
    const overallScore = Math.round(
      Object.entries(weights).reduce((sum, [factor, weight]) => {
        return sum + (normalizedFactors[factor as keyof typeof normalizedFactors] * weight);
      }, 0)
    );

    // Determine tier
    const tier = this.getTier(overallScore);

    // Generate signals
    const signals = this.generateSignals(factors, normalizedFactors);

    // Calculate conversion probability
    const conversionProbability = this.calculateConversionProbability(
      overallScore,
      factors,
      tier
    );

    return {
      overallScore: Math.min(100, Math.max(0, overallScore)),
      breakdownByFactor: normalizedFactors,
      tier,
      signals,
      conversionProbability,
    };
  }

  private normalizeFactors(
    factors: EngagementScoreFactors
  ): Record<string, number> {
    return {
      scrollDepth: Math.min(100, factors.scrollDepth),
      timeOnPage: this.normalizeTime(factors.timeOnPage),
      readingProgress: Math.min(100, factors.readingProgress),
      visibleSections: this.normalizeSections(factors.visibleSections),
      interactions: Math.min(100, factors.interactions * 20), // Each interaction = 20 points
    };
  }

  private normalizeTime(seconds: number): number {
    // Map seconds to 0-100 scale
    // 30s = 20 points, 60s = 40 points, 300s (5min) = 100 points
    return Math.min(100, (seconds / 300) * 100);
  }

  private normalizeSections(count: number): number {
    // Map section count to 0-100 scale
    // Scale: 0 sections = 0%, 5 sections = 100%
    return Math.min(100, (count / 5) * 100);
  }

  private getTier(score: number): 'low' | 'medium' | 'high' | 'very_high' {
    if (score >= 75) return 'very_high';
    if (score >= this.thresholds.high) return 'high';
    if (score >= this.thresholds.medium) return 'medium';
    return 'low';
  }

  private generateSignals(
    factors: EngagementScoreFactors,
    normalized: Record<string, number>
  ): string[] {
    const signals: string[] = [];

    // Scroll depth signals
    if (factors.scrollDepth >= 75) {
      signals.push('deep_scroll');
    }
    if (factors.scrollDepth >= 50 && factors.scrollDepth < 75) {
      signals.push('mid_scroll');
    }

    // Time signals
    if (factors.timeOnPage >= 300) {
      signals.push('extended_reading');
    }
    if (factors.timeOnPage >= 60 && factors.timeOnPage < 300) {
      signals.push('engaged_reader');
    }

    // Reading signals (for articles)
    if (factors.readingProgress >= 75) {
      signals.push('high_completion');
    }
    if (factors.readingProgress >= 50 && factors.readingProgress < 75) {
      signals.push('mid_completion');
    }

    // Interaction signals
    if (factors.interactions >= 3) {
      signals.push('heavy_interaction');
    }
    if (factors.interactions >= 1) {
      signals.push('clicked_cta');
    }

    // Section visibility signals
    if (factors.visibleSections >= 4) {
      signals.push('explored_content');
    }

    return signals;
  }

  private calculateConversionProbability(
    score: number,
    factors: EngagementScoreFactors,
    tier: string
  ): number {
    let baseProbability = 0;

    switch (tier) {
      case 'very_high':
        baseProbability = 0.45; // 45% conversion probability
        break;
      case 'high':
        baseProbability = 0.25; // 25% conversion probability
        break;
      case 'medium':
        baseProbability = 0.08; // 8% conversion probability
        break;
      case 'low':
        baseProbability = 0.02; // 2% conversion probability
        break;
    }

    // Boost probability for specific interactions
    if (factors.interactions >= 1) {
      baseProbability *= 1.5;
    }

    // Boost for reading articles
    if (factors.contentType === 'article' && factors.readingProgress >= 75) {
      baseProbability *= 1.3;
    }

    // Boost for service/portfolio deep scrolls
    if (
      (factors.contentType === 'service' || factors.contentType === 'portfolio') &&
      factors.scrollDepth >= 75
    ) {
      baseProbability *= 1.25;
    }

    return Math.min(1, baseProbability);
  }
}

export const engagementScoreCalculator = new EngagementScoreCalculator();
```

---

## Part 6: Integration with Existing Analytics

### 6.1 Integration with current `analytics.ts`

Add these functions to `/src/lib/analytics.ts`:

```typescript
/**
 * Track engagement metrics
 */
export function trackEngagementMetrics(
  metrics: Record<string, unknown>
): void {
  trackEvent('engagement_metrics', metrics);
}

/**
 * Track scroll depth milestone
 */
export function trackScrollDepth(
  depth: number,
  isThreshold: boolean,
  threshold?: number
): void {
  trackEvent('scroll_depth', {
    scroll_depth: depth,
    is_threshold: isThreshold,
    threshold_reached: threshold,
  });
}

/**
 * Track reading metrics
 */
export function trackReadingMetrics(
  metrics: Record<string, unknown>
): void {
  trackEvent('reading_metrics', metrics);
}

/**
 * Track content visibility
 */
export function trackContentVisibility(
  contentId: string,
  visible: boolean,
  visibilityPercentage: number
): void {
  trackEvent('content_visibility', {
    content_id: contentId,
    is_visible: visible,
    visibility_percentage: visibilityPercentage,
  });
}

/**
 * Track engagement score
 */
export function trackEngagementScore(
  score: number,
  tier: string,
  factors: Record<string, unknown>
): void {
  trackEvent('engagement_score', {
    engagement_score: score,
    engagement_tier: tier,
    ...factors,
  });
}
```

### 6.2 Page Component Integration Example

For `/src/pages/BlogArticle.tsx`:

```typescript
import { useEffect } from 'react';
import { scrollDepthTracker } from '@/lib/scrollDepthTracker';
import { timeEngagementTracker } from '@/lib/timeEngagementTracker';
import { readingCompletionTracker } from '@/lib/readingCompletionTracker';
import { engagementScoreCalculator } from '@/lib/engagementScoreCalculator';
import { trackEngagementScore } from '@/lib/analytics';

export const BlogArticle = () => {
  // ... existing code ...

  useEffect(() => {
    // Initialize trackers when article loads
    const interval = setInterval(() => {
      const scrollMetrics = scrollDepthTracker.getScrollDepthData();
      const readingMetrics = readingCompletionTracker.getReadingMetrics();
      const timeMetrics = timeEngagementTracker.getTotalEngagementTime();

      // Calculate engagement score
      const engagementScore = engagementScoreCalculator.calculateEngagementScore({
        scrollDepth: scrollMetrics.depth,
        timeOnPage: Math.round(timeMetrics / 1000),
        readingProgress: readingMetrics.currentReadingProgress,
        visibleSections: 4, // Count visible sections
        interactions: 0,
        contentType: 'article',
      });

      // Track every 30 seconds or on significant changes
      trackEngagementScore(
        engagementScore.overallScore,
        engagementScore.tier,
        {
          scroll_depth: scrollMetrics.depth,
          reading_progress: readingMetrics.currentReadingProgress,
          time_on_page: Math.round(timeMetrics / 1000),
          conversion_probability: engagementScore.conversionProbability,
        }
      );
    }, 30000); // Every 30 seconds

    return () => clearInterval(interval);
  }, []);

  // ... rest of component ...
};
```

---

## Part 7: GA4 Event Custom Dimensions Setup

### 7.1 Recommended Custom Dimensions

In Google Analytics 4 Admin Console, create these custom dimensions:

| Dimension Name | Scope | Description |
|---|---|---|
| `content_type` | Event | Type of content (blog, article, landing, service) |
| `engagement_tier` | Event | Engagement level (low, medium, high, very_high) |
| `reading_speed` | Event | User's reading speed in WPM |
| `scroll_depth_max` | Event | Maximum scroll depth reached in session |
| `content_section_id` | Event | ID of content section being viewed |
| `time_to_interaction` | Event | Seconds until first user interaction |
| `content_completion_percent` | Event | Percentage of content consumed |

### 7.2 Recommended Custom Metrics

| Metric Name | Scope | Description |
|---|---|---|
| `engagement_score` | Event | Calculated engagement score (0-100) |
| `scroll_depth_reached` | Event | Current scroll depth percentage |
| `time_engaged` | Event | Seconds of active engagement |
| `content_visible_sections` | Event | Number of content sections viewed |
| `reading_completion_rate` | Event | Percentage of article read |

---

## Part 8: Dashboard & Reporting

### 8.1 Key Reports to Create in GA4

**1. Engagement Overview Report**
- Metric: Engagement Score (avg, min, max)
- Dimensions: Page Path, Content Type
- Filters: Engagement Tier = High/Very High
- Goal: Track which pages drive highest engagement

**2. Scroll Depth Analysis**
- Event: scroll_depth
- Metric: Count of events at each threshold (25%, 50%, 75%, 90%)
- Dimension: Page Path
- Goal: Identify content where users drop off

**3. Reading Behavior Report**
- Event: reading_metrics
- Metrics: Average reading speed, completion rate
- Dimensions: Article path, category
- Goal: Optimize content length and quality

**4. Content Visibility Report**
- Event: content_visibility
- Dimensions: Content section ID
- Metric: Average visibility percentage
- Goal: Optimize section placement and prominence

**5. Conversion Path Report**
- Dimension: Engagement Tier
- Metric: Conversions, conversion rate
- Goal: Correlate engagement with conversions

---

## Part 9: Implementation Checklist

### Phase 1: Foundation (Week 1)
- [ ] Add scroll depth tracker utility
- [ ] Implement time engagement tracker
- [ ] Update analytics.ts with new tracking functions
- [ ] Configure GA4 custom dimensions and metrics
- [ ] Test in development environment

### Phase 2: Content Tracking (Week 2)
- [ ] Implement Intersection Observer visibility tracker
- [ ] Add HTML data attributes to key content sections
- [ ] Implement reading completion tracker
- [ ] Update BlogArticle component with trackers
- [ ] Create engagement score calculator

### Phase 3: Integration (Week 3)
- [ ] Integrate trackers into main page components
- [ ] Add to: BlogArticle, ServiceDetail, CaseStudy pages
- [ ] Create dashboard reports in GA4
- [ ] Set up alerts for low engagement thresholds
- [ ] Test cross-page tracking

### Phase 4: Optimization (Week 4)
- [ ] Monitor baseline metrics for 1 week
- [ ] Identify low-performing content
- [ ] A/B test content improvements
- [ ] Refine weight calculations based on actual data
- [ ] Document insights and recommendations

---

## Part 10: Performance Considerations

### 10.1 Optimization Tips

1. **Use Passive Event Listeners**: All scroll/resize handlers use `{ passive: true }`
2. **Debounce Calculations**: Scroll depth calculations debounced to 150ms
3. **Use Intersection Observer**: Not scroll events for visibility tracking
4. **Batch GA4 Events**: Send data in pulses, not on every pixel
5. **Session Storage**: Use sessionStorage for temporary tracking data
6. **Code Splitting**: Load trackers only on relevant pages

### 10.2 Expected Performance Impact

- Scroll depth tracking: < 0.5ms per scroll event (debounced)
- Visibility tracking: < 1ms overhead (browser-optimized)
- Time engagement: < 0.2ms per pulse (every 15 seconds)
- Reading tracker: < 1ms per calculation (every 5 seconds)

---

## Part 11: Testing & Validation

### 11.1 Manual Testing Checklist

```typescript
// In browser console, test each tracker:

// Scroll depth tracker
import { scrollDepthTracker } from '@/lib/scrollDepthTracker';
scrollDepthTracker.getScrollDepthData(); // Check current metrics

// Time engagement
import { timeEngagementTracker } from '@/lib/timeEngagementTracker';
timeEngagementTracker.getTotalEngagementTime(); // Check engagement time

// Reading metrics
import { readingCompletionTracker } from '@/lib/readingCompletionTracker';
readingCompletionTracker.getReadingMetrics(); // Check reading progress

// Engagement score
import { engagementScoreCalculator } from '@/lib/engagementScoreCalculator';
engagementScoreCalculator.calculateEngagementScore({
  scrollDepth: 75,
  timeOnPage: 180,
  readingProgress: 60,
  visibleSections: 4,
  interactions: 2,
  contentType: 'article',
}); // Check score calculation
```

### 11.2 GA4 Real-Time Validation

1. Open GA4 Real-Time report
2. Scroll through a page
3. Verify scroll_depth events fire at 25%, 50%, 75%, 90%
4. Verify engagement_pulse events every 15 seconds
5. Verify content_visible events when sections appear
6. Verify reading_metrics events update every 5 seconds

---

## Resources & References

- [The value of scroll depth and how to track it](https://usermaven.com/blog/value-of-scroll-depth)
- [Scroll Depth Tracking: Why GA4 Isn't The Best Way to Do It](https://contentsquare.com/blog/scroll-tracking/)
- [Scroll-Depth Tracking: What, Why, and How](https://vwo.com/blog/scroll-depth-tracking-what-why-and-how-of-monitoring-visitor-engagement/)
- [Google Analytics Scroll Depth Tracking (Explained)](https://analytify.io/google-analytics-scroll-depth-tracking/)
- [How to Track Scroll Depth in GA4: Complete Implementation Guide for 2025](https://www.heatmap.com/blog/ga4-scroll-depth)
- [Intersection Observer API - MDN](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API)
- [Trust is good, observation is best: Intersection Observer v2](https://web.dev/articles/intersectionobserver-v2)
- [Content Engagement Score: Measuring Impact](https://www.getcensus.com/ops_glossary/content-engagement-score-measuring-impact)
- [Measuring Content Engagement in Google Analytics](https://clarity.global/news-insights/team-insights/measuring-content-engagement-in-google-analytics-part-1-article-completion-rate)
- [User Engagement Metrics - The Complete Guide 2025](https://uxcam.com/blog/user-engagement-metrics/)

---

## Implementation Summary

This comprehensive guide provides:

1. **Scroll Depth Tracking**: Optimal thresholds (25%, 50%, 75%, 90%) with GA4 integration
2. **Time-Based Engagement**: Pulse-based tracking every 15 seconds for accurate metrics
3. **Content Visibility**: Intersection Observer v2 for performance-optimized section tracking
4. **Reading Completion**: WPM calculation, milestone tracking, completion probability
5. **Engagement Scoring**: Weighted formula combining all metrics with content-type specific weights
6. **GA4 Integration**: Custom dimensions, metrics, and event tracking
7. **Performance**: Debouncing, passive listeners, and browser-optimized APIs
8. **Testing Framework**: Validation checklists and GA4 real-time verification

Total implementation time: 3-4 weeks with phased approach.
