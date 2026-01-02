"use client";

import { useRef, useMemo, memo } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowLeft, ExternalLink, Palette, Sparkles, ShoppingBag, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

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
    image: "/portfolio/sione/sione-homepage-hero.png",
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
    image: "/portfolio/teenvestsor/teenvestsor-hero.png",
    link: "/portfolio/teenvestsor",
    tags: ["FinTech", "Education", "Courses"],
    Icon: TrendingUp,
    color: "from-emerald-500/20 to-cyan-500/20",
  },
];

// Placeholder for visual balance - defined outside component to prevent recreation
const placeholder = {
  id: 4,
  title: "פרויקט חדש",
  subtitle: "בקרוב",
  description: "עיצוב ופיתוח",
  Icon: Palette,
  color: "from-amber-500/10 to-yellow-500/10",
} as const;

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

// Memoized placeholder card component
const PlaceholderCard = memo(function PlaceholderCard({ isInView, delay }: { isInView: boolean; delay: number }) {
  return (
    <motion.div
      initial={fadeInUp.initial}
      animate={isInView ? fadeInUp.animate : {}}
      transition={{ duration: 0.6, delay }}
      className={cn(
        "relative col-span-1 row-span-1 rounded-3xl overflow-hidden",
        "bg-gradient-to-br",
        placeholder.color,
        "border border-dashed border-[#e0e0e0]",
        "flex flex-col items-center justify-center text-center p-6"
      )}
    >
      <placeholder.Icon className="w-10 h-10 text-[#a0a0a0] mb-4" />
      <h4 className="text-lg font-bold text-[#6a6a6a] mb-1" dir="rtl">
        {placeholder.title}
      </h4>
      <p className="text-sm text-[#a0a0a0]" dir="rtl">
        {placeholder.subtitle}
      </p>
    </motion.div>
  );
});

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
      className="relative py-28 md:py-40 overflow-hidden bg-[#FAFAFA]"
    >
      <div className="container mx-auto px-6 md:px-12 relative z-10">
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
              <h2 className="text-5xl md:text-6xl lg:text-7xl font-black text-[#1a1a1a] leading-[0.9] tracking-tight">
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
              className="text-[#6a6a6a] text-lg md:text-xl max-w-sm leading-relaxed"
              dir="rtl"
            >
              עבודות נבחרות שמציגות את הגישה שלנו לעיצוב ופיתוח דיגיטלי
            </motion.p>
          </div>
        </div>

        {/* Bento Grid */}
        <div
          ref={gridRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 auto-rows-[280px] md:auto-rows-[320px]"
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
            {/* Background Image */}
            <div className="absolute inset-0">
              <img
                src={memoizedProjects[0].image}
                alt={memoizedProjects[0].title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
                decoding="async"
                width={800}
                height={640}
              />
              <div className={cn(
                "absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent",
                "transition-opacity duration-500"
              )} />
            </div>

            {/* Category Badge */}
            <div className="absolute top-5 right-5 z-10">
              <span className="px-4 py-2 text-xs font-bold uppercase tracking-wider bg-white/95 backdrop-blur-sm text-[#1a1a1a] rounded-full shadow-sm">
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
              <img
                src={memoizedProjects[1].image}
                alt={memoizedProjects[1].title}
                className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
                decoding="async"
                width={600}
                height={320}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            </div>

            {/* Category Badge */}
            <div className="absolute top-5 right-5 z-10">
              <span className="px-4 py-2 text-xs font-bold uppercase tracking-wider bg-white/95 backdrop-blur-sm text-[#1a1a1a] rounded-full shadow-sm">
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

          {/* TeenVestor - Small Card */}
          <motion.a
            href={memoizedProjects[2].link}
            initial={fadeInUp.initial}
            animate={isGridInView ? fadeInUp.animate : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className={cn(
              "group relative col-span-1 row-span-1 rounded-3xl overflow-hidden",
              "bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.03),0_2px_4px_rgba(0,0,0,0.05),0_12px_24px_rgba(0,0,0,0.05)]",
              "hover:shadow-[0_0_0_1px_rgba(0,0,0,0.05),0_4px_8px_rgba(0,0,0,0.08),0_24px_48px_rgba(0,0,0,0.08)]",
              "transition-all duration-500"
            )}
          >
            {/* Background Image */}
            <div className="absolute inset-0">
              <img
                src={memoizedProjects[2].image}
                alt={memoizedProjects[2].title}
                className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
                decoding="async"
                width={400}
                height={320}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            </div>

            {/* Category Badge */}
            <div className="absolute top-4 right-4 z-10">
              <span className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider bg-white/95 backdrop-blur-sm text-[#1a1a1a] rounded-full shadow-sm">
                {memoizedProjects[2].category}
              </span>
            </div>

            {/* Content */}
            <div className="absolute bottom-0 left-0 right-0 p-5 z-10" dir="rtl">
              <h3 className="text-lg font-black text-white leading-tight mb-1">
                {memoizedProjects[2].title}
              </h3>
              <p className="text-white/70 text-xs">
                {memoizedProjects[2].subtitle}
              </p>
            </div>
          </motion.a>

          {/* Placeholder Card */}
          <PlaceholderCard isInView={isGridInView} delay={0.4} />
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
            className="group px-8 py-6 text-base font-bold rounded-full bg-[#1a1a1a] hover:bg-primary transition-colors duration-300"
          >
            <a href="/portfolio" className="flex items-center gap-3">
              <span>צפייה בכל הפרויקטים</span>
              <ExternalLink className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" />
            </a>
          </Button>
        </motion.div>
      </div>
    </section>
  );
});

export default PortfolioSection;
