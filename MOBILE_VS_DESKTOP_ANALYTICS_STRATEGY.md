# Mobile vs Desktop Analytics Segmentation Strategy

## Executive Summary

This document provides a comprehensive strategy for implementing advanced mobile vs desktop analytics segmentation for the NEXO website. The current implementation has foundational analytics tracking (GA4 + Microsoft Clarity + Airtable CRM), but lacks device-specific conversion tracking, behavioral segmentation, and cross-device journey mapping.

---

## Current State Analysis

### Existing Infrastructure

**Analytics Stack:**
- Google Analytics 4 (GA4) - ID: `G-CL4Y6SFBMZ`
- Microsoft Clarity - Project ID: `uxu2vm6wqq`
- Airtable CRM - Captures form submissions with tracking data
- Monday.com - Synced leads management

**File References:**
- `/src/lib/analytics.ts` - GA4 and Clarity integration
- `/src/hooks/useAnalytics.ts` - Page view tracking on navigation
- `/src/hooks/use-mobile.tsx` - Mobile detection (768px breakpoint)
- `/src/utils/formTracking.ts` - Form submission tracking
- `/api/submit-form.ts` - Backend form processing with lead enrichment

**Current Tracking Capabilities:**
- Page views with page type segmentation (home, services, case_study, etc.)
- Form submissions with UTM parameters and referrer data
- Custom events (form_submit, cta_click, outbound links)
- Session tracking with session IDs
- Landing page attribution
- Cross-domain tracking (nexo-agency.co.il & nexoagency.org)

**Current Mobile Detection:**
- Viewport-based detection using `useIsMobile()` hook
- Mobile breakpoint: 768px (tablet dividing line)
- Responsive design implemented in key components
- No device-specific analytics tagging

### Gaps in Current Implementation

1. **Device Segmentation:** No device type (mobile/tablet/desktop) tagging in GA4
2. **Responsive Performance:** No tracking of rendering performance by device
3. **Mobile Conversion Funnel:** Form submissions not segmented by device
4. **Touch vs Click:** No distinction between mobile interactions and desktop
5. **Viewport-Specific Events:** No custom events for viewport-dependent features
6. **Device Persistence:** Mobile detection resets on page navigation
7. **Cross-Device Journeys:** No unified user tracking across devices
8. **Mobile-Specific UX Metrics:** No tracking of mobile-specific behaviors (scroll, gesture)

---

## 1. Device-Specific Conversion Tracking

### Strategy

Implement comprehensive device segmentation at the conversion level to understand how mobile vs desktop users convert differently.

### Implementation

#### 1.1 Enhanced User Properties Tagging

```typescript
// src/lib/analytics.ts - Enhanced version
export interface DeviceContext {
  deviceType: 'mobile' | 'tablet' | 'desktop';
  browserName: string;
  osName: string;
  screenResolution: string;
  viewportHeight: number;
  viewportWidth: number;
  pixelRatio: number;
  isTouch: boolean;
  connectionType: string;
  deviceMemory?: number;
}

export function captureDeviceContext(): DeviceContext {
  const ua = navigator.userAgent;
  const width = window.innerWidth;
  const height = window.innerHeight;

  // Device type classification
  let deviceType: 'mobile' | 'tablet' | 'desktop' = 'desktop';
  if (width < 768) deviceType = 'mobile';
  else if (width < 1024) deviceType = 'tablet';

  // Browser and OS detection
  const browserName = detectBrowser(ua);
  const osName = detectOS(ua);

  // Connection type (Network Information API)
  const connection = (navigator as any).connection ||
                    (navigator as any).mozConnection ||
                    (navigator as any).webkitConnection;
  const connectionType = connection?.effectiveType || 'unknown';

  return {
    deviceType,
    browserName,
    osName,
    screenResolution: `${window.screen.width}x${window.screen.height}`,
    viewportHeight: height,
    viewportWidth: width,
    pixelRatio: window.devicePixelRatio,
    isTouch: /touch|webos|iphone|ipad|ipod|blackberry|android/i.test(ua),
    connectionType,
    deviceMemory: (navigator as any).deviceMemory,
  };
}

// Helper functions
function detectBrowser(ua: string): string {
  if (ua.includes('Chrome')) return 'Chrome';
  if (ua.includes('Safari')) return 'Safari';
  if (ua.includes('Firefox')) return 'Firefox';
  if (ua.includes('Edge')) return 'Edge';
  return 'Other';
}

function detectOS(ua: string): string {
  if (ua.includes('Windows')) return 'Windows';
  if (ua.includes('Mac')) return 'MacOS';
  if (ua.includes('iPhone') || ua.includes('iPad')) return 'iOS';
  if (ua.includes('Android')) return 'Android';
  if (ua.includes('Linux')) return 'Linux';
  return 'Unknown';
}

// Initialize device context on app load
export function initDeviceTracking(): void {
  const deviceContext = captureDeviceContext();

  // Set GA4 user properties for segmentation
  window.gtag?.('set', 'user_properties', {
    device_type: deviceContext.deviceType,
    browser: deviceContext.browserName,
    os: deviceContext.osName,
    is_touch_device: deviceContext.isTouch ? 'yes' : 'no',
    connection_type: deviceContext.connectionType,
  });

  // Set Clarity custom tags
  Clarity.setTag('device_type', deviceContext.deviceType);
  Clarity.setTag('browser', deviceContext.browserName);
  Clarity.setTag('os', deviceContext.osName);
}
```

