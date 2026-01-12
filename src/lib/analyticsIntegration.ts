/**
 * Analytics Integration Helper
 * Unified interface for tracking engagement metrics across all trackers
 * Integrates with existing GA4 and Clarity setup
 */

import { scrollDepthTracker } from './scrollDepthTracker';
import { timeEngagementTracker } from './timeEngagementTracker';
import { contentVisibilityTracker } from './contentVisibilityTracker';
import { readingCompletionTracker } from './readingCompletionTracker';
import { engagementScoreCalculator, type ContentType } from './engagementScoreCalculator';
import { trackEvent } from './analytics';

export interface EngagementTrackingConfig {
  contentType: ContentType;
  pageTitle: string;
  trackingInterval?: number; // ms, default 30000
  enableDebug?: boolean;
}

class AnalyticsIntegration {
  private config: EngagementTrackingConfig | null = null;
  private trackingInterval: number | null = null;
  private isInitialized: boolean = false;

  /**
   * Initialize engagement tracking for a page
   */
  public initializePageTracking(config: EngagementTrackingConfig): void {
    if (this.isInitialized) {
      console.warn('[AnalyticsIntegration] Already initialized, skipping');
      return;
    }

    this.config = {
      trackingInterval: 30000, // 30 seconds
      enableDebug: import.meta.env.DEV,
      ...config,
    };

    // Initialize all sub-trackers
    contentVisibilityTracker.init();
    readingCompletionTracker; // Lazy init

    // Start engagement tracking loop
    this.startEngagementTracking();

    // Send page-specific metadata
    this.sendPageMetadata();

    this.isInitialized = true;

    if (this.config.enableDebug) {
      console.log('[AnalyticsIntegration] Initialized for', config.contentType);
    }
  }

  /**
   * Start periodic engagement tracking
   */
  private startEngagementTracking(): void {
    if (!this.config) return;

    this.trackingInterval = window.setInterval(() => {
      this.trackEngagementMetrics();
    }, this.config.trackingInterval);

    // Also track on page unload
    window.addEventListener('beforeunload', () => this.trackEngagementMetrics());
  }

  /**
   * Track all engagement metrics
   */
  private trackEngagementMetrics(): void {
    if (!this.config) return;

    // Gather all metrics
    const scrollData = scrollDepthTracker.getScrollDepthData();
    const timeData = timeEngagementTracker.getEngagementData();
    const readingData = readingCompletionTracker.getReadingMetrics();
    const visibilityData = contentVisibilityTracker.getVisibilityData();

    const visibleSections = visibilityData.filter((d) => d.isVisible).length;

    // Calculate engagement score
    const engagementScore = engagementScoreCalculator.calculateEngagementScore({
      scrollDepth: scrollData.depth,
      timeOnPage: Math.round(timeData.timeOnPage / 1000),
      readingProgress: readingData.currentReadingProgress,
      visibleSections,
      interactions: 0, // Track separately with trackInteraction()
      contentType: this.config.contentType,
    });

    // Send to GA4
    this.sendEngagementMetrics({
      scrollDepth: scrollData.depth,
      maxScrollDepth: scrollDepthTracker.getMaxDepth(),
      timeOnPage: Math.round(timeData.timeOnPage / 1000),
      engagementTime: Math.round(timeData.engagementTime / 1000),
      readingProgress: readingData.currentReadingProgress,
      readingSpeed: readingData.readingSpeed,
      visibleSections,
      engagementScore: engagementScore.overallScore,
      engagementTier: engagementScore.tier,
      conversionProbability: engagementScore.conversionProbability,
      signals: engagementScore.signals,
    });

    if (this.config.enableDebug) {
      console.log('[AnalyticsIntegration] Metrics:', {
        score: engagementScore.overallScore,
        tier: engagementScore.tier,
        scrollDepth: scrollData.depth,
        readingProgress: readingData.currentReadingProgress,
      });
    }
  }

  /**
   * Send engagement metrics to GA4
   */
  private sendEngagementMetrics(metrics: Record<string, unknown>): void {
    trackEvent('engagement_metrics', {
      content_type: this.config?.contentType,
      page_title: this.config?.pageTitle,
      ...metrics,
    });
  }

  /**
   * Send page metadata
   */
  private sendPageMetadata(): void {
    if (!this.config) return;

    trackEvent('page_metadata', {
      content_type: this.config.contentType,
      page_title: this.config.pageTitle,
      word_count: readingCompletionTracker.getTotalWordCount(),
      estimated_reading_time: readingCompletionTracker.getEstimatedCompletionTime(),
    });
  }

