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

export interface NormalizedFactors {
  scrollDepth: number;
  timeOnPage: number;
  readingProgress: number;
  visibleSections: number;
  interactions: number;
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

  /**
   * Calculate engagement score from factors
   */
  public calculateEngagementScore(factors: EngagementScoreFactors): EngagementScore {
    const weights = this.weights[factors.contentType];

    // Normalize factors to 0-100 scale
    const normalizedFactors = this.normalizeFactors(factors);

    // Calculate weighted score
    const overallScore = Math.round(
      Object.entries(weights).reduce((sum, [factor, weight]) => {
        const normalizedValue = normalizedFactors[factor as keyof NormalizedFactors];
        return sum + (normalizedValue * weight);
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

  /**
   * Normalize factors to 0-100 scale
   */
  private normalizeFactors(factors: EngagementScoreFactors): NormalizedFactors {
    return {
      scrollDepth: Math.min(100, factors.scrollDepth),
      timeOnPage: this.normalizeTime(factors.timeOnPage),
      readingProgress: Math.min(100, factors.readingProgress),
      visibleSections: this.normalizeSections(factors.visibleSections),
      interactions: Math.min(100, factors.interactions * 20), // Each interaction = 20 points
    };
  }

  /**
   * Normalize time (seconds) to 0-100 scale
   */
  private normalizeTime(seconds: number): number {
    // Map seconds to 0-100 scale
    // 30s = 20 points, 60s = 40 points, 300s (5min) = 100 points
    return Math.min(100, (seconds / 300) * 100);
  }

  /**
   * Normalize section count to 0-100 scale
   */
  private normalizeSections(count: number): number {
    // Map section count to 0-100 scale
    // Scale: 0 sections = 0%, 5 sections = 100%
    return Math.min(100, (count / 5) * 100);
  }

  /**
   * Determine engagement tier
   */
  private getTier(score: number): 'low' | 'medium' | 'high' | 'very_high' {
    if (score >= 75) return 'very_high';
    if (score >= this.thresholds.high) return 'high';
    if (score >= this.thresholds.medium) return 'medium';
    return 'low';
  }

  /**
   * Generate engagement signals based on metrics
   */
  private generateSignals(
    factors: EngagementScoreFactors,
    normalized: NormalizedFactors
  ): string[] {
    const signals: string[] = [];

    // Scroll depth signals
    if (factors.scrollDepth >= 75) {
      signals.push('deep_scroll');
    } else if (factors.scrollDepth >= 50 && factors.scrollDepth < 75) {
      signals.push('mid_scroll');
    }

    // Time signals
    if (factors.timeOnPage >= 300) {
      signals.push('extended_reading');
    } else if (factors.timeOnPage >= 60 && factors.timeOnPage < 300) {
      signals.push('engaged_reader');
    }

    // Reading signals (for articles)
    if (factors.readingProgress >= 75) {
      signals.push('high_completion');
    } else if (factors.readingProgress >= 50 && factors.readingProgress < 75) {
      signals.push('mid_completion');
    }

    // Interaction signals
    if (factors.interactions >= 3) {
      signals.push('heavy_interaction');
    } else if (factors.interactions >= 1) {
      signals.push('clicked_cta');
    }

    // Section visibility signals
    if (factors.visibleSections >= 4) {
      signals.push('explored_content');
    } else if (factors.visibleSections >= 2) {
      signals.push('browsed_content');
    }

    return signals;
  }

  /**
   * Calculate conversion probability
   */
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

    // Boost for landing page conversions
    if (factors.contentType === 'landing' && factors.scrollDepth >= 50) {
      baseProbability *= 1.2;
    }

    return Math.min(1, baseProbability);
  }

  /**
   * Get tier distribution stats
   */
  public getTierDistribution(scores: EngagementScore[]): Record<string, number> {
    const distribution = {
      low: 0,
      medium: 0,
      high: 0,
      very_high: 0,
    };

    scores.forEach((score) => {
      distribution[score.tier]++;
    });

    // Convert to percentages
    const total = scores.length;
    if (total > 0) {
      Object.keys(distribution).forEach((key) => {
        distribution[key as keyof typeof distribution] = Math.round(
          (distribution[key as keyof typeof distribution] / total) * 100
        );
      });
    }

    return distribution;
  }

  /**
   * Get average conversion probability
   */
  public getAverageConversionProbability(scores: EngagementScore[]): number {
    if (scores.length === 0) return 0;
    const sum = scores.reduce((acc, score) => acc + score.conversionProbability, 0);
    return Math.round((sum / scores.length) * 100) / 100;
  }

  /**
   * Get insights from scores
   */
  public getInsights(scores: EngagementScore[]): string[] {
    const insights: string[] = [];

    if (scores.length === 0) return insights;

    const avgScore = Math.round(
      scores.reduce((acc, score) => acc + score.overallScore, 0) / scores.length
    );

    // Score insights
    if (avgScore >= 75) {
      insights.push('Excellent engagement across content');
    } else if (avgScore >= 50) {
      insights.push('Moderate engagement - room for improvement');
    } else {
      insights.push('Low engagement - content needs optimization');
    }

    // Signal frequency
    const allSignals: Record<string, number> = {};
    scores.forEach((score) => {
      score.signals.forEach((signal) => {
        allSignals[signal] = (allSignals[signal] || 0) + 1;
      });
    });

    const topSignal = Object.entries(allSignals).sort(([, a], [, b]) => b - a)[0];
    if (topSignal) {
      insights.push(`Most common signal: ${topSignal[0]}`);
    }

    // Conversion insight
    const avgConversion = this.getAverageConversionProbability(scores);
    if (avgConversion > 0.25) {
      insights.push(`Strong conversion potential (${Math.round(avgConversion * 100)}%)`);
    }

    return insights;
  }
}

// Export singleton instance
let instance: EngagementScoreCalculator | null = null;

export function getEngagementScoreCalculator(): EngagementScoreCalculator {
  if (!instance) {
    instance = new EngagementScoreCalculator();
  }
  return instance;
}

export const engagementScoreCalculator = getEngagementScoreCalculator();
