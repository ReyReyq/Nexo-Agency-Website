/**
 * Analytics Integration - Google Analytics 4 + Microsoft Clarity
 *
 * This module provides unified analytics tracking for:
 * - Google Analytics 4 with cross-domain tracking (nexo-agency.co.il & nexoagency.org)
 * - Microsoft Clarity for session recordings and heatmaps
 *
 * Cross-domain tracking allows tracking users across both domains as a single session.
 * Configure both domains in GA4 Admin > Data Streams > Configure your domains
 */

import Clarity from '@microsoft/clarity';

// ============================================================================
// Configuration
// ============================================================================

// GA4 Configuration - Using single property for both domains
// Cross-domain tracking configured via linker settings below
const GA4_MEASUREMENT_ID = 'G-CL4Y6SFBMZ';

// Domains for cross-domain tracking
const CROSS_DOMAIN_DOMAINS = ['nexo-agency.co.il', 'nexoagency.org'];

// Microsoft Clarity Project ID
const CLARITY_PROJECT_ID = 'uxu2vm6wqq';

// ============================================================================
// Type Definitions
// ============================================================================

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}

type GtagCommand = 'config' | 'event' | 'set' | 'js' | 'consent';

// ============================================================================
// State Management
// ============================================================================

let isGAInitialized = false;
let isClarityInitialized = false;

// ============================================================================
// Google Analytics 4
// ============================================================================

/**
 * Initialize Google Analytics 4 with cross-domain tracking
 * Should be called once at app startup
 */
