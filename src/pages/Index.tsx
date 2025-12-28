import { useState, useEffect, lazy, Suspense } from "react";
import GlassNavbar from "@/components/GlassNavbar";
import Hero from "@/components/Hero";
import ServicesSection from "@/components/ServicesSection";
import AboutSection from "@/components/AboutSection";
import Preloader from "@/components/Preloader";
import Footer from "@/components/Footer";

// Lazy load sections below the fold for better initial bundle size
// These sections are not immediately visible, so we can defer their loading
const AboutDarkSection = lazy(() => import("@/components/AboutDarkSection"));
const ProcessSection = lazy(() => import("@/components/ProcessSection"));
const FAQSection = lazy(() => import("@/components/FAQSection"));
const PortfolioSection = lazy(() => import("@/components/PortfolioSection"));
const BlogPreviewSection = lazy(() => import("@/components/BlogPreviewSection"));
const Contact = lazy(() => import("@/components/Contact"));

// Minimal loading placeholder for lazy-loaded sections
const SectionLoader = () => (
  <div className="min-h-[50vh] flex items-center justify-center bg-background">
    <div className="w-8 h-8 border-2 border-border border-t-primary rounded-full animate-spin" />
  </div>
);

const Index = () => {
  // Check if preloader should show
  const [isLoading, setIsLoading] = useState(() => {
    // Check if this is a page refresh
    const navEntries = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
    const isRefresh = navEntries.length > 0 && navEntries[0].type === 'reload';

    // Show preloader on refresh OR if it hasn't been shown yet this session
    if (isRefresh) {
      return true;
    }

    const hasSeenPreloader = sessionStorage.getItem("nexo-preloader-shown");
    return !hasSeenPreloader;
  });

  const handlePreloaderComplete = () => {
    // Mark preloader as shown for this session (for internal navigation)
    sessionStorage.setItem("nexo-preloader-shown", "true");
    setIsLoading(false);
  };

  return (
    <>
      {/* Preloader on top - fades out when complete (only shows once per session) */}
      {isLoading && <Preloader onComplete={handlePreloaderComplete} />}

      {/*
        Main content is ALWAYS rendered underneath the preloader.
        This ensures no flash when preloader fades out - Hero is already there.
      */}
      <div className="min-h-screen bg-background">
        {/* Glass Navigation with integrated scroll progress border */}
        <GlassNavbar />

        {/* Main content area */}
        <main>
          {/* Hero section - sticky so it scrolls away naturally */}
          <div className="relative z-0">
            <div className="sticky top-0 h-screen">
              <Hero />
            </div>

            {/* ServicesSection scrolls over the Hero */}
            <div className="relative z-10 bg-[#FAF9F6]">
              <ServicesSection />
            </div>
          </div>

          {/* AboutSection wrapper - sticky section with content scrolling over */}
          <div className="relative z-10">
            {/* Sticky about section - stays in place while content scrolls over */}
            <div className="sticky top-0 h-screen shadow-2xl overflow-hidden bg-[#FAF9F6]">
              <AboutSection />
            </div>

            {/* Content scrolls over the sticky AboutSection */}
            {/* Lazy-loaded sections wrapped in Suspense for code splitting */}
            <div className="relative z-10 bg-background">
              <Suspense fallback={<SectionLoader />}>
                <AboutDarkSection />
              </Suspense>
              <Suspense fallback={<SectionLoader />}>
                <ProcessSection />
              </Suspense>
              <Suspense fallback={<SectionLoader />}>
                <PortfolioSection />
              </Suspense>
              <Suspense fallback={<SectionLoader />}>
                <FAQSection />
              </Suspense>
              <Suspense fallback={<SectionLoader />}>
                <BlogPreviewSection />
              </Suspense>
              <Suspense fallback={<SectionLoader />}>
                <Contact />
              </Suspense>
              <Footer />
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default Index;