#### 1.2 Conversion Event Segmentation

```typescript
// src/utils/formTracking.ts - Extended

export interface ConversionContext extends TrackingData {
  deviceType: 'mobile' | 'tablet' | 'desktop';
  conversionFunnel: string;
  formInteractionTime: number; // milliseconds from page load
  fieldsCompleted: number;
  attemptCount: number;
}

// Track form step completion with device context
export function trackFormStepCompletion(
  stepNumber: number,
  stepName: string,
  deviceType: 'mobile' | 'tablet' | 'desktop',
  timeSpent: number
): void {
  window.gtag?.('event', 'form_step_completed', {
    step_number: stepNumber,
    step_name: stepName,
    device_type: deviceType,
    time_spent_seconds: Math.round(timeSpent / 1000),
  });

  // Upgrade Clarity session for mobile form interactions (higher priority)
  if (deviceType === 'mobile') {
    Clarity.upgrade(`mobile_form_step_${stepNumber}`);
  }
}

// Track form field interactions by device
export function trackFormFieldInteraction(
  fieldName: string,
  deviceType: 'mobile' | 'tablet' | 'desktop',
  interactionType: 'focus' | 'change' | 'blur' | 'error'
): void {
  window.gtag?.('event', 'form_field_interaction', {
    field_name: fieldName,
    device_type: deviceType,
    interaction_type: interactionType,
  });
}

// Track conversion completion
export function trackConversionCompletion(
  deviceType: 'mobile' | 'tablet' | 'desktop',
  conversionValue: number,
  conversionCurrency: string = 'ILS'
): void {
  window.gtag?.('event', 'purchase', {
    value: conversionValue,
    currency: conversionCurrency,
    device_type: deviceType,
    timestamp: new Date().toISOString(),
  });
}
```

#### 1.3 Backend Conversion Enrichment

```typescript
// api/submit-form.ts - Enhanced

interface SubmissionPayload {
  formData: FormData;
  tracking: TrackingData;
  trafficSourceSummary: string;
  deviceContext: {
    deviceType: 'mobile' | 'tablet' | 'desktop';
    viewportWidth: number;
    viewportHeight: number;
    isTouch: boolean;
    formSubmissionTime: number; // seconds
  };
}

// Add to Airtable record
const airtableFields = {
  'Device Type': deviceContext.deviceType,
  'Viewport': `${deviceContext.viewportWidth}x${deviceContext.viewportHeight}`,
  'Is Touch Device': deviceContext.isTouch ? 'Yes' : 'No',
  'Form Completion Time': `${deviceContext.formSubmissionTime}s`,
  // ... existing fields
};
```

### KPIs to Track

- **Mobile Conversion Rate** (forms submitted / mobile visitors)
- **Desktop Conversion Rate** (forms submitted / desktop visitors)
- **Conversion Rate by Device Type** (mobile/tablet/desktop)
- **Average Form Completion Time** (by device)
- **Form Abandonment Rate** (by device and field)
- **Error Rate on Form Fields** (by device)
- **Form Step Completion Rate** (by device and step)

### GA4 Custom Metrics

1. `form_conversion_rate_mobile`
2. `form_conversion_rate_desktop`
3. `avg_form_completion_time_mobile`
4. `form_field_error_rate_mobile`

---

## 2. Mobile User Behavior Differences

### Strategy

Capture mobile-specific user behaviors that differ significantly from desktop users.

### Implementation

#### 2.1 Mobile Interaction Tracking