export function initGA(): boolean {
  // Prevent double initialization (important for React 18 StrictMode)
  if (isGAInitialized) {
    return true;
  }

  // Only initialize in production
  if (import.meta.env.DEV) {
    console.log('[Analytics] GA4 skipped in development mode');
    return false;
  }

  try {
    // Initialize dataLayer
    window.dataLayer = window.dataLayer || [];

    // Define gtag function
    window.gtag = function gtag(...args: unknown[]) {
      window.dataLayer.push(args);
    };

    // Set linker for cross-domain tracking BEFORE config
    // This ensures users are tracked across both .co.il and .org domains
    window.gtag('set', 'linker', {
      domains: CROSS_DOMAIN_DOMAINS,
      accept_incoming: true,
      decorate_forms: true, // Important for contact forms
    });

    // Initialize with timestamp
    window.gtag('js', new Date());

    // Configure the GA4 property
    window.gtag('config', GA4_MEASUREMENT_ID, {
      send_page_view: false, // We'll send page views manually for SPA
      transport_type: 'beacon', // More reliable tracking
    });

    // Load the gtag.js script with low priority (non-critical third-party)
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA4_MEASUREMENT_ID}`;
    // Mark as low priority to not compete with critical resources
    // Note: fetchpriority on scripts has limited browser support but is a progressive enhancement
    script.setAttribute('fetchpriority', 'low');
    document.head.appendChild(script);

    isGAInitialized = true;
    console.log('[Analytics] GA4 initialized with cross-domain tracking');
    return true;
  } catch (error) {
    console.error('[Analytics] Failed to initialize GA4:', error);
    return false;
  }
}

/**
 * Track page view (for SPA navigation)
 * Call this on route changes
 */
export function trackPageView(path: string, title?: string): void {
  if (!isGAInitialized || !window.gtag) return;

  window.gtag('event', 'page_view', {
    page_path: path,
    page_title: title || document.title,
    page_location: window.location.href,
  });

  // Also track in Clarity if available
  if (isClarityInitialized) {
    Clarity.setTag('page_path', path);
  }
}

/**
 * Track custom events
 * @param eventName - Name of the event (e.g., 'form_submit', 'cta_click')
 * @param params - Optional event parameters
 */
export function trackEvent(
  eventName: string,
  params?: Record<string, unknown>
): void {
  if (!isGAInitialized || !window.gtag) return;

  window.gtag('event', eventName, params);

  // Also track important events in Clarity
  if (isClarityInitialized) {
    Clarity.event(eventName);
  }
}

/**
 * Track form submissions with detailed data
 */
export function trackFormSubmission(
  formName: string,
  formData?: Record<string, unknown>
): void {
  trackEvent('form_submit', {
    form_name: formName,
    ...formData,
  });

  // Upgrade Clarity session for form submissions (higher priority recording)
  if (isClarityInitialized) {
    Clarity.upgrade(`form_${formName}`);
  }
}

/**
 * Track CTA button clicks (basic)
 */
export function trackCTAClick(ctaName: string, location?: string): void {
  trackEvent('cta_click', {
    cta_name: ctaName,
    cta_location: location,
  });
}

/**
 * Track CTA button clicks with enhanced parameters
 * Includes page path, CTA text, and Clarity tagging
 */
export function trackCTAClickEnhanced(
  ctaName: string,
  ctaLocation: string,
  ctaText: string
): void {
  trackEvent('cta_click', {
    cta_name: ctaName,
    cta_location: ctaLocation,
    cta_text: ctaText,
    page_path: window.location.pathname,
  });

  // Tag in Clarity for session correlation
  if (isClarityInitialized) {
    Clarity.setTag('cta_clicked', ctaName);
  }
}

// ============================================================================
// Form Funnel Tracking
// ============================================================================

/**
 * Track form start - fires when user first focuses on a form field
 */
export function trackFormStart(formName: string, formLocation: string): void {
  trackEvent('form_start', {
    form_name: formName,
    form_location: formLocation,
    page_path: window.location.pathname,
  });

  if (isClarityInitialized) {
    Clarity.setTag('form_started', formName);
  }
}

/**
 * Track form step completion in multi-step forms
 */
export function trackFormStepComplete(
  formName: string,
  stepNumber: number,
  stepName: string,
  fieldsCompleted?: number
): void {
  trackEvent('form_step_complete', {
    form_name: formName,
    step_number: stepNumber,
    step_name: stepName,
    fields_completed: fieldsCompleted,
    page_path: window.location.pathname,
  });
}

/**
 * Track individual form field completion
 */
export function trackFormFieldComplete(
  formName: string,
  fieldName: string,
  stepNumber: number
): void {
  trackEvent('form_field_complete', {
    form_name: formName,
    field_name: fieldName,
    step_number: stepNumber,
  });
}

/**
 * Track form abandonment - fires when user leaves without submitting
 */
export function trackFormAbandon(
  formName: string,
  lastStep: number,
  lastField: string,
  timeSpentMs: number
): void {
  trackEvent('form_abandon', {
    form_name: formName,
    last_step: lastStep,
    last_field: lastField,
    time_spent_seconds: Math.round(timeSpentMs / 1000),
    page_path: window.location.pathname,
  });

  if (isClarityInitialized) {
    Clarity.setTag('form_abandoned', 'true');
    Clarity.setTag('abandon_step', String(lastStep));
  }
}

/**
 * Track lead generation - GA4 recommended event
 * Use this for high-value form submissions
 */
export function trackGenerateLead(
  formName: string,
  leadId?: string,
  budgetSelected?: string,
  sourceSelected?: string,
  estimatedValue?: number
): void {
  trackEvent('generate_lead', {
    form_name: formName,
    lead_id: leadId || `lead_${Date.now()}`,
    budget_selected: budgetSelected,
    source_selected: sourceSelected,
    value: estimatedValue || 500, // Default estimated lead value in ILS
    currency: 'ILS',
    page_path: window.location.pathname,
  });

  if (isClarityInitialized) {
    Clarity.setTag('conversion', 'lead');
    Clarity.setTag('form_submitted', formName);
    if (budgetSelected) {
      Clarity.setTag('budget_selected', budgetSelected);
    }
    Clarity.upgrade('form_conversion');
  }
}

// ============================================================================
// Navigation Tracking
// ============================================================================

/**
 * Track navigation link clicks
 */
export function trackNavigationClick(
  linkText: string,
  linkUrl: string,
  navType: 'main' | 'mobile' | 'footer'
): void {
  trackEvent('navigation_click', {
    link_text: linkText,
    link_url: linkUrl,
    nav_type: navType,
    page_path: window.location.pathname,
  });
}

/**
 * Track menu toggle (hamburger menu open/close)
 */
export function trackMenuToggle(action: 'open' | 'close'): void {
  trackEvent('menu_toggle', {
    action,
    device_type: window.innerWidth < 768 ? 'mobile' : 'desktop',
  });
}

/**
 * Track phone number clicks (tel: links)
 */
export function trackPhoneClick(phoneNumber: string): void {
  trackEvent('phone_click', {
    phone_number: phoneNumber,
    page_path: window.location.pathname,
  });

  if (isClarityInitialized) {
    Clarity.setTag('phone_clicked', 'true');
    Clarity.upgrade('phone_contact');
  }
}

/**
 * Track email clicks (mailto: links)
 */
export function trackEmailClick(emailAddress: string): void {
  trackEvent('email_click', {
    email_address: emailAddress,
    page_path: window.location.pathname,
  });

  if (isClarityInitialized) {
    Clarity.setTag('email_clicked', 'true');
  }
}

/**
 * Track social media link clicks
 */
export function trackSocialClick(platform: string): void {
  trackEvent('social_click', {
    platform,
    page_path: window.location.pathname,
  });
}

// ============================================================================
// Engagement Tracking
// ============================================================================

/**
 * Track scroll depth milestones
 */
export function trackScrollDepth(
  depth: 25 | 50 | 75 | 100,
  pageType: string
): void {
  trackEvent(`scroll_${depth}`, {
    page_path: window.location.pathname,
    page_type: pageType,
    scroll_depth: depth,
  });

  if (isClarityInitialized) {
    Clarity.setTag('scroll_milestone', String(depth));
  }
}

/**
 * Track FAQ tab clicks
 */
export function trackFAQTabClick(tabName: string, tabIndex: number): void {
  trackEvent('faq_tab_click', {
    tab_name: tabName,
    tab_index: tabIndex,
    page_path: window.location.pathname,
  });
}

/**
 * Track FAQ accordion open
 */
export function trackFAQAccordionOpen(
  questionText: string,
  tabName: string,
  accordionIndex: number
): void {
  trackEvent('faq_accordion_open', {
    question_text: questionText.substring(0, 100), // Truncate for GA4 limits
    tab_name: tabName,
    accordion_index: accordionIndex,
    page_path: window.location.pathname,
  });
}

/**
 * Track carousel navigation
 */
export function trackCarouselNavigate(
  carouselName: string,
  direction: 'next' | 'prev',
  slideIndex: number
): void {
  trackEvent('carousel_navigate', {
    carousel_name: carouselName,
    direction,
    slide_index: slideIndex,
    page_path: window.location.pathname,
  });
}

/**
 * Track portfolio card clicks
 */
export function trackPortfolioCardClick(
  projectName: string,
  projectSlug: string
): void {
  trackEvent('portfolio_card_click', {
    project_name: projectName,
    project_slug: projectSlug,
    page_path: window.location.pathname,
  });
}

// ============================================================================
// Service Page Tracking
// ============================================================================

/**
 * Track service page views
 */
export function trackServiceView(
  serviceName: string,
  serviceCategory: string
): void {
  trackEvent('service_view', {
    service_name: serviceName,
    service_category: serviceCategory,
    page_path: window.location.pathname,
  });

  if (isClarityInitialized) {
    Clarity.setTag('service_viewed', serviceCategory);
  }
}

/**
 * Track service page CTA clicks
 */
export function trackServiceCTAClick(
  serviceName: string,
  ctaLocation: string
): void {
  trackEvent('service_cta_click', {
    service_name: serviceName,
    cta_location: ctaLocation,
    page_path: window.location.pathname,
  });
}

/**
 * Track related service clicks
 */
export function trackRelatedServiceClick(
  fromService: string,
  toService: string
): void {
  trackEvent('related_service_click', {
    from_service: fromService,
    to_service: toService,
    page_path: window.location.pathname,
  });
}

/**
 * Track outbound links
 */
export function trackOutboundLink(url: string): void {
  trackEvent('click', {
    event_category: 'outbound',
    event_label: url,
    transport_type: 'beacon',
  });
}

/**
 * Set user properties for segmentation
 */
export function setUserProperties(properties: Record<string, unknown>): void {
  if (!isGAInitialized || !window.gtag) return;

  window.gtag('set', 'user_properties', properties);
}

// ============================================================================
// Microsoft Clarity
// ============================================================================

/**
 * Initialize Microsoft Clarity
 * Should be called once at app startup
 */
export function initClarity(): boolean {
  // Prevent double initialization
  if (isClarityInitialized) {
    return true;
  }

  // Only initialize in production
  if (import.meta.env.DEV) {
    console.log('[Analytics] Clarity skipped in development mode');
    return false;
  }

  try {
    Clarity.init(CLARITY_PROJECT_ID);
    isClarityInitialized = true;
    console.log('[Analytics] Microsoft Clarity initialized');
    return true;
  } catch (error) {
    console.error('[Analytics] Failed to initialize Clarity:', error);
    return false;
  }
}

/**
 * Identify user in Clarity (for logged-in users)
 * @param userId - Unique user identifier
 * @param sessionId - Optional session ID
 * @param pageId - Optional page ID
 * @param friendlyName - Optional display name
 */
export function identifyUser(
  userId: string,
  sessionId?: string,
  pageId?: string,
  friendlyName?: string
): void {
  if (!isClarityInitialized) return;
  Clarity.identify(userId, sessionId, pageId, friendlyName);
}

/**
 * Set custom tags in Clarity for filtering
 */
export function setClarityTag(key: string, value: string): void {
  if (!isClarityInitialized) return;
  Clarity.setTag(key, value);
}

/**
 * Upgrade Clarity session priority (for important interactions)
 */
export function upgradeClaritySession(reason: string): void {
  if (!isClarityInitialized) return;
  Clarity.upgrade(reason);
}

/**
 * Grant cookie consent for Clarity (GDPR compliance)
 * Call this after user grants consent
 */
export function grantClarityConsent(): void {
  if (!isClarityInitialized) return;
  Clarity.consent();
}

// ============================================================================
// Web Vitals Tracking
// ============================================================================

/**
 * Web Vitals tracking - industry standard for Core Web Vitals monitoring
 * Tracks: LCP (Largest Contentful Paint), CLS (Cumulative Layout Shift),
 * INP (Interaction to Next Paint), FCP (First Contentful Paint), TTFB (Time to First Byte)
 *
 * Dynamically imports web-vitals to avoid blocking initial page load
 */
export function initWebVitalsTracking(): void {
  import('web-vitals').then(({ onCLS, onINP, onLCP, onFCP, onTTFB }) => {
    const sendToAnalytics = (metric: { name: string; value: number; id: string }) => {
      // Send to Google Analytics 4
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', metric.name, {
          event_category: 'Web Vitals',
          event_label: metric.id,
          value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
          non_interaction: true,
        });
      }

      // Log to console in development
      if (import.meta.env.DEV) {
        console.log(`[Web Vitals] ${metric.name}:`, metric.value);
      }
    };

    onCLS(sendToAnalytics);
    onINP(sendToAnalytics);
    onLCP(sendToAnalytics);
    onFCP(sendToAnalytics);
    onTTFB(sendToAnalytics);
  }).catch((error) => {
    // Silently fail if web-vitals is not available
    if (import.meta.env.DEV) {
      console.warn('[Analytics] Failed to load web-vitals:', error);
    }
  });
}

// ============================================================================
// Unified Initialization
// ============================================================================

/**
 * Initialize all analytics services
 * Call this once at app startup (in main.tsx)
 */
export function initAnalytics(): void {
  initGA();
  initClarity();
  initWebVitalsTracking();
}

/**
 * Check if analytics is initialized
 */
export function isAnalyticsReady(): boolean {
  return isGAInitialized || isClarityInitialized;
}
