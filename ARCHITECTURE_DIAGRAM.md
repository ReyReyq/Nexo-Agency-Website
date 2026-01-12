# Mobile vs Desktop Analytics Architecture Diagram

## Current Analytics Stack

```
┌─────────────────────────────────────────────────────────────────┐
│                     NEXO WEBSITE (React + Vite)                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────────┐         ┌──────────────────┐             │
│  │   User Visits    │         │  User Behavior   │             │
│  │  (any device)    │         │  (scroll, clicks)│             │
│  └────────┬─────────┘         └────────┬─────────┘             │
│           │                             │                       │
│           └──────────────┬──────────────┘                       │
│                          │                                      │
│  ┌───────────────────────▼────────────────────────┐            │
│  │     src/lib/analytics.ts                       │            │
│  │  (GA4 + Clarity Initialization)                │            │
│  │  - initGA()                                    │            │
│  │  - initClarity()                               │            │
│  │  - trackPageView()                             │            │
│  │  - trackEvent()                                │            │
│  └───────────────────┬─────────────────┬──────────┘            │
│                      │                 │                       │
│         ┌────────────┴──────┐   ┌──────┴─────────────┐        │
│         │                   │   │                    │        │
│  ┌──────▼────────┐  ┌──────▼──┐  ┌──────────────┐  ┌──▼──────┘
│  │  Google       │  │Microsoft│  │Airtable CRM  │  │Monday.com
│  │ Analytics 4   │  │Clarity  │  │(Form Leads)  │  │(Pipeline)
│  └───────────────┘  │         │  │              │  │
│                     │(Events &│  └──────────────┘  │
│                     │Recordings)                   │
│                     └─────────┘                    │
└─────────────────────────────────────────────────────────────────┘
```

---

## Enhanced Analytics Stack (Post-Implementation)

