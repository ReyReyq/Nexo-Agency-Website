import { useState, lazy, Suspense, useCallback, memo } from "react";
import { Helmet } from "react-helmet-async";
import GlassNavbar from "@/components/GlassNavbar";
import Hero from "@/components/Hero";
import ServicesSection from "@/components/ServicesSection";
import AboutSection from "@/components/AboutSection";
import Preloader from "@/components/Preloader";
import Footer from "@/components/Footer";
import ErrorBoundary, { SectionErrorFallback } from "@/components/ErrorBoundary";

// Lazy load sections below the fold for better initial bundle size
// These sections are not immediately visible, so we can defer their loading
const AboutDarkSection = lazy(() => import("@/components/AboutDarkSection"));
const ProcessSection = lazy(() => import("@/components/ProcessSection"));
const FAQSection = lazy(() => import("@/components/FAQSection"));
const PortfolioSection = lazy(() => import("@/components/PortfolioSection"));
const BlogPreviewSection = lazy(() => import("@/components/BlogPreviewSection"));
const Contact = lazy(() => import("@/components/Contact"));

// Memoized loading placeholder for lazy-loaded sections - prevents re-creation on parent re-renders
const SectionLoader = memo(() => (
  <div className="min-h-[50vh] min-h-[50dvh] flex items-center justify-center bg-background">
    <div className="w-8 h-8 border-2 border-border border-t-primary rounded-full animate-spin" />
  </div>
));

SectionLoader.displayName = 'SectionLoader';

// JSON-LD Structured Data Schemas for SEO
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "נקסו - NEXO Agency",
  "alternateName": "NEXO",
  "url": "https://nexo.agency",
  "logo": "https://nexo.agency/logo.png",
  "description": "סוכנות דיגיטל מובילה בישראל - עיצוב אתרים, פיתוח, שיווק דיגיטלי ומיתוג",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "תל אביב",
    "addressCountry": "IL"
  },
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+972-53-362-2423",
    "contactType": "sales",
    "email": "sales@nexoagency.org",
    "availableLanguage": ["Hebrew", "English"]
  },
  "sameAs": [
    "https://www.instagram.com/nexo.agency",
    "https://www.facebook.com/nexoagency",
    "https://www.linkedin.com/company/nexo-agency"
  ]
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "נקסו",
  "url": "https://nexo.agency",
  "inLanguage": "he-IL",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://nexo.agency/blog?search={search_term_string}",
    "query-input": "required name=search_term_string"
  }
};

const Index = () => {
  // Check if preloader should show - only on first visit this session
  const [isLoading, setIsLoading] = useState(() => {
    const hasSeenPreloader = sessionStorage.getItem("nexo-preloader-shown");
    return !hasSeenPreloader;
  });

  // Memoized callback to prevent unnecessary re-renders of Preloader
  const handlePreloaderComplete = useCallback(() => {
    // Mark preloader as shown for this session
    sessionStorage.setItem("nexo-preloader-shown", "true");
    setIsLoading(false);
  }, []);

  return (
    <>
      <Helmet>
        <title>נקסו - סוכנות דיגיטל לעסקים | NEXO AGENCY</title>
        <meta name="description" content="סוכנות דיגיטל מובילה בישראל. עיצוב אתרים, פיתוח, שיווק דיגיטלי ומיתוג לעסקים." />
        <link rel="canonical" href="https://nexo.agency/" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="נקסו - סוכנות דיגיטל לעסקים" />
        <meta property="og:description" content="סוכנות דיגיטל מובילה בישראל. עיצוב אתרים, פיתוח, שיווק דיגיטלי ומיתוג לעסקים." />
        <meta property="og:url" content="https://nexo.agency/" />
        <meta property="og:locale" content="he_IL" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="נקסו - סוכנות דיגיטל לעסקים" />
        <meta name="twitter:description" content="סוכנות דיגיטל מובילה בישראל. עיצוב אתרים, פיתוח, שיווק דיגיטלי ומיתוג לעסקים." />
        <meta property="og:image" content="https://nexo.agency/og-image.jpg" />
        <meta name="twitter:image" content="https://nexo.agency/og-image.jpg" />
        <link rel="alternate" hreflang="he" href="https://nexo.agency/" />
        <link rel="alternate" hreflang="x-default" href="https://nexo.agency/" />
        <script type="application/ld+json">
          {JSON.stringify(organizationSchema)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(websiteSchema)}
        </script>
      </Helmet>

      {/* Preloader on top - fades out when complete (only shows once per session) */}
      {isLoading && <Preloader onComplete={handlePreloaderComplete} />}

      {/*
        Main content is ALWAYS rendered underneath the preloader.
        This ensures no flash when preloader fades out - Hero is already there.
      */}
      <div className="min-h-screen min-h-[100dvh] bg-background">
        {/* Glass Navigation with integrated scroll progress border */}
        <GlassNavbar />

        {/* Main content area */}
        <main id="main-content">
          {/* Hero section - sticky so it scrolls away naturally */}
          <div className="relative z-0">
            <div className="sticky top-0 h-screen h-[100dvh]">
              <ErrorBoundary variant="section" fallback={<SectionErrorFallback />}>
                <Hero />
              </ErrorBoundary>
            </div>

            {/* ServicesSection scrolls over the Hero */}
            <div className="relative z-10 bg-nexo-light">
              <ErrorBoundary variant="section" fallback={<SectionErrorFallback />}>
                <ServicesSection />
              </ErrorBoundary>
            </div>
          </div>

          {/* AboutSection wrapper - sticky section with content scrolling over */}
          <div className="relative z-10">
            {/* Sticky about section - stays in place while content scrolls over */}
            <div className="sticky top-0 h-screen h-[100dvh] shadow-2xl overflow-hidden bg-nexo-light">
              <ErrorBoundary variant="section" fallback={<SectionErrorFallback />}>
                <AboutSection />
              </ErrorBoundary>
            </div>

            {/* Content scrolls over the sticky AboutSection */}
            {/* Lazy-loaded sections wrapped in Suspense + ErrorBoundary for resilience */}
            <div className="relative z-10 bg-background">
              <ErrorBoundary variant="section" fallback={<SectionErrorFallback />}>
                <Suspense fallback={<SectionLoader />}>
                  <AboutDarkSection />
                </Suspense>
              </ErrorBoundary>
              <ErrorBoundary variant="section" fallback={<SectionErrorFallback />}>
                <Suspense fallback={<SectionLoader />}>
                  <ProcessSection />
                </Suspense>
              </ErrorBoundary>
              <ErrorBoundary variant="section" fallback={<SectionErrorFallback />}>
                <Suspense fallback={<SectionLoader />}>
                  <PortfolioSection />
                </Suspense>
              </ErrorBoundary>
              <ErrorBoundary variant="section" fallback={<SectionErrorFallback />}>
                <Suspense fallback={<SectionLoader />}>
                  <FAQSection />
                </Suspense>
              </ErrorBoundary>
              <ErrorBoundary variant="section" fallback={<SectionErrorFallback />}>
                <Suspense fallback={<SectionLoader />}>
                  <BlogPreviewSection />
                </Suspense>
              </ErrorBoundary>
              <ErrorBoundary variant="section" fallback={<SectionErrorFallback />}>
                <Suspense fallback={<SectionLoader />}>
                  <Contact />
                </Suspense>
              </ErrorBoundary>
              <Footer />
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default Index;
