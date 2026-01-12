# Mobile vs Desktop Analytics Segmentation - Implementation Checklist

## Phase 1: Device-Specific Conversion Tracking (Days 1-2)

### Task 1.1: Device Context Capture
- [ ] Add `DeviceContext` interface to `src/lib/analytics.ts`
- [ ] Implement `captureDeviceContext()` function
- [ ] Add `detectBrowser()` helper function
- [ ] Add `detectOS()` helper function
- [ ] Implement `initDeviceTracking()` function
- [ ] Test device detection on:
  - [ ] Desktop Chrome
  - [ ] Desktop Safari
  - [ ] Desktop Firefox
  - [ ] iPhone Safari
  - [ ] Android Chrome
  - [ ] Tablet iPad Safari
  - [ ] Tablet Android

### Task 1.2: GA4 User Properties
- [ ] Update `initAnalytics()` in `src/main.tsx` to call `initDeviceTracking()`
- [ ] Verify GA4 receives these user properties:
  - [ ] `device_type`
  - [ ] `browser`
  - [ ] `os`
  - [ ] `is_touch_device`
  - [ ] `connection_type`
- [ ] Test in GA4 real-time report that user properties populate
- [ ] Create GA4 custom dimensions for each property

### Task 1.3: Form Submission Device Tracking
- [ ] Add device context to `TrackingData` interface in `src/utils/formTracking.ts`
- [ ] Capture device type in `getTrackingData()` function
- [ ] Include device context in form submission payload
- [ ] Update `api/submit-form.ts` to:
  - [ ] Extract device context from payload
  - [ ] Add to Airtable record fields:
    - [ ] Device Type
    - [ ] Viewport (width x height)
    - [ ] Is Touch Device
    - [ ] Form Completion Time
- [ ] Test form submission captures device data correctly

### Task 1.4: GA4 Conversion Events
- [ ] Add `trackFormStepCompletion()` function to `src/lib/analytics.ts`
- [ ] Add `trackFormFieldInteraction()` function
- [ ] Add `trackConversionCompletion()` function
- [ ] Update Contact form component to call these functions:
  - [ ] On form step change
  - [ ] On form field validation error
  - [ ] On successful submission
- [ ] Create GA4 events report filtered by device type

### Task 1.5: Testing & Validation
- [ ] Verify device type tracks correctly for mobile users
- [ ] Verify device type tracks correctly for desktop users
- [ ] Verify device type tracks correctly for tablet users
- [ ] Verify form submissions show device type in GA4
- [ ] Verify Airtable records have device context fields
- [ ] Verify no tracking errors in browser console

---

## Phase 2: Mobile User Behavior Tracking (Days 3-4)

### Task 2.1: Mobile Interaction Hook
- [ ] Create `src/hooks/useMobileInteractionTracking.ts`
- [ ] Implement scroll depth tracking (25%, 50%, 75%)
- [ ] Implement orientation change detection
- [ ] Implement tap/click detection
- [ ] Implement Clarity upgrade calls for mobile interactions
- [ ] Test scroll tracking by scrolling page to each threshold
- [ ] Test orientation by rotating device
- [ ] Verify events fire in GA4

### Task 2.2: Mobile Performance Tracking
- [ ] Create `src/hooks/useMobilePerformanceTracking.ts`
- [ ] Implement LCP (Largest Contentful Paint) tracking
- [ ] Implement FID (First Input Delay) tracking
- [ ] Implement CLS (Cumulative Layout Shift) tracking
- [ ] Implement TTI (Time to Interactive) tracking
- [ ] Test on slow 3G network (use DevTools throttling)
- [ ] Verify Core Web Vitals metrics in GA4

### Task 2.3: Mobile Session Tracking
- [ ] Create `src/utils/mobileSessionTracking.ts`
- [ ] Implement session duration tracking
- [ ] Implement page visit counting
- [ ] Implement gesture detection (swipe, pinch)
- [ ] Implement session end event tracking
- [ ] Test session metrics accumulate correctly
- [ ] Verify session data in GA4

### Task 2.4: Integration with App
- [ ] Add `useMobileInteractionTracking()` call to app root component
- [ ] Add `useMobilePerformanceTracking()` call to app root component
- [ ] Add `initializeMobileSessionTracking()` call to `src/main.tsx`
- [ ] Test all hooks initialize correctly on mobile
- [ ] Verify no duplicate event firing

### Task 2.5: GA4 Dashboard Setup
- [ ] Create GA4 custom event report for mobile scroll depth
- [ ] Create GA4 custom event report for Core Web Vitals
- [ ] Add device type filter to all reports
- [ ] Create segment for "Mobile Users"
- [ ] Create segment for "Desktop Users"
- [ ] Validate data populates in dashboards

