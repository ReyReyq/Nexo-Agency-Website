import { useState, lazy, Suspense, useCallback, memo } from "react";
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

// Memoized loading placeholder for lazy-loaded sections - prevents re-creation on parent re-renders
const SectionLoader = memo(() => (
  <div className="min-h-[50vh] min-h-[50dvh] flex items-center justify-center bg-background">
    <div className="w-8 h-8 border-2 border-border border-t-primary rounded-full animate-spin" />
  </div>
));

SectionLoader.displayName = 'SectionLoader';

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
        <main>
          {/* Hero section - sticky so it scrolls away naturally */}
          <div className="relative z-0">
            <div className="sticky top-0 h-screen h-[100dvh]">
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
            <div className="sticky top-0 h-screen h-[100dvh] shadow-2xl overflow-hidden bg-[#FAF9F6]">
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
