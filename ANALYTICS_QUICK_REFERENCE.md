# Mobile vs Desktop Analytics - Quick Reference Card

## Current Implementation Status

### What's Already Tracking
```
✓ Page views (by page type)
✓ Form submissions (with UTM params)
✓ Session tracking (session IDs)
✓ Landing page attribution
✓ Custom events (form_submit, cta_click, outbound)
✓ Microsoft Clarity sessions
✓ Cross-domain tracking (2 domains)
```

### What's NOT Tracking (Gaps)
```
✗ Device type (mobile/tablet/desktop)
✗ Mobile-specific behaviors (scroll, gestures)
✗ Form field performance (mobile vs desktop)
✗ Responsive breakpoint impact
✗ Cross-device user journeys
✗ Touch vs click interactions
✗ Mobile abandonment points
✗ Core Web Vitals by device
```

---

## 5 Quick Wins to Implement

### #1: Add Device Type to GA4 (1 hour)
```typescript
// In src/lib/analytics.ts
const deviceType = window.innerWidth < 768 ? 'mobile' : 'desktop';

window.gtag?.('set', 'user_properties', {
  device_type: deviceType,
});
```

**Then in GA4:**
- Create Report grouped by device_type
- Compare conversion rates
- Find which device converts less

### #2: Track Form Completion by Device (2 hours)
```typescript
// In Contact form on submit
const deviceType = window.innerWidth < 768 ? 'mobile' : 'desktop';
const completionTime = Date.now() - formStartTime;

window.gtag?.('event', 'form_completion', {
  device_type: deviceType,
  completion_time_seconds: Math.round(completionTime / 1000),
});
```

**Then in GA4:**
- Filter by device_type
- Compare completion times
- Identify mobile-specific slowdowns

### #3: Track Scroll Depth on Mobile (2 hours)
```typescript
// New hook: src/hooks/useMobileScrollTracking.ts
useEffect(() => {
  const handleScroll = () => {
    const scrolled = (window.scrollY / (document.height - window.innerHeight)) * 100;
    if (scrolled >= 50 && !tracked50) {
      window.gtag?.('event', 'scroll_50_percent', { device: 'mobile' });
      setTracked50(true);
    }
  };

  window.addEventListener('scroll', handleScroll);
  return () => window.removeEventListener('scroll', handleScroll);
}, []);
```

**Expected insight:** "Mobile users scroll 30% less than desktop"

### #4: Track Form Field Errors by Device (1 hour)
```typescript
// In form field validation
const isMobile = window.innerWidth < 768;

if (!isValid) {
  window.gtag?.('event', 'form_field_error', {
    field: fieldName,
    device: isMobile ? 'mobile' : 'desktop',
  });
}
```

**Expected insight:** "Phone field has 5x error rate on mobile - need auto-format"

### #5: Link Users Across Devices (3 hours)
```typescript
// On form submission - capture user email
const userEmail = formData.email;

// Set as user ID in GA4
window.gtag?.('set', 'user_id', userEmail);

// Store locally for cross-device tracking
localStorage.setItem('nexo_user_id', userEmail);
```

**Expected insight:** "40% of conversions are multi-device (research on mobile, purchase on desktop)"

---

## GA4 Reports to Create

### Report 1: Device Comparison
```
Metric: Conversion Rate
Dimensions: Device Type
Breakdown: Page Type (services, contact, blog)
Filter: Conversions > 0

Expected finding: Mobile converts at 2-3% vs Desktop 4-5%
```

### Report 2: Form Completion Funnel
```
Metric: Form Step Completion Count
Dimensions: Device Type, Step Name
Chart: Funnel

Expected finding: Mobile drops 30% at phone field
```

### Report 3: Page Performance by Breakpoint
```
Metric: Bounce Rate, Session Duration
Dimensions: Viewport Width (grouped in ranges)
Filter: None

Expected finding: Bounce spikes at 768px tablet breakpoint
```

---

## Event Naming Convention

Use this pattern for consistency:

```
[event prefix]_[action]_[target]_[device]

Examples:
- form_field_error_phone_mobile
- form_step_completed_contact_desktop
- cta_clicked_services_mobile
- scroll_25_percent_blog_mobile
```

---

## User Properties to Set (in GA4)

```typescript
window.gtag?.('set', 'user_properties', {
  device_type: 'mobile|tablet|desktop',
  browser: 'Chrome|Safari|Firefox|Edge',
  os: 'iOS|Android|Windows|MacOS|Linux',
  is_touch_device: 'yes|no',
  connection_type: '4g|3g|2g|unknown',
  form_completer: 'yes|no',
  cross_device_user: 'yes|no',
});
```

---

## Key Metrics Dashboard (GA4)

Create a single dashboard with these cards:

| Card | Formula | Target |
|------|---------|--------|
| Mobile Conv. Rate | (mobile_conversions / mobile_users) × 100 | > 3% |
| Desktop Conv. Rate | (desktop_conversions / desktop_users) × 100 | > 5% |
| Mobile Form Time | avg(form_completion_time_mobile) | < 120s |
| Desktop Form Time | avg(form_completion_time_desktop) | < 90s |
| Mobile Scroll 50% | count(scroll_50_mobile) / mobile_users | > 30% |
| Desktop Scroll 50% | count(scroll_50_desktop) / desktop_users | > 50% |
| Multi-Device Conv. | count(conversions_with_user_id) / total_conversions | > 40% |

---

## Testing Checklist (Quick Version)

```
On Desktop:
□ Form submission captures device_type = 'desktop'
□ GA4 shows desktop events in real-time report
□ Scroll tracking works

On Mobile:
□ Form submission captures device_type = 'mobile'
□ GA4 shows mobile events in real-time report
□ Touch events track correctly
□ No console errors

Cross-Device:
□ Submit form on mobile with email
□ Revisit site on desktop
□ Check GA4 user_id is linked
□ Verify same person on both devices
```

