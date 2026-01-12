import { memo, useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { getIcon } from "@/data/iconMap";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { LandingPainPointsContent } from "@/types/landingPage";
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

export interface LandingPainPointsProps {
  content: LandingPainPointsContent;
  accentColor: string;
}

// Pain Point Card Component - shared between grid and carousel
interface PainPointCardProps {
  item: LandingPainPointsContent['items'][0];
  index: number;
  accentColor: string;
  isInView: boolean;
  isCarousel?: boolean;
}

const PainPointCard = memo(({ item, index, accentColor, isInView, isCarousel = false }: PainPointCardProps) => {
  const Icon = getIcon(item.icon);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, rotate: isCarousel ? 0 : (index % 2 === 0 ? -1 : 1) }}
      animate={isInView ? { opacity: 1, y: 0, rotate: isCarousel ? 0 : (index % 2 === 0 ? -1 : 1) } : {}}
      whileHover={!isCarousel ? { rotate: 0, scale: 1.02, y: -4 } : undefined}
      transition={{ delay: isCarousel ? 0 : 0.1 + index * 0.1, duration: 0.5 }}
      className="group relative h-full"
    >
      <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-nexo-mist/50 h-full">
        {/* Icon */}
        <div
          className="w-14 h-14 rounded-xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110"
          style={{ backgroundColor: `${accentColor}15` }}
        >
          <Icon
            className="w-7 h-7"
            style={{ color: accentColor }}
          />
        </div>

        {/* Content */}
        <h3 className="text-xl font-bold text-nexo-charcoal mb-2">
          {item.title}
        </h3>
        <p className="text-nexo-steel text-base leading-relaxed">
          {item.description}
        </p>

        {/* Decorative corner accent */}
        <div
          className="absolute top-0 right-0 w-16 h-16 opacity-5 rounded-bl-full"
          style={{ backgroundColor: accentColor }}
        />
      </div>
    </motion.div>
  );
});

PainPointCard.displayName = 'PainPointCard';

const LandingPainPoints = memo(({ content, accentColor }: LandingPainPointsProps) => {
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
      className="py-20 md:py-28 bg-nexo-light relative overflow-hidden"
      dir="rtl"
    >
      {/* Subtle pattern background */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, var(--nexo-charcoal) 1px, transparent 0)`,
          backgroundSize: '32px 32px',
        }}
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
            <p className="text-nexo-steel text-lg sm:text-xl">
              {content.subtitle}
            </p>
          )}
        </motion.div>

        {/* Desktop: Grid layout */}
        <div className="hidden md:grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {content.items.map((item, index) => (
            <PainPointCard
              key={index}
              item={item}
              index={index}
              accentColor={accentColor}
              isInView={isInView}
            />
          ))}
        </div>

        {/* Mobile: Carousel layout */}
        <div className="md:hidden">
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
                <CarouselItem key={index} className="pl-4 basis-[90%]">
                  <PainPointCard
                    item={item}
                    index={index}
                    accentColor={accentColor}
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
              className="w-10 h-10 rounded-full bg-white flex items-center justify-center hover:bg-nexo-mist transition-colors shadow-sm"
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
                  style={{ backgroundColor: current === index ? accentColor : '#d0d0d0' }}
                  aria-label={`עבור לשקופית ${index + 1}`}
                />
              ))}
            </div>

            <button
              onClick={() => api?.scrollNext()}
              className="w-10 h-10 rounded-full bg-white flex items-center justify-center hover:bg-nexo-mist transition-colors shadow-sm"
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

LandingPainPoints.displayName = 'LandingPainPoints';

export default LandingPainPoints;