```typescript
// src/hooks/useMobileInteractionTracking.ts - New file

import { useEffect } from 'react';
import { useIsMobile } from './use-mobile';
import { trackEvent } from '@/lib/analytics';

export function useMobileInteractionTracking() {
  const isMobile = useIsMobile();

  useEffect(() => {
    if (!isMobile) return;

    // Track scroll depth on mobile (different from desktop)
    let maxScrollPercentage = 0;

    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

      if (scrollPercent > maxScrollPercentage) {
        maxScrollPercentage = scrollPercent;

        // Track milestone scroll depths
        if (scrollPercent >= 25 && scrollPercent < 50 && maxScrollPercentage >= 25) {
          trackEvent('mobile_scroll_25_percent', { page_path: window.location.pathname });
        }
        if (scrollPercent >= 50 && scrollPercent < 75 && maxScrollPercentage >= 50) {
          trackEvent('mobile_scroll_50_percent', { page_path: window.location.pathname });
        }
        if (scrollPercent >= 75 && maxScrollPercentage >= 75) {
          trackEvent('mobile_scroll_75_percent', { page_path: window.location.pathname });
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    // Track viewport orientation changes
    const handleOrientationChange = () => {
      const orientation = window.innerWidth > window.innerHeight ? 'landscape' : 'portrait';
      trackEvent('device_orientation_change', { orientation });
    };

    window.addEventListener('orientationchange', handleOrientationChange);

    // Track tap interactions (mobile-specific)
    const handleTouchStart = (e: TouchEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'BUTTON' || target.closest('button')) {
        trackEvent('mobile_button_tap', {
          button_text: target.textContent?.substring(0, 50) || 'unknown',
        });
      }
    };

    document.addEventListener('touchstart', handleTouchStart, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('orientationchange', handleOrientationChange);
      document.removeEventListener('touchstart', handleTouchStart);
    };
  }, [isMobile]);
}
```

#### 2.2 Mobile Performance Tracking

```typescript
// src/hooks/useMobilePerformanceTracking.ts - New file

import { useEffect } from 'react';
import { useIsMobile } from './use-mobile';
import { trackEvent } from '@/lib/analytics';

export function useMobilePerformanceTracking() {
  const isMobile = useIsMobile();

  useEffect(() => {
    if (!isMobile || !window.performance || !window.PerformanceObserver) return;

    // Track Core Web Vitals for mobile
    const reportWebVitals = () => {
      // Largest Contentful Paint (LCP)
      const lcpObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        const lastEntry = entries[entries.length - 1];
        trackEvent('mobile_lcp', {
          lcp_value: Math.round(lastEntry.renderTime || lastEntry.loadTime),
        });
      });

      try {
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      } catch (e) {
        // Fallback for browsers without LCP support
      }

      // First Input Delay (FID) / Interaction to Next Paint (INP)
      const fidObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        entries.forEach((entry: PerformanceEntry) => {
          const entryTyped = entry as any;
          trackEvent('mobile_input_delay', {
            processing_time: Math.round(entryTyped.processingDuration || 0),
            name: entryTyped.name,
          });
        });
      });

      try {
        fidObserver.observe({
          entryTypes: ['first-input', 'interaction-to-next-paint']
        });
      } catch (e) {
        // Fallback
      }

      // Cumulative Layout Shift (CLS)
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          const entryTyped = entry as any;
          if (!entryTyped.hadRecentInput) {
            clsValue += entryTyped.value;
          }
        }
        trackEvent('mobile_cls', { cls_value: clsValue.toFixed(3) });
      });

      try {
        clsObserver.observe({ entryTypes: ['layout-shift'] });
      } catch (e) {
        // Fallback
      }
    };

    // Report after page load
    if (document.readyState === 'complete') {
      reportWebVitals();
    } else {
      window.addEventListener('load', reportWebVitals);
    }

    // Track Time to Interactive (TTI)
    const navigationTiming = performance.getEntriesByType('navigation')[0] as any;
    if (navigationTiming) {
      const tti = navigationTiming.loadEventEnd - navigationTiming.fetchStart;
      trackEvent('mobile_tti', { tti_milliseconds: Math.round(tti) });
    }
  }, [isMobile]);
}
```

#### 2.3 Mobile User Session Behavior