---

## Code Template: Full Device Tracking

### Step 1: Add to src/lib/analytics.ts
```typescript
export function captureDeviceType(): 'mobile' | 'tablet' | 'desktop' {
  const width = window.innerWidth;
  if (width < 768) return 'mobile';
  if (width < 1024) return 'tablet';
  return 'desktop';
}

export function initDeviceTracking(): void {
  const deviceType = captureDeviceType();

  window.gtag?.('set', 'user_properties', {
    device_type: deviceType,
  });

  console.log('[Analytics] Device type:', deviceType);
}
```

### Step 2: Call in src/main.tsx
```typescript
import { initDeviceTracking } from '@/lib/analytics';

initDeviceTracking();
initAnalytics();
```

### Step 3: Use in Components
```typescript
import { captureDeviceType } from '@/lib/analytics';

const deviceType = captureDeviceType();

window.gtag?.('event', 'form_submit', {
  device_type: deviceType,
  page: window.location.pathname,
});
```

---

## Clarity Tags to Set

```typescript
// For mobile sessions
Clarity.setTag('device_type', 'mobile');
Clarity.setTag('form_status', 'in_progress');
Clarity.setTag('error_field', 'phone');

// For important conversions
Clarity.upgrade('form_mobile_conversion');
```

---

## Airtable Fields to Add

Add these columns to Leads table:

```
Device Type:          [Single Select] mobile / tablet / desktop
Viewport:             [Single Line Text] "375x812"
Is Touch Device:      [Checkbox] True / False
Form Completion Time: [Number] seconds
Previous Devices:     [Number] count
Cross-Device Conversion: [Checkbox] True / False
Days Since First Touch: [Number] days
```

---

## Monday.com Automations

Create these automations:

### Automation 1: Flag Mobile Conversions
```
When: Lead converted AND device_type = mobile
Then: Add tag "MOBILE_CONVERSION"
Then: Alert team
```

### Automation 2: Slow Form Alert
```
When: form_completion_time > 180 seconds
Then: Priority = "High"
Then: Notify lead owner
```

### Automation 3: Abandonment Alert
```
When: form_step_completed < 3 AND device_type = mobile
Then: Create task "Follow up mobile lead"
```

---

## Performance Impact Check

Before deploying, verify:

```
Bundle size increase:   < 15KB gzipped
New GA4 events:         < 100 per session
Clarity tag calls:      < 50 per session
CPU impact (mobile):    < 2% increase
Memory impact (mobile): < 5MB additional
```

---

## 30-Day Success Criteria

After implementation, you should have:

```
✓ Device type data for 100% of visitors
✓ Mobile conversion rate baseline established
✓ Top 3 mobile pain points identified
✓ Multi-device user % measured
✓ Optimization roadmap created
✓ GA4 dashboards operational
✓ Team trained on new metrics
✓ Monthly report process defined
```

---

## Common Issues & Fixes

### "GA4 doesn't show user properties"
```
Fix: Wait 24 hours for data processing
     Verify gtag function is loaded
     Check user_properties parameter format
```

### "Mobile and desktop tracking mixed up"
```
Fix: Use fixed 768px breakpoint consistently
     Not window.innerWidth (can vary)
     Not CSS media queries (different values)
```

### "Cross-device linking not working"
```
Fix: Set user_id BEFORE form submission
     Use persistent identifier (email)
     Verify localStorage not blocked
```

### "Clarity tags not appearing"
```
Fix: Check Clarity initialized first
     Verify tags called AFTER Clarity loads
     Check browser console for Clarity errors
```

---

## File Path Reference

```
Analytics Core:
  src/lib/analytics.ts                 ← Add device functions here
  src/utils/formTracking.ts            ← Add device to tracking data
  api/submit-form.ts                   ← Add device fields to Airtable

Mobile Detection:
  src/hooks/use-mobile.tsx             ← Existing, use this

New Files to Create:
  src/hooks/useMobileScrollTracking.ts ← Scroll depth
  src/hooks/useMobileFormOptimization.ts ← Form metrics
  src/utils/crossDeviceTracking.ts     ← Cross-device linking

Integration Points:
  src/main.tsx                         ← Initialize tracking
  src/components/Contact.tsx           ← Track form events
  src/App.tsx                          ← App-level tracking
```

---

## Next Actions (In Priority Order)

1. **Today (30 min):** Add `captureDeviceType()` to analytics.ts
2. **Tomorrow (1 hour):** Set GA4 device_type user property
3. **This Week (2 hours):** Create GA4 device comparison report
4. **Next Week (1 day):** Implement form field tracking by device
5. **Following Week (1 day):** Add scroll depth tracking

**Total Time to Baseline:** 5-6 days
**Time to Full Implementation:** 10-13 days

---

## Support Resources

**Documentation:**
- `MOBILE_VS_DESKTOP_ANALYTICS_STRATEGY.md` - Full detailed guide
- `ANALYTICS_SEGMENTATION_SUMMARY.md` - Executive overview
- `IMPLEMENTATION_CHECKLIST.md` - Step-by-step tasks

**External Resources:**
- [GA4 Documentation](https://support.google.com/analytics)
- [Clarity Setup Guide](https://docs.microsoft.com/clarity)
- [Google Analytics Academy](https://analytics.google.com/analytics/academy)

**Team Contacts:**
- Analytics Owner: _____________
- Dev Lead: _____________
- Product Manager: _____________

---

**Last Updated:** January 7, 2026
**Difficulty Level:** Intermediate (Node.js, React, GA4 knowledge helpful)
**Implementation Time:** 8-13 days
**ROI Expected:** 25-30% mobile conversion improvement
