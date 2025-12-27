"use client";

import { useRef, memo, lazy, Suspense } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowLeft } from "lucide-react";

// Lazy load HoverVideoPlayer - it's a feature-rich video component
const HoverVideoPlayer = lazy(() => import("react-hover-video-player"));

// Project data - uniform grid
// Optimized thumbnails: 600px for card display, WebP format
// TODO: Consider converting external Unsplash URLs to local optimized images for better performance
const projects = [
  {
    id: 1,
    number: "01",
    title: "חנות אונליין מתקדמת",
    client: "Fashion Hub",
    category: "E-Commerce",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-typing-on-laptop-close-up-4892-large.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80&fm=webp&fit=crop",
    link: "/case-studies/fashion-hub",
  },
  {
    id: 2,
    number: "02",
    title: "פורטל B2B",
    client: "TechConnect",
    category: "Web App",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-hands-of-a-woman-working-on-a-laptop-4793-large.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80&fm=webp&fit=crop",
    link: "/case-studies/techconnect",
  },
  {
    id: 3,
    number: "03",
    title: "אפליקציית פיננסים",
    client: "FinFlow",
    category: "Mobile App",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-woman-working-on-laptop-at-night-4796-large.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=600&q=80&fm=webp&fit=crop",
    link: "/case-studies/finflow",
  },
];

// Minimal Project Card - memoized for performance
interface ProjectCardProps {
  project: typeof projects[0];
  index: number;
}

// Memoized overlay components to prevent recreation on each render
const PausedOverlay = memo(({ thumbnailUrl, title }: { thumbnailUrl: string; title: string }) => (
  <div className="relative w-full h-full">
    <img
      src={thumbnailUrl}
      alt={title}
      loading="lazy"
      decoding="async"
      width={600}
      height={375}
      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
    />
    {/* Subtle vignette */}
    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
  </div>
));

PausedOverlay.displayName = 'PausedOverlay';

const LoadingOverlay = memo(() => (
  <div className="absolute inset-0 flex items-center justify-center bg-[#f0efec]">
    <div className="w-8 h-8 rounded-full border-2 border-[#1a1a1a]/10 border-t-primary animate-spin" />
  </div>
));

LoadingOverlay.displayName = 'LoadingOverlay';

const ProjectCard = memo(({ project, index }: ProjectCardProps) => {
  const cardRef = useRef(null);
  const isInView = useInView(cardRef, { once: true, margin: "-80px" });

  return (
    <motion.article
      ref={cardRef}
      initial={{ opacity: 0, y: 80 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.9,
        delay: index * 0.12,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      className="group relative"
    >
      <a href={project.link} className="block">
        {/* Project Number - Editorial Style */}
        <div className="absolute -top-3 -right-2 z-20 pointer-events-none">
          <span className="text-[120px] md:text-[160px] font-black text-[#1a1a1a]/[0.04] leading-none select-none">
            {project.number}
          </span>
        </div>

        {/* Video Container */}
        <div className="relative overflow-hidden rounded-2xl aspect-[16/10] bg-[#f0efec]">
          <Suspense fallback={<PausedOverlay thumbnailUrl={project.thumbnailUrl} title={project.title} />}>
            <HoverVideoPlayer
              videoSrc={project.videoUrl}
              pausedOverlay={<PausedOverlay thumbnailUrl={project.thumbnailUrl} title={project.title} />}
              loadingOverlay={<LoadingOverlay />}
              muted
              loop
              preload="metadata"
              restartOnPaused
              overlayTransitionDuration={500}
              style={{ width: "100%", height: "100%" }}
              sizingMode="container"
            />
          </Suspense>

          {/* Category Badge */}
          <div className="absolute top-4 left-4 z-10">
            <span className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.15em] bg-white/90 backdrop-blur-sm text-[#1a1a1a] rounded-full">
              {project.category}
            </span>
          </div>

          {/* Hover Arrow */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileHover={{ opacity: 1, scale: 1 }}
            className="absolute bottom-4 left-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          >
            <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/30">
              <ArrowLeft className="w-5 h-5 text-white" />
            </div>
          </motion.div>
        </div>

        {/* Content */}
        <div className="mt-6 pr-2" dir="rtl">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-xl md:text-2xl font-black text-[#1a1a1a] leading-tight group-hover:text-primary transition-colors duration-300">
                {project.title}
              </h3>
              <p className="mt-1 text-sm text-[#8a8a8a] font-medium">
                {project.client}
              </p>
            </div>
            <motion.div
              className="mt-1 flex items-center gap-1.5 text-primary opacity-0 group-hover:opacity-100 transition-all duration-300"
              initial={{ x: 10 }}
              whileHover={{ x: 0 }}
            >
              <span className="text-sm font-semibold">צפייה</span>
              <ArrowLeft className="w-4 h-4" />
            </motion.div>
          </div>
        </div>
      </a>
    </motion.article>
  );
});

ProjectCard.displayName = 'ProjectCard';

const PortfolioSection = () => {
  const headerRef = useRef(null);
  const isHeaderInView = useInView(headerRef, { once: true, margin: "-100px" });

  return (
    <section
      id="portfolio"
      className="relative py-28 md:py-40 overflow-hidden"
      style={{ backgroundColor: "#FAF9F6" }}
    >
      {/* Grain texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.35] pointer-events-none mix-blend-multiply"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="container mx-auto px-6 md:px-12 relative z-10">
        {/* Section Header - Asymmetric Editorial */}
        <div ref={headerRef} className="mb-20 md:mb-28">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
            {/* Left side - Title */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={isHeaderInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
              className="max-w-xl"
              dir="rtl"
            >
              <motion.div
                initial={{ scaleX: 0 }}
                animate={isHeaderInView ? { scaleX: 1 } : {}}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="w-16 h-1 bg-primary mb-6 origin-right"
              />
              <h2 className="text-5xl md:text-6xl lg:text-7xl font-black text-[#1a1a1a] leading-[0.9] tracking-tight">
                הפרויקטים
                <br />
                <span className="bg-gradient-to-l from-primary to-[#8330c2] bg-clip-text text-transparent">
                  שלנו
                </span>
              </h2>
            </motion.div>

            {/* Right side - Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-[#6a6a6a] text-lg md:text-xl max-w-sm leading-relaxed"
              dir="rtl"
            >
              עבודות נבחרות שמציגות את הגישה שלנו לעיצוב ופיתוח דיגיטלי
            </motion.p>
          </div>
        </div>

        {/* Uniform Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          {projects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PortfolioSection;
