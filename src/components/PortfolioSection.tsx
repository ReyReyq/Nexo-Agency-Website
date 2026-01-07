"use client";

import { useRef, useMemo, memo, useState } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowLeft, ExternalLink, Sparkles, ShoppingBag, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Marquee } from "@/components/ui/marquee";

// Helper to generate srcset for portfolio images
// Naming convention: image.webp -> image-sm.webp (400w), image-md.webp (600w)
const generatePortfolioSrcSet = (src: string, isLarge = false) => {
  if (!src.startsWith('/portfolio/')) return { src };

  const extension = src.substring(src.lastIndexOf('.'));
  const basePath = src.substring(0, src.lastIndexOf('.'));

  // Large cards (featured) get larger srcset
  if (isLarge) {
    return {
      src,
      srcSet: `${basePath}-sm${extension} 480w, ${basePath}-md${extension} 800w, ${src} 1200w`,
      sizes: '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 800px',
    };
  }

  // Standard cards
  return {
    src,
    srcSet: `${basePath}-sm${extension} 320w, ${basePath}-md${extension} 480w, ${src} 640w`,
    sizes: '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 600px',
  };
};

// Helper to generate srcset for marquee images
// Uses responsive images: -sm (600w) for mobile, original for desktop
const generateMarqueeSrcSet = (src: string) => {
  if (!src.startsWith('/images/websites-pictures/')) return { src };

  const extension = src.substring(src.lastIndexOf('.'));
  const basePath = src.substring(0, src.lastIndexOf('.'));

  return {
    src,
    srcSet: `${basePath}-sm${extension} 600w, ${src} 1680w`,
    sizes: '(max-width: 768px) 280px, 360px',
  };
};

// Memoized marquee image component with optimized loading
const MarqueeImage = memo(function MarqueeImage({
  src,
  index,
  rowOffset = 0
}: {
  src: string;
  index: number;
  rowOffset?: number;
}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const imageSet = generateMarqueeSrcSet(src);

  return (
    <div
      className="relative w-[280px] md:w-[360px] aspect-[16/10] rounded-2xl overflow-hidden shadow-2xl flex-shrink-0"
    >
      {/* Placeholder skeleton */}
      {!isLoaded && (
        <div
          className="absolute inset-0 bg-muted animate-pulse"
          aria-hidden="true"
        />
      )}
      <img
        src={imageSet.src}
        srcSet={imageSet.srcSet}
        sizes={imageSet.sizes}
        alt={`Website showcase ${index + rowOffset + 1}`}
        width={360}
        height={225}
        loading="lazy"
        decoding="async"
        onLoad={() => setIsLoaded(true)}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </div>
  );
});

// Website showcase images for marquee - equally distributed (18 each)
const websiteImages = {
  row1: [
    "/images/websites-pictures/portfolio-website-01.webp",
    "/images/websites-pictures/portfolio-website-02.webp",
    "/images/websites-pictures/portfolio-website-03.webp",
    "/images/websites-pictures/portfolio-website-04.webp",
    "/images/websites-pictures/portfolio-website-05.webp",
    "/images/websites-pictures/portfolio-website-06.webp",
    "/images/websites-pictures/portfolio-website-07.webp",
    "/images/websites-pictures/portfolio-website-08.webp",
    "/images/websites-pictures/portfolio-website-09.webp",
    "/images/websites-pictures/portfolio-website-10.webp",
    "/images/websites-pictures/portfolio-website-11.webp",
    "/images/websites-pictures/portfolio-website-12.webp",
    "/images/websites-pictures/portfolio-website-13.webp",
    "/images/websites-pictures/portfolio-website-14.webp",
    "/images/websites-pictures/portfolio-website-15.webp",
    "/images/websites-pictures/portfolio-website-16.webp",
    "/images/websites-pictures/portfolio-website-17.webp",
    "/images/websites-pictures/portfolio-website-18.webp",
  ],
  row2: [
    "/images/websites-pictures/portfolio-website-19.webp",
    "/images/websites-pictures/portfolio-website-20.webp",
    "/images/websites-pictures/portfolio-website-21.webp",
    "/images/websites-pictures/portfolio-website-22.webp",
    "/images/websites-pictures/portfolio-website-23.webp",
    "/images/websites-pictures/portfolio-website-24.webp",
    "/images/websites-pictures/portfolio-website-25.webp",
    "/images/websites-pictures/portfolio-website-26.webp",
    "/images/websites-pictures/portfolio-website-27.webp",
    "/images/websites-pictures/portfolio-website-28.webp",
    "/images/websites-pictures/portfolio-website-29.webp",
    "/images/websites-pictures/portfolio-website-30.webp",
    "/images/websites-pictures/portfolio-website-31.webp",
    "/images/websites-pictures/portfolio-website-32.webp",
    "/images/websites-pictures/portfolio-website-33.webp",
    "/images/websites-pictures/portfolio-website-03.webp",
    "/images/websites-pictures/portfolio-website-05.webp",
    "/images/websites-pictures/portfolio-website-07.webp",
  ],
};

