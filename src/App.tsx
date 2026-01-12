import { lazy, Suspense, memo, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LenisProvider } from "@/lib/lenis";
import ScrollToTop from "@/components/ScrollToTop";
import ErrorBoundary from "@/components/ErrorBoundary";
import { useAnalytics } from "@/hooks/useAnalytics";

// Eagerly loaded pages (home page with preloader, and small fallback page)
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// Lazy loaded pages for code splitting
const About = lazy(() => import("./pages/About"));
const Services = lazy(() => import("./pages/Services"));
const ServiceDetail = lazy(() => import("./pages/ServiceDetail"));
const SubServiceDetail = lazy(() => import("./pages/SubServiceDetail"));
const Portfolio = lazy(() => import("./pages/Portfolio"));
const CaseStudy = lazy(() => import("./pages/CaseStudy"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogArticle = lazy(() => import("./pages/BlogArticle"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const ImagePicker = lazy(() => import("./pages/ImagePicker"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Terms = lazy(() => import("./pages/Terms"));

// Landing Pages - SEO-optimized industry-specific pages
const LawyersWebsite = lazy(() => import("./pages/lp/LawyersWebsite"));
const BusinessWebsites = lazy(() => import("./pages/lp/BusinessWebsites"));
const WebsiteBuilding = lazy(() => import("./pages/lp/WebsiteBuilding"));
const WebsiteDesign = lazy(() => import("./pages/lp/WebsiteDesign"));
const PortfolioWebsite = lazy(() => import("./pages/lp/PortfolioWebsite"));
const WebsiteBuilder = lazy(() => import("./pages/lp/WebsiteBuilder"));
const OnlineStore = lazy(() => import("./pages/lp/OnlineStore"));
const WebsiteCompany = lazy(() => import("./pages/lp/WebsiteCompany"));
const WordpressWebsite = lazy(() => import("./pages/lp/WordpressWebsite"));
const WebsiteSetup = lazy(() => import("./pages/lp/WebsiteSetup"));
const PortfolioSite = lazy(() => import("./pages/lp/PortfolioSite"));
const FreeWebsite = lazy(() => import("./pages/lp/FreeWebsite"));
const InternetWebsite = lazy(() => import("./pages/lp/InternetWebsite"));
const SalesWebsite = lazy(() => import("./pages/lp/SalesWebsite"));
const WebsiteDevelopment = lazy(() => import("./pages/lp/WebsiteDevelopment"));

// Create QueryClient outside component to prevent recreation on re-renders
// Configure with optimized defaults for performance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes - reduces unnecessary refetches
      gcTime: 1000 * 60 * 30, // 30 minutes (formerly cacheTime)
      retry: 1, // Reduce retry attempts for faster failure feedback
      refetchOnWindowFocus: false, // Prevents refetch on tab focus
    },
  },
});

// Loading fallback component for lazy-loaded routes
// Memoized to prevent unnecessary re-renders
const PageLoader = memo(() => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="w-12 h-12 border-4 border-border border-t-primary rounded-full animate-spin" />
  </div>
));

PageLoader.displayName = 'PageLoader';

// Analytics wrapper - tracks page views on route changes
// Must be inside BrowserRouter to access useLocation
const AnalyticsProvider = memo(({ children }: { children: React.ReactNode }) => {
  useAnalytics();
  return <>{children}</>;
});

AnalyticsProvider.displayName = 'AnalyticsProvider';

// Main App component - memoized to prevent unnecessary re-renders from parent
const App = memo(() => {
  // Deferred analytics loading - waits until after LCP is complete
  // Uses requestIdleCallback when available, otherwise falls back to setTimeout
  useEffect(() => {
    const loadAnalytics = () => {
      import('./lib/analytics').then(({ initAnalytics }) => {
        initAnalytics();
      });
    };

    if ('requestIdleCallback' in window) {
      requestIdleCallback(loadAnalytics, { timeout: 3000 });
    } else {
      setTimeout(loadAnalytics, 2500);
    }
  }, []);

  return (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <LenisProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AnalyticsProvider>
              <ScrollToTop />
              <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/about" element={
              <Suspense fallback={<PageLoader />}>
                <About />
              </Suspense>
            } />
            <Route path="/services" element={
              <Suspense fallback={<PageLoader />}>
                <Services />
              </Suspense>
            } />
            <Route path="/services/:parentSlug/:subSlug" element={
              <Suspense fallback={<PageLoader />}>
                <SubServiceDetail />
              </Suspense>
            } />
            <Route path="/services/:slug" element={
              <Suspense fallback={<PageLoader />}>
                <ServiceDetail />
              </Suspense>
            } />
            <Route path="/portfolio" element={
              <Suspense fallback={<PageLoader />}>
                <Portfolio />
              </Suspense>
            } />
            <Route path="/portfolio/:slug" element={
              <Suspense fallback={<PageLoader />}>
                <CaseStudy />
              </Suspense>
            } />
            <Route path="/blog" element={
              <Suspense fallback={<PageLoader />}>
                <Blog />
              </Suspense>
            } />
            <Route path="/blog/:slug" element={
              <Suspense fallback={<PageLoader />}>
                <BlogArticle />
              </Suspense>
            } />
            <Route path="/contact" element={
              <Suspense fallback={<PageLoader />}>
                <ContactPage />
              </Suspense>
            } />
            <Route path="/image-picker" element={
              <Suspense fallback={<PageLoader />}>
                <ImagePicker />
              </Suspense>
            } />
            {/* Legal Pages */}
            <Route path="/privacy" element={
              <Suspense fallback={<PageLoader />}>
                <Privacy />
              </Suspense>
            } />
            <Route path="/terms" element={
              <Suspense fallback={<PageLoader />}>
                <Terms />
              </Suspense>
            } />
            {/* Landing Pages - SEO-optimized industry pages */}
            <Route path="/lp/lawyers-website" element={
              <Suspense fallback={<PageLoader />}>
                <LawyersWebsite />
              </Suspense>
            } />
            <Route path="/lp/business-websites" element={
              <Suspense fallback={<PageLoader />}>
                <BusinessWebsites />
              </Suspense>
            } />
            <Route path="/lp/website-building" element={
              <Suspense fallback={<PageLoader />}>
                <WebsiteBuilding />
              </Suspense>
            } />
            <Route path="/lp/website-design" element={
              <Suspense fallback={<PageLoader />}>
                <WebsiteDesign />
              </Suspense>
            } />
            <Route path="/lp/portfolio-website" element={
              <Suspense fallback={<PageLoader />}>
                <PortfolioWebsite />
              </Suspense>
            } />
            <Route path="/lp/website-builder" element={
              <Suspense fallback={<PageLoader />}>
                <WebsiteBuilder />
              </Suspense>
            } />
            <Route path="/lp/online-store" element={
              <Suspense fallback={<PageLoader />}>
                <OnlineStore />
              </Suspense>
            } />
            <Route path="/lp/website-company" element={
              <Suspense fallback={<PageLoader />}>
                <WebsiteCompany />
              </Suspense>
            } />
            <Route path="/lp/wordpress-website" element={
              <Suspense fallback={<PageLoader />}>
                <WordpressWebsite />
              </Suspense>
            } />
            <Route path="/lp/website-setup" element={
              <Suspense fallback={<PageLoader />}>
                <WebsiteSetup />
              </Suspense>
            } />
            <Route path="/lp/portfolio-site" element={
              <Suspense fallback={<PageLoader />}>
                <PortfolioSite />
              </Suspense>
            } />
            <Route path="/lp/free-website" element={
              <Suspense fallback={<PageLoader />}>
                <FreeWebsite />
              </Suspense>
            } />
            <Route path="/lp/internet-website" element={
              <Suspense fallback={<PageLoader />}>
                <InternetWebsite />
              </Suspense>
            } />
            <Route path="/lp/sales-website" element={
              <Suspense fallback={<PageLoader />}>
                <SalesWebsite />
              </Suspense>
            } />
            <Route path="/lp/website-development" element={
              <Suspense fallback={<PageLoader />}>
                <WebsiteDevelopment />
              </Suspense>
            } />
            <Route path="*" element={<NotFound />} />
              </Routes>
            </AnalyticsProvider>
          </BrowserRouter>
        </LenisProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
  );
});

App.displayName = 'App';

export default App;