```typescript
// src/utils/mobileSessionTracking.ts - New file

import { trackEvent } from '@/lib/analytics';

export interface MobileSessionMetrics {
  sessionDuration: number;
  pagesVisited: number;
  scrollDepthPercentage: number;
  tapCount: number;
  gestureCount: {
    pinch: number;
    swipe: number;
    longPress: number;
  };
  errorEncountered: boolean;
  timeToFirstConversion: number | null;
}

const sessionMetrics: MobileSessionMetrics = {
  sessionDuration: 0,
  pagesVisited: 1,
  scrollDepthPercentage: 0,
  tapCount: 0,
  gestureCount: {
    pinch: 0,
    swipe: 0,
    longPress: 0,
  },
  errorEncountered: false,
  timeToFirstConversion: null,
};

export function initializeMobileSessionTracking(): void {
  if (!/mobile|android|iphone/i.test(navigator.userAgent)) {
    return;
  }

  const sessionStart = Date.now();

  // Track session duration
  window.addEventListener('beforeunload', () => {
    sessionMetrics.sessionDuration = Date.now() - sessionStart;
    trackEvent('mobile_session_end', {
      session_duration_seconds: Math.round(sessionMetrics.sessionDuration / 1000),
      pages_visited: sessionMetrics.pagesVisited,
      scroll_depth: sessionMetrics.scrollDepthPercentage,
      tap_count: sessionMetrics.tapCount,
      error_encountered: sessionMetrics.errorEncountered,
    });
  });

  // Track gesture detection (basic swipe/pinch)
  let touchStartX = 0;
  let touchStartY = 0;
  let touchStartDistance = 0;

  document.addEventListener('touchstart', (e: TouchEvent) => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;

    if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      touchStartDistance = Math.sqrt(dx * dx + dy * dy);
    }
  }, { passive: true });

  document.addEventListener('touchend', (e: TouchEvent) => {
    if (e.changedTouches.length === 1) {
      const touchEndX = e.changedTouches[0].clientX;
      const touchEndY = e.changedTouches[0].clientY;
      const deltaX = Math.abs(touchEndX - touchStartX);
      const deltaY = Math.abs(touchEndY - touchStartY);

      // Detect swipe
      if (deltaX > 50 && deltaY < 50) {
        sessionMetrics.gestureCount.swipe++;
      }
    }

    if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const touchEndDistance = Math.sqrt(dx * dx + dy * dy);

      // Detect pinch
      if (Math.abs(touchEndDistance - touchStartDistance) > 20) {
        sessionMetrics.gestureCount.pinch++;
      }
    }
  }, { passive: true });

  // Track taps
  document.addEventListener('click', () => {
    sessionMetrics.tapCount++;
  }, { passive: true });
}

export function getMobileSessionMetrics(): MobileSessionMetrics {
  return sessionMetrics;
}
```

### Mobile-Specific Events to Track

1. **Scroll Depth:**
   - Mobile: Track at 25%, 50%, 75%
   - Desktop: Track at 50%, 75%, 100%

2. **Gesture Events:**
   - Swipe direction (left/right/up/down)
   - Pinch zoom
   - Long press
   - Double tap

3. **Orientation Changes:**
   - Portrait to landscape transitions
   - Conversion rate by orientation

4. **Time-Based Metrics:**
   - Time to first interaction
   - Time to first meaningful paint
   - Time to form submission

---

## 3. Responsive Design Analytics

### Strategy

Track how responsive design impacts user behavior and conversion across breakpoints.

### Implementation

#### 3.1 Viewport Breakpoint Tracking

```typescript
// src/utils/responsiveAnalytics.ts - New file

import { trackEvent } from '@/lib/analytics';

export const BREAKPOINTS = {
  mobile: { min: 0, max: 480 },
  mobileL: { min: 480, max: 768 },
  tablet: { min: 768, max: 1024 },
  desktop: { min: 1024, max: 1440 },
  desktopL: { min: 1440, max: Infinity },
} as const;

export type BreakpointType = keyof typeof BREAKPOINTS;

export function getBreakpoint(width: number): BreakpointType {
  if (width < 480) return 'mobile';
  if (width < 768) return 'mobileL';
  if (width < 1024) return 'tablet';
  if (width < 1440) return 'desktop';
  return 'desktopL';
}

export function trackViewportChange(
  breakpoint: BreakpointType,
  previousBreakpoint?: BreakpointType
): void {
  trackEvent('viewport_breakpoint_change', {
    breakpoint,
    previous_breakpoint: previousBreakpoint || 'none',
    viewport_width: window.innerWidth,
    viewport_height: window.innerHeight,
  });
}

export function trackResponsiveComponentRender(
  componentName: string,
  breakpoint: BreakpointType,
  renderMode: 'visible' | 'hidden' | 'modified'
): void {
  trackEvent('responsive_component_render', {
    component_name: componentName,
    breakpoint,
    render_mode: renderMode,
  });
}

export function trackResponsivePerformance(
  breakpoint: BreakpointType,
  renderTime: number,
  layoutShift: number
): void {
  trackEvent('responsive_performance', {
    breakpoint,
    render_time_ms: Math.round(renderTime),
    layout_shift_cls: layoutShift.toFixed(3),
  });
}
```

#### 3.2 Responsive Design Hook

```typescript
// src/hooks/useResponsiveAnalytics.ts - New file

import { useEffect, useState } from 'react';
import { getBreakpoint, trackViewportChange, type BreakpointType } from '@/utils/responsiveAnalytics';

export function useResponsiveAnalytics() {
  const [currentBreakpoint, setCurrentBreakpoint] = useState<BreakpointType>(() => {
    if (typeof window === 'undefined') return 'desktop';
    return getBreakpoint(window.innerWidth);
  });

  const [previousBreakpoint, setPreviousBreakpoint] = useState<BreakpointType | undefined>();

  useEffect(() => {
    const handleResize = () => {
      const newBreakpoint = getBreakpoint(window.innerWidth);

      if (newBreakpoint !== currentBreakpoint) {
        trackViewportChange(newBreakpoint, currentBreakpoint);
        setPreviousBreakpoint(currentBreakpoint);
        setCurrentBreakpoint(newBreakpoint);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [currentBreakpoint]);

  return { currentBreakpoint, previousBreakpoint };
}
```