// Project data - only real projects
const projects = [
  {
    id: 1,
    title: "SimplyHebrew",
    subtitle: "לימוד עברית בקלות",
    client: "SimplyHebrew",
    category: "EdTech",
    description: "פלטפורמת לימוד עברית אינטראקטיבית עם חוויית משתמש מודרנית וממשק נקי",
    image: "/portfolio/simplyhebrew/simply-hero-img-optimized.webp",
    link: "/portfolio/simplyhebrew",
    tags: ["React", "Next.js", "AI"],
    Icon: Sparkles,
    color: "from-blue-500/20 to-purple-500/20",
  },
  {
    id: 2,
    title: "SIONÉ",
    subtitle: "אופנת יוקרה",
    client: "SIONÉ Official",
    category: "E-Commerce",
    description: "חנות אונליין יוקרתית עם חוויית קנייה פרימיום ועיצוב אלגנטי",
    image: "/portfolio/sione/sione-homepage-hero.webp",
    link: "/portfolio/sione",
    tags: ["E-Commerce", "Fashion", "Premium"],
    Icon: ShoppingBag,
    color: "from-rose-500/20 to-orange-500/20",
  },
  {
    id: 3,
    title: "TeenVestor",
    subtitle: "הצעד הראשון לעצמאות",
    client: "TeenVestor",
    category: "FinTech",
    description: "פלטפורמת לימוד השקעות לבני נוער עם קורסים אינטראקטיביים",
    image: "/portfolio/teenvestsor/teenvestsor-hero.webp",
    link: "/portfolio/teenvestsor",
    tags: ["FinTech", "Education", "Courses"],
    Icon: TrendingUp,
    color: "from-emerald-500/20 to-cyan-500/20",
  },
];

// Animation variants - defined outside to prevent recreation on each render
const fadeInUp = {
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0 },
} as const;

const fadeInLeft = {
  initial: { opacity: 0, x: -40 },
  animate: { opacity: 1, x: 0 },
} as const;

const scaleIn = {
  initial: { scaleX: 0 },
  animate: { scaleX: 1 },
} as const;