---

## Phase 3: Responsive Design Analytics (Days 5-6)

### Task 3.1: Responsive Utilities
- [ ] Create `src/utils/responsiveAnalytics.ts`
- [ ] Define breakpoint constants (mobile, tablet, desktop, etc.)
- [ ] Implement `getBreakpoint()` function
- [ ] Implement `trackViewportChange()` function
- [ ] Implement `trackResponsiveComponentRender()` function
- [ ] Implement `trackResponsivePerformance()` function
- [ ] Test functions return correct breakpoint values

### Task 3.2: Responsive Analytics Hook
- [ ] Create `src/hooks/useResponsiveAnalytics.ts`
- [ ] Implement viewport change detection
- [ ] Implement automatic tracking on resize
- [ ] Implement previous breakpoint tracking
- [ ] Test by resizing browser window
- [ ] Verify events fire only on actual breakpoint change

### Task 3.3: Component-Level Tracking
- [ ] Add responsive tracking to hero sections
- [ ] Add responsive tracking to grid layouts
- [ ] Add responsive tracking to navigation
- [ ] Add responsive tracking to forms
- [ ] Test each component tracks breakpoint changes
- [ ] Verify no performance impact from tracking

### Task 3.4: Breakpoint Analysis
- [ ] Create GA4 report grouped by breakpoint
- [ ] Track conversion rate by breakpoint
- [ ] Track bounce rate by breakpoint
- [ ] Track session duration by breakpoint
- [ ] Identify breakpoints with low conversion
- [ ] Document findings

### Task 3.5: Responsive Performance
- [ ] Track rendering time by breakpoint
- [ ] Track layout shift (CLS) by breakpoint
- [ ] Identify which responsive state causes slowdown
- [ ] Document performance issues
- [ ] Create optimization recommendations

---

## Phase 4: Cross-Device Journey Tracking (Days 7-8)

### Task 4.1: Device Fingerprinting
- [ ] Create `src/utils/crossDeviceTracking.ts`
- [ ] Implement `generateDeviceFingerprint()` function
- [ ] Implement `getDeviceType()` function
- [ ] Implement local storage persistence
- [ ] Test device fingerprints generate consistently
- [ ] Verify fingerprints don't store PII

### Task 4.2: Cross-Device Linking
- [ ] Implement `linkCrossDeviceUser()` function
- [ ] Implement user ID setting in GA4
- [ ] Implement Clarity user identification
- [ ] Add to form submission (link by email)
- [ ] Test on two different devices:
  - [ ] Submit form on mobile, check GA4 user ID
  - [ ] Visit site on desktop with same email, verify linking

### Task 4.3: Journey Step Tracking
- [ ] Implement `trackJourneyStep()` function
- [ ] Add calls to page navigation
- [ ] Add calls to form progression
- [ ] Add calls to CTA clicks
- [ ] Verify journey steps accumulate in localStorage
- [ ] Test journey data persists across navigation

### Task 4.4: Conversion Attribution
- [ ] Implement `markConversion()` function
- [ ] Add call on form submission success
- [ ] Calculate days since first device
- [ ] Track device path to conversion
- [ ] Verify Clarity upgrade for cross-device conversions
- [ ] Test multi-device conversion sequence

### Task 4.5: Enhanced Form Tracking
- [ ] Update `src/utils/formTracking.ts` with cross-device fields
- [ ] Update form submission payload with cross-device data
- [ ] Update `api/submit-form.ts` to capture:
  - [ ] Cross-Device User ID
  - [ ] Previous Device Count
  - [ ] Is Cross-Device Conversion
  - [ ] Days Since First Device
- [ ] Add fields to Airtable record
- [ ] Verify data appears in Monday.com

### Task 4.6: Cross-Device Analysis
- [ ] Create GA4 report: Device path to conversion
- [ ] Segment by first-touch device vs conversion device
- [ ] Track time between devices
- [ ] Identify most common device sequences
- [ ] Create audience: "Multi-Device Converters"
- [ ] Document cross-device insights

---

## Phase 5: Mobile-Specific Optimizations (Days 9-10)

### Task 5.1: Mobile Form Optimization
- [ ] Create `src/hooks/useMobileFormOptimization.ts`
- [ ] Implement field focus time tracking
- [ ] Implement field error tracking
- [ ] Attach listeners to form components
- [ ] Test by completing form on mobile
- [ ] Verify metrics in GA4

