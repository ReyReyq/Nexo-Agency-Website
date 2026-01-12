import { memo, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { websiteCompanyLandingPage } from "@/data/landingPages/websiteCompany";
import {
  LandingHero,
  LandingPainPoints,
  LandingFeatures,
  LandingProcess,
  LandingFAQ,
  LandingCTA,
  LandingPortfolioMarquee,
  LandingBentoGrid,
} from "@/components/landing";
import Footer from "@/components/Footer";
import GlassNavbar from "@/components/GlassNavbar";

// ============================================
// WEBSITE COMPANY LANDING PAGE
// חברה לבניית אתרים
// ============================================
// SEO-optimized landing page targeting "חברה לבניית אתרים"
// 590 monthly searches - website building company in Hebrew

const WebsiteCompany = memo(() => {
  const data = websiteCompanyLandingPage;

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Generate Service schema JSON-LD
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": data.seo.schema.type,
    "name": data.seo.title,
    "description": data.seo.description,
    "serviceType": data.seo.schema.serviceType,
    "areaServed": {
      "@type": "Country",
      "name": data.seo.schema.areaServed,
    },
    "provider": {
      "@type": "Organization",
      "name": data.seo.schema.provider.name,
      "url": data.seo.schema.provider.url,
    },
    "offers": {
      "@type": "Offer",
      "availability": "https://schema.org/InStock",
      "priceCurrency": "ILS",
    },
  };

  // Generate BreadcrumbList schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "דף הבית",
        "item": "https://nexo.co.il",
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "דפי נחיתה",
        "item": "https://nexo.co.il/lp",
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": "חברה לבניית אתרים",
        "item": data.seo.canonicalUrl,
      },
    ],
  };

  return (
    <>
      {/* SEO Meta Tags */}
      <Helmet>
        <html lang="he" dir="rtl" />
        <title>{data.seo.title}</title>
        <meta name="description" content={data.seo.description} />
        <meta name="keywords" content={data.seo.keywords.join(", ")} />
        <link rel="canonical" href={data.seo.canonicalUrl} />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content={data.seo.title} />
        <meta property="og:description" content={data.seo.description} />
        <meta property="og:url" content={data.seo.canonicalUrl} />
        {data.seo.ogImage && <meta property="og:image" content={data.seo.ogImage} />}
        <meta property="og:locale" content="he_IL" />
        <meta property="og:site_name" content="Nexo Digital" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={data.seo.title} />
        <meta name="twitter:description" content={data.seo.description} />
        {data.seo.ogImage && <meta name="twitter:image" content={data.seo.ogImage} />}

        {/* Additional SEO */}
        <meta name="robots" content="index, follow" />
        <meta name="author" content="Nexo Digital" />
        <meta name="geo.region" content="IL" />
        <meta name="geo.placename" content="Israel" />
        <meta name="language" content="Hebrew" />

        {/* Service Schema JSON-LD */}
        <script type="application/ld+json">
          {JSON.stringify(serviceSchema)}
        </script>

        {/* Breadcrumb Schema JSON-LD */}
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbSchema)}
        </script>
      </Helmet>

      {/* Navigation - GlassNavbar on all screen sizes */}
      <GlassNavbar />

      {/* Main Content */}
      <main dir="rtl" lang="he">
        {/* Hero Section - Above the fold */}
        <LandingHero
          content={data.hero}
          theme={data.theme}
        />

        {/* Pain Points Section */}
        <LandingPainPoints
          content={data.painPoints}
          accentColor={data.theme.accentColor}
        />

        {/* Features Section */}
        <LandingFeatures
          content={data.features}
          accentColor={data.theme.accentColor}
          gradient={data.theme.gradient}
        />

        {/* Process Section */}
        <LandingProcess
          content={data.process}
          accentColor={data.theme.accentColor}
        />

        {/* Portfolio Marquee Section */}
        {data.portfolio && (
          <LandingPortfolioMarquee
            title={data.portfolio.title}
            subtitle={data.portfolio.subtitle}
            ctaText={data.portfolio.ctaText}
            ctaLink={data.portfolio.ctaLink}
            accentColor={data.theme.accentColor}
          />
        )}

        {/* Related Services Bento Grid */}
        {data.relatedServicesBento && (
          <LandingBentoGrid
            title={data.relatedServicesBento.title}
            subtitle={data.relatedServicesBento.subtitle}
            items={data.relatedServicesBento.items}
            accentColor={data.theme.accentColor}
          />
        )}

        {/* FAQ Section with JSON-LD schema */}
        <LandingFAQ
          content={data.faq}
          accentColor={data.theme.accentColor}
          generateSchema={true}
        />

        {/* Final CTA Section */}
        <LandingCTA
          content={data.cta}
          accentColor={data.theme.accentColor}
          gradient={data.theme.gradient}
        />
      </main>

      {/* Footer */}
      <Footer />
    </>
  );
});

WebsiteCompany.displayName = 'WebsiteCompany';

export default WebsiteCompany;