const PortfolioSection = memo(function PortfolioSection() {
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const isHeaderInView = useInView(headerRef, { once: true, margin: "-100px" });
  const isGridInView = useInView(gridRef, { once: true, margin: "-50px" });

  // Memoize projects data to prevent unnecessary re-renders
  const memoizedProjects = useMemo(() => projects, []);

  return (
    <section
      id="portfolio"
      className="relative py-28 md:py-40 overflow-hidden bg-nexo-section"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 md:px-12 relative z-10">
        {/* Section Header */}
        <div ref={headerRef} className="mb-16 md:mb-24">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
            {/* Title */}
            <motion.div
              initial={fadeInLeft.initial}
              animate={isHeaderInView ? fadeInLeft.animate : {}}
              transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
              className="max-w-xl"
              dir="rtl"
            >
              <motion.div
                initial={scaleIn.initial}
                animate={isHeaderInView ? scaleIn.animate : {}}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="w-16 h-1 bg-primary mb-6 origin-right"
              />
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-nexo-charcoal leading-[0.9] tracking-tight">
                הפרויקטים
                <br />
                <span className="text-primary">שלנו</span>
              </h2>
            </motion.div>

            {/* Description */}
            <motion.p
              initial={fadeInUp.initial}
              animate={isHeaderInView ? fadeInUp.animate : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-nexo-ash text-lg md:text-xl max-w-sm leading-relaxed"
              dir="rtl"
            >
              עבודות נבחרות שמציגות את הגישה שלנו לעיצוב ופיתוח דיגיטלי
            </motion.p>
          </div>
        </div>

        {/* Bento Grid */}
        <div
          ref={gridRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8 auto-rows-[280px] md:auto-rows-[320px]"
        >
          {/* SimplyHebrew - Large Featured Card */}
          <motion.a
            href={memoizedProjects[0].link}
            initial={fadeInUp.initial}
            animate={isGridInView ? fadeInUp.animate : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className={cn(
              "group relative col-span-1 md:col-span-2 row-span-1 md:row-span-2 rounded-3xl overflow-hidden",
              "bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.03),0_2px_4px_rgba(0,0,0,0.05),0_12px_24px_rgba(0,0,0,0.05)]",
              "hover:shadow-[0_0_0_1px_rgba(0,0,0,0.05),0_4px_8px_rgba(0,0,0,0.08),0_24px_48px_rgba(0,0,0,0.08)]",
              "transition-all duration-500"
            )}
          >
            {/* Background Image - Featured large card */}
            <div className="absolute inset-0">
              {(() => {
                const imageSet = generatePortfolioSrcSet(memoizedProjects[0].image, true);
                return (
                  <img
                    src={imageSet.src}
                    srcSet={imageSet.srcSet}
                    sizes={imageSet.sizes}
                    alt={memoizedProjects[0].title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                    decoding="async"
                    width={800}
                    height={640}
                  />
                );
              })()}
              <div className={cn(
                "absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent",
                "transition-opacity duration-500"
              )} />
            </div>

            {/* Category Badge */}
            <div className="absolute top-5 right-5 z-10">
              <span className="px-4 py-2 text-xs font-bold uppercase tracking-wider bg-white/95 backdrop-blur-sm text-nexo-charcoal rounded-full shadow-sm">
                {memoizedProjects[0].category}
              </span>
            </div>

            {/* Content */}
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 z-10" dir="rtl">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-2xl md:text-3xl font-black text-white leading-tight mb-2">
                    {memoizedProjects[0].title}
                  </h3>
                  <p className="text-white/70 text-sm md:text-base mb-3">
                    {memoizedProjects[0].subtitle}
                  </p>
                  <p className="text-white/60 text-sm max-w-md hidden md:block">
                    {memoizedProjects[0].description}
                  </p>
                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mt-4">
                    {memoizedProjects[0].tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 text-xs font-medium bg-white/10 backdrop-blur-sm text-white/80 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Arrow Button */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileHover={{ scale: 1.1 }}
                  className="opacity-0 group-hover:opacity-100 transition-all duration-300 flex-shrink-0"
                >
                  <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/30">
                    <ArrowLeft className="w-5 h-5 text-white" />
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.a>

          {/* SIONE - Medium Card */}
          <motion.a
            href={memoizedProjects[1].link}
            initial={fadeInUp.initial}
            animate={isGridInView ? fadeInUp.animate : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className={cn(
              "group relative col-span-1 md:col-span-2 row-span-1 rounded-3xl overflow-hidden",
              "bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.03),0_2px_4px_rgba(0,0,0,0.05),0_12px_24px_rgba(0,0,0,0.05)]",
              "hover:shadow-[0_0_0_1px_rgba(0,0,0,0.05),0_4px_8px_rgba(0,0,0,0.08),0_24px_48px_rgba(0,0,0,0.08)]",
              "transition-all duration-500"
            )}
          >
            {/* Background Image */}
            <div className="absolute inset-0">
              {(() => {
                const imageSet = generatePortfolioSrcSet(memoizedProjects[1].image);
                return (
                  <img
                    src={imageSet.src}
                    srcSet={imageSet.srcSet}
                    sizes={imageSet.sizes}
                    alt={memoizedProjects[1].title}
                    className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                    decoding="async"
                    width={600}
                    height={320}
                  />
                );
              })()}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            </div>

            {/* Category Badge */}
            <div className="absolute top-5 right-5 z-10">
              <span className="px-4 py-2 text-xs font-bold uppercase tracking-wider bg-white/95 backdrop-blur-sm text-nexo-charcoal rounded-full shadow-sm">
                {memoizedProjects[1].category}
              </span>
            </div>

            {/* Content */}
            <div className="absolute bottom-0 left-0 right-0 p-6 z-10" dir="rtl">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <h3 className="text-xl md:text-2xl font-black text-white leading-tight mb-1">
                    {memoizedProjects[1].title}
                  </h3>
                  <p className="text-white/70 text-sm">
                    {memoizedProjects[1].subtitle}
                  </p>
                </div>

                {/* Arrow Button */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileHover={{ scale: 1.1 }}
                  className="opacity-0 group-hover:opacity-100 transition-all duration-300 flex-shrink-0"
                >
                  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/30">
                    <ArrowLeft className="w-4 h-4 text-white" />
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.a>

          {/* TeenVestor - Medium Card (same as Sioné) */}
          <motion.a
            href={memoizedProjects[2].link}
            initial={fadeInUp.initial}
            animate={isGridInView ? fadeInUp.animate : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className={cn(
              "group relative col-span-1 md:col-span-2 row-span-1 rounded-3xl overflow-hidden",
              "bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.03),0_2px_4px_rgba(0,0,0,0.05),0_12px_24px_rgba(0,0,0,0.05)]",
              "hover:shadow-[0_0_0_1px_rgba(0,0,0,0.05),0_4px_8px_rgba(0,0,0,0.08),0_24px_48px_rgba(0,0,0,0.08)]",
              "transition-all duration-500"
            )}
          >
            {/* Background Image */}
            <div className="absolute inset-0">
              {(() => {
                const imageSet = generatePortfolioSrcSet(memoizedProjects[2].image);
                return (
                  <img
                    src={imageSet.src}
                    srcSet={imageSet.srcSet}
                    sizes={imageSet.sizes}
                    alt={memoizedProjects[2].title}
                    className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                    decoding="async"
                    width={600}
                    height={320}
                  />
                );
              })()}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            </div>

            {/* Category Badge */}
            <div className="absolute top-5 right-5 z-10">
              <span className="px-4 py-2 text-xs font-bold uppercase tracking-wider bg-white/95 backdrop-blur-sm text-nexo-charcoal rounded-full shadow-sm">
                {memoizedProjects[2].category}
              </span>
            </div>

            {/* Content */}
            <div className="absolute bottom-0 left-0 right-0 p-6 z-10" dir="rtl">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <h3 className="text-xl md:text-2xl font-black text-white leading-tight mb-1">
                    {memoizedProjects[2].title}
                  </h3>
                  <p className="text-white/70 text-sm">
                    {memoizedProjects[2].subtitle}
                  </p>
                </div>

                {/* Arrow Button */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileHover={{ scale: 1.1 }}
                  className="opacity-0 group-hover:opacity-100 transition-all duration-300 flex-shrink-0"
                >
                  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/30">
                    <ArrowLeft className="w-4 h-4 text-white" />
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.a>
        </div>

        {/* View All Portfolio Button */}
        <motion.div
          initial={fadeInUp.initial}
          animate={isGridInView ? fadeInUp.animate : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex justify-center mt-12 md:mt-16"
        >
          <Button
            asChild
            size="lg"
            className="group px-8 py-6 text-base font-bold rounded-full bg-nexo-charcoal hover:bg-primary transition-colors duration-300"
          >
            <a href="/portfolio" className="flex items-center gap-3 min-h-[44px]">
              <span>צפייה בכל הפרויקטים</span>
              <ExternalLink className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" />
            </a>
          </Button>
        </motion.div>
      </div>

      {/* Website Showcase Marquees */}
      <div className="mt-16 md:mt-24 overflow-hidden">
        {/* First Marquee Row - Left to Right */}
        <div className="mb-6">
          <Marquee className="[--duration:20s] [--gap:1.5rem]">
            {websiteImages.row1.map((src, index) => (
              <MarqueeImage key={index} src={src} index={index} rowOffset={0} />
            ))}
          </Marquee>
        </div>

        {/* Second Marquee Row - Right to Left */}
        <Marquee className="[--duration:20s] [--gap:1.5rem]" reverse>
          {websiteImages.row2.map((src, index) => (
            <MarqueeImage key={index} src={src} index={index} rowOffset={18} />
          ))}
        </Marquee>
      </div>
    </section>
  );
});

export default PortfolioSection;