  /**
   * Track user interaction (CTA click, form submission, etc.)
   */
  public trackInteraction(
    interactionType: string,
    interactionLabel?: string,
    additionalData?: Record<string, unknown>
  ): void {
    const scrollData = scrollDepthTracker.getScrollDepthData();
    const readingData = readingCompletionTracker.getReadingMetrics();

    trackEvent('user_interaction', {
      interaction_type: interactionType,
      interaction_label: interactionLabel,
      scroll_depth_at_interaction: scrollData.depth,
      reading_progress_at_interaction: readingData.currentReadingProgress,
      time_to_interaction: Math.round((Date.now() - (readingCompletionTracker.hasReadingStarted() ? readingCompletionTracker.getTimeSpentReading() : 0)) / 1000),
      ...additionalData,
    });
  }

  /**
   * Track milestone (e.g., video play, form field focus)
   */
  public trackMilestone(
    milestoneType: string,
    milestoneLabel?: string
  ): void {
    trackEvent('engagement_milestone', {
      milestone_type: milestoneType,
      milestone_label: milestoneLabel,
      scroll_depth: scrollDepthTracker.getScrollDepthData().depth,
      time_on_page: Math.round(timeEngagementTracker.getEngagementData().timeOnPage / 1000),
    });
  }

  /**
   * Get current engagement metrics snapshot
   */
  public getCurrentMetrics(): Record<string, unknown> {
    const scrollData = scrollDepthTracker.getScrollDepthData();
    const timeData = timeEngagementTracker.getEngagementData();
    const readingData = readingCompletionTracker.getReadingMetrics();
    const visibilityData = contentVisibilityTracker.getVisibilityData();

    const visibleSections = visibilityData.filter((d) => d.isVisible).length;

    const engagementScore = engagementScoreCalculator.calculateEngagementScore({
      scrollDepth: scrollData.depth,
      timeOnPage: Math.round(timeData.timeOnPage / 1000),
      readingProgress: readingData.currentReadingProgress,
      visibleSections,
      interactions: 0,
      contentType: this.config?.contentType || 'article',
    });

    return {
      scrollDepth: scrollData.depth,
      maxScrollDepth: scrollDepthTracker.getMaxDepth(),
      timeOnPage: Math.round(timeData.timeOnPage / 1000),
      readingProgress: readingData.currentReadingProgress,
      readingSpeed: readingData.readingSpeed,
      visibleSections,
      engagementScore: engagementScore.overallScore,
      engagementTier: engagementScore.tier,
      conversionProbability: engagementScore.conversionProbability,
      isActive: timeEngagementTracker.isUserActive(),
    };
  }

  /**
   * Get engagement insights
   */
  public getInsights(): string[] {
    const metrics = this.getCurrentMetrics();
    const insights: string[] = [];

    const score = metrics.engagementScore as number;
    const tier = metrics.engagementTier as string;

    // Score-based insights
    if (tier === 'very_high') {
      insights.push('Excellent engagement - user highly invested');
    } else if (tier === 'high') {
      insights.push('Strong engagement - good content quality');
    } else if (tier === 'medium') {
      insights.push('Moderate engagement - some interest shown');
    } else {
      insights.push('Low engagement - content may need optimization');
    }

    // Scroll insights
    const scrollDepth = metrics.scrollDepth as number;
    if (scrollDepth < 25) {
      insights.push('User scrolled minimally - content placement issue?');
    } else if (scrollDepth < 50) {
      insights.push('User scrolled through first half');
    } else if (scrollDepth < 75) {
      insights.push('User engaged with majority of content');
    } else {
      insights.push('User scrolled nearly entire page - high interest');
    }

    // Time insights
    const timeOnPage = metrics.timeOnPage as number;
    if (timeOnPage < 30) {
      insights.push('Short visit - users leaving quickly');
    } else if (timeOnPage < 120) {
      insights.push('Average session length');
    } else {
      insights.push('Extended session - deep engagement');
    }

    // Reading insights (if applicable)
    const readingProgress = metrics.readingProgress as number;
    if (readingProgress > 0) {
      if (readingProgress < 50) {
        insights.push('User scanning but not deeply reading');
      } else if (readingProgress < 75) {
        insights.push('User actively reading article');
      } else {
        insights.push('High article completion - excellent quality signal');
      }
    }

    return insights;
  }

  /**
   * Cleanup resources
   */
  public cleanup(): void {
    if (this.trackingInterval !== null) {
      clearInterval(this.trackingInterval);
    }
    contentVisibilityTracker.cleanup();
    this.isInitialized = false;
  }
}

// Export singleton
let instance: AnalyticsIntegration | null = null;

export function getAnalyticsIntegration(): AnalyticsIntegration {
  if (!instance) {
    instance = new AnalyticsIntegration();
  }
  return instance;
}

export const analyticsIntegration = getAnalyticsIntegration();
