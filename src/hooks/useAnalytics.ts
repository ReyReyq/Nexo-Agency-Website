/**
 * useAnalytics Hook
 *
 * Tracks page views on route changes for Single Page Applications.
 * Uses React Router's useLocation to detect navigation.
 *
 * Usage:
 * - Wrap your routes with a component that calls this hook
 * - Page views are automatically tracked on route changes
 */

import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { trackPageView, setClarityTag } from '@/lib/analytics';

// Page title mappings for Hebrew pages
const PAGE_TITLES: Record<string, string> = {
  '/': 'דף הבית | NEXO',
  '/about': 'אודות | NEXO',
  '/services': 'שירותים | NEXO',
  '/portfolio': 'תיק עבודות | NEXO',
  '/blog': 'בלוג | NEXO',
  '/contact': 'צור קשר | NEXO',
  '/privacy': 'מדיניות פרטיות | NEXO',
  '/terms': 'תנאי שימוש | NEXO',
};

/**
 * Get page title from path
 */
function getPageTitle(pathname: string): string {
  // Check exact match first
  if (PAGE_TITLES[pathname]) {
    return PAGE_TITLES[pathname];
  }

  // Check for dynamic routes
  if (pathname.startsWith('/services/')) {
    return 'שירות | NEXO';
  }
  if (pathname.startsWith('/portfolio/')) {
    return 'פרויקט | NEXO';
  }
  if (pathname.startsWith('/blog/')) {
    return 'מאמר | NEXO';
  }

  // Default to document title
  return document.title;
}

/**
 * Hook to track page views on route changes
 * Must be used inside a Router component
 */
export function useAnalytics(): void {
  const location = useLocation();
  const isFirstRender = useRef(true);

  useEffect(() => {
    const fullPath = location.pathname + location.search;
    const pageTitle = getPageTitle(location.pathname);

    // Track page view
    trackPageView(fullPath, pageTitle);

    // Set Clarity tags for page type
    const pageType = getPageType(location.pathname);
    setClarityTag('page_type', pageType);

    // Log in development
    if (import.meta.env.DEV) {
      console.log('[Analytics] Page view:', {
        path: fullPath,
        title: pageTitle,
        type: pageType,
        isFirstRender: isFirstRender.current,
      });
    }

    // Mark first render complete
    if (isFirstRender.current) {
      isFirstRender.current = false;
    }
  }, [location.pathname, location.search]);
}

/**
 * Get page type for analytics segmentation
 */
function getPageType(pathname: string): string {
  if (pathname === '/') return 'home';
  if (pathname === '/about') return 'about';
  if (pathname === '/contact') return 'contact';
  if (pathname === '/portfolio') return 'portfolio';
  if (pathname.startsWith('/portfolio/')) return 'case_study';
  if (pathname === '/services') return 'services';
  if (pathname.startsWith('/services/')) return 'service_detail';
  if (pathname === '/blog') return 'blog';
  if (pathname.startsWith('/blog/')) return 'blog_article';
  if (pathname === '/privacy' || pathname === '/terms') return 'legal';
  return 'other';
}

export default useAnalytics;