```
┌──────────────────────────────────────────────────────────────────┐
│                    NEXO WEBSITE (Enhanced)                       │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │              Browser Detection Layer                      │   │
│  │  ┌─────────────────────────────────────────────────────┐ │   │
│  │  │ useIsMobile() → device type (mobile/tablet/desktop) │ │   │
│  │  │ useResponsiveAnalytics() → viewport width tracking  │ │   │
│  │  │ useMobileInteractionTracking() → scroll, gestures   │ │   │
│  │  │ useMobilePerformanceTracking() → Core Web Vitals    │ │   │
│  │  │ useMobileFormOptimization() → form field metrics    │ │   │
│  │  └─────────────────────────────────────────────────────┘ │   │
│  └──────────────────┬───────────────────────────────────────┘   │
│                     │                                            │
│  ┌──────────────────▼───────────────────────────────────────┐   │
│  │          Tracking Data Enrichment Layer                  │   │
│  │  ┌─────────────────────────────────────────────────────┐ │   │
│  │  │ formTracking.ts                                      │ │   │
│  │  │  - Device type capture                              │ │   │
│  │  │  - Landing page attribution                         │ │   │
│  │  │  - UTM parameter extraction                         │ │   │
│  │  │  - Cross-device user linking                        │ │   │
│  │  │  - Form completion metrics                          │ │   │
│  │  └─────────────────────────────────────────────────────┘ │   │
│  │                                                          │   │
│  │  ┌─────────────────────────────────────────────────────┐ │   │
│  │  │ crossDeviceTracking.ts                              │ │   │
│  │  │  - Device fingerprinting                            │ │   │
│  │  │  - User ID linking (email/phone)                    │ │   │
│  │  │  - Journey step tracking                            │ │   │
│  │  │  - Multi-device conversion marking                  │ │   │
│  │  └─────────────────────────────────────────────────────┘ │   │
│  │                                                          │   │
│  │  ┌─────────────────────────────────────────────────────┐ │   │
│  │  │ responsiveAnalytics.ts                              │ │   │
│  │  │  - Breakpoint detection (5 sizes)                   │ │   │
│  │  │  - Viewport width tracking                          │ │   │
│  │  │  - Component render mode tracking                   │ │   │
│  │  └─────────────────────────────────────────────────────┘ │   │
│  │                                                          │   │
│  │  ┌─────────────────────────────────────────────────────┐ │   │
│  │  │ mobileCTAOptimization.ts                            │ │   │
│  │  │ mobileNavigationTracking.ts                         │ │   │
│  │  │ mobileSessionTracking.ts                            │ │   │
│  │  │  - Mobile-specific behavior patterns                │ │   │
│  │  │  - Touch event tracking                             │ │   │
│  │  │  - Gesture recognition (swipe, pinch)              │ │   │
│  │  └─────────────────────────────────────────────────────┘ │   │
│  └──────────────────┬───────────────────────────────────────┘   │
│                     │                                            │
│  ┌──────────────────▼───────────────────────────────────────┐   │
│  │              Core Analytics Engine                       │   │
│  │  (Enhanced src/lib/analytics.ts)                        │   │
│  │  ┌─────────────────────────────────────────────────────┐ │   │
│  │  │ Device Context Functions:                            │ │   │
│  │  │  - captureDeviceContext()                            │ │   │
│  │  │  - initDeviceTracking()                              │ │   │
│  │  │                                                       │ │   │
│  │  │ Enhanced Event Tracking:                             │ │   │
│  │  │  - trackFormStepCompletion()                         │ │   │
│  │  │  - trackFormFieldInteraction()                       │ │   │
│  │  │  - trackConversionCompletion()                       │ │   │
│  │  │  - trackMobileCTAClick()                             │ │   │
│  │  │                                                       │ │   │
│  │  │ User Property Management:                            │ │   │
│  │  │  - setUserProperties()                               │ │   │
│  │  │  - linkCrossDeviceUser()                             │ │   │
│  │  │  - markConversion()                                  │ │   │
│  │  └─────────────────────────────────────────────────────┘ │   │
│  └──────────────┬──────────────────────────────────────────┘   │
│                 │                                               │
│     ┌───────────┴──────────────────────────────────────────┐   │
│     │                                                       │   │
│  ┌──▼──────────┐  ┌──────────────┐  ┌────────────────┐   │   │
│  │   GA4       │  │  Microsoft   │  │   Airtable     │   │   │
│  │ Analytics   │  │  Clarity     │  │   CRM          │   │   │
│  │             │  │              │  │                │   │   │
│  │ Events:     │  │ Sessions:    │  │ Lead Fields:   │   │   │
│  │ - Page view │  │ - Heatmaps   │  │ - Device Type  │   │   │
│  │ - Form step │  │ - Recordings │  │ - Viewport     │   │   │
│  │ - CTA click │  │ - Tags       │  │ - Form Time    │   │   │
│  │ - Scroll    │  │              │  │ - Visit Path   │   │   │
│  │ - Core Web  │  │ Tags:        │  │ - Session ID   │   │   │
│  │   Vitals    │  │ - device_type│  │ - Cross-Device │   │   │
│  │ - Gesture   │  │ - page_type  │  │   Info         │   │   │
│  │             │  │              │  │                │   │   │
│  │ Dimensions: │  │ Filters:     │  │ Views:         │   │   │
│  │ - Device    │  │ - Mobile     │  │ - By Device    │   │   │
│  │ - Breakpoint│  │ - Desktop    │  │ - Multi-Device │   │   │
│  │ - Browser   │  │ - Form Conv. │  │ - Conversion   │   │   │
│  │ - OS        │  │              │  │ - Abandonment  │   │   │
│  └─────────────┘  └──────────────┘  └────────────────┘   │   │
│                                                           │   │
│  ┌────────────────────────────────────────────────────┐  │   │
│  │           Monday.com Pipeline Automation           │  │   │
│  │  - Mobile Conversion Alerts                        │  │   │
│  │  - Multi-Device Lead Tracking                      │  │   │
│  │  - Form Abandonment Notifications                  │  │   │
│  │  - Slow Form Alerts                                │  │   │
│  └────────────────────────────────────────────────────┘  │   │
└──────────────────────────────────────────────────────────────┘
```