### Task 5.2: Mobile CTA Optimization
- [ ] Create `src/utils/mobileCTAOptimization.ts`
- [ ] Implement `trackMobileCTAClick()` function
- [ ] Implement `trackMobileCTAImpression()` function
- [ ] Add CTA position tracking (above/middle/below fold)
- [ ] Add CTA size tracking (small/medium/large)
- [ ] Test all CTAs on website:
  - [ ] Header CTAs
  - [ ] Hero CTAs
  - [ ] Section CTAs
  - [ ] Footer CTAs
- [ ] Compare click rates by position and size

### Task 5.3: Mobile Navigation Tracking
- [ ] Create `src/utils/mobileNavigationTracking.ts`
- [ ] Track hamburger menu interactions
- [ ] Track direct link clicks
- [ ] Track back button usage
- [ ] Track search interactions
- [ ] Add to mobile navbar component
- [ ] Test each navigation method

### Task 5.4: Form Abandonment Points
- [ ] Implement `trackMobileFormAbandonmentPoint()` function
- [ ] Track which field causes abandonment
- [ ] Track time spent on abandoned field
- [ ] Track if error occurred before abandonment
- [ ] Identify top 3 abandonment fields
- [ ] Create optimization plan for each field

### Task 5.5: Mobile-Specific Optimizations
- [ ] Create GA4 report: Form field metrics by device
- [ ] Compare field focus time (mobile vs desktop)
- [ ] Compare field error rate (mobile vs desktop)
- [ ] Analyze CTA click rate by size
- [ ] Identify touch target size issues
- [ ] Document optimization opportunities

---

## Phase 6: Reporting & Analysis (Days 11-13)

### Task 6.1: GA4 Dashboard Creation
- [ ] Create dashboard: "Mobile vs Desktop Overview"
  - [ ] Conversion rate comparison (card)
  - [ ] Form completion time (bar chart)
  - [ ] Scroll depth distribution (histogram)
  - [ ] Core Web Vitals (scorecard)
- [ ] Create dashboard: "Mobile Form Analysis"
  - [ ] Form step completion funnel (by device)
  - [ ] Field error rates (mobile vs desktop)
  - [ ] Field focus time (mobile vs desktop)
  - [ ] Abandonment point analysis
- [ ] Create dashboard: "Responsive Design Impact"
  - [ ] Conversion rate by breakpoint
  - [ ] Bounce rate by breakpoint
  - [ ] Session duration by breakpoint
- [ ] Create dashboard: "Cross-Device Journeys"
  - [ ] Device path attribution
  - [ ] Multi-device conversion rate
  - [ ] Days between touch and conversion
  - [ ] Device sequence analysis

### Task 6.2: Clarity Session Tagging
- [ ] Verify mobile device type tags populate
- [ ] Create view: "Mobile Sessions"
- [ ] Create view: "Form Submissions by Device"
- [ ] Review mobile session recordings
- [ ] Identify UX issues in recordings
- [ ] Document findings

### Task 6.3: Airtable Analysis
- [ ] Create view: "Leads by Device Type"
- [ ] Create view: "Multi-Device Conversions"
- [ ] Add filter: device_type = "mobile"
- [ ] Analyze conversion completion time by device
- [ ] Review form completion patterns
- [ ] Identify data quality issues

### Task 6.4: Monday.com Dashboard
- [ ] Create view: "Lead Quality by Device"
- [ ] Group by device type
- [ ] Filter by conversion status
- [ ] Analyze form completion rate
- [ ] Track average completion time
- [ ] Create alerts for low mobile conversion

### Task 6.5: Initial Findings Report
- [ ] Document baseline metrics (month 1):
  - [ ] Mobile conversion rate: ____%
  - [ ] Desktop conversion rate: ____%
  - [ ] Mobile form abandonment rate: ____%
  - [ ] Average mobile form completion time: _____ seconds
- [ ] Identify top 3 mobile optimization opportunities:
  1. _________________________________
  2. _________________________________
  3. _________________________________
- [ ] Document cross-device insights:
  - [ ] % of multi-device users: ____%
  - [ ] Most common device path: _____________
- [ ] Create 90-day optimization roadmap

---

## Phase 7: Optimization & Monitoring (Ongoing)

### Task 7.1: Performance Monitoring
- [ ] Set up alerts for:
  - [ ] Mobile conversion rate drops > 10%
  - [ ] Form abandonment rate increases > 15%
  - [ ] Core Web Vitals degradation
  - [ ] High error rates on specific fields
- [ ] Monitor event volume:
  - [ ] No spike in duplicate events
  - [ ] Consistent daily event counts
