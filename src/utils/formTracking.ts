/**
 * Form Tracking Utility
 * Captures page source, referrer, UTM parameters, and session data
 * for tracking where form submissions originate from
 */

export interface TrackingData {
  // Current page info
  currentPageUrl: string;
  currentPagePath: string;
  currentPageTitle: string;

  // Referrer info
  referrerUrl: string;
  referrerDomain: string;

  // Session info
  landingPageUrl: string;
  landingPagePath: string;

  // UTM parameters
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  utmTerm: string | null;
  utmContent: string | null;

  // Timestamp
  timestamp: string;
  sessionId: string;
}

const STORAGE_KEY = 'nexo_tracking_data';
const SESSION_KEY = 'nexo_session_id';

/**
 * Generate a unique session ID
 */
const generateSessionId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
};

/**
 * Get or create session ID
 */
const getSessionId = (): string => {
  if (typeof window === 'undefined') return '';

  let sessionId = sessionStorage.getItem(SESSION_KEY);
  if (!sessionId) {
    sessionId = generateSessionId();
    sessionStorage.setItem(SESSION_KEY, sessionId);
  }
  return sessionId;
};

/**
 * Parse UTM parameters from URL
 */
const parseUtmParams = (url: string): Record<string, string | null> => {
  try {
    const urlObj = new URL(url);
    return {
      utmSource: urlObj.searchParams.get('utm_source'),
      utmMedium: urlObj.searchParams.get('utm_medium'),
      utmCampaign: urlObj.searchParams.get('utm_campaign'),
      utmTerm: urlObj.searchParams.get('utm_term'),
      utmContent: urlObj.searchParams.get('utm_content'),
    };
  } catch {
    return {
      utmSource: null,
      utmMedium: null,
      utmCampaign: null,
      utmTerm: null,
      utmContent: null,
    };
  }
};

/**
 * Extract domain from URL
 */
const extractDomain = (url: string): string => {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname;
  } catch {
    return '';
  }
};

/**
 * Get page title from path (for Hebrew service pages)
 */
const getPageTitleFromPath = (path: string): string => {
  const pathMap: Record<string, string> = {
    '/': 'דף הבית',
    '/services': 'שירותים',
    '/services/web-development': 'פיתוח אתרים',
    '/services/ecommerce': 'חנויות אונליין',
    '/services/branding': 'מיתוג ועיצוב',
    '/services/digital-marketing': 'שיווק דיגיטלי',
    '/services/seo': 'קידום אתרים',
    '/services/social-media': 'רשתות חברתיות',
    '/services/ai-automation': 'AI ואוטומציה',
    '/services/app-development': 'פיתוח אפליקציות',
    '/about': 'אודות',
    '/portfolio': 'תיק עבודות',
    '/blog': 'בלוג',
    '/contact': 'צור קשר',
  };

  // Check for exact match
  if (pathMap[path]) return pathMap[path];

  // Check for partial match (sub-services, blog articles)
  if (path.startsWith('/services/')) {
    const serviceName = path.split('/').pop()?.replace(/-/g, ' ') || 'שירות';
    return `שירות: ${serviceName}`;
  }
  if (path.startsWith('/blog/')) {
    return 'מאמר בבלוג';
  }
  if (path.startsWith('/portfolio/')) {
    return 'פרויקט בתיק עבודות';
  }

  return document.title || path;
};

/**
 * Initialize tracking on page load
 * Call this once when the app loads to capture landing page and UTM params
 */
export const initTracking = (): void => {
  if (typeof window === 'undefined') return;

  const existingData = localStorage.getItem(STORAGE_KEY);

  // Only set landing page data if this is a new session
  if (!existingData || !sessionStorage.getItem(SESSION_KEY)) {
    const currentUrl = window.location.href;
    const utmParams = parseUtmParams(currentUrl);

    const trackingData = {
      landingPageUrl: currentUrl,
      landingPagePath: window.location.pathname,
      ...utmParams,
      sessionId: getSessionId(),
      timestamp: new Date().toISOString(),
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(trackingData));
  }
};

/**
 * Get complete tracking data for form submission
 * Call this when the form is about to be submitted
 */
export const getTrackingData = (): TrackingData => {
  if (typeof window === 'undefined') {
    return {
      currentPageUrl: '',
      currentPagePath: '',
      currentPageTitle: '',
      referrerUrl: '',
      referrerDomain: '',
      landingPageUrl: '',
      landingPagePath: '',
      utmSource: null,
      utmMedium: null,
      utmCampaign: null,
      utmTerm: null,
      utmContent: null,
      timestamp: new Date().toISOString(),
      sessionId: '',
    };
  }

  // Get stored session data
  const storedData = localStorage.getItem(STORAGE_KEY);
  const sessionData = storedData ? JSON.parse(storedData) : {};

  // Current page info
  const currentPageUrl = window.location.href;
  const currentPagePath = window.location.pathname;
  const currentPageTitle = getPageTitleFromPath(currentPagePath);

  // Referrer info
  const referrerUrl = document.referrer || '';
  const referrerDomain = extractDomain(referrerUrl);

  // Check if referrer is external (not same domain)
  const currentDomain = window.location.hostname;
  const isExternalReferrer = referrerDomain && referrerDomain !== currentDomain;

  return {
    currentPageUrl,
    currentPagePath,
    currentPageTitle,
    referrerUrl: isExternalReferrer ? referrerUrl : sessionData.landingPageUrl || currentPageUrl,
    referrerDomain: isExternalReferrer ? referrerDomain : '',
    landingPageUrl: sessionData.landingPageUrl || currentPageUrl,
    landingPagePath: sessionData.landingPagePath || currentPagePath,
    utmSource: sessionData.utmSource || null,
    utmMedium: sessionData.utmMedium || null,
    utmCampaign: sessionData.utmCampaign || null,
    utmTerm: sessionData.utmTerm || null,
    utmContent: sessionData.utmContent || null,
    timestamp: new Date().toISOString(),
    sessionId: getSessionId(),
  };
};

/**
 * Get a human-readable summary of the traffic source
 */
export const getTrafficSourceSummary = (tracking: TrackingData): string => {
  if (tracking.utmSource) {
    return `${tracking.utmSource}${tracking.utmCampaign ? ` / ${tracking.utmCampaign}` : ''}`;
  }
  if (tracking.referrerDomain) {
    return tracking.referrerDomain;
  }
  return 'Direct / Organic';
};

/**
 * Clear tracking data (useful for testing or after form submission)
 */
export const clearTrackingData = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
  sessionStorage.removeItem(SESSION_KEY);
};