---

## Data Flow Diagram: Form Submission

```
┌─────────────────────────────────────────────────────────────┐
│                   User Submits Contact Form                 │
│                                                              │
│  Device Type Detected: mobile (viewport < 768px)            │
│  Form Completion Time: 145 seconds                          │
└─────────────────────┬───────────────────────────────────────┘
                      │
       ┌──────────────┴──────────────┐
       │                             │
    ┌──▼──────────┐         ┌──────┬──────────┐
    │  Browser    │         │Cross │  Cross   │
    │ localStorage│         │Device│ Device   │
    │             │         │Linking          │
    │ Session ID  │         │      │          │
    │ Landing Page│         │User  │ Journey  │
    │ UTM Params  │         │Email │ Tracking│
    └──┬──────────┘         └──────┴────┬─────┘
       │                               │
       │   ┌──────────────────────────┘
       │   │
    ┌──▼───▼─────────────────────────┐
    │  src/utils/formTracking.ts      │
    │  getTrackingData()              │
    │                                 │
    │  Returns:                       │
    │  - Form data                    │
    │  - Device type: 'mobile'        │
    │  - UTM parameters               │
    │  - Session ID                   │
    │  - Cross-device user ID         │
    └──┬────────────────────────────┬─┘
       │                            │
    ┌──▼───────────────────┐   ┌──▼────────────────────┐
    │  window.gtag()       │   │ trackFormSubmission() │
    │                      │   │ (src/lib/analytics)   │
    │ gtag('event',        │   │                       │
    │       'form_submit', │   │ Sends to GA4:         │
    │       {              │   │ - device_type         │
    │ device_type:mobile,  │   │ - form_name           │
    │ completion_time:145  │   │ - field_error_count   │
    │ })                   │   │ - completion_time     │
    │                      │   │                       │
    │ Sets user property:  │   │ Upgrades Clarity:     │
    │ 'device_type':mobile │   │ form_mobile_*         │
    └──────────┬───────────┘   └──────┬────────────────┘
               │                      │
               │      ┌───────────────┘
               │      │
         ┌─────▼──────▼──────────────────────┐
         │ submitContactForm()                │
         │ (src/utils/formSubmission.ts)      │
         │                                   │
         │ POST /api/submit-form             │
         │ Payload:                          │
         │ {                                 │
         │   formData: {...},                │
         │   tracking: {...},                │
         │   deviceContext: {                │
         │     deviceType: 'mobile',         │
         │     viewportWidth: 375,           │
         │     isTouch: true,                │
         │     formSubmissionTime: 145       │
         │   }                               │
         │ }                                 │
         └──────────┬────────────────────────┘
                    │
        ┌───────────┴────────────┐
        │                        │
      ┌─▼──────────────────┐  ┌──▼────────────────┐
      │ Airtable (CRM)     │  │ Monday.com        │
      │                    │  │ (Pipeline)        │
      │ New Lead Record:   │  │                   │
      │ - Name             │  │ New Item:         │
      │ - Phone            │  │ - Lead Name       │
      │ - Email            │  │ - Phone           │
      │ - Budget           │  │ - Status          │
      │ - Device Type      │  │ - Device Type     │
      │ - Viewport         │  │ - Form Time       │
      │ - Is Touch         │  │ - Priority (auto) │
      │ - Form Time        │  │ - Notes           │
      │ - Session ID       │  │                   │
      │ - Landing Page     │  │ Trigger Automation│
      │ - UTM Source       │  │ if device_type =  │
      │ - Cross-Device?    │  │ 'mobile' →        │
      │ - Days to Convert  │  │ Flag & Alert team │
      │ - Traffic Source   │  │                   │
      └────────────────────┘  └───────────────────┘
```

---

## Cross-Device Journey Tracking

