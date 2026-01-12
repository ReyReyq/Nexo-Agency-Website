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
  private contentSelector: string;

  // Average adult reading speeds
  private readonly NORMAL_READING_SPEED = 200; // WPM
  private readonly SKIMMING_SPEED = 300; // WPM
  private readonly CAREFUL_READING = 100; // WPM

  constructor(contentSelector: string = 'article, main, [role="main"]') {
    this.contentSelector = contentSelector;
    this.init();
  }

  private init(): void {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.findAndInitContent());
    } else {
      this.findAndInitContent();
    }

    // Cleanup on unload
    window.addEventListener('beforeunload', () => this.cleanup());
  }

  private findAndInitContent(): void {
    this.contentElement = document.querySelector(this.contentSelector);

    if (!this.contentElement) {
      if (import.meta.env.DEV) {
        console.warn(`[ReadingTracker] No element found for selector: ${this.contentSelector}`);
      }
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

        if (import.meta.env.DEV) {
          console.log(`[ReadingTracker] Milestone ${milestone}% reached`);
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

  /**
   * Get current reading metrics
   */
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

  /**
   * Get reading progress percentage (0-100)
   */
  private getReadingProgress(): number {
    if (!this.contentElement || this.readingStartTime === 0) return 0;

    const rect = this.contentElement.getBoundingClientRect();

    // Calculate how far through the content we are based on scroll position
    const elementScrollTop = window.scrollY - rect.top;
    const readProgress = Math.max(0, elementScrollTop);
    const totalReadableHeight = rect.height;

    return Math.min(100, Math.round((readProgress / totalReadableHeight) * 100));
  }

  /**
   * Get estimated reading time in minutes
   */
  private getEstimatedReadingTime(): number {
    return Math.ceil(this.totalWords / this.NORMAL_READING_SPEED);
  }

  /**
   * Calculate completion probability based on progress
   */
  private calculateCompletionProbability(progress: number): number {
    // Based on typical reading patterns
    if (progress < 25) return 0.1;
    if (progress < 50) return 0.4;
    if (progress < 75) return 0.7;
    if (progress < 100) return 0.9;
    return 1.0;
  }

  /**
   * Get estimated completion time in minutes
   */
  public getEstimatedCompletionTime(): number {
    return this.getEstimatedReadingTime();
  }

  /**
   * Get time spent reading in milliseconds
   */
  public getTimeSpentReading(): number {
    return this.readingStartTime > 0 ? Date.now() - this.readingStartTime : 0;
  }

  /**
   * Get total word count
   */
  public getTotalWordCount(): number {
    return this.totalWords;
  }

  /**
   * Check if reading has started
   */
  public hasReadingStarted(): boolean {
    return this.readingStartTime > 0;
  }

  /**
   * Check if reading is completed
   */
  public isReadingCompleted(): boolean {
    return this.completedAt !== null;
  }

  /**
   * Reset tracker (useful for testing)
   */
  public reset(): void {
    this.readingStartTime = 0;
    this.lastCalculationTime = 0;
    this.completedAt = null;
    sessionStorage.removeItem('reading_milestone_25');
    sessionStorage.removeItem('reading_milestone_50');
    sessionStorage.removeItem('reading_milestone_75');
    sessionStorage.removeItem('reading_milestone_100');
  }

  /**
   * Cleanup resources
   */
  private cleanup(): void {
    // Nothing to clean up for now, but available for future optimization
  }
}

// Export singleton instance
let instance: ReadingCompletionTracker | null = null;

export function getReadingCompletionTracker(): ReadingCompletionTracker {
  if (!instance) {
    instance = new ReadingCompletionTracker();
  }
  return instance;
}

export const readingCompletionTracker = getReadingCompletionTracker();
