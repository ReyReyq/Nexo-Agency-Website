import { lazy, Suspense, memo } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LenisProvider } from "@/lib/lenis";
import ScrollToTop from "@/components/ScrollToTop";

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

// Main App component - memoized to prevent unnecessary re-renders from parent
const App = memo(() => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <LenisProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
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
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </LenisProvider>
    </TooltipProvider>
  </QueryClientProvider>
));

App.displayName = 'App';

export default App;