```
Timeline:
Day 1 - User on Mobile
  ├─ Visits homepage (mobile, 375x812)
  ├─ Reads blog article
  ├─ Clicks "Services" CTA
  └─ Leaves (no conversion)

Day 3 - User on Desktop
  ├─ Google search for "web development"
  ├─ Lands on services page (desktop, 1920x1080)
  ├─ Reads case studies
  ├─ Fills form with email: john@example.com ✓
  └─ CONVERSION TRACKED


Data Captured:
┌───────────────────────────────────────────────┐
│ User Journey Record (localStorage)            │
├───────────────────────────────────────────────┤
│ userId: john@example.com                      │
│ firstTouchDevice: mobile                      │
│ conversionDevice: desktop                     │
│ journeySteps: [                               │
│   {device: mobile, page: /, action: view}     │
│   {device: mobile, page: /blog/..., action}   │
│   {device: mobile, page: /services, action}   │
│   {device: desktop, page: /services, action}  │
│   {device: desktop, page: /services/web-dev}  │
│   {device: desktop, page: /contact, action}   │
│   {device: desktop, page: /contact, action:   │
│     form_submitted}                           │
│ ]                                             │
│ daysSinceFirstTouch: 3                        │
│ totalDevices: 2                               │
│ journeyLength: 7                              │
└───────────────────────────────────────────────┘

GA4 Event Fired:
{
  event: 'cross_device_conversion',
  first_touch_device: 'mobile',
  conversion_device: 'desktop',
  days_since_first_touch: 3,
  total_devices: 2,
  journey_length: 7
}

Airtable Record:
- Cross-Device User ID: john@example.com
- Previous Devices Count: 2
- Is Cross-Device Conversion: Yes
- Days Since First Device: 3
- First Touch Device: mobile
- Conversion Device: desktop
```

---

## Mobile vs Desktop Event Comparison

```
Same User, Different Devices
════════════════════════════════════════════════

MOBILE SESSION (iPhone)                  DESKTOP SESSION (Chrome)
────────────────────────────────────────────────────────────────
Page Load: 2.8s (LCP)                    Page Load: 1.2s (LCP)
First Input Delay: 150ms                 First Input Delay: 45ms
Layout Shift: 0.18                       Layout Shift: 0.05

Form Interaction:
- Focus Time per Field: 8.2s             - Focus Time per Field: 3.1s
- Field Errors: 2 (phone format)         - Field Errors: 0
- Tap Misses: 3                          - No misses
- Scroll to CTA: 12s                     - Scroll to CTA: 2s
- Total Form Time: 145s                  - Total Form Time: 52s

Events Fired:
- form_field_interaction (4 events)      - form_field_interaction (1 event)
- mobile_scroll_25_percent                - scroll_50_percent
- mobile_button_tap (5)                   - click (2)
- form_field_error_phone (2)              - No field errors
- mobile_form_abandonment (1 attempted)   - Direct completion

Clarity Tags:
- device_type: mobile                    - device_type: desktop
- form_status: in_progress               - form_status: completed
- error_field: phone                     - No errors
- network: 3g                            - network: wifi
```

---

## Responsive Design Tracking

```
Same Page, Different Breakpoints
════════════════════════════════════════════════

Mobile (<480px)         Tablet (480-1024px)      Desktop (>1024px)
─────────────────────────────────────────────────────────────────

Hero Image:
- Hidden                - Shown                  - Shown
- Form Stacked          - Form 2-Column          - Form 3-Column
- CTA: 48x48px          - CTA: 56x56px           - CTA: 64x64px

Events Tracked:
- responsive_component  - responsive_component   - responsive_component
  render:               render:                  render:
  component: hero       component: hero          component: hero
  breakpoint: mobile    breakpoint: tablet       breakpoint: desktop
  render_mode:          render_mode:             render_mode:
  modified              modified                 visible

Form Performance:
- CLS: 0.25            - CLS: 0.12              - CLS: 0.08
- TTI: 3.2s            - TTI: 2.1s              - TTI: 1.5s
- Bounce Rate: 45%     - Bounce Rate: 28%       - Bounce Rate: 12%

Conversion Rate:
- 2.1%                 - 3.5%                   - 5.8%

Insights:
- Mobile layout shift   - Tablet sweet spot      - Optimal performance
  causes bounces        for conversion
- CTA size too small    - Balance of UX          - Best conversion
- Form takes too long   - Responsive design      - Minimal friction
                          working well
```

