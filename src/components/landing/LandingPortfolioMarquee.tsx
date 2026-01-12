import { memo, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Marquee } from "@/components/ui/marquee";
import { Button } from "@/components/ui/button";

// Animation constants
const INITIAL_FADE_UP = { opacity: 0, y: 40 };
const ANIMATE_VISIBLE = { opacity: 1, y: 0 };
const IN_VIEW_OPTIONS = { once: true, margin: "-100px" as const };

// Helper to generate srcset for marquee images
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

// Memoized marquee image component
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
    <div className="relative w-[280px] md:w-[360px] aspect-[16/10] rounded-2xl overflow-hidden shadow-2xl flex-shrink-0">
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

// Website showcase images - same as homepage
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
  ],
};

export interface LandingPortfolioMarqueeProps {
  /** Section title */
  title?: string;
  /** Section subtitle */
  subtitle?: string;
  /** CTA button text */
  ctaText?: string;
  /** CTA button link */
  ctaLink?: string;
  /** Accent color for the section */
  accentColor?: string;
}

const LandingPortfolioMarquee = memo(function LandingPortfolioMarquee({
  title = "עבודות שעשינו",
  subtitle = "הצצה לפרויקטים שהשקנו ללקוחות שלנו",
  ctaText = "לצפייה בכל הפרויקטים",
  ctaLink = "/portfolio",
  accentColor = "#1e3a5f",
}: LandingPortfolioMarqueeProps) {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, IN_VIEW_OPTIONS);

  return (
    <section
      ref={sectionRef}
      className="py-16 md:py-24 overflow-hidden bg-nexo-section"
      dir="rtl"
      id="portfolio"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        {/* Section Header */}
        <motion.div
          initial={INITIAL_FADE_UP}
          animate={isInView ? ANIMATE_VISIBLE : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto"
        >
          {/* Accent line */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="h-1 w-20 mx-auto mb-6 origin-center"
            style={{ backgroundColor: accentColor }}
          />

          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-nexo-charcoal mb-4">
            {title}
          </h2>

          {subtitle && (
            <p className="text-nexo-steel text-base sm:text-lg md:text-xl">
              {subtitle}
            </p>
          )}
        </motion.div>
      </div>

      {/* Marquee Rows */}
      <div className="overflow-hidden">
        {/* First Marquee Row - Left to Right */}
        <div className="mb-6">
          <Marquee className="[--duration:25s] [--gap:1.5rem]">
            {websiteImages.row1.map((src, index) => (
              <MarqueeImage key={index} src={src} index={index} rowOffset={0} />
            ))}
          </Marquee>
        </div>

        {/* Second Marquee Row - Right to Left */}
        <Marquee className="[--duration:25s] [--gap:1.5rem]" reverse>
          {websiteImages.row2.map((src, index) => (
            <MarqueeImage key={index} src={src} index={index} rowOffset={9} />
          ))}
        </Marquee>
      </div>

      {/* CTA Button */}
      <motion.div
        initial={INITIAL_FADE_UP}
        animate={isInView ? ANIMATE_VISIBLE : {}}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="flex justify-center mt-12"
      >
        <Button
          asChild
          size="lg"
          className="group px-8 py-6 text-base font-bold rounded-full transition-colors duration-300"
          style={{
            backgroundColor: accentColor,
          }}
        >
          <a href={ctaLink} className="flex items-center gap-3 min-h-[44px] text-white hover:opacity-90">
            <span>{ctaText}</span>
            <ArrowLeft className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" />
          </a>
        </Button>
      </motion.div>
    </section>
  );
});

export default LandingPortfolioMarquee;