#### 3.3 Component-Level Responsive Tracking

```typescript
// Example: Track when components hide/show based on responsive design

import { trackResponsiveComponentRender } from '@/utils/responsiveAnalytics';

export function ResponsiveHeroSection() {
  const isMobile = useIsMobile();
  const breakpoint = useResponsiveAnalytics().currentBreakpoint;

  useEffect(() => {
    const mode = isMobile ? 'modified' : 'visible';
    trackResponsiveComponentRender('hero_section', breakpoint, mode);
  }, [isMobile, breakpoint]);

  return (
    <>
      {isMobile ? (
        <MobileHeroVariant />
      ) : (
        <DesktopHeroVariant />
      )}
    </>
  );
}
```

### Responsive Design Analytics KPIs

1. **Breakpoint-Specific Metrics:**
   - Conversion rate by viewport width/breakpoint
   - Bounce rate by breakpoint
   - Average session duration by breakpoint
   - Pages per session by breakpoint

2. **Layout Shift Impact:**
   - CLS score by responsive state
   - Conversion drop-off due to layout shifts
   - Click accuracy (misclicks due to shifts)

3. **Component Rendering:**
   - Number of times component visibility changes
   - Time spent in each responsive layout
   - User interactions with component variants

---

## 4. Cross-Device User Journey Tracking

### Strategy

Track individual users across multiple devices to understand conversion paths and multi-device behavior.

### Implementation

#### 4.1 Device Graph / Cross-Device Linking

```typescript
// src/utils/crossDeviceTracking.ts - New file

import { trackEvent } from '@/lib/analytics';

interface DeviceFingerprint {
  email?: string; // Primary identifier for logged-in users
  phoneNumber?: string; // From form submission
  gClientId?: string; // Google Analytics Client ID
  clarityId?: string; // Microsoft Clarity ID
  sessionId: string;
  timestamp: number;
  deviceType: 'mobile' | 'tablet' | 'desktop';
}

interface CrossDeviceJourney {
  userId: string;
  devices: DeviceFingerprint[];
  journeySteps: {
    device: string;
    page: string;
    action: string;
    timestamp: number;
  }[];
  firstTouchDevice: string;
  lastTouchDevice: string;
  conversionDevice: string;
  daysSinceFirstTouch: number;
}

const CROSS_DEVICE_STORAGE_KEY = 'nexo_cross_device_profile';

export function generateDeviceFingerprint(): DeviceFingerprint {
  const gClientId = window.gtag?.getAll?.()[0]?.['client_id'] || 'unknown';
  const sessionId = sessionStorage.getItem('nexo_session_id') || '';

  return {
    gClientId,
    clarityId: (window as any).clarity?.getId?.() || 'unknown',
    sessionId,
    timestamp: Date.now(),
    deviceType: getDeviceType(),
  };
}

function getDeviceType(): 'mobile' | 'tablet' | 'desktop' {
  const width = window.innerWidth;
  if (width < 768) return 'mobile';
  if (width < 1024) return 'tablet';
  return 'desktop';
}

export function linkCrossDeviceUser(identifier: string, type: 'email' | 'phone'): void {
  const fingerprint = generateDeviceFingerprint();

  if (type === 'email') {
    fingerprint.email = identifier;
  } else if (type === 'phone') {
    fingerprint.phoneNumber = identifier;
  }

  // Store in localStorage for persistence
  let profile: CrossDeviceJourney | null = null;

  try {
    const stored = localStorage.getItem(CROSS_DEVICE_STORAGE_KEY);
    if (stored) {
      profile = JSON.parse(stored);
    } else {
      profile = {
        userId: identifier,
        devices: [],
        journeySteps: [],
        firstTouchDevice: getDeviceType(),
        lastTouchDevice: getDeviceType(),
        conversionDevice: '',
        daysSinceFirstTouch: 0,
      };
    }
  } catch {
    return;
  }

  if (!profile) return;

  // Add device if not already tracked
  if (!profile.devices.some(d => d.gClientId === fingerprint.gClientId)) {
    profile.devices.push(fingerprint);
  }

  profile.lastTouchDevice = getDeviceType();
  profile.userId = identifier;

  // Send to GA4 for analysis
  window.gtag?.('set', 'user_id', identifier);
  window.gtag?.('set', 'user_properties', {
    device_count: profile.devices.length,
    first_touch_device: profile.firstTouchDevice,
    last_touch_device: profile.lastTouchDevice,
  });

  localStorage.setItem(CROSS_DEVICE_STORAGE_KEY, JSON.stringify(profile));

  trackEvent('cross_device_linking', {
    identifier_type: type,
    device_count: profile.devices.length,
  });
}

export function trackJourneyStep(
  page: string,
  action: string,
  isMobile: boolean
): void {
  try {
    const stored = localStorage.getItem(CROSS_DEVICE_STORAGE_KEY);
    if (!stored) return;

    const profile: CrossDeviceJourney = JSON.parse(stored);

    profile.journeySteps.push({
      device: isMobile ? 'mobile' : 'desktop',
      page,
      action,
      timestamp: Date.now(),
    });

    // Keep only last 50 steps to avoid storage bloat
    if (profile.journeySteps.length > 50) {
      profile.journeySteps = profile.journeySteps.slice(-50);
    }

    localStorage.setItem(CROSS_DEVICE_STORAGE_KEY, JSON.stringify(profile));
  } catch {
    return;
  }
}

export function markConversion(isMobile: boolean): void {
  try {
    const stored = localStorage.getItem(CROSS_DEVICE_STORAGE_KEY);
    if (!stored) return;

    const profile: CrossDeviceJourney = JSON.parse(stored);
    profile.conversionDevice = isMobile ? 'mobile' : 'desktop';

    const firstStep = profile.journeySteps[0];
    if (firstStep) {
      profile.daysSinceFirstTouch = Math.floor(
        (Date.now() - firstStep.timestamp) / (1000 * 60 * 60 * 24)
      );
    }

    localStorage.setItem(CROSS_DEVICE_STORAGE_KEY, JSON.stringify(profile));

    trackEvent('cross_device_conversion', {
      first_touch_device: profile.firstTouchDevice,
      conversion_device: profile.conversionDevice,
      days_since_first_touch: profile.daysSinceFirstTouch,
      total_devices: profile.devices.length,
      journey_length: profile.journeySteps.length,
    });
  } catch {
    return;
  }
}
```

