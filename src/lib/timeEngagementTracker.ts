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

export interface TimeEngagementData {
  timeOnPage: number; // Milliseconds
  engagementTime: number; // Milliseconds actively engaged
  isActive: boolean;
  sessionEngaged: boolean;
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
        page_type: this.config.pageType,
      });
    }

    if (import.meta.env.DEV) {
      console.log(`[TimeEngagement] Pulse: ${Math.round(timeOnPage / 1000)}s on page, ${Math.round(engagementTime / 1000)}s engaged`);
    }
  }

  private onEngagementResume(): void {
    if (window.gtag) {
      window.gtag('event', 'engagement_resume', {
        page_title: document.title,
      });
    }

    if (import.meta.env.DEV) {
      console.log('[TimeEngagement] User engagement resumed');
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

    if (import.meta.env.DEV) {
      console.log('[TimeEngagement] User engagement paused');
    }
  }

  /**
   * Get total engagement time in milliseconds
   */
  public getTotalEngagementTime(): number {
    return this.totalEngagementTime + (this.isActive ? (Date.now() - this.lastActivityTime) : 0);
  }

  /**
   * Get time on page in seconds
   */
  public getTimeOnPageSeconds(): number {
    return Math.round((Date.now() - this.sessionStartTime) / 1000);
  }

  /**
   * Check if user is currently active
   */
  public isUserActive(): boolean {
    return this.isActive;
  }

  /**
   * Get engagement data
   */
  public getEngagementData(): TimeEngagementData {
    const timeOnPage = Date.now() - this.sessionStartTime;
    const engagementTime = this.getTotalEngagementTime();

    return {
      timeOnPage,
      engagementTime,
      isActive: this.isActive,
      sessionEngaged: true,
    };
  }

  /**
   * Get engagement percentage (0-100)
   */
  public getEngagementPercentage(): number {
    const timeOnPage = Date.now() - this.sessionStartTime;
    const engagementTime = this.getTotalEngagementTime();
    return timeOnPage > 0 ? Math.round((engagementTime / timeOnPage) * 100) : 0;
  }

  /**
   * Reset tracker (useful for testing)
   */
  public reset(): void {
    this.sessionStartTime = Date.now();
    this.lastActivityTime = Date.now();
    this.totalEngagementTime = 0;
    this.isActive = true;
  }

  /**
   * Cleanup resources
   */
  private cleanup(): void {
    if (this.pulseTimer !== null) {
      clearInterval(this.pulseTimer);
    }
    if (this.inactivityTimer !== null) {
      clearTimeout(this.inactivityTimer);
    }
  }
}

// Export singleton instance
let instance: TimeEngagementTracker | null = null;

export function getTimeEngagementTracker(): TimeEngagementTracker {
  if (!instance) {
    instance = new TimeEngagementTracker();
  }
  return instance;
}

export const timeEngagementTracker = getTimeEngagementTracker();