---

## GA4 Custom Dashboard Layout

```
┌────────────────────────────────────────────────────────────────┐
│                MOBILE VS DESKTOP ANALYTICS DASHBOARD            │
├────────────────────────────────────────────────────────────────┤
│                                                                 │
│ ┌─────────────────┐  ┌─────────────────┐  ┌──────────────────┐│
│ │ Mobile Conv.    │  │ Desktop Conv.   │  │ Multi-Device %   ││
│ │ Rate: 2.8%      │  │ Rate: 5.2%      │  │ 42% of Users     ││
│ │ ▼ 0.3% vs week  │  │ ▲ 0.8% vs week  │  │ ▲ 5% vs month    ││
│ └─────────────────┘  └─────────────────┘  └──────────────────┘│
│                                                                 │
│ ┌──────────────────────────────────────────────────────────┐  │
│ │ Conversion Rate by Device (Trend)                        │  │
│ │  6.0% │                                              ▲   │  │
│ │       │                                            ╱ │   │  │
│ │  5.0% │                                ╱─────────╱   │Desktop
│ │       │                              ╱             │  │  │
│ │  4.0% │                         ────────           │  │  │
│ │       │                       ╱                    │  │  │
│ │  3.0% │   ╱─────────────────                       │  │  │
│ │       │ ╱                                          │Mobile │
│ │  2.0% │                                           │  │  │
│ │       └────────────────────────────────────────────┘  │  │
│ │         Jan  Feb  Mar  Apr  May  Jun                   │  │
│ └──────────────────────────────────────────────────────┘  │
│                                                           │  │
│ ┌────────────────────────┐  ┌──────────────────────────┐ │  │
│ │ Form Completion Time   │  │ Bounce Rate by Device    │ │  │
│ │ Mobile: 145s           │  │ Mobile: 38%              │ │  │
│ │ Desktop: 52s           │  │ Desktop: 15%             │ │  │
│ │ Tablet: 87s            │  │ Tablet: 24%              │ │  │
│ │                        │  │                          │ │  │
│ │ ▼ Mobile slow ↑ issue  │  │ ▲ Mobile high ↓ UX      │ │  │
│ └────────────────────────┘  └──────────────────────────┘ │  │
│                                                           │  │
│ ┌─────────────────────────────────────────────────────┐  │  │
│ │ Form Abandonment by Field (Mobile)                  │  │  │
│ │  Phone: 35% ████████████                            │  │  │
│ │  Budget: 18% ██████                                 │  │  │
│ │  Email: 8%  ███                                     │  │  │
│ │  Name: 3%   █                                       │  │  │
│ └─────────────────────────────────────────────────────┘  │  │
│                                                           │  │
│ ┌─────────────────────────────────────────────────────┐  │  │
│ │ Core Web Vitals by Device                           │  │  │
│ │              Mobile    Desktop    Target            │  │  │
│ │ LCP (paint): 2.8s      1.2s       <2.5s ✗  ✓        │  │  │
│ │ FID (input): 150ms     45ms       <100ms ✗  ✓        │  │  │
│ │ CLS (shift): 0.18      0.05       <0.1  ✗  ✓        │  │  │
│ └─────────────────────────────────────────────────────┘  │  │
│                                                           │  │
└───────────────────────────────────────────────────────────┘  │
```

---

## Implementation Dependency Graph