- [ ] Monitor data quality:
  - [ ] Device type always populated
  - [ ] No null values in core fields

### Task 7.2: Bug Fixes & Edge Cases
- [ ] Test on older browsers (iOS 12, Android 4.4)
- [ ] Test on low-end devices
- [ ] Test on slow networks (2G, 3G)
- [ ] Test with JavaScript disabled
- [ ] Fix any tracking failures
- [ ] Document workarounds

### Task 7.3: Privacy Compliance
- [ ] Verify consent check before tracking
- [ ] Audit data retention (max 30 days)
- [ ] Review data storage in localStorage
- [ ] No PII in analytics events
- [ ] GDPR compliant user identification
- [ ] Test with privacy tools (CCPA, etc.)

### Task 7.4: Documentation
- [ ] Update README with analytics setup
- [ ] Document all tracking events
- [ ] Create analytics style guide
- [ ] Document GA4 custom dimensions
- [ ] Create tracking audit checklist
- [ ] Train team on new tracking

### Task 7.5: Optimization Implementation
- [ ] Implement finding #1 from initial report
- [ ] Measure impact on conversions
- [ ] Implement finding #2
- [ ] Implement finding #3
- [ ] Document results
- [ ] Identify next optimization opportunities

---

## Testing Checklist

### Mobile Device Testing
- [ ] iPhone 12 (iOS 15+)
- [ ] iPhone 8 (iOS 12+)
- [ ] iPhone SE
- [ ] Samsung Galaxy S21
- [ ] Google Pixel 6
- [ ] Older Android (8.0+)
- [ ] iPad (tablet)
- [ ] iPad Mini (mobile-like)

### Browser Testing
- [ ] Safari (iOS)
- [ ] Chrome (iOS, Android)
- [ ] Firefox (iOS, Android)
- [ ] Samsung Internet

### Network Testing
- [ ] WiFi (fast)
- [ ] 4G LTE
- [ ] 3G
- [ ] Offline (to verify graceful degradation)

### Feature Testing
- [ ] Device context detection
- [ ] Touch event handling
- [ ] Orientation changes
- [ ] Form interactions
- [ ] Scroll tracking
- [ ] Gesture detection
- [ ] Cross-device linking

---

## Success Criteria

### Phase 1 Complete When:
- [ ] Device type tracks for 100% of users
- [ ] Form submissions show device type
- [ ] GA4 conversion data segmented by device
- [ ] No console errors on mobile or desktop

### Phase 2 Complete When:
- [ ] Mobile scroll depth events fire correctly
- [ ] Core Web Vitals track for mobile users
- [ ] Gesture detection works on touch devices
- [ ] GA4 dashboard shows mobile behavior metrics

### Phase 3 Complete When:
- [ ] Breakpoint changes tracked on window resize
- [ ] Conversion rate data by breakpoint available
- [ ] Responsive component tracking works
- [ ] No false positives on breakpoint changes

### Phase 4 Complete When:
- [ ] Cross-device users identified correctly
- [ ] Device paths tracked to conversion
- [ ] Multi-device conversion rate calculated
- [ ] Days between devices tracked accurately

### Phase 5 Complete When:
- [ ] Form field metrics captured for mobile
- [ ] CTA click rates tracked by position/size
- [ ] Form abandonment points identified
- [ ] Mobile-specific optimization opportunities documented

### Phase 6 Complete When:
- [ ] All GA4 dashboards display data correctly
- [ ] Clarity mobile sessions tagged and filterable
- [ ] Airtable views show device-specific leads
- [ ] Initial findings report completed

---

## Known Limitations & Workarounds

### Browser Support
- **Issue**: Device Memory API not available in older browsers
- **Workaround**: Wrap in try-catch, default to "unknown"

### Cross-Device Linking
- **Issue**: Users might use different emails on different devices
- **Workaround**: Implement phone number as secondary identifier

### Gesture Detection
- **Issue**: Pinch zoom detection can be fragile
- **Workaround**: Only detect high-confidence gestures (50px+ distance)

### Orientation Detection
- **Issue**: Some browsers report orientation incorrectly
- **Workaround**: Use viewport dimensions as secondary check

### Privacy Restrictions
- **Issue**: Safari ITP limits localStorage persistence
- **Workaround**: Implement sync to server-side storage

---

## Sign-Off

- **Developer**: ________________  Date: ________
- **QA**: ________________  Date: ________
- **Analytics Owner**: ________________  Date: ________
- **Product Manager**: ________________  Date: ________

---

**Last Updated**: January 7, 2026
**Status**: Ready for Implementation
**Next Review**: Upon completion of Phase 1
