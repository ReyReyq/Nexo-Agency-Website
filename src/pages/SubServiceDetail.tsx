import { useEffect, useMemo, memo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowLeft } from "lucide-react";
import GlassNavbar from "@/components/GlassNavbar";
import Footer from "@/components/Footer";
import SteppedProcessSection from "@/components/SteppedProcessSection";
import SubServiceBlogSection from "@/components/service/SubServiceBlogSection";
import {
  SubServiceHero,
  SubServiceWhatIsThis,
  SubServiceFeatures,
  SubServiceWhyChooseUs,
  SubServiceFAQ,
  SubServiceRelated,
  SubServiceCTA,
} from "@/components/subservice";
import { getSubServiceBySlug, type SubServiceDetail as SubServiceDetailType } from "@/data/subServices";
import { getServiceBySlug, type Service } from "@/data/services";

// ============================================
// LOADING COMPONENT
// ============================================

const LoadingState = memo(() => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="w-12 h-12 border-4 border-border border-t-primary rounded-full animate-spin" />
  </div>
));

LoadingState.displayName = 'LoadingState';

// ============================================
// NOT FOUND COMPONENT
// ============================================

const NotFoundState = memo(() => (
  <div className="min-h-screen flex items-center justify-center bg-background" dir="rtl">
    <div className="text-center">
      <h1 className="text-4xl font-black text-foreground mb-4">404</h1>
      <p className="text-muted-foreground mb-8">השירות המבוקש לא נמצא</p>
      <Link
        to="/services"
        className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-white font-medium hover:opacity-90 transition-opacity"
      >
        חזרה לשירותים
        <ArrowLeft className="w-4 h-4" />
      </Link>
    </div>
  </div>
));

NotFoundState.displayName = 'NotFoundState';

// ============================================
// MAIN PAGE COMPONENT
// ============================================

const SubServiceDetail = () => {
  const { parentSlug, subSlug } = useParams<{ parentSlug: string; subSlug: string }>();
  const navigate = useNavigate();

  // Memoize lookups
  const subService = useMemo(
    () => (parentSlug && subSlug ? getSubServiceBySlug(parentSlug, subSlug) : undefined),
    [parentSlug, subSlug]
  );

  const parentService = useMemo(
    () => (parentSlug ? getServiceBySlug(parentSlug) : undefined),
    [parentSlug]
  );

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [parentSlug, subSlug]);

  // Redirect if not found
  useEffect(() => {
    if (parentSlug && subSlug && (!subService || !parentService)) {
      // Try to navigate to parent service first
      if (parentService) {
        navigate(`/services/${parentSlug}`, { replace: true });
      } else {
        navigate("/services", { replace: true });
      }
    }
  }, [parentSlug, subSlug, subService, parentService, navigate]);

  // Loading state
  if (!subService || !parentService) {
    return <LoadingState />;
  }

  // BreadcrumbList JSON-LD Schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "דף הבית", "item": "https://nexo.agency/" },
      { "@type": "ListItem", "position": 2, "name": "שירותים", "item": "https://nexo.agency/services" },
      { "@type": "ListItem", "position": 3, "name": parentService.name, "item": `https://nexo.agency/services/${parentSlug}` },
      { "@type": "ListItem", "position": 4, "name": subService.name, "item": `https://nexo.agency/services/${parentSlug}/${subService.slug}` }
    ]
  };

  return (
    <div className="min-h-screen bg-background overflow-x-clip" dir="rtl">
      {/* SEO Meta Tags */}
      <Helmet>
        <title>{subService.name} | {parentService.name} | NEXO AGENCY</title>
        <meta name="description" content={subService.heroDescription || `${subService.name} - ${parentService.name} - שירותי נקסו`} />
        <link rel="canonical" href={`https://nexo.agency/services/${parentSlug}/${subService.slug}`} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={`${subService.name} | ${parentService.name} | NEXO AGENCY`} />
        <meta property="og:description" content={subService.heroDescription || `${subService.name} - ${parentService.name} - שירותי נקסו`} />
        <meta property="og:url" content={`https://nexo.agency/services/${parentSlug}/${subService.slug}`} />
        <meta property="og:locale" content="he_IL" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${subService.name} | ${parentService.name} | NEXO AGENCY`} />
        <meta name="twitter:description" content={subService.heroDescription || `${subService.name} - ${parentService.name} - שירותי נקסו`} />
        <meta property="og:image" content="https://nexo.agency/og-image.jpg" />
        <meta name="twitter:image" content="https://nexo.agency/og-image.jpg" />
        <link rel="alternate" hreflang="he" href={`https://nexo.agency/services/${parentSlug}/${subService.slug}`} />
        <link rel="alternate" hreflang="x-default" href={`https://nexo.agency/services/${parentSlug}/${subService.slug}`} />
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbSchema)}
        </script>
      </Helmet>

      <GlassNavbar />

      <main id="main-content">
        <SubServiceHero subService={subService} parentService={parentService} />

      <SubServiceWhatIsThis subService={subService} parentService={parentService} />

      <SubServiceBlogSection subService={subService} parentService={parentService} />

      <SubServiceFeatures subService={subService} parentService={parentService} />

      <SubServiceWhyChooseUs subService={subService} parentService={parentService} />

      <SteppedProcessSection
        title={subService.process.title}
        description={subService.process.description}
        steps={subService.process.steps}
        accentColor={parentService.accentColor}
      />

      <SubServiceFAQ subService={subService} parentService={parentService} />

      <SubServiceRelated
        currentSubServiceId={subService.id}
        parentService={parentService}
        parentSlug={parentSlug!}
      />

        <SubServiceCTA subService={subService} parentService={parentService} />
      </main>

      <Footer />
    </div>
  );
};

export default SubServiceDetail;
