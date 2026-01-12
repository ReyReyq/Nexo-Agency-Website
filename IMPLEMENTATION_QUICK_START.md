# Scroll & Engagement Tracking - Quick Start Guide

## Files Created

1. **SCROLL_ENGAGEMENT_TRACKING_GUIDE.md** - Comprehensive 11-part implementation guide
2. **src/lib/scrollDepthTracker.ts** - Tracks scroll depth at optimal thresholds
3. **src/lib/timeEngagementTracker.ts** - Sends engagement pulses every 15 seconds
4. **src/lib/contentVisibilityTracker.ts** - Uses Intersection Observer for section tracking
5. **src/lib/readingCompletionTracker.ts** - Calculates reading progress and WPM
6. **src/lib/engagementScoreCalculator.ts** - Combines metrics into engagement score

## Quick Integration (30 Minutes)

### Step 1: Import trackers in your page component

```typescript
import { scrollDepthTracker } from '@/lib/scrollDepthTracker';
import { timeEngagementTracker } from '@/lib/timeEngagementTracker';
import { contentVisibilityTracker } from '@/lib/contentVisibilityTracker';
import { readingCompletionTracker } from '@/lib/readingCompletionTracker';
import { engagementScoreCalculator } from '@/lib/engagementScoreCalculator';
```

### Step 2: Initialize visibility tracker on mount

```typescript
useEffect(() => {
  // Initialize content visibility tracking
  contentVisibilityTracker.init();

  return () => {
    contentVisibilityTracker.cleanup();
  };
}, []);
```

### Step 3: Set up periodic tracking

```typescript
useEffect(() => {
  // Track engagement every 30 seconds
  const interval = setInterval(() => {
    const scrollData = scrollDepthTracker.getScrollDepthData();
    const timeData = timeEngagementTracker.getEngagementData();
    const readingData = readingCompletionTracker.getReadingMetrics();

    const engagementScore = engagementScoreCalculator.calculateEngagementScore({
      scrollDepth: scrollData.depth,
      timeOnPage: Math.round(timeData.timeOnPage / 1000),
      readingProgress: readingData.currentReadingProgress,
      visibleSections: contentVisibilityTracker.getVisibleElementCount(),
      interactions: 0, // Track separately
      contentType: 'article', // or 'blog', 'landing', 'service', etc.
    });

    // Send to GA4
    if (window.gtag) {
      window.gtag('event', 'engagement_score', {
        engagement_score: engagementScore.overallScore,
        engagement_tier: engagementScore.tier,
        scroll_depth: scrollData.depth,
        reading_progress: readingData.currentReadingProgress,
        conversion_probability: engagementScore.conversionProbability,
      });
    }
  }, 30000); // Every 30 seconds

  return () => clearInterval(interval);
}, []);
```

### Step 4: Mark content sections for tracking

Add to your HTML:

```html
<article>
  <section data-track-visibility="article-intro">
    <!-- Introduction -->
  </section>

  <section data-track-visibility="article-main">
    <!-- Main content -->
  </section>

  <section data-track-visibility="article-cta">
    <!-- Call-to-action -->
  </section>

  <section data-track-visibility="article-related">
    <!-- Related content -->
  </section>
</article>
```

## Key Metrics Overview

### Scroll Depth Thresholds
- **25%**: User found content worth scrolling
- **50%**: Mid-engagement milestone
- **75%**: Deep engagement signal
- **90%**: Near completion, high intent

### Time-Based Triggers
- **15 seconds**: First pulse sent
- **30 seconds**: Early engagement threshold
- **60 seconds**: Meaningful engagement
- **3+ minutes**: Strong engagement signal

### Reading Metrics
- **Estimated time**: Based on word count
- **Current progress**: 0-100% of article
- **Reading speed**: Words per minute (WPM)
- **Completion probability**: 0-100%

### Visibility Tracking
- **25% visible**: Section entering viewport
- **50% visible**: Section mid-viewport
- **75% visible**: Strong section engagement
- **100% visible**: Full section viewed

## Engagement Score Tiers