#### 4.2 Enhanced Form Tracking with Cross-Device Data

```typescript
// src/utils/formTracking.ts - Enhanced

export interface TrackingData {
  // ... existing fields
  crossDeviceUserId?: string;
  previousDevicesCount?: number;
  isCrossDeviceConversion?: boolean;
  daysSinceFirstDevice?: number;
}

export function getTrackingData(): TrackingData {
  // ... existing code

  // Add cross-device data
  let crossDeviceUserId: string | undefined;
  let previousDevicesCount: number | undefined;
  let isCrossDeviceConversion = false;
  let daysSinceFirstDevice: number | undefined;

  try {
    const stored = localStorage.getItem('nexo_cross_device_profile');
    if (stored) {
      const profile = JSON.parse(stored);
      crossDeviceUserId = profile.userId;
      previousDevicesCount = profile.devices.length;
      isCrossDeviceConversion = previousDevicesCount > 1;
      daysSinceFirstDevice = profile.daysSinceFirstTouch;
    }
  } catch {
    // Fallback: no cross-device data
  }

  return {
    // ... existing fields
    crossDeviceUserId,
    previousDevicesCount,
    isCrossDeviceConversion,
    daysSinceFirstDevice,
  };
}
```

### Cross-Device Journey KPIs

1. **Device Path Analysis:**
   - Most common device sequences (mobile → desktop, etc.)
   - Percentage of multi-device users
   - Average number of devices per user

2. **Attribution by Device Path:**
   - First-touch vs last-touch attribution by device path
   - Assisted conversions (mobile research → desktop purchase)
   - Device affinity (which devices drive conversions)

3. **Cross-Device Conversion Metrics:**
   - Cross-device conversion rate (multi-device users)
   - Single-device conversion rate
   - Time between first touch and conversion
   - Device combinations that convert best

---

## 5. Mobile-Specific Optimizations

### Strategy

Implement mobile-specific tracking to identify optimization opportunities.

### Implementation

#### 5.1 Mobile Form Optimization Tracking

