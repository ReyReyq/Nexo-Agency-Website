# Click Tracking Implementation Guide
## Practical Code Examples & Setup Instructions

---

## Table of Contents
1. [Enhanced Analytics Module](#enhanced-analytics-module)
2. [Tracked Component Wrappers](#tracked-component-wrappers)
3. [Integration Points](#integration-points)
4. [Setup Checklist](#setup-checklist)
5. [Testing & Validation](#testing--validation)

---

## Enhanced Analytics Module

### Extend `src/lib/analytics.ts` with Click Tracking Functions

```typescript
/**
 * Enhanced click tracking functions for comprehensive CTA analytics
 * Add these functions to the existing analytics.ts module
 */

// ============================================================================
// Click Tracking Types
// ============================================================================

type ClickElementType = 'button' | 'link' | 'file' | 'form' | 'custom';
type CTAType = 'primary' | 'secondary' | 'tertiary' | 'navigation' | 'footer';

interface ClickTrackingData {
  elementId: string;
  elementName: string;
  elementType: ClickElementType;
  ctaType: CTAType;
  pageSection: string; // 'hero', 'features', 'footer', etc.
  pageLocation: string; // pathname
  metadata?: Record<string, unknown>;
}

// ============================================================================
// Core Click Tracking Functions
// ============================================================================

/**
 * Track click on any element (button, link, etc.)
 * @param data - Click tracking data
 */
export function trackElementClick(data: ClickTrackingData): void {
  if (!isGAInitialized || !window.gtag) return;

  window.gtag('event', 'element_click', {
    element_id: data.elementId,
    element_name: data.elementName,
    element_type: data.elementType,
    cta_type: data.ctaType,
    page_section: data.pageSection,
    page_location: data.pageLocation,
    timestamp: new Date().toISOString(),
    ...data.metadata,
  });

  // Also track in Clarity with session context
  if (isClarityInitialized) {
    Clarity.event(`click_${data.elementType}_${data.elementId}`);
  }
}

/**
 * Track CTA button click with full context
 * @param ctaName - Display name for the CTA
 * @param ctaType - primary, secondary, tertiary, etc.
 * @param pageSection - Page section where CTA appears
 * @param metadata - Additional data to track
 */
export function trackCTAClick(
  ctaName: string,
  ctaType: CTAType = 'primary',
  pageSection: string = 'unknown',
  metadata?: Record<string, unknown>
): void {
  const data: ClickTrackingData = {
    elementId: ctaName.toLowerCase().replace(/\s+/g, '_'),
    elementName: ctaName,
    elementType: 'button',
    ctaType,
    pageSection,
    pageLocation: window.location.pathname,
    metadata,
  };

  trackElementClick(data);

  // Upgrade Clarity session for important CTAs
  if (isClarityInitialized && ctaType === 'primary') {
    Clarity.upgrade(`primary_cta_${ctaName}`);
  }
}

/**
 * Track internal link click
 * @param url - Target URL
 * @param linkText - Display text
 * @param linkCategory - Category for grouping
 */
export function trackInternalLinkClick(
  url: string,
  linkText: string,
  linkCategory: string = 'internal'
): void {
  const data: ClickTrackingData = {
    elementId: `link_${url}`,
    elementName: linkText,
    elementType: 'link',
    ctaType: 'navigation',
    pageSection: 'navigation',
    pageLocation: window.location.pathname,
    metadata: {
      link_url: url,
      link_category: linkCategory,
    },
  };

  trackElementClick(data);
}

/**
 * Track external/outbound link click
 * @param url - External URL
 * @param linkText - Display text
 */
export function trackOutboundLinkClick(url: string, linkText: string): void {
  if (!isGAInitialized || !window.gtag) return;

  // GA4 already tracks outbound clicks, but we can enhance with context
  window.gtag('event', 'click', {
    event_category: 'outbound',
    event_label: url,
    event_location: window.location.pathname,
    link_text: linkText,
    transport_type: 'beacon', // Ensures data sends even if user navigates away
  });
}

/**
 * Track file download click
 * @param fileName - Name of file being downloaded
 * @param fileType - Type of file (pdf, doc, zip, etc.)
 */
export function trackFileDownload(
  fileName: string,
  fileType: string
): void {
  const data: ClickTrackingData = {
    elementId: `download_${fileName}`,
    elementName: `Download: ${fileName}`,
    elementType: 'file',
    ctaType: 'secondary',
    pageSection: 'content',
    pageLocation: window.location.pathname,
    metadata: {
      file_name: fileName,
      file_type: fileType,
    },
  };

  trackElementClick(data);
}

/**
 * Track form interaction (focus, blur, submit attempt)
 * @param formName - Name/ID of form
 * @param fieldName - Name of field interacting with
 * @param interactionType - 'focus', 'blur', 'change', 'submit_attempt'
 */
export function trackFormInteraction(
  formName: string,
  fieldName: string,
  interactionType: 'focus' | 'blur' | 'change' | 'submit_attempt'
): void {
  const data: ClickTrackingData = {
    elementId: `form_${formName}_${fieldName}`,
    elementName: `${formName} - ${fieldName}`,
    elementType: 'form',
    ctaType: 'secondary',
    pageSection: 'form',
    pageLocation: window.location.pathname,
    metadata: {
      form_name: formName,
      field_name: fieldName,
      interaction_type: interactionType,
    },
  };

  trackElementClick(data);
}

/**
 * Track clicks on custom elements (video plays, tabs, accordions, etc.)
 * @param elementName - Name of element
 * @param elementType - Type of interaction (play, tab_switch, etc.)
 * @param pageSection - Page section
 */
export function trackCustomClick(
  elementName: string,
  elementType: string,
  pageSection: string
): void {
  const data: ClickTrackingData = {
    elementId: elementName.toLowerCase().replace(/\s+/g, '_'),
    elementName,
    elementType: 'custom',
    ctaType: 'secondary',
    pageSection,
    pageLocation: window.location.pathname,
    metadata: {
      interaction_type: elementType,
    },
  };

  trackElementClick(data);
}

// ============================================================================
// Session Tagging for Clarity (Context)
// ============================================================================

/**
 * Tag Clarity session with CTA-related context
 * Useful for filtering sessions and session recordings in Clarity dashboard
 */
export function tagClaritySessionWithCTA(
  pageType: string,
  primaryCtaVisible: boolean,
  ctaCount: number
): void {
  if (!isClarityInitialized) return;

  setClarityTag('page_type', pageType);
  setClarityTag('primary_cta_visible', primaryCtaVisible ? 'yes' : 'no');
  setClarityTag('cta_count_on_page', ctaCount.toString());
}

/**
 * Tag session with traffic source for attribution
 */
export function tagClaritySessionWithTrafficSource(
  source: string,
  medium?: string,
  campaign?: string
): void {
  if (!isClarityInitialized) return;

  setClarityTag('traffic_source', source);
  if (medium) setClarityTag('traffic_medium', medium);
  if (campaign) setClarityTag('traffic_campaign', campaign);
}

// ============================================================================
// Heatmap & Session Recording Priorities
// ============================================================================

/**
 * Prioritize session recording when important CTA interaction occurs
 * Useful for understanding why users didn't convert after CTA engagement
 */
export function prioritizeSessionForCTAAnalysis(reason: string): void {
  if (!isClarityInitialized) return;
  upgradeClaritySession(`cta_${reason}`);
}

/**
 * Mark session as high-value if user completes important action
 */
export function markSessionAsHighValue(reason: string): void {
  if (!isClarityInitialized) return;
  upgradeClaritySession(`high_value_${reason}`);
}
```

---

## Tracked Component Wrappers

### Create `src/components/ui/TrackedButton.tsx`

```typescript
import * as React from 'react';
import { Button, ButtonProps } from '@/components/ui/button';
import { trackCTAClick, type CTAType } from '@/lib/analytics';

export interface TrackedButtonProps extends Omit<ButtonProps, 'children'> {
  /** Display text for button */
  children: React.ReactNode;
  /** Name for tracking (e.g., 'Get Started', 'View Services') */
  trackingLabel: string;
  /** Type of CTA for categorization */
  ctaType?: CTAType;
  /** Page section where button appears */
  pageSection?: string;
  /** Additional metadata to track */
  trackingMetadata?: Record<string, unknown>;
  /** Optional callback in addition to tracking */
  onTrackedClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

/**
 * Button component with automatic click tracking
 * Wraps the standard Button and adds GA4 + Clarity tracking
 */
export const TrackedButton = React.forwardRef<
  HTMLButtonElement,
  TrackedButtonProps
>(
  (
    {
      trackingLabel,
      ctaType = 'secondary',
      pageSection = 'unknown',
      trackingMetadata,
      onClick,
      onTrackedClick,
      children,
      ...props
    },
    ref
  ) => {
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      // Track the click
      trackCTAClick(trackingLabel, ctaType, pageSection, {
        button_text: String(children),
        ...trackingMetadata,
      });

      // Call optional additional callback
      onTrackedClick?.(e);

      // Call original onClick if provided
      onClick?.(e);
    };

    return (
      <Button ref={ref} onClick={handleClick} {...props}>
        {children}
      </Button>
    );
  }
);

TrackedButton.displayName = 'TrackedButton';

export default TrackedButton;
```

### Create `src/components/ui/TrackedLink.tsx`

```typescript
import React from 'react';
import { trackInternalLinkClick } from '@/lib/analytics';

export interface TrackedLinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  /** Link text/children */
  children: React.ReactNode;
  /** URL to navigate to */
  href: string;
  /** Display name for tracking */
  trackingLabel?: string;
  /** Category for grouping related links */
  linkCategory?: string;
  /** Whether this is an external link */
  isExternal?: boolean;
  /** Additional click handler */
  onTrackedClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

/**
 * Link component with automatic click tracking
 * Tracks both internal and external link clicks
 */
export const TrackedLink = React.forwardRef<
  HTMLAnchorElement,
  TrackedLinkProps
>(
  (
    {
      href,
      trackingLabel,
      linkCategory = 'internal',
      isExternal = false,
      onClick,
      onTrackedClick,
      children,
      ...props
    },
    ref
  ) => {
    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
      const label = trackingLabel || String(children);

      if (isExternal) {
        // External link - use GA4's automatic tracking
        // Optionally enhance with custom metadata
      } else {
        // Internal link - track manually
        trackInternalLinkClick(href, label, linkCategory);
      }

      // Call optional callback
      onTrackedClick?.(e);

      // Call original onClick if provided
      onClick?.(e);
    };

    return (
      <a ref={ref} href={href} onClick={handleClick} {...props}>
        {children}
      </a>
    );
  }
);

TrackedLink.displayName = 'TrackedLink';

export default TrackedLink;
```

### Create `src/components/ui/TrackedForm.tsx`

```typescript
import React, { useCallback } from 'react';
import { trackFormInteraction, trackFormSubmission } from '@/lib/analytics';

export interface TrackedFormProps
  extends Omit<React.FormHTMLAttributes<HTMLFormElement>, 'onSubmit'> {
  /** Name/ID for form tracking */
  formName: string;
  /** Handler called after tracking */
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  /** Track field interactions (focus, blur) */
  trackFieldInteractions?: boolean;
}

/**
 * Form wrapper component that tracks form interactions
 * Automatically tracks form submissions and optionally field-level interactions
 */
export const TrackedForm = React.forwardRef<
  HTMLFormElement,
  TrackedFormProps
>(
  (
    { formName, onSubmit, trackFieldInteractions = true, children, ...props },
    ref
  ) => {
    const handleSubmit = useCallback(
      (e: React.FormEvent<HTMLFormElement>) => {
        // Track form submission
        trackFormSubmission(formName, {
          timestamp: new Date().toISOString(),
        });

        // Call provided handler
        onSubmit(e);
      },
      [formName, onSubmit]
    );

    // Only wrap children with tracking if tracking field interactions is enabled
    const wrappedChildren = trackFieldInteractions
      ? wrapFormFields(children, formName)
      : children;

    return (
      <form ref={ref} onSubmit={handleSubmit} {...props}>
        {wrappedChildren}
      </form>
    );
  }
);

TrackedForm.displayName = 'TrackedForm';

/**
 * Helper to wrap form inputs with focus/blur tracking
 */
function wrapFormFields(
  children: React.ReactNode,
  formName: string
): React.ReactNode {
  return React.Children.map(children, (child) => {
    if (!React.isValidElement(child)) return child;

    if (
      child.type === 'input' ||
      child.type === 'textarea' ||
      child.type === 'select'
    ) {
      const fieldName = child.props.name || 'unknown';

      return React.cloneElement(child, {
        onFocus: (e: React.FocusEvent<HTMLInputElement>) => {
          trackFormInteraction(formName, fieldName, 'focus');
          child.props.onFocus?.(e);
        },
        onBlur: (e: React.FocusEvent<HTMLInputElement>) => {
          trackFormInteraction(formName, fieldName, 'blur');
          child.props.onBlur?.(e);
        },
        onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
          trackFormInteraction(formName, fieldName, 'change');
          child.props.onChange?.(e);
        },
      });
    }

    return child;
  });
}

export default TrackedForm;
```

---

## Integration Points

### 1. Hero Section Example

```typescript
// In components/Hero.tsx or similar
import { TrackedButton } from '@/components/ui/TrackedButton';

export function Hero() {
  return (
    <section className="hero">
      <h1>Welcome to Nexo</h1>
      <p>Professional digital solutions</p>

      <TrackedButton
        trackingLabel="Get Started"
        ctaType="primary"
        pageSection="hero"
        trackingMetadata={{ context: 'main_cta' }}
        onClick={() => {
          // Navigate to services or contact
        }}
      >
        Get Started
      </TrackedButton>

      <TrackedButton
        trackingLabel="Learn More"
        ctaType="secondary"
        pageSection="hero"
        variant="outline"
      >
        Learn More
      </TrackedButton>
    </section>
  );
}
```

### 2. Service Card Example

```typescript
// In components/ServiceCard.tsx or similar
import { TrackedButton } from '@/components/ui/TrackedButton';
import { TrackedLink } from '@/components/ui/TrackedLink';

export function ServiceCard({ service }) {
  return (
    <div className="service-card">
      <h3>{service.name}</h3>
      <p>{service.description}</p>

      <TrackedLink
        href={`/services/${service.slug}`}
        trackingLabel={`View ${service.name}`}
        linkCategory="service_card"
        pageSection="services"
      >
        View Details
      </TrackedLink>

      <TrackedButton
        trackingLabel={`Request ${service.name}`}
        ctaType="primary"
        pageSection="service_card"
        trackingMetadata={{ service_id: service.id }}
      >
        Request Quote
      </TrackedButton>
    </div>
  );
}
```

### 3. Contact Form Example

```typescript
// In components/ContactForm.tsx or similar
import { TrackedForm } from '@/components/ui/TrackedForm';
import { TrackedButton } from '@/components/ui/TrackedButton';
import { getTrackingData } from '@/utils/formTracking';

export function ContactForm() {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const trackingData = getTrackingData();

    // Combine form data with tracking context
    const payload = {
      ...Object.fromEntries(formData),
      ...trackingData,
    };

    // Send to backend
    await submitForm(payload);
  };

  return (
    <TrackedForm formName="contact_form" onSubmit={handleSubmit}>
      <input
        type="text"
        name="name"
        placeholder="Your Name"
        required
      />

      <input
        type="email"
        name="email"
        placeholder="Your Email"
        required
      />

      <textarea
        name="message"
        placeholder="Your Message"
        required
      />

      <TrackedButton
        trackingLabel="Submit Contact Form"
        ctaType="primary"
        pageSection="contact_form"
        type="submit"
      >
        Send Message
      </TrackedButton>
    </TrackedForm>
  );
}
```

### 4. Footer Navigation Example

```typescript
// In components/Footer.tsx
import { TrackedLink } from '@/components/ui/TrackedLink';

export function Footer() {
  return (
    <footer>
      <nav>
        <TrackedLink
          href="/services"
          trackingLabel="Services"
          linkCategory="footer_navigation"
          pageSection="footer"
        >
          Services
        </TrackedLink>

        <TrackedLink
          href="/portfolio"
          trackingLabel="Portfolio"
          linkCategory="footer_navigation"
          pageSection="footer"
        >
          Portfolio
        </TrackedLink>

        <TrackedLink
          href="/blog"
          trackingLabel="Blog"
          linkCategory="footer_navigation"
          pageSection="footer"
        >
          Blog
        </TrackedLink>

        <TrackedLink
          href="/contact"
          trackingLabel="Contact"
          linkCategory="footer_navigation"
          pageSection="footer"
        >
          Contact
        </TrackedLink>
      </nav>
    </footer>
  );
}
```

---

## Setup Checklist

### Phase 1: Analytics Enhancement

- [ ] Extend `src/lib/analytics.ts` with click tracking functions
- [ ] Create `src/components/ui/TrackedButton.tsx`
- [ ] Create `src/components/ui/TrackedLink.tsx`
- [ ] Create `src/components/ui/TrackedForm.tsx`
- [ ] Test in development with console logs
- [ ] Verify TypeScript compilation passes

### Phase 2: Component Integration

- [ ] Update Hero section to use `TrackedButton`
- [ ] Update Service cards to use `TrackedButton` and `TrackedLink`
- [ ] Update Contact form to use `TrackedForm`
- [ ] Update Footer links to use `TrackedLink`
- [ ] Update Blog section CTAs
- [ ] Update Navbar CTAs

### Phase 3: GA4 Configuration

- [ ] Log into GA4 admin console
- [ ] Create custom dimensions for: `cta_type`, `page_section`, `element_type`
- [ ] Set up conversion goals for: Form submission, Service CTA click, Blog CTA click
- [ ] Enable DebugView in GA4
- [ ] Create test events in GA4 DebugView

### Phase 4: Google Tag Manager Setup

- [ ] Create GTM container for click tracking triggers
- [ ] Set up "Click - Just Links" trigger
- [ ] Enable click variables: Click URL, Click ID, Click Text, Click Classes
- [ ] Create GA4 event tag for internal link clicks
- [ ] Test in GTM Preview mode

### Phase 5: Microsoft Clarity Enhancement

- [ ] Log into Clarity dashboard
- [ ] Create session tags for page type, traffic source, CTA count
- [ ] Review current heatmaps for low-engagement areas
- [ ] Set up alerts for unusual click patterns
- [ ] Configure session recording priorities

### Phase 6: Testing & Validation

- [ ] Open GA4 DebugView
- [ ] Click buttons and verify events appear in DebugView
- [ ] Check Clarity dashboard for event tracking
- [ ] Verify heatmaps are recording clicks
- [ ] Test on mobile devices
- [ ] Review session recordings in Clarity

### Phase 7: Launch & Monitoring

- [ ] Deploy to production
- [ ] Monitor GA4 events for 24-48 hours
- [ ] Check for implementation errors in GA4
- [ ] Review initial heatmap data
- [ ] Set up automated alerts in GA4

---

## Testing & Validation

### Manual Testing Checklist

```
DESKTOP TESTING:
- [ ] Click hero CTA - verify GA4 event
- [ ] Click service card button - verify with tracking metadata
- [ ] Fill contact form - verify field interactions tracked
- [ ] Submit contact form - verify form_submit event
- [ ] Click footer link - verify internal link click tracked
- [ ] Check Clarity dashboard - session should show all events

MOBILE TESTING (375px):
- [ ] Click hero CTA - verify click registers
- [ ] Tap service card button
- [ ] Check heatmap on mobile view
- [ ] Verify button is tappable (touch target 44x44px)

GA4 DEBUG VIEW:
- [ ] Navigate to: Admin > Realtime > DebugView
- [ ] Perform actions
- [ ] Verify events appear with correct parameters
- [ ] Check parameter values match expectations

CLARITY DASHBOARD:
- [ ] View heatmaps - should show click concentrations
- [ ] Play session recordings - should show click events
- [ ] Check event list - should include all tracked events
- [ ] Review session tags - should match page context
```

### Debugging Common Issues

```typescript
// If events not appearing in GA4:
console.log('GA4 Initialized:', isGAInitialized);
console.log('Window gtag:', typeof window.gtag);

// If Clarity not recording:
console.log('Clarity Initialized:', isClarityInitialized);

// Manual event fire for testing:
trackCTAClick('Test Button', 'primary', 'test_section');

// Check data layer:
console.log('Data Layer:', window.dataLayer);
```

### GA4 DebugView Expected Format

Each tracked event should appear in DebugView with:
```
Event Name: element_click
Parameters:
  - element_id: [snake_case_element_name]
  - element_name: [Display Name]
  - element_type: button|link|file|form|custom
  - cta_type: primary|secondary|tertiary|navigation|footer
  - page_section: hero|services|footer|etc
  - page_location: /pathname
  - timestamp: 2026-01-07T...
```

---

## Performance Considerations

### Tracking Overhead
- Click tracking adds minimal overhead (< 1ms per click)
- All tracking is asynchronous and non-blocking
- Uses `transport_type: 'beacon'` for reliability

### Data Layer Size
- Keep `window.dataLayer` arrays under control
- GA4 automatically manages size
- Each event is ~1-2KB of data

### Clarity Session Recordings
- Limited to ~500MB per project (free tier)
- Prioritize high-value sessions only
- Regularly review and archive old recordings

---

## Next Steps

1. **Week 1**: Implement analytics module and components
2. **Week 2**: Integrate tracked components into existing pages
3. **Week 3**: Configure GA4 custom dimensions and goals
4. **Week 4**: Set up GTM triggers and test
5. **Week 5**: Deploy to production with monitoring
6. **Week 6+**: Analyze data and optimize based on insights

---

**Last Updated**: January 7, 2026
**Status**: Ready for Implementation