| Tier | Score | Conversion Probability | Signal |
|---|---|---|---|
| Low | 0-24 | 2% | Minimal engagement |
| Medium | 25-49 | 8% | Some engagement |
| High | 50-74 | 25% | Strong engagement |
| Very High | 75-100 | 45%+ | Excellent engagement |

## Testing in Browser Console

```typescript
// Check scroll depth
const scrollData = scrollDepthTracker.getScrollDepthData();
console.log(`Scroll depth: ${scrollData.depth}%`);
console.log(`Max reached: ${scrollDepthTracker.getMaxDepth()}%`);

// Check engagement time
const timeData = timeEngagementTracker.getEngagementData();
console.log(`Time on page: ${Math.round(timeData.timeOnPage / 1000)}s`);
console.log(`Engagement %: ${timeEngagementTracker.getEngagementPercentage()}%`);

// Check reading progress
const readingData = readingCompletionTracker.getReadingMetrics();
console.log(`Reading progress: ${readingData.currentReadingProgress}%`);
console.log(`Reading speed: ${readingData.readingSpeed} WPM`);
console.log(`Est. remaining: ${readingData.estimatedTimeRemaining} min`);

// Check visible sections
const visible = contentVisibilityTracker.getVisibilityData();
console.log(`Visible sections: ${visible.filter(d => d.isVisible).length}`);

// Calculate engagement score
const score = engagementScoreCalculator.calculateEngagementScore({
  scrollDepth: 75,
  timeOnPage: 120,
  readingProgress: 60,
  visibleSections: 3,
  interactions: 1,
  contentType: 'article'
});
console.log(`Engagement score: ${score.overallScore}/100`);
console.log(`Tier: ${score.tier}`);
console.log(`Conversion probability: ${Math.round(score.conversionProbability * 100)}%`);
```

## GA4 Events Automatically Tracked

1. **scroll_depth** - Fires at 25%, 50%, 75%, 90% thresholds
2. **engagement_pulse** - Fires every 15 seconds (prevents bounces)
3. **engagement_resume** - When user returns from inactivity
4. **engagement_pause** - When user inactive for 60+ seconds
5. **content_visible** - When section becomes visible
6. **content_visibility_milestone** - At 25%, 50%, 75%, 100% section visibility
7. **reading_started** - When user starts reading article
8. **reading_milestone** - At 25%, 50%, 75%, 100% reading completion
9. **reading_completed** - When article reading finishes
10. **engagement_score** - Custom engagement metric (every 30s)

## Performance Notes

- All trackers use passive event listeners (no performance impact)
- Scroll calculations debounced to 150ms
- Visibility tracking uses browser-optimized Intersection Observer
- Time calculations run every 15 seconds (not every scroll)
- Reading progress calculated every 5 seconds
- Engagement score sent every 30 seconds (adjustable)

## Content-Specific Weights

### Blog Articles
- Scroll Depth: 35% (primary indicator)
- Reading Progress: 35% (content consumption)
- Time: 20% (engagement duration)
- Interactions: 10% (CTA clicks)

### Landing Pages
- Interactions: 25% (form submissions)
- Visible Sections: 25% (CTA/benefit visibility)
- Scroll Depth: 25% (page exploration)
- Time: 15% (page time)
- Reading: 10% (text engagement)

### Service Pages
- Scroll Depth: 25% (content exploration)
- Reading Progress: 25% (detailed reading)
- Time: 20% (page time)
- Visible Sections: 20% (service sections)
- Interactions: 10% (CTA clicks)

## Next Steps

1. Copy all tracker files to `src/lib/`
2. Update your page components with initialization
3. Add `data-track-visibility` attributes to content sections
4. Test in GA4 Real-Time dashboard
5. Create custom reports for insights
6. Monitor baseline metrics for 1 week
7. Optimize content based on low-performing areas

## Support & Debugging

Enable debug logging in development:

```typescript
// In .env or main.tsx
import.meta.env.DEV // Automatically logs to console

// All trackers log [TrackerName] prefix:
// [ScrollDepth], [TimeEngagement], [VisibilityTracker],
// [ReadingTracker], [EngagementScore]
```

---

For comprehensive documentation, see **SCROLL_ENGAGEMENT_TRACKING_GUIDE.md**