```typescript
// src/hooks/useMobileFormOptimization.ts - New file

import { useEffect, useRef } from 'react';
import { useIsMobile } from './use-mobile';
import { trackEvent } from '@/lib/analytics';

export function useMobileFormOptimization(formId: string) {
  const isMobile = useIsMobile();
  const fieldFocusTimeRef = useRef<Record<string, number>>({});
  const fieldErrorCountRef = useRef<Record<string, number>>({});

  useEffect(() => {
    if (!isMobile) return;

    // Track focus time per field
    const handleFieldFocus = (e: FocusEvent) => {
      const field = e.target as HTMLInputElement;
      if (field?.name) {
        fieldFocusTimeRef.current[field.name] = Date.now();
      }
    };

    const handleFieldBlur = (e: FocusEvent) => {
      const field = e.target as HTMLInputElement;
      if (field?.name && fieldFocusTimeRef.current[field.name]) {
        const focusTime = Date.now() - fieldFocusTimeRef.current[field.name];

        trackEvent('mobile_form_field_focus', {
          form_id: formId,
          field_name: field.name,
          focus_time_ms: focusTime,
          field_type: field.type,
        });

        delete fieldFocusTimeRef.current[field.name];
      }
    };

    // Track field errors (e.g., validation)
    const handleFieldError = (e: Event) => {
      const field = e.target as HTMLInputElement;
      if (field?.name) {
        fieldErrorCountRef.current[field.name] =
          (fieldErrorCountRef.current[field.name] || 0) + 1;

        trackEvent('mobile_form_field_error', {
          form_id: formId,
          field_name: field.name,
          error_count: fieldErrorCountRef.current[field.name],
          field_value_length: field.value?.length || 0,
        });
      }
    };

    // Find form and attach listeners
    const form = document.getElementById(formId) ||
                 document.querySelector(`[data-form-id="${formId}"]`);

    if (form) {
      form.addEventListener('focusin', handleFieldFocus, { passive: true });
      form.addEventListener('focusout', handleFieldBlur, { passive: true });
      form.addEventListener('invalid', handleFieldError, true);
    }

    return () => {
      if (form) {
        form.removeEventListener('focusin', handleFieldFocus);
        form.removeEventListener('focusout', handleFieldBlur);
        form.removeEventListener('invalid', handleFieldError);
      }
    };
  }, [isMobile, formId]);
}
```

#### 5.2 Mobile CTA Optimization

```typescript
// src/utils/mobileCTAOptimization.ts - New file

import { trackEvent } from '@/lib/analytics';

export interface MobileCTAMetrics {
  ctaName: string;
  position: 'above_fold' | 'middle' | 'below_fold';
  size: 'small' | 'medium' | 'large';
  color: string;
  clickRate: number;
  errorRate: number;
  misclickRate: number;
}

export function trackMobileCTAClick(
  ctaName: string,
  position: 'above_fold' | 'middle' | 'below_fold',
  size: 'small' | 'medium' | 'large'
): void {
  trackEvent('mobile_cta_click', {
    cta_name: ctaName,
    position,
    size,
    page: window.location.pathname,
  });
}

export function trackMobileCTAImpression(
  ctaName: string,
  isVisible: boolean
): void {
  trackEvent('mobile_cta_impression', {
    cta_name: ctaName,
    is_visible: isVisible ? 'yes' : 'no',
  });
}

export function trackMobileFormAbandonmentPoint(
  fieldName: string,
  secondsSpent: number,
  hasError: boolean
): void {
  trackEvent('mobile_form_abandonment', {
    field_name: fieldName,
    seconds_spent: secondsSpent,
    has_error: hasError ? 'yes' : 'no',
  });
}
```

#### 5.3 Mobile Navigation Tracking

```typescript
// src/utils/mobileNavigationTracking.ts - New file

import { trackEvent } from '@/lib/analytics';

export function trackMobileMenuInteraction(
  action: 'open' | 'close' | 'link_click',
  linkName?: string
): void {
  trackEvent('mobile_menu_interaction', {
    action,
    link_name: linkName || '',
  });
}

export function trackMobileNavigationMethod(
  method: 'hamburger_menu' | 'direct_link' | 'back_button' | 'search'
): void {
  trackEvent('mobile_navigation_method', { method });
}

export function trackMobileBottomSheetInteraction(
  sheetName: string,
  action: 'opened' | 'closed' | 'action_taken'
): void {
  trackEvent('mobile_bottom_sheet_interaction', {
    sheet_name: sheetName,
    action,
  });
}
```

### Mobile Optimization Opportunities to Track

1. **Touch Target Sizes:**
   - Misclick rate (clicks outside intended targets)
   - Optimal tap target size (48x48px minimum)

2. **Mobile Form Optimization:**
   - Auto-fill effectiveness
   - Numeric keyboard for phone fields
   - Dropdown vs picker selection time

3. **Mobile Navigation:**
   - Menu interaction patterns
   - Navigation depth on mobile vs desktop
   - Back button usage

4. **Mobile Loading States:**
   - Visible loading indicators (tracked)
   - Skeleton screen engagement
   - Network-aware content loading

---

## 6. Implementation Roadmap

### Phase 1: Foundation (Weeks 1-2)
- [ ] Implement `DeviceContext` capture in `analytics.ts`
- [ ] Add device type tagging to GA4 user properties
- [ ] Create mobile interaction tracking hook
- [ ] Deploy responsive analytics utilities

