# Interactive Element Tracking - Implementation Reference
## Code Snippets & Integration Patterns

---

## Table of Contents

1. [Utility Hooks](#utility-hooks)
2. [Component Integration Patterns](#component-integration-patterns)
3. [Event Schema Definition](#event-schema-definition)
4. [Clarity Tag Integration](#clarity-tag-integration)
5. [Testing & Verification](#testing--verification)

---

## Utility Hooks

### useEventTracking Hook

Reusable hook for consistent event tracking across components:

```typescript
// src/hooks/useEventTracking.ts
import { useCallback, useRef } from 'react';
import { trackEvent, trackFormSubmission, trackCTAClick } from '@/lib/analytics';

interface EventTrackingOptions {
  debounceMs?: number;
  logToConsole?: boolean;
}

export function useEventTracking(options: EventTrackingOptions = {}) {
  const { debounceMs = 0, logToConsole = import.meta.env.DEV } = options;
  const lastEventTimeRef = useRef<Record<string, number>>({});

  const track = useCallback((
    eventName: string,
    params?: Record<string, unknown>
  ) => {
    const now = Date.now();
    const lastTime = lastEventTimeRef.current[eventName] ?? 0;

    // Debounce check
    if (now - lastTime < debounceMs) {
      return;
    }

    lastEventTimeRef.current[eventName] = now;

    // Log in development
    if (logToConsole) {
      console.log(`📊 [Analytics] ${eventName}`, params);
    }

    // Track event
    trackEvent(eventName, params);
  }, [debounceMs, logToConsole]);

  const trackAccordionOpen = useCallback((
    title: string,
    category: string,
    position: number,
    sectionId: string = 'main_faq'
  ) => {
    track('faq_item_expanded', {
      item_title: title,
      category,
      position,
      section_id: sectionId,
    });
  }, [track]);

  const trackAccordionClose = useCallback((
    title: string,
    category: string,
    position: number,
    sectionId: string = 'main_faq'
  ) => {
    track('faq_item_collapsed', {
      item_title: title,
      category,
      position,
      section_id: sectionId,
    });
  }, [track]);

  const trackTabChange = useCallback((
    fromTab: string,
    toTab: string,
    tabIndex: number,
    timeInPrevious?: number,
    itemsOpened?: number
  ) => {
    track('faq_category_changed', {
      from_category: fromTab,
      to_category: toTab,
      category_index: tabIndex,
      ...(timeInPrevious && { time_in_previous_ms: timeInPrevious }),
      ...(itemsOpened && { items_opened_in_previous: itemsOpened }),
    });
  }, [track]);

  const trackVideoEvent = useCallback((
    eventType: 'play' | 'pause' | 'progress' | 'complete' | 'error',
    videoId: string,
    videoTitle: string,
    params?: Record<string, unknown>
  ) => {
    track(`video_${eventType}`, {
      video_id: videoId,
      video_title: videoTitle,
      ...params,
    });
  }, [track]);

  const trackWidgetInteraction = useCallback((
    widgetType: 'carousel' | 'dropdown' | 'toggle' | 'map',
    widgetId: string,
    params?: Record<string, unknown>
  ) => {
    track(`${widgetType}_interaction`, {
      widget_id: widgetId,
      widget_type: widgetType,
      ...params,
    });
  }, [track]);

  const trackFormInteraction = useCallback((
    formId: string,
    fieldName: string,
    interactionType: 'focus' | 'error' | 'submit',
    params?: Record<string, unknown>
  ) => {
    const eventName = `form_${interactionType}`;
    track(eventName, {
      form_id: formId,
      field_name: fieldName,
      ...params,
    });
  }, [track]);

  return {
    track,
    trackAccordionOpen,
    trackAccordionClose,
    trackTabChange,
    trackVideoEvent,
    trackWidgetInteraction,
    trackFormInteraction,
  };
}
```

### useInteractionTimer Hook

Track duration of interactions:

```typescript
// src/hooks/useInteractionTimer.ts
import { useEffect, useRef, useCallback } from 'react';

interface InteractionTimerOptions {
  onTimerEnd?: (duration: number) => void;
  autoStart?: boolean;
}

export function useInteractionTimer(
  options: InteractionTimerOptions = { autoStart: true }
) {
  const startTimeRef = useRef<number | null>(null);
  const isActiveRef = useRef(false);

  const start = useCallback(() => {
    startTimeRef.current = Date.now();
    isActiveRef.current = true;
  }, []);

  const stop = useCallback((): number => {
    if (!startTimeRef.current) return 0;
    const duration = Date.now() - startTimeRef.current;
    isActiveRef.current = false;
    startTimeRef.current = null;
    options.onTimerEnd?.(duration);
    return duration;
  }, [options]);

  const getDuration = useCallback((): number => {
    if (!startTimeRef.current) return 0;
    return Date.now() - startTimeRef.current;
  }, []);

  useEffect(() => {
    if (options.autoStart) {
      start();
    }

    return () => {
      if (isActiveRef.current) {
        stop();
      }
    };
  }, [options.autoStart, start, stop]);

  return {
    start,
    stop,
    getDuration,
    isActive: isActiveRef.current,
  };
}
```

---

## Component Integration Patterns

### Pattern 1: Enhanced FAQSection

```typescript
// src/components/FAQSection.enhanced.tsx
import { useState, useCallback, memo, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useEventTracking } from "@/hooks/useEventTracking";
import { useInteractionTimer } from "@/hooks/useInteractionTimer";

const TABS = ["כללי", "תהליך העבודה", "מחירים וזמנים", "טכנולוגיה"];

interface Question {
  question: string;
  answer: string;
}

const QUESTIONS: Record<string, Question[]> = {
  // ... existing questions
};

interface FAQSectionProps {
  sectionId?: string;
}

const FAQSection = memo(({ sectionId = 'main_faq' }: FAQSectionProps) => {
  const [selectedTab, setSelectedTab] = useState(TABS[0]);
  const [openIndex, setOpenIndex] = useState<number>(-1);

  const { trackTabChange, trackAccordionOpen, trackAccordionClose } =
    useEventTracking();

  const categoryTimerRef = useRef<number>(Date.now());
  const expandedItemsRef = useRef<Set<number>>(new Set());

  // Track tab changes
  const handleTabChange = useCallback((newTab: string) => {
    if (selectedTab === newTab) return; // Same tab, ignore

    const timeInCategory = Date.now() - categoryTimerRef.current;
    const itemsOpened = expandedItemsRef.current.size;

    trackTabChange(selectedTab, newTab, TABS.indexOf(newTab), timeInCategory, itemsOpened);

    // Reset for new tab
    expandedItemsRef.current.clear();
    categoryTimerRef.current = Date.now();
    setSelectedTab(newTab);
    setOpenIndex(-1); // Close any open accordion
  }, [selectedTab, trackTabChange]);

  // Track accordion interactions
  const handleToggle = useCallback((idx: number) => {
    const isOpening = openIndex !== idx;
    const currentQuestions = QUESTIONS[selectedTab] || [];
    const question = currentQuestions[idx]?.question || '';

    if (isOpening) {
      trackAccordionOpen(question, selectedTab, idx + 1, sectionId);
      expandedItemsRef.current.add(idx);
    } else {
      trackAccordionClose(question, selectedTab, idx + 1, sectionId);
      expandedItemsRef.current.delete(idx);
    }

    setOpenIndex(isOpening ? idx : -1);
  }, [openIndex, selectedTab, sectionId, trackAccordionOpen, trackAccordionClose]);

  // Track section impression
  useEffect(() => {
    const { track } = useEventTracking();
    track('faq_section_viewed', {
      section_id: sectionId,
      total_tabs: TABS.length,
      initial_tab: TABS[0],
    });
  }, [sectionId]);

  const currentQuestions = useMemo(() => QUESTIONS[selectedTab] || [], [selectedTab]);

  return (
    <section className="relative py-12 sm:py-16 md:py-20 lg:py-24 overflow-hidden bg-nexo-light">
      {/* Tabs */}
      <div
        className="flex flex-wrap justify-center gap-2 sm:gap-3 md:gap-4 mb-8 sm:mb-10"
        role="tablist"
        dir="rtl"
      >
        {TABS.map((tab, idx) => (
          <button
            key={tab}
            role="tab"
            aria-selected={selectedTab === tab}
            onClick={() => handleTabChange(tab)}
            className={`px-4 sm:px-5 py-2.5 sm:py-3 rounded-full text-sm md:text-base font-medium transition-colors ${
              selectedTab === tab ? 'bg-primary text-white' : 'bg-white text-nexo-steel'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Questions */}
      <div className="max-w-3xl mx-auto px-4">
        <AnimatePresence mode="wait">
          {currentQuestions.map((q, idx) => (
            <motion.div
              key={`${selectedTab}-${idx}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="border-b border-nexo-mist"
            >
              <button
                onClick={() => handleToggle(idx)}
                className="flex w-full items-center justify-between py-4 sm:py-5 md:py-6"
                dir="rtl"
              >
                <span className={`text-lg md:text-xl font-medium ${
                  openIndex === idx ? 'text-primary' : 'text-nexo-charcoal'
                }`}>
                  {q.question}
                </span>
                <motion.span
                  animate={{ rotate: openIndex === idx ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChevronDown className="w-6 h-6" />
                </motion.span>
              </button>

              {/* Answer */}
              <div
                className="grid transition-[grid-template-rows,opacity] duration-300 ease-out"
                style={{
                  gridTemplateRows: openIndex === idx ? '1fr' : '0fr',
                  opacity: openIndex === idx ? 1 : 0,
                }}
              >
                <div className="overflow-hidden">
                  <p className="text-base md:text-lg leading-relaxed pb-4" dir="rtl">
                    {q.answer}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </section>
  );
});

FAQSection.displayName = 'FAQSection';

export default FAQSection;
```

### Pattern 2: Enhanced Video Component

```typescript
// src/components/VideoPlayer.enhanced.tsx
import { useRef, useCallback, useEffect, memo } from 'react';
import { useEventTracking } from '@/hooks/useEventTracking';
import { useInteractionTimer } from '@/hooks/useInteractionTimer';

interface VideoPlayerProps {
  videoId: string;
  videoTitle: string;
  videoUrl: string;
  duration: number;
  location: string;
  contentType?: 'instructional' | 'testimonial' | 'product_demo';
}

const PROGRESS_MILESTONES = [25, 50, 75, 100];

const VideoPlayer = memo(({
  videoId,
  videoTitle,
  videoUrl,
  duration,
  location,
  contentType = 'product_demo',
}: VideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { trackVideoEvent } = useEventTracking();
  const { start: startTimer, getDuration: getPlayDuration } =
    useInteractionTimer({ autoStart: false });

  const progressTrackedRef = useRef<Set<number>>(new Set());
  const totalWatchTimeRef = useRef<number>(0);

  // Track play event
  const handlePlay = useCallback(() => {
    startTimer();
    trackVideoEvent('play', videoId, videoTitle, {
      duration_seconds: duration,
      start_time_seconds: videoRef.current?.currentTime || 0,
      location,
      content_type: contentType,
    });
  }, [startTimer, trackVideoEvent, videoId, videoTitle, duration, location, contentType]);

  // Track pause event
  const handlePause = useCallback(() => {
    const playDuration = getPlayDuration();
    totalWatchTimeRef.current += playDuration;

    trackVideoEvent('pause', videoId, videoTitle, {
      paused_at_seconds: videoRef.current?.currentTime || 0,
      duration_seconds: duration,
      progress_percent: ((videoRef.current?.currentTime || 0) / duration) * 100,
      play_duration_seconds: Math.round(playDuration / 1000),
    });
  }, [getPlayDuration, trackVideoEvent, videoId, videoTitle, duration]);

  // Track progress milestones
  const handleTimeUpdate = useCallback(() => {
    const currentTime = videoRef.current?.currentTime || 0;
    const progressPercent = (currentTime / duration) * 100;

    PROGRESS_MILESTONES.forEach((milestone) => {
      if (
        progressPercent >= milestone &&
        !progressTrackedRef.current.has(milestone)
      ) {
        progressTrackedRef.current.add(milestone);

        trackVideoEvent('progress', videoId, videoTitle, {
          progress_percent: milestone,
          current_time_seconds: Math.round(currentTime),
          duration_seconds: duration,
          location,
        });
      }
    });
  }, [trackVideoEvent, videoId, videoTitle, duration, location]);

  // Track completion
  const handleEnded = useCallback(() => {
    const totalDuration = getPlayDuration();
    totalWatchTimeRef.current += totalDuration;

    trackVideoEvent('complete', videoId, videoTitle, {
      duration_seconds: duration,
      location,
      watch_time_seconds: Math.round(totalWatchTimeRef.current / 1000),
      completion_rate: 1.0,
    });

    // Reset progress tracking for potential rewatch
    progressTrackedRef.current.clear();
  }, [getPlayDuration, trackVideoEvent, videoId, videoTitle, duration, location]);

  // Track errors
  const handleError = useCallback(() => {
    const video = videoRef.current;
    if (!video?.error) return;

    const errorMap: Record<number, string> = {
      1: 'MEDIA_ERR_ABORTED',
      2: 'MEDIA_ERR_NETWORK',
      3: 'MEDIA_ERR_DECODE',
      4: 'MEDIA_ERR_SRC_NOT_SUPPORTED',
    };

    const errorType = errorMap[video.error.code] || 'unknown';

    trackVideoEvent('error', videoId, videoTitle, {
      error_type: errorType,
      error_code: video.error.code,
      current_time_seconds: video.currentTime,
      location,
    });
  }, [trackVideoEvent, videoId, videoTitle, location]);

  // Attach event listeners
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
      src={videoUrl}
      controls
      className="w-full rounded-lg bg-black"
      style={{ aspectRatio: '16 / 9' }}
    >
      Your browser does not support the video tag.
    </video>
  );
});

VideoPlayer.displayName = 'VideoPlayer';

export default VideoPlayer;
```

### Pattern 3: Enhanced Carousel Component

```typescript
// src/components/FanCarousel.enhanced.tsx
import { useState, useRef, memo, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { useEventTracking } from "@/hooks/useEventTracking";

interface CardData {
  id: number;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  subtitle: string;
  description: string;
  color: string;
  primaryColor: string;
  stat?: { value: string; label: string };
}

interface FanCarouselProps {
  cards: CardData[];
  carouselId?: string;
  onCardChange?: (index: number) => void;
}

const FanCarousel = memo(({
  cards,
  carouselId = 'default_carousel',
  onCardChange,
}: FanCarouselProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const { trackWidgetInteraction } = useEventTracking();
  const viewedItemsRef = useRef<Set<number>>(new Set([0]));
  const carouselStartRef = useRef<number>(Date.now());

  const handleCardChange = useCallback((newIndex: number) => {
    trackWidgetInteraction('carousel', carouselId, {
      from_index: activeIndex,
      to_index: newIndex,
      direction: newIndex > activeIndex ? 'forward' : 'backward',
      total_items: cards.length,
      items_viewed: newIndex + 1,
    });

    viewedItemsRef.current.add(newIndex);
    setActiveIndex(newIndex);
    onCardChange?.(newIndex);

    // Check if carousel completed (all items viewed)
    if (viewedItemsRef.current.size === cards.length) {
      const timeSpent = Date.now() - carouselStartRef.current;
      trackWidgetInteraction('carousel', carouselId, {
        event_type: 'carousel_complete',
        items_viewed: Array.from(viewedItemsRef.current),
        total_items: cards.length,
        completion_rate: 100,
        time_spent_seconds: Math.round(timeSpent / 1000),
      });
    }
  }, [activeIndex, cards.length, carouselId, trackWidgetInteraction, onCardChange]);

  // Track initial carousel impression
  useEffect(() => {
    trackWidgetInteraction('carousel', carouselId, {
      event_type: 'carousel_viewed',
      total_items: cards.length,
      initial_item: 0,
    });
  }, [carouselId, cards.length, trackWidgetInteraction]);

  return (
    <div className="relative">
      {/* Carousel content */}
      <div className="flex items-center justify-center">
        {cards.map((card, index) => (
          <motion.div
            key={card.id}
            onClick={() => handleCardChange(index)}
            className="cursor-pointer"
          >
            {/* Card content */}
            <div className="p-6">
              <h3 className="text-xl font-bold mb-2">{card.title}</h3>
              <p className="text-sm">{card.description}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Navigation indicators */}
      <div className="flex justify-center gap-2 mt-6">
        {cards.map((_, index) => (
          <button
            key={index}
            onClick={() => handleCardChange(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              index === activeIndex ? 'bg-primary w-8' : 'bg-gray-300'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
});

FanCarousel.displayName = 'FanCarousel';

export default FanCarousel;
```

---

## Event Schema Definition

```typescript
// src/lib/analytics-schemas.ts

export interface AnalyticsEventSchema {
  name: string;
  description: string;
  required: string[];
  optional: string[];
  paramTypes: Record<string, 'string' | 'number' | 'boolean' | 'array'>;
}

export const EVENT_SCHEMAS: Record<string, AnalyticsEventSchema> = {
  // FAQ Events
  faq_item_expanded: {
    name: 'FAQ Item Expanded',
    description: 'User opened an accordion item in FAQ section',
    required: ['item_title', 'category', 'position'],
    optional: ['section_id', 'time_to_expand'],
    paramTypes: {
      item_title: 'string',
      category: 'string',
      position: 'number',
      section_id: 'string',
      time_to_expand: 'number',
    },
  },

  faq_item_collapsed: {
    name: 'FAQ Item Collapsed',
    description: 'User closed an accordion item in FAQ section',
    required: ['item_title', 'category', 'position'],
    optional: ['section_id', 'time_open_seconds'],
    paramTypes: {
      item_title: 'string',
      category: 'string',
      position: 'number',
      section_id: 'string',
      time_open_seconds: 'number',
    },
  },

  faq_category_changed: {
    name: 'FAQ Category Changed',
    description: 'User switched between FAQ tabs/categories',
    required: ['from_category', 'to_category'],
    optional: ['category_index', 'time_in_previous_ms', 'items_opened_in_previous'],
    paramTypes: {
      from_category: 'string',
      to_category: 'string',
      category_index: 'number',
      time_in_previous_ms: 'number',
      items_opened_in_previous: 'number',
    },
  },

  // Tab Events
  tab_selected: {
    name: 'Tab Selected',
    description: 'User clicked on a tab',
    required: ['tab_name', 'tab_index'],
    optional: ['component', 'previous_tab', 'session_tab_switches'],
    paramTypes: {
      tab_name: 'string',
      tab_index: 'number',
      component: 'string',
      previous_tab: 'string',
      session_tab_switches: 'number',
    },
  },

  // Video Events
  video_play: {
    name: 'Video Play',
    description: 'User started video playback',
    required: ['video_id', 'video_title'],
    optional: ['duration_seconds', 'start_time_seconds', 'location', 'content_type'],
    paramTypes: {
      video_id: 'string',
      video_title: 'string',
      duration_seconds: 'number',
      start_time_seconds: 'number',
      location: 'string',
      content_type: 'string',
    },
  },

  video_progress: {
    name: 'Video Progress',
    description: 'Video playback reached a milestone (25%, 50%, 75%, 100%)',
    required: ['video_id', 'progress_percent'],
    optional: ['current_time_seconds', 'duration_seconds', 'location'],
    paramTypes: {
      video_id: 'string',
      progress_percent: 'number',
      current_time_seconds: 'number',
      duration_seconds: 'number',
      location: 'string',
    },
  },

  video_complete: {
    name: 'Video Complete',
    description: 'User watched video to completion',
    required: ['video_id', 'video_title'],
    optional: ['duration_seconds', 'watch_time_seconds', 'location'],
    paramTypes: {
      video_id: 'string',
      video_title: 'string',
      duration_seconds: 'number',
      watch_time_seconds: 'number',
      location: 'string',
    },
  },

  // Widget Events
  carousel_interaction: {
    name: 'Carousel Interaction',
    description: 'User interacted with carousel/slider',
    required: ['widget_id'],
    optional: ['from_index', 'to_index', 'direction', 'total_items'],
    paramTypes: {
      widget_id: 'string',
      from_index: 'number',
      to_index: 'number',
      direction: 'string',
      total_items: 'number',
    },
  },

  dropdown_interaction: {
    name: 'Dropdown Interaction',
    description: 'User opened or selected dropdown option',
    required: ['widget_id'],
    optional: ['action', 'selected_option', 'option_index'],
    paramTypes: {
      widget_id: 'string',
      action: 'string',
      selected_option: 'string',
      option_index: 'number',
    },
  },
};

export function validateEvent(
  eventName: string,
  params?: Record<string, unknown>
): { valid: boolean; errors: string[] } {
  const schema = EVENT_SCHEMAS[eventName];
  const errors: string[] = [];

  if (!schema) {
    return { valid: true, errors: [] }; // Unknown events pass through
  }

  // Check required fields
  schema.required.forEach((field) => {
    if (!(field in (params || {}))) {
      errors.push(`Missing required parameter: ${field}`);
    }
  });

  // Check parameter types
  Object.entries(params || {}).forEach(([key, value]) => {
    const expectedType = schema.paramTypes[key];
    if (!expectedType) return;

    const actualType = Array.isArray(value) ? 'array' : typeof value;
    if (actualType !== expectedType) {
      errors.push(
        `Parameter ${key} has wrong type. Expected ${expectedType}, got ${actualType}`
      );
    }
  });

  return {
    valid: errors.length === 0,
    errors,
  };
}
```

---

## Clarity Tag Integration

```typescript
// src/hooks/useClarityTags.ts
import { useEffect, useRef } from 'react';
import { setClarityTag } from '@/lib/analytics';

interface ClarityTagsOptions {
  engagementThresholds?: {
    highEngagementItemsOpened: number;
    highEngagementVideoTime: number;
  };
}

export function useClarityTags(options: ClarityTagsOptions = {}) {
  const {
    engagementThresholds = {
      highEngagementItemsOpened: 5,
      highEngagementVideoTime: 120,
    },
  } = options;

  const metricsRef = useRef({
    itemsOpened: 0,
    videoWatchTime: 0,
    widgetInteractions: 0,
    formFieldsFocused: 0,
  });

  // Track engagement level
  useEffect(() => {
    const updateEngagementTag = () => {
      const { itemsOpened, videoWatchTime, widgetInteractions } = metricsRef.current;

      if (itemsOpened >= engagementThresholds.highEngagementItemsOpened) {
        setClarityTag('engagement_level', 'high');
      } else if (videoWatchTime >= engagementThresholds.highEngagementVideoTime) {
        setClarityTag('engagement_level', 'high');
      } else if (itemsOpened > 0 || videoWatchTime > 0 || widgetInteractions > 0) {
        setClarityTag('engagement_level', 'medium');
      } else {
        setClarityTag('engagement_level', 'low');
      }
    };

    const timer = setInterval(updateEngagementTag, 5000); // Update every 5 seconds
    return () => clearInterval(timer);
  }, [engagementThresholds]);

  return {
    recordItemOpened: () => {
      metricsRef.current.itemsOpened++;
      setClarityTag('faq_items_opened', String(metricsRef.current.itemsOpened));
    },
    recordVideoWatch: (seconds: number) => {
      metricsRef.current.videoWatchTime += seconds;
      setClarityTag('video_watch_time', String(metricsRef.current.videoWatchTime));
    },
    recordWidgetInteraction: () => {
      metricsRef.current.widgetInteractions++;
      setClarityTag('widget_interactions', String(metricsRef.current.widgetInteractions));
    },
    recordFormField: () => {
      metricsRef.current.formFieldsFocused++;
      setClarityTag('form_progress', String(metricsRef.current.formFieldsFocused));
    },
    getMetrics: () => metricsRef.current,
  };
}
```

---

## Testing & Verification

### Testing Events in Development

```typescript
// src/lib/analytics-testing.ts

export function enableAnalyticsDebugMode() {
  // Intercept all analytics calls
  if (!window.__analyticsDebug) {
    window.__analyticsDebug = {
      events: [],
      clear: () => {
        window.__analyticsDebug.events = [];
      },
      print: () => {
        console.table(window.__analyticsDebug.events);
      },
      export: () => {
        const json = JSON.stringify(window.__analyticsDebug.events, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `analytics-debug-${Date.now()}.json`;
        a.click();
      },
    };
  }
}

// In development console:
// enableAnalyticsDebugMode()
// window.__analyticsDebug.print() - view all captured events
// window.__analyticsDebug.export() - download as JSON for analysis
```

### Manual Testing Checklist

```typescript
// Copy to browser console and execute

// Test 1: FAQ Accordion
document.querySelector('[aria-expanded="false"]')?.click();
console.log('Event should fire: faq_item_expanded');

// Test 2: Tab Selection
document.querySelector('[role="tab"]:nth-child(2)')?.click();
console.log('Event should fire: faq_category_changed');

// Test 3: Video Play
document.querySelector('video')?.play();
console.log('Event should fire: video_play');

// Test 4: Check GA4
// Open DevTools > Network tab
// Look for "www.googletagmanager.com/g/collect" requests
// Event parameters appear in request payload
```

### Automated Testing Example

```typescript
// src/__tests__/analytics.test.ts
import { describe, it, expect, vi } from 'vitest';
import * as analytics from '@/lib/analytics';

describe('Analytics Tracking', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should track accordion expansion', () => {
    const trackEventSpy = vi.spyOn(analytics, 'trackEvent');

    analytics.trackEvent('faq_item_expanded', {
      item_title: 'Test Question',
      category: 'General',
      position: 1,
    });

    expect(trackEventSpy).toHaveBeenCalledWith(
      'faq_item_expanded',
      expect.objectContaining({
        item_title: 'Test Question',
        category: 'General',
        position: 1,
      })
    );
  });

  it('should track video completion', () => {
    const trackEventSpy = vi.spyOn(analytics, 'trackEvent');

    analytics.trackEvent('video_complete', {
      video_id: 'test-video',
      video_title: 'Test Video',
      duration_seconds: 300,
    });

    expect(trackEventSpy).toHaveBeenCalledWith(
      'video_complete',
      expect.objectContaining({
        video_id: 'test-video',
      })
    );
  });
});
```

---

## GA4 Real-Time Testing

1. Open your GA4 property
2. Navigate to Real-time report
3. Trigger the interaction on your site
4. Event should appear in real-time within seconds
5. Click on event to see parameters

**Example Real-Time Report View:**
```
Event Name: faq_item_expanded
Parameters:
  item_title: "مه قرار است که دیده بشود"
  category: "کلی"
  position: 2
  section_id: "main_faq"
Timestamp: 2024-01-10 14:32:45
User: (Anonymous ID)
```

---

*Implementation Reference v1.0*
*For use with INTERACTIVE_ELEMENT_TRACKING_GUIDE.md*
