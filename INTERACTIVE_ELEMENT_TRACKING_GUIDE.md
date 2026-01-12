# Interactive Element Analytics Tracking Guide
## FAQ, Accordions, Tabs, Video & Widget Engagement

Last Updated: January 2026

---

## Executive Summary

This guide provides comprehensive strategies for tracking user interactions with FAQ sections, collapsible accordions, tabs, video players, and interactive widgets across the Nexo website. It leverages the existing Google Analytics 4 (GA4) and Microsoft Clarity infrastructure integrated into the application.

**Current Analytics Stack:**
- **Google Analytics 4** (Measurement ID: G-CL4Y6SFBMZ)
- **Microsoft Clarity** (Project ID: uxu2vm6wqq)
- Cross-domain tracking enabled for nexo-agency.co.il and nexoagency.org

---

## Table of Contents

1. [Current State Analysis](#current-state-analysis)
2. [Accordion/Collapsible Tracking](#accordioncollapsible-tracking)
3. [Tab Interaction Measurement](#tab-interaction-measurement)
4. [Video Engagement Tracking](#video-engagement-tracking)
5. [Interactive Widget Analytics](#interactive-widget-analytics)
6. [User Interaction Patterns](#user-interaction-patterns)
7. [Implementation Best Practices](#implementation-best-practices)
8. [Metrics Dashboard Recommendations](#metrics-dashboard-recommendations)

---

## Current State Analysis

### Existing Implementation

#### Analytics Infrastructure (`/src/lib/analytics.ts`)

The application has a robust analytics foundation with:

```typescript
// Core tracking functions available:
- trackEvent(eventName, params?)           // Custom event tracking
- trackPageView(path, title?)              // SPA page views
- trackFormSubmission(formName, formData?) // Form tracking
- trackCTAClick(ctaName, location?)        // CTA button tracking
- trackOutboundLink(url)                   // Outbound link tracking
- setUserProperties(properties)            // User segmentation
```

#### FAQ Components Status

**Main FAQ Section** (`/src/components/FAQSection.tsx`)
- **Status:** Fully implemented with accordion functionality
- **Features:**
  - Tab-based filtering (Hebrew language: "כללי", "תהליך העבודה", "מחירים וזמנים", "טכנולוגיה")
  - Single-open accordion pattern (only one question open at a time)
  - Smooth expand/collapse animations using Framer Motion
  - GPU-accelerated CSS Grid animations
  - Memoized components for performance
  - Accessibility: ARIA roles (tablist, tab, tabpanel, region)

**Sub-Service FAQ** (`/src/components/subservice/SubServiceFAQ.tsx`)
- **Status:** Implemented with dynamic FAQ items per subservice
- **Features:**
  - Accordion items controlled by parent state
  - Color-coded chevron indicators
  - GPU-optimized grid animations
  - Responsive design

**Current Gap:** No interaction tracking implemented for accordion opens/closes

---

## Accordion/Collapsible Tracking

### Strategy Overview

Accordion interactions are critical user engagement signals. Each expand/collapse action indicates user interest in specific content areas.

### Recommended Events to Track

#### Event 1: Accordion Item Expanded
```typescript
// Event Name: faq_item_expanded

trackEvent('faq_item_expanded', {
  item_title: question,              // Question text
  category: selectedTab,              // FAQ category/tab selected
  position: index,                    // Position in accordion list (1-based)
  section: 'faq_section',            // Which FAQ component
  parent_service: parentService?.name, // If sub-service FAQ
  time_to_expand: timeFromPageLoad,  // Milliseconds until user expanded
  total_items_in_section: itemCount, // How many items were visible
});
```

#### Event 2: Accordion Item Collapsed
```typescript
// Event Name: faq_item_collapsed

trackEvent('faq_item_collapsed', {
  item_title: question,
  category: selectedTab,
  position: index,
  time_open: timeOpenedMsec,         // How long was the answer visible
  section: 'faq_section',
});
```

#### Event 3: Accordion Category/Tab Changed
```typescript
// Event Name: faq_category_changed

trackEvent('faq_category_changed', {
  from_category: previousTab,
  to_category: newTab,
  category_index: tabIndex,
  time_in_previous_category: timeSpentMsec,
  items_opened_in_previous: itemsExpandedCount,
});
```

### Implementation Example: Enhanced FAQSection Component

```typescript
import { useState, useCallback, memo, useMemo, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { trackEvent } from "@/lib/analytics";
import { ChevronDown } from "lucide-react";

interface FAQSectionProps {
  sectionId?: string;
}

const FAQSection = memo(({ sectionId = 'main_faq' }: FAQSectionProps) => {
  const [selectedTab, setSelectedTab] = useState(TABS[0]);
  const categoryStartTimeRef = useRef<number>(Date.now());
  const expandedItemsRef = useRef<Set<number>>(new Set());

  // Track category changes
  const handleTabChange = useCallback((newTab: string) => {
    const previousTab = selectedTab;
    const timeInCategory = Date.now() - categoryStartTimeRef.current;
    const itemsOpened = expandedItemsRef.current.size;

    // Track the tab switch
    trackEvent('faq_category_changed', {
      section_id: sectionId,
      from_category: previousTab,
      to_category: newTab,
      category_index: TABS.indexOf(newTab),
      time_in_previous_ms: timeInCategory,
      items_opened_in_previous: itemsOpened,
    });

    // Reset tracking for new tab
    expandedItemsRef.current.clear();
    categoryStartTimeRef.current = Date.now();
    setSelectedTab(newTab);
  }, [selectedTab, sectionId]);

  // Track individual question expand/collapse
  const handleQuestionToggle = useCallback((index: number, question: string, isOpening: boolean) => {
    if (isOpening) {
      trackEvent('faq_item_expanded', {
        section_id: sectionId,
        item_title: question,
        category: selectedTab,
        position: index + 1,
        total_items_in_section: QUESTIONS[selectedTab]?.length || 0,
      });
      expandedItemsRef.current.add(index);
    } else {
      trackEvent('faq_item_collapsed', {
        section_id: sectionId,
        item_title: question,
        category: selectedTab,
        position: index + 1,
      });
      expandedItemsRef.current.delete(index);
    }
  }, [selectedTab, sectionId]);

  return (
    <section className="...">
      {/* Existing JSX */}
      <Tabs
        selected={selectedTab}
        setSelected={handleTabChange}
      />
      <Questions
        selected={selectedTab}
        onQuestionToggle={handleQuestionToggle}
      />
    </section>
  );
});
```

### Tracking Best Practices for Accordions

1. **Track Opens Before Content Reveal**: Record the event immediately when expand button is clicked, not after animation completes
2. **Include Context**: Always include category/section information to understand topic interest
3. **Measure Dwell Time**: Calculate time spent reading by tracking expand and subsequent collapse
4. **Count Unique Items**: Monitor how many unique accordion items users explore
5. **Segment by Device**: Mobile vs desktop accordion interactions may differ significantly

---

## Tab Interaction Measurement

### Tab-Specific Events

#### Event 1: Tab Selected
```typescript
// Event Name: tab_selected

trackEvent('tab_selected', {
  tab_name: selectedTab,              // "כללי", "תהליך העבודה", etc.
  tab_index: tabIndex,                // 0-based position
  component: 'faq_tabs',              // Component identifier
  previous_tab: previousTab,          // Where user came from
  session_tab_switches: switchCount,  // How many times switched tabs this session
});
```

#### Event 2: Tab Visibility (Impression Tracking)
```typescript
// Event Name: tab_visible

trackEvent('tab_visible', {
  tabs: tabNames.join(','),           // All available tabs
  total_tabs: tabCount,
  section: 'faq_section',
});
```

### Implementation in Tabs Component

```typescript
interface TabsProps {
  selected: string;
  setSelected: (tab: string) => void;
}

const Tabs = memo(({ selected, setSelected }: TabsProps) => {
  const previousTabRef = useRef<string | null>(null);
  const tabSwitchCountRef = useRef(0);

  const handleTabClick = useCallback((tab: string) => {
    const previousTab = previousTabRef.current;
    tabSwitchCountRef.current++;

    trackEvent('tab_selected', {
      tab_name: tab,
      tab_index: TABS.indexOf(tab),
      component: 'faq_tabs',
      previous_tab: previousTab || 'none',
      session_tab_switches: tabSwitchCountRef.current,
      total_available_tabs: TABS.length,
    });

    previousTabRef.current = tab;
    setSelected(tab);
  }, [setSelected]);

  // Track tab section impression once
  useEffect(() => {
    trackEvent('tab_visible', {
      tabs: TABS.join(','),
      total_tabs: TABS.length,
      section: 'faq_section',
    });
  }, []); // Empty dependency array = fire once

  return (
    // ... JSX
  );
});
```

### Tab Navigation Patterns to Monitor

- **Tab Completion Rate**: % of users who view all tabs
- **Tab Stickiness**: How long users stay in specific tabs
- **Tab Abandonment**: Users who leave FAQ section without exploring all tabs
- **Tab Jump Patterns**: Which tabs are visited in sequence
- **Cold Tab Start**: First tab users typically click (may differ from default)

---

## Video Engagement Tracking

### Recommended Video Tracking Events

#### Event 1: Video Play
```typescript
// Event Name: video_play

trackEvent('video_play', {
  video_id: videoId,
  video_title: videoTitle,
  duration_seconds: videoDuration,
  start_time_seconds: 0,
  location: sectionName,              // "hero", "services", "case_study", etc.
  content_type: 'instructional',      // or 'testimonial', 'product_demo', etc.
  autoplay: wasAutoplay,
});
```

#### Event 2: Video Progress
```typescript
// Event Name: video_progress

// Track at 25%, 50%, 75%, 100% watched
trackEvent('video_progress', {
  video_id: videoId,
  video_title: videoTitle,
  progress_percent: progressPercentage,
  current_time_seconds: currentTime,
  duration_seconds: duration,
  location: sectionName,
});
```

#### Event 3: Video Pause
```typescript
// Event Name: video_pause

trackEvent('video_pause', {
  video_id: videoId,
  video_title: videoTitle,
  paused_at_seconds: currentTime,
  duration_seconds: duration,
  progress_percent: (currentTime / duration) * 100,
});
```

#### Event 4: Video Complete
```typescript
// Event Name: video_complete

trackEvent('video_complete', {
  video_id: videoId,
  video_title: videoTitle,
  duration_seconds: duration,
  location: sectionName,
  watch_time_seconds: actualWatchTime,     // Total watch time (excluding pauses)
  completion_rate: 1.0,
  played_once_through: true,
});
```

#### Event 5: Video Error
```typescript
// Event Name: video_error

trackEvent('video_error', {
  video_id: videoId,
  error_type: 'playback_failed',  // or 'network', 'unsupported_format'
  error_message: errorDescription,
  current_time_seconds: currentTime,
  location: sectionName,
});
```

### Video Tracking Implementation

```typescript
interface VideoPlayerProps {
  videoId: string;
  videoTitle: string;
  duration: number;
  location: string;
}

const VideoPlayer = memo(({
  videoId,
  videoTitle,
  duration,
  location
}: VideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressTrackingRef = useRef<Set<number>>(new Set()); // Track 25%, 50%, 75%
  const startTimeRef = useRef<number>(0);
  const pauseTimeRef = useRef<number>(0);
  const totalWatchTimeRef = useRef<number>(0);

  // Track video play
  const handlePlay = useCallback(() => {
    startTimeRef.current = Date.now();
    pauseTimeRef.current = 0;

    trackEvent('video_play', {
      video_id: videoId,
      video_title: videoTitle,
      duration_seconds: duration,
      start_time_seconds: videoRef.current?.currentTime || 0,
      location: location,
      content_type: 'product_demo',
    });
  }, [videoId, videoTitle, duration, location]);

  // Track video pause
  const handlePause = useCallback(() => {
    if (startTimeRef.current > 0) {
      const watchTime = (Date.now() - startTimeRef.current) / 1000;
      totalWatchTimeRef.current += watchTime;
      pauseTimeRef.current = Date.now();

      trackEvent('video_pause', {
        video_id: videoId,
        video_title: videoTitle,
        paused_at_seconds: videoRef.current?.currentTime || 0,
        duration_seconds: duration,
        progress_percent: ((videoRef.current?.currentTime || 0) / duration) * 100,
      });
    }
  }, [videoId, videoTitle, duration]);

  // Track progress milestones
  const handleTimeUpdate = useCallback(() => {
    const currentTime = videoRef.current?.currentTime || 0;
    const progressPercent = (currentTime / duration) * 100;

    // Track 25%, 50%, 75%, 100%
    const milestones = [25, 50, 75, 100];

    milestones.forEach((milestone) => {
      if (
        progressPercent >= milestone &&
        !progressTrackingRef.current.has(milestone)
      ) {
        progressTrackingRef.current.add(milestone);

        trackEvent('video_progress', {
          video_id: videoId,
          video_title: videoTitle,
          progress_percent: milestone,
          current_time_seconds: currentTime,
          duration_seconds: duration,
          location: location,
        });
      }
    });
  }, [videoId, videoTitle, duration, location]);

  // Track video completion
  const handleEnded = useCallback(() => {
    if (startTimeRef.current > 0) {
      const finalWatchTime = (Date.now() - startTimeRef.current) / 1000;
      totalWatchTimeRef.current += finalWatchTime;
    }

    trackEvent('video_complete', {
      video_id: videoId,
      video_title: videoTitle,
      duration_seconds: duration,
      location: location,
      watch_time_seconds: Math.round(totalWatchTimeRef.current),
      completion_rate: 1.0,
      played_once_through: true,
    });
  }, [videoId, videoTitle, duration, location]);

  // Track video errors
  const handleError = useCallback((event: Event) => {
    const video = event.target as HTMLVideoElement;
    const error = video.error;
    let errorType = 'unknown';

    if (error) {
      switch (error.code) {
        case error.MEDIA_ERR_ABORTED:
          errorType = 'playback_aborted';
          break;
        case error.MEDIA_ERR_NETWORK:
          errorType = 'network_error';
          break;
        case error.MEDIA_ERR_DECODE:
          errorType = 'decode_error';
          break;
        case error.MEDIA_ERR_SRC_NOT_SUPPORTED:
          errorType = 'unsupported_format';
          break;
      }
    }

    trackEvent('video_error', {
      video_id: videoId,
      error_type: errorType,
      error_message: error?.message || 'Unknown error',
      current_time_seconds: video?.currentTime || 0,
      location: location,
    });
  }, [videoId, location]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('ended', handleEnded);
    video.addEventListener('error', handleError);

    return () => {
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('ended', handleEnded);
      video.removeEventListener('error', handleError);
    };
  }, [handlePlay, handlePause, handleTimeUpdate, handleEnded, handleError]);

  return (
    <video
      ref={videoRef}
      controls
      className="w-full rounded-lg"
    >
      <source src={`/videos/${videoId}.mp4`} type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  );
});
```

### Video Engagement Metrics

**Primary KPIs:**
- Play Rate: % of users who initiate video playback
- Completion Rate: % of viewers who watch to 100%
- Average Watch Time: Mean duration watched (including rewatches)
- Drop-off Points: Where users pause and don't resume
- Engagement Rate: (play_events / page_views) × 100

**Secondary KPIs:**
- Time to First Play: How long before user hits play
- Rewatch Rate: Users who replay videos
- Multi-video Engagement: How many different videos viewed per session
- Device Completion Rates: Desktop vs mobile completion differences

---

## Interactive Widget Analytics

### Widget Types & Tracking

#### Type 1: Carousel/Slider (FanCarousel)
```typescript
// Event Name: carousel_swipe

trackEvent('carousel_swipe', {
  carousel_id: carouselId,
  from_index: previousIndex,
  to_index: currentIndex,
  direction: 'forward' | 'backward',
  interaction_method: 'click' | 'drag' | 'keyboard',
  total_items: itemCount,
  items_completed: currentIndex + 1,
});

// Event Name: carousel_complete

trackEvent('carousel_complete', {
  carousel_id: carouselId,
  items_viewed: itemsViewedList, // Array of viewed item indices
  total_items: itemCount,
  completion_rate: (itemsViewed / itemCount) * 100,
  time_spent_seconds: timeSpentMsec / 1000,
});
```

**Implementation:**
```typescript
const FanCarousel = memo(({ cards, onCardChange }: FanCarouselProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const viewedItemsRef = useRef<Set<number>>(new Set([0])); // Track viewed items
  const carouselStartRef = useRef<number>(Date.now());

  const handleCardChange = useCallback((newIndex: number) => {
    trackEvent('carousel_swipe', {
      carousel_id: 'services_carousel',
      from_index: activeIndex,
      to_index: newIndex,
      direction: newIndex > activeIndex ? 'forward' : 'backward',
      interaction_method: 'click',
      total_items: cards.length,
      items_completed: newIndex + 1,
    });

    viewedItemsRef.current.add(newIndex);
    setActiveIndex(newIndex);
    onCardChange?.(newIndex);

    // Track completion if viewed all items
    if (viewedItemsRef.current.size === cards.length) {
      const timeSpent = Date.now() - carouselStartRef.current;
      trackEvent('carousel_complete', {
        carousel_id: 'services_carousel',
        items_viewed: Array.from(viewedItemsRef.current),
        total_items: cards.length,
        completion_rate: 100,
        time_spent_seconds: Math.round(timeSpent / 1000),
      });
    }
  }, [activeIndex, cards.length, onCardChange]);

  return (
    // ... carousel JSX
  );
});
```

#### Type 2: Dropdown/Select Menu
```typescript
// Event Name: dropdown_opened

trackEvent('dropdown_opened', {
  dropdown_id: dropdownId,
  dropdown_name: name,
  option_count: optionCount,
  location: sectionName,
});

// Event Name: dropdown_selected

trackEvent('dropdown_selected', {
  dropdown_id: dropdownId,
  selected_option: selectedValue,
  option_index: optionIndex,
  dropdown_name: name,
});
```

#### Type 3: Form Widget (Contact Form)
```typescript
// Event Name: form_field_focused

trackEvent('form_field_focused', {
  form_id: formId,
  field_name: fieldName,
  field_type: fieldType, // 'text', 'email', 'textarea', etc.
  field_position: fieldPosition, // Order in form
});

// Event Name: form_field_error

trackEvent('form_field_error', {
  form_id: formId,
  field_name: fieldName,
  error_type: errorType, // 'required', 'invalid_email', 'too_long', etc.
  user_input_length: inputLength,
});

// Event Name: form_progress

trackEvent('form_progress', {
  form_id: formId,
  fields_completed: completedCount,
  total_fields: totalCount,
  progress_percent: (completedCount / totalCount) * 100,
  time_in_form_seconds: timeSpent / 1000,
});
```

#### Type 4: Interactive Map/Globe
```typescript
// Event Name: map_interaction

trackEvent('map_interaction', {
  map_id: mapId,
  interaction_type: 'zoom' | 'pan' | 'click_marker',
  zoom_level: currentZoom,
  marker_clicked: markerName, // If applicable
  duration_seconds: interactionDuration,
});
```

#### Type 5: Toggle/Switch
```typescript
// Event Name: toggle_switched

trackEvent('toggle_switched', {
  toggle_id: toggleId,
  toggle_name: name,
  new_state: isEnabled ? 'on' : 'off',
  previous_state: wasEnabled ? 'on' : 'off',
  context: contextInfo, // e.g., "pricing_calculator"
});
```

### Multi-Step Widget Tracking

For complex widgets with multiple steps (like wizards):

```typescript
interface MultiStepWidgetProps {
  widgetId: string;
  totalSteps: number;
}

const MultiStepWidget = memo(({ widgetId, totalSteps }: MultiStepWidgetProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const startTimeRef = useRef<number>(Date.now());

  const handleStepChange = useCallback((newStep: number) => {
    const timeOnStep = Date.now() - startTimeRef.current;

    trackEvent('widget_step_completed', {
      widget_id: widgetId,
      step_number: currentStep + 1,
      step_name: getStepName(currentStep),
      total_steps: totalSteps,
      progress_percent: ((currentStep + 1) / totalSteps) * 100,
      time_on_step_seconds: Math.round(timeOnStep / 1000),
      direction: newStep > currentStep ? 'forward' : 'backward',
    });

    startTimeRef.current = Date.now();
    setCurrentStep(newStep);

    // Track completion on final step
    if (newStep === totalSteps - 1) {
      trackEvent('widget_completed', {
        widget_id: widgetId,
        total_steps: totalSteps,
        total_time_seconds: Math.round((Date.now() - startTimeRef.current) / 1000),
        steps_skipped: totalSteps - stepsCompleted,
      });
    }
  }, [currentStep, totalSteps, widgetId]);

  return (
    // ... widget JSX
  );
});
```

---

## User Interaction Patterns

### Session-Level Analytics

Track patterns across an entire user session:

```typescript
interface SessionAnalytics {
  faqSectionsViewed: string[];        // Which FAQ sections user accessed
  accordionItemsOpened: number;       // Total items expanded across session
  tabsExplored: number;               // Unique tabs clicked
  videoWatchTime: number;             // Total video watch time (seconds)
  widgetInteractions: number;         // Total widget interactions
  avgTimePerInteraction: number;      // Mean duration per action
}
```

### User Segmentation by Behavior

```typescript
type UserSegment =
  | 'info_seeker'        // Lots of accordion opens, minimal video
  | 'visual_learner'     // High video engagement
  | 'comparison_shopper'  // Views all tabs, high carousel interaction
  | 'action_taker'       // Quick navigation, form submission
  | 'bouncer';           // Minimal interaction

function detectUserSegment(interactions: SessionAnalytics): UserSegment {
  if (interactions.videoWatchTime > 120) return 'visual_learner';
  if (interactions.tabsExplored === TOTAL_TABS) return 'comparison_shopper';
  if (interactions.accordionItemsOpened > 8) return 'info_seeker';
  // ... more logic
  return 'bouncer';
}
```

### Journey Mapping

Track the sequence of interactions to understand user flow:

```typescript
// Track interaction sequence
type InteractionSequence = {
  timestamp: number;
  eventType: 'accordion' | 'tab' | 'video' | 'widget' | 'form';
  eventName: string;
  duration?: number;
};

const interactionJourneyRef = useRef<InteractionSequence[]>([]);

// Before leaving page, send journey data
window.addEventListener('beforeunload', () => {
  if (interactionJourneyRef.current.length > 0) {
    setUserProperties({
      interaction_sequence: JSON.stringify(interactionJourneyRef.current),
      session_interaction_count: interactionJourneyRef.current.length,
    });
  }
});
```

### Funnel Analysis

Create funnels for content paths:

```typescript
// Event Name: faq_funnel_step

// Step 1: View FAQ section
trackEvent('faq_funnel_step', {
  step: 1,
  step_name: 'faq_viewed',
});

// Step 2: Select tab
trackEvent('faq_funnel_step', {
  step: 2,
  step_name: 'tab_selected',
  tab_selected: selectedTab,
});

// Step 3: Expand accordion
trackEvent('faq_funnel_step', {
  step: 3,
  step_name: 'accordion_opened',
  questions_opened: 2,
});

// Step 4: Engage with CTA
trackEvent('faq_funnel_step', {
  step: 4,
  step_name: 'contacted',
  contact_method: 'form',
});
```

---

## Implementation Best Practices

### 1. Performance Considerations

**Debounce Excessive Events:**
```typescript
import { useCallback, useRef } from 'react';

const useThrottledEvent = (eventName: string, delay: number = 500) => {
  const lastTimeRef = useRef<number>(0);

  return useCallback((params?: Record<string, unknown>) => {
    const now = Date.now();
    if (now - lastTimeRef.current > delay) {
      trackEvent(eventName, params);
      lastTimeRef.current = now;
    }
  }, [eventName, delay]);
};

// Use for events that fire frequently (like video timeupdate)
const throttledProgressTrack = useThrottledEvent('video_progress', 1000);
```

**Batch Events:**
```typescript
interface EventBatch {
  events: Array<{ name: string; params: Record<string, unknown> }>;
  timestamp: number;
}

const eventBatchRef = useRef<EventBatch>({
  events: [],
  timestamp: Date.now(),
});

// Send batch when user leaves page or batch reaches size limit
const flushEventBatch = () => {
  if (eventBatchRef.current.events.length > 0) {
    trackEvent('event_batch', {
      event_count: eventBatchRef.current.events.length,
      events: eventBatchRef.current.events,
    });
    eventBatchRef.current = { events: [], timestamp: Date.now() };
  }
};
```

### 2. Data Quality

**Validate Event Parameters:**
```typescript
interface EventValidation {
  required: string[];
  optional: string[];
  types: Record<string, string>;
}

const eventSchemas: Record<string, EventValidation> = {
  faq_item_expanded: {
    required: ['item_title', 'category', 'position'],
    optional: ['section', 'time_to_expand'],
    types: {
      item_title: 'string',
      category: 'string',
      position: 'number',
      time_to_expand: 'number',
    },
  },
  // ... more schemas
};

function validateEvent(
  eventName: string,
  params?: Record<string, unknown>
): boolean {
  const schema = eventSchemas[eventName];
  if (!schema) return true; // Unknown events pass through

  // Check required fields
  return schema.required.every(field => field in (params || {}));
}
```

### 3. Privacy Compliance

**Exclude Sensitive Data:**
```typescript
// Never track PII or sensitive information
const BLOCKED_PATTERNS = [
  /email/i,
  /password/i,
  /credit_card/i,
  /ssn/i,
  /phone/i,
];

function sanitizeEventParams(params: Record<string, unknown>): Record<string, unknown> {
  const sanitized: Record<string, unknown> = {};

  Object.entries(params).forEach(([key, value]) => {
    if (BLOCKED_PATTERNS.some(pattern => pattern.test(key))) {
      return; // Skip blocked fields
    }
    sanitized[key] = value;
  });

  return sanitized;
}
```

**Respect User Consent:**
```typescript
// Only track analytics if user has consented
export function trackEventWithConsent(
  eventName: string,
  params?: Record<string, unknown>
): void {
  const hasConsent = localStorage.getItem('analytics_consent') === 'true';
  if (!hasConsent) return;

  trackEvent(eventName, params);
}
```

### 4. Debugging in Development

```typescript
// Enable detailed logging in development
const ANALYTICS_DEBUG = import.meta.env.DEV;

export function trackEventDebug(
  eventName: string,
  params?: Record<string, unknown>
): void {
  if (ANALYTICS_DEBUG) {
    console.log(
      `%c[Analytics] ${eventName}`,
      'color: #1f2937; font-weight: bold;',
      params || {}
    );
  }

  trackEvent(eventName, params);
}
```

---

## Metrics Dashboard Recommendations

### GA4 Dashboard Setup

**Custom Report 1: FAQ Engagement Summary**
- Primary Dimension: `event_name` (faq_item_expanded, faq_item_collapsed, etc.)
- Primary Metric: Event Count
- Secondary Metric: Unique Users
- Date Range: Last 30 days
- Filters: page_title contains "שאלות נפוצות"

**Custom Report 2: Tab Performance**
- Dimensions: `event_parameter: tab_name`, `event_parameter: category`
- Metrics: Event Count, Avg. Event Value
- Comparison: Mobile vs Desktop

**Custom Report 3: Video Engagement Funnel**
- Funnel: video_play → video_progress (25%) → video_progress (50%) → video_progress (100%)
- Segment: Page where video appears
- Compare: Sources (organic, referral, direct)

**Custom Report 4: User Journey**
- Sequence: faq_category_changed → accordion_expanded → contact_form_started → form_submission
- Count: How many users complete this sequence
- Time: Average time between steps

**Custom Report 5: Widget Interaction Heatmap**
- Dimensions: Carousel/Widget ID, Interaction Type
- Metrics: Total Interactions, Unique Users
- Visualization: Table sorted by engagement

### Key Metrics to Monitor

| Metric | Target | Why It Matters |
|--------|--------|-----------------|
| **FAQ Expansion Rate** | >40% | User interest indicator |
| **Avg. Items Opened/Session** | >2 | Content exploration depth |
| **Tab Exploration Rate** | >60% view all tabs | Topic interest comprehensiveness |
| **Video Completion Rate** | >50% | Content quality signal |
| **Carousel View-All Rate** | >40% | Product/service awareness |
| **Form Completion Rate** | >20% of viewers | Conversion efficiency |
| **Session Duration (FAQ) | >2 min | Engagement quality |
| **Bounce Rate (FAQ)** | <35% | Content relevance |

### Clarity Session Recording Tags

Set these tags to filter and analyze session recordings:

```typescript
// In useAnalytics hook or at app initialization
import { setClarityTag } from '@/lib/analytics';

// Tag high-engagement sessions
if (faqItemsOpened > 5) {
  setClarityTag('engagement_level', 'high');
}

// Tag by device type
setClarityTag('device_type', isMobile ? 'mobile' : 'desktop');

// Tag by user intent (detected from interactions)
if (userSegment === 'info_seeker') {
  setClarityTag('user_intent', 'research');
}

// Tag checkout/conversion path
if (hasStartedContactForm) {
  setClarityTag('conversion_stage', 'interested');
}
```

---

## Quick Reference: Event Checklist

### FAQ Section Events
- [ ] `faq_item_expanded` - User opens accordion item
- [ ] `faq_item_collapsed` - User closes accordion item
- [ ] `faq_category_changed` - User switches tab
- [ ] `tab_visible` - FAQ section becomes visible

### Tab Events
- [ ] `tab_selected` - User clicks tab
- [ ] Tab switch sequence - Multiple tabs viewed

### Video Events
- [ ] `video_play` - Video starts playing
- [ ] `video_progress` - Video reaches 25%, 50%, 75%, 100%
- [ ] `video_pause` - Video paused by user
- [ ] `video_complete` - Full playback completed
- [ ] `video_error` - Video playback error

### Widget Events
- [ ] `carousel_swipe` - Carousel item changed
- [ ] `carousel_complete` - User viewed all carousel items
- [ ] `dropdown_opened` - Select menu opened
- [ ] `dropdown_selected` - Option selected
- [ ] `toggle_switched` - Toggle changed state
- [ ] `map_interaction` - Map/globe interaction

### Form Events
- [ ] `form_field_focused` - User focuses form field
- [ ] `form_field_error` - Form validation error
- [ ] `form_progress` - Form completion percentage
- [ ] `form_submit` - Form submitted

---

## Implementation Timeline

**Phase 1 (Week 1-2): Foundation**
- Add event tracking to FAQSection and SubServiceFAQ components
- Implement accordion expand/collapse event tracking
- Set up tab selection tracking
- Test with GA4 real-time reports

**Phase 2 (Week 3-4): Video & Widgets**
- Implement video engagement tracking
- Add carousel/widget interaction tracking
- Create custom events for all widget types
- Validate data quality

**Phase 3 (Week 5-6): Analysis & Optimization**
- Build custom dashboards in GA4
- Configure Clarity session tags
- Analyze user segment patterns
- Identify optimization opportunities

**Phase 4 (Ongoing): Monitoring & Refinement**
- Weekly dashboard reviews
- A/B test FAQ presentation changes
- Monitor video completion trends
- Refine widget UX based on interaction data

---

## Troubleshooting Guide

### Events Not Appearing in GA4

1. **Check Initialization**: Verify `initAnalytics()` called in main.tsx
2. **Verify Production**: Analytics only track in production (check `import.meta.env.DEV`)
3. **Check Event Names**: Custom events must match GA4 configuration
4. **Real-time Report**: Use GA4 real-time report to confirm events firing
5. **Browser Console**: Look for errors in console when events should fire

### Inaccurate Video Duration

- Ensure `<video>` tag has `duration` attribute set correctly
- For HLS/DASH streams, duration may not be immediately available
- Add small delay before tracking initial duration

### Missing User Properties

- Check that `setUserProperties()` called before events
- Verify user properties don't contain PII
- Allow 24-48 hours for properties to appear in reports

### Clarity Recording Issues

- Confirm Clarity project ID correct in analytics.ts
- Check browser console for Clarity errors
- Verify no CSP violations blocking Clarity script
- Try incognito mode to rule out browser extensions

---

## Resources

- **GA4 Documentation**: https://developers.google.com/analytics/devguides/collection/ga4
- **Microsoft Clarity Docs**: https://clarity.microsoft.com/
- **GA4 Event Parameters**: https://support.google.com/analytics/answer/7029846
- **Framer Motion Docs**: https://www.framer.com/motion/
- **React Best Practices**: https://react.dev/

---

*Document Version: 1.0*
*Last Updated: January 2026*
*Maintained by: NEXO Development Team*
