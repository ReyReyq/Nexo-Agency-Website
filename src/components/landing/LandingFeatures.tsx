import { memo, useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { getIcon } from "@/data/iconMap";
import { Check, ChevronLeft, ChevronRight } from "lucide-react";
import type { LandingFeaturesContent } from "@/types/landingPage";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";

// Animation constants
const INITIAL_FADE_UP = { opacity: 0, y: 40 };
const ANIMATE_VISIBLE = { opacity: 1, y: 0 };
const IN_VIEW_OPTIONS = { once: true, margin: "-100px" as const };

export interface LandingFeaturesProps {
  content: LandingFeaturesContent;
  accentColor: string;
  gradient: string;
}

// Feature Card Component - shared between grid and carousel
interface FeatureCardProps {
  item: LandingFeaturesContent['items'][0];
  index: number;
  accentColor: string;
  gradient: string;
  isInView: boolean;
  isCarousel?: boolean;
}

const FeatureCard = memo(({ item, index, accentColor, gradient, isInView, isCarousel = false }: FeatureCardProps) => {
  const Icon = getIcon(item.icon);
  const isHighlighted = item.highlight;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      whileHover={!isCarousel ? { y: -6, scale: 1.02 } : undefined}
      transition={{ delay: isCarousel ? 0 : 0.1 + index * 0.08, duration: 0.5 }}
      className={`group relative rounded-2xl p-6 transition-all duration-300 h-full ${
        isHighlighted
          ? `bg-gradient-to-br ${gradient} text-white shadow-xl`
          : 'bg-nexo-light hover:shadow-lg border border-nexo-mist/30'
      }`}
    >
      {/* Highlight badge */}
      {isHighlighted && (
        <div className="absolute -top-3 right-4 bg-white text-xs font-bold px-3 py-1 rounded-full shadow-md"
          style={{ color: accentColor }}
        >
          <span className="flex items-center gap-1">
            <Check className="w-3 h-3" />
            מומלץ
          </span>
        </div>
      )}

      {/* Icon */}
      <div
        className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110 ${
          isHighlighted ? 'bg-white/20' : ''
        }`}
        style={!isHighlighted ? { backgroundColor: `${accentColor}15` } : {}}
      >
        <Icon
          className="w-7 h-7"
          style={{ color: isHighlighted ? 'white' : accentColor }}
        />
      </div>

      {/* Content */}
      <h3 className={`text-lg font-bold mb-2 ${
        isHighlighted ? 'text-white' : 'text-nexo-charcoal'
      }`}>
        {item.title}
      </h3>
      <p className={`text-sm leading-relaxed ${
        isHighlighted ? 'text-white/80' : 'text-nexo-steel'
      }`}>
        {item.description}
      </p>
    </motion.div>
  );
});

FeatureCard.displayName = 'FeatureCard';

const LandingFeatures = memo(({ content, accentColor, gradient }: LandingFeaturesProps) => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, IN_VIEW_OPTIONS);
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) return;
    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());
    api.on("select", () => setCurrent(api.selectedScrollSnap()));
  }, [api]);

  return (
    <section
      ref={sectionRef}
      className="py-20 md:py-28 bg-white relative overflow-hidden"
      dir="rtl"
    >
      {/* Background decorations */}
      <div
        className="absolute top-0 left-0 w-96 h-96 rounded-full blur-[150px] opacity-10"
        style={{ backgroundColor: accentColor }}
      />
      <div
        className="absolute bottom-0 right-0 w-64 h-64 rounded-full blur-[120px] opacity-10"
        style={{ backgroundColor: accentColor }}
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={INITIAL_FADE_UP}
          animate={isInView ? ANIMATE_VISIBLE : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-16 max-w-3xl mx-auto"
        >
          {/* Accent line */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="h-1 w-20 mx-auto mb-6 origin-center"
            style={{ backgroundColor: accentColor }}
          />

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-nexo-charcoal mb-4">
            {content.title}
          </h2>

          {content.subtitle && (
            <p className="text-nexo-steel text-lg sm:text-xl mb-4">
              {content.subtitle}
            </p>
          )}

          {content.description && (
            <p className="text-nexo-ash text-base">
              {content.description}
            </p>
          )}
        </motion.div>

        {/* Desktop: Grid layout */}
        <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {content.items.map((item, index) => (
            <FeatureCard
              key={index}
              item={item}
              index={index}
              accentColor={accentColor}
              gradient={gradient}
              isInView={isInView}
            />
          ))}
        </div>

        {/* Mobile: Carousel layout */}
        <div className="sm:hidden">
          <Carousel
            setApi={setApi}
            opts={{
              align: "start",
              loop: true,
              direction: "rtl",
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-4">
              {content.items.map((item, index) => (
                <CarouselItem key={index} className="pl-4 basis-[85%]">
                  <FeatureCard
                    item={item}
                    index={index}
                    accentColor={accentColor}
                    gradient={gradient}
                    isInView={isInView}
                    isCarousel
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>

          {/* Carousel indicators and controls */}
          <div className="flex items-center justify-center gap-4 mt-6">
            <button
              onClick={() => api?.scrollPrev()}
              className="w-10 h-10 rounded-full bg-nexo-light flex items-center justify-center hover:bg-nexo-mist transition-colors"
              aria-label="הקודם"
            >
              <ChevronRight className="w-5 h-5 text-nexo-charcoal" />
            </button>

            {/* Dots */}
            <div className="flex gap-2">
              {Array.from({ length: count }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => api?.scrollTo(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    current === index ? 'w-6' : ''
                  }`}
                  style={{ backgroundColor: current === index ? accentColor : '#e0e0e0' }}
                  aria-label={`עבור לשקופית ${index + 1}`}
                />
              ))}
            </div>

            <button
              onClick={() => api?.scrollNext()}
              className="w-10 h-10 rounded-full bg-nexo-light flex items-center justify-center hover:bg-nexo-mist transition-colors"
              aria-label="הבא"
            >
              <ChevronLeft className="w-5 h-5 text-nexo-charcoal" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
});

LandingFeatures.displayName = 'LandingFeatures';

export default LandingFeatures;