### Phase 2: Enhanced Tracking (Weeks 3-4)
- [ ] Implement form step completion tracking
- [ ] Add mobile performance metrics (CWV)
- [ ] Create responsive design breakpoint tracking
- [ ] Set up cross-device linking system

### Phase 3: Optimization (Weeks 5-6)
- [ ] Create mobile form optimization hook
- [ ] Implement mobile-specific CTA tracking
- [ ] Add gesture detection and tracking
- [ ] Create mobile session behavior analysis

### Phase 4: Analysis & Reporting (Week 7+)
- [ ] Set up GA4 custom dashboards for mobile vs desktop
- [ ] Create Clarity tags for mobile-specific sessions
- [ ] Configure Airtable views for cross-device conversions
- [ ] Build reporting dashboard in Monday.com

---

## 7. GA4 Configuration

### Custom Dimensions to Create

1. `device_type` (mobile, tablet, desktop)
2. `breakpoint` (mobile, mobileL, tablet, desktop, desktopL)
3. `is_touch_device` (yes, no)
4. `connection_type` (4g, 3g, 2g, slow-2g, unknown)
5. `form_completion_time_category` (fast, medium, slow)
6. `cross_device_user` (yes, no)
7. `first_touch_device` (mobile, desktop)
8. `conversion_device` (mobile, desktop)

### Custom Metrics to Create

1. `form_conversion_rate_mobile`
2. `form_completion_time_seconds`
3. `mobile_scroll_depth_percentage`
4. `form_field_error_count`
5. `cta_click_rate`
6. `cross_device_conversion_value`

### Audiences to Create

1. Mobile Converters (device_type = mobile AND conversion_count > 0)
2. Desktop Converters (device_type = desktop AND conversion_count > 0)
3. Multi-Device Users (cross_device_user = yes)
4. Mobile Form Completers (device_type = mobile AND form_steps_completed >= 3)
5. High-Intent Mobile Users (device_type = mobile AND scroll_depth > 50%)

---

## 8. Data Privacy & Compliance

### Considerations

1. **GDPR Compliance:**
   - Only collect device data with user consent
   - Allow users to opt-out of tracking
   - Implement cookie consent banner

2. **User Privacy:**
   - Don't store PII in localStorage for cross-device tracking
   - Use hashed identifiers instead of plain email/phone
   - Implement data retention policies (max 30 days for raw data)

3. **Implementation:**
   ```typescript
   // Add consent check
   export function trackEventWithConsent(
     eventName: string,
     params?: Record<string, unknown>
   ): void {
     const consent = localStorage.getItem('analytics_consent');
     if (consent === 'denied') return;

     trackEvent(eventName, params);
   }
   ```

---

## 9. Monitoring & Validation

### Quality Assurance

1. **Event Validation:**
   - Verify events fire on desktop, tablet, and mobile
   - Test form tracking across breakpoints
   - Validate cross-device linking with test accounts

2. **Performance Impact:**
   - Monitor bundle size increase from tracking code
   - Measure impact on Core Web Vitals
   - Test on low-end mobile devices

3. **Data Quality:**
   - Regular audits of GA4 event volume
   - Check for duplicate events (mobile vs desktop)
   - Validate form submission data in Airtable

---

## 10. Dashboard & Reporting

### Recommended Reports

**GA4 Dashboard: Mobile vs Desktop Performance**
- Conversion rate by device type (table)
- Form completion time by device (line chart)
- Scroll depth distribution (histogram)
- Session duration by breakpoint (bar chart)
- Device-specific CTA click rates (comparison)

**Clarity Dashboard: Mobile Sessions**
- Filter by `device_type: mobile`
- Tag-based filtering by `breakpoint`
- Heatmaps by device type
- Session recordings for mobile form interactions

**Airtable View: Cross-Device Conversions**
- Group by device type
- Filter by conversion status
- Analyze form completion time trends
- Identify abandon points

**Monday.com Dashboard: Lead Quality by Device**
- Device type distribution
- Form completion rate by device
- Average time to completion
- Error rate by device

---

## Conclusion

This comprehensive segmentation strategy provides a foundation for understanding how mobile and desktop users behave differently on the NEXO website. By implementing these tracking mechanisms, you'll gain insights into:

- Which devices drive conversions
- Where mobile users abandon forms
- How responsive design impacts behavior
- Cross-device customer journeys
- Mobile-specific optimization opportunities

The phased implementation approach allows for incremental deployment and validation, with each phase building on previous learnings.

**Key Success Metrics:**
- Increase mobile conversion rate by 25%+
- Reduce mobile form abandonment by 30%+
- Identify top 3 mobile optimization opportunities
- Map cross-device conversion paths
- Establish mobile-specific performance baselines
