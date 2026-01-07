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

    // Load the gtag.js script
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA4_MEASUREMENT_ID}`;
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
 * Track CTA button clicks
 */
export function trackCTAClick(ctaName: string, location?: string): void {
  trackEvent('cta_click', {
    cta_name: ctaName,
    cta_location: location,
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
// Unified Initialization
// ============================================================================

/**
 * Initialize all analytics services
 * Call this once at app startup (in main.tsx)
 */
export function initAnalytics(): void {
  initGA();
  initClarity();
}

/**
 * Check if analytics is initialized
 */
export function isAnalyticsReady(): boolean {
  return isGAInitialized || isClarityInitialized;
}
