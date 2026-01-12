// ============================================
// LANDING PAGE TYPE DEFINITIONS
// ============================================
// Types for SEO-optimized landing pages targeting specific industries/niches

import type { LucideIcon } from "lucide-react";

/**
 * SEO Metadata for landing pages
 * Used for meta tags, JSON-LD structured data, and Open Graph
 */
export interface LandingPageSEO {
  title: string;              // Page title (60-70 chars ideal)
  description: string;        // Meta description (150-160 chars ideal)
  keywords: string[];         // Target keywords for the page
  canonicalUrl?: string;      // Canonical URL if different from page URL
  ogImage?: string;           // Open Graph image URL
  schema: {
    type: "Service" | "LocalBusiness" | "ProfessionalService";
    serviceType: string;      // e.g., "Website Development"
    areaServed: string;       // e.g., "Israel"
    provider: {
      name: string;
      url: string;
    };
  };
}

/**
 * Hero section content
 */
export interface LandingHeroContent {
  badge?: string;             // Optional badge text above title
  title: string;              // H1 - Main headline
  subtitle: string;           // Supporting headline
  description?: string;       // Optional longer description
  primaryCTA: {
    text: string;
    href: string;
  };
  secondaryCTA?: {
    text: string;
    href: string;
  };
  trustBadge?: string;        // e.g., "50+ projects delivered"
  stats?: Array<{
    value: string;
    label: string;
  }>;
}

/**
 * Pain point item for the target audience
 */
export interface PainPoint {
  icon: string;               // Lucide icon name
  title: string;
  description: string;
}

/**
 * Pain points section content
 */
export interface LandingPainPointsContent {
  title: string;
  subtitle?: string;
  items: PainPoint[];
}

/**
 * Feature/benefit item
 */
export interface LandingFeature {
  icon: string;               // Lucide icon name
  title: string;
  description: string;
  highlight?: boolean;        // Whether to highlight this feature
}

/**
 * Features section content
 */
export interface LandingFeaturesContent {
  title: string;
  subtitle?: string;
  description?: string;
  items: LandingFeature[];
}

/**
 * Process step
 */
export interface LandingProcessStep {
  number: string;             // e.g., "01"
  title: string;
  description: string;
  icon?: string;              // Optional Lucide icon name
}

/**
 * Process section content
 */
export interface LandingProcessContent {
  title: string;
  subtitle?: string;
  steps: LandingProcessStep[];
}

/**
 * FAQ item
 */
export interface LandingFAQItem {
  question: string;
  answer: string;
}

/**
 * FAQ category with questions (for tabbed interface)
 */
export interface LandingFAQCategory {
  name: string;               // Tab name, e.g., "כללי"
  questions: LandingFAQItem[];
}

/**
 * FAQ section content
 * Supports both flat list (items) and categorized (categories) formats
 */
export interface LandingFAQContent {
  title: string;
  subtitle?: string;
  /** Flat list of FAQ items (simple accordion) */
  items?: LandingFAQItem[];
  /** Categorized FAQ items (tabbed interface like homepage) */
  categories?: LandingFAQCategory[];
}

/**
 * Testimonial item
 */
export interface LandingTestimonial {
  quote: string;
  author: string;
  role: string;               // e.g., "Managing Partner"
  company?: string;           // e.g., "Cohen & Partners Law Firm"
  image?: string;             // Author photo URL
  rating?: number;            // 1-5 star rating
}

/**
 * Testimonials section content
 */
export interface LandingTestimonialsContent {
  title: string;
  subtitle?: string;
  items: LandingTestimonial[];
}

/**
 * Portfolio marquee section content
 */
export interface LandingPortfolioContent {
  title?: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
}

/**
 * CTA section content
 */
export interface LandingCTAContent {
  title: string;
  description: string;
  primaryCTA: {
    text: string;
    href: string;
  };
  secondaryCTA?: {
    text: string;
    href: string;
  };
  features?: string[];        // Quick feature list for CTA section
}

/**
 * Complete landing page data structure
 */
export interface LandingPageData {
  // Identification
  id: string;                 // Unique identifier
  slug: string;               // URL slug, e.g., "lawyers-website"

  // SEO
  seo: LandingPageSEO;

  // Visual theming
  theme: {
    accentColor: string;      // Hex color for accents
    gradient: string;         // Tailwind gradient classes
    heroImage?: string;       // Background image for hero
  };

  // Content sections
  hero: LandingHeroContent;
  painPoints: LandingPainPointsContent;
  features: LandingFeaturesContent;
  process: LandingProcessContent;
  faq: LandingFAQContent;
  testimonials: LandingTestimonialsContent;
  cta: LandingCTAContent;

  // Optional sections
  portfolio?: LandingPortfolioContent;
  /** Related services bento grid with title, subtitle, and items */
  relatedServices?: {
    title: string;
    subtitle?: string;
    items: Array<{
      name: string;
      description: string;
      href: string;
    }>;
  };
  /** Alternative format for bento grid (same as relatedServices) */
  relatedServicesBento?: {
    title: string;
    subtitle?: string;
    items: Array<{
      name: string;
      description: string;
      href: string;
    }>;
  };
}

/**
 * Type guard for LandingPageData
 */
export function isLandingPageData(data: unknown): data is LandingPageData {
  return (
    typeof data === "object" &&
    data !== null &&
    "id" in data &&
    "slug" in data &&
    "seo" in data &&
    "hero" in data
  );
}
