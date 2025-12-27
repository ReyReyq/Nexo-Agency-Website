import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LenisProvider } from "@/lib/lenis";

// Eagerly loaded pages (home page with preloader, and small fallback page)
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// Lazy loaded pages for code splitting
const About = lazy(() => import("./pages/About"));
const Services = lazy(() => import("./pages/Services"));
const Portfolio = lazy(() => import("./pages/Portfolio"));
const Blog = lazy(() => import("./pages/Blog"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const ImagePicker = lazy(() => import("./pages/ImagePicker"));

const queryClient = new QueryClient();

// Loading fallback component for lazy-loaded routes
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="w-12 h-12 border-4 border-border border-t-primary rounded-full animate-spin" />
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <LenisProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
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
            <Route path="/portfolio" element={
              <Suspense fallback={<PageLoader />}>
                <Portfolio />
              </Suspense>
            } />
            <Route path="/blog" element={
              <Suspense fallback={<PageLoader />}>
                <Blog />
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
);

export default App;
