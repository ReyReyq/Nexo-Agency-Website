import { useState, useEffect } from "react";
import GlassNavbar from "@/components/GlassNavbar";
import Hero from "@/components/Hero";
import ServicesSection from "@/components/ServicesSection";
import AboutSection from "@/components/AboutSection";
import AboutDarkSection from "@/components/AboutDarkSection";
import ProcessSection from "@/components/ProcessSection";
import FAQSection from "@/components/FAQSection";
import PortfolioSection from "@/components/PortfolioSection";
import BlogPreviewSection from "@/components/BlogPreviewSection";
import Contact from "@/components/Contact";
import Preloader from "@/components/Preloader";

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
            <div className="relative z-10 bg-background">
              <AboutDarkSection />
              <ProcessSection />
              <PortfolioSection />
              <FAQSection />
              <BlogPreviewSection />
              <Contact />
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default Index;