```
                    ┌─────────────┐
                    │ src/main.tsx│
                    └────────┬────┘
                             │
          ┌──────────────────┴──────────────────┐
          │                                     │
    ┌─────▼────────────┐          ┌────────────▼─────────┐
    │ initTracking()   │          │ initAnalytics()      │
    │ (formTracking)   │          │ (analytics)          │
    └─────┬────────────┘          └───────────┬──────────┘
          │                                   │
          │          ┌──────────────┬─────────┘
          │          │              │
    ┌─────▼──────────┴──────┐  ┌────▼─────────────┐
    │ Enhanced analytics.ts │  │ Device Context   │
    │ - captureDeviceType() │  │ - Browser/OS     │
    │ - initDeviceTracking()│  │ - Touch Detection│
    │ - trackFormStep()     │  │ - Connection     │
    │ - trackConversion()   │  └──────────────────┘
    └──────────┬────────────┘
               │
    ┌──────────┴──────────────────────────────────┐
    │                                             │
┌───▼──────────────┐ ┌─────────────┬───────────┐ │
│ useAnalytics()   │ │ useIsMobile()           │ │
│ (page tracking)  │ │ (device detection)      │ │
└──────────────────┘ └───────┬──────┬──────────┘ │
                             │      │            │
                    ┌────────┘      │            │
                    │               │            │
          ┌─────────▼───────┐  ┌───▼──────────────────┐
          │ useResponsive   │  │ useMobileTracking()  │
          │ Analytics()     │  │ - Scroll depth       │
          │ - Breakpoint    │  │ - Orientation       │
          │   detection     │  │ - Tap events        │
          └──────────────────┘  │ - Gestures        │
                                │ - Performance      │
                                └────────────────────┘
                                      │
                  ┌───────────────────┬┘
                  │                   │
             ┌────▼──────┐    ┌──────▼─────────┐
             │ Mobile    │    │ Session        │
             │ Form Hook │    │ Tracking       │
             │ - Field   │    │ - Metrics      │
             │   focus   │    │ - Gestures     │
             │ - Errors  │    │ - Duration     │
             └───────────┘    └────────────────┘
```

---

## Data Storage & Persistence

```
Browser Storage:
┌──────────────────────────────────────┐
│ sessionStorage                        │
├──────────────────────────────────────┤
│ nexo_session_id: "xxx"               │
│ (cleared on tab close)               │
└──────────────────────────────────────┘

┌──────────────────────────────────────┐
│ localStorage                          │
├──────────────────────────────────────┤
│ nexo_tracking_data: {                │
│   landingPageUrl,                    │
│   utmSource,                         │
│   utmCampaign,                       │
│   sessionId                          │
│ }                                    │
│                                      │
│ nexo_cross_device_profile: {         │
│   userId,                            │
│   devices: [...],                    │
│   journeySteps: [...],               │
│   firstTouchDevice,                  │
│   conversionDevice,                  │
│   daysSinceFirstTouch                │
│ }                                    │
│ (persists across sessions)           │
└──────────────────────────────────────┘

Server-Side (Airtable):
┌──────────────────────────────────────┐
│ Leads Table                          │
├──────────────────────────────────────┤
│ Core Fields:                         │
│ - Name, Phone, Email, Budget         │
│                                      │
│ Tracking Fields:                     │
│ - Device Type                        │
│ - Viewport Dimensions                │
│ - Is Touch Device                    │
│ - Form Completion Time               │
│ - Session ID                         │
│ - Landing Page                       │
│ - UTM Parameters                     │
│ - Referrer Domain                    │
│ - Cross-Device Info                  │
│ - Traffic Source                     │
│                                      │
│ (Synced to Monday.com board)         │
└──────────────────────────────────────┘

Analytics Platforms:
┌──────────────────────────────────────┐
│ GA4                                  │
│ - Events stream                      │
│ - User properties                    │
│ - Conversion tracking                │
│ - Custom dimensions/metrics          │
└──────────────────────────────────────┘

┌──────────────────────────────────────┐
│ Clarity                              │
│ - Session recordings                 │
│ - Heatmaps                           │
│ - Custom tags                        │
│ - User identification                │
└──────────────────────────────────────┘
```

---

**Diagram Legend:**
- Solid boxes = Files/Components
- Dashed flows = Data movement
- ➜ = Data transformation
- ✓ = Success condition
- ✗ = Failed condition
- ▲/▼ = Trending direction

---

**Last Updated:** January 7, 2026
