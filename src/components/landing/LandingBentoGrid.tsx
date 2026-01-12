import { memo, useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";

// Vibrant card colors for bento grid
const bentoCardColors = [
  "bg-emerald-300",
  "bg-indigo-300",
  "bg-rose-300",
  "bg-amber-300",
  "bg-cyan-300",
  "bg-violet-300",
  "bg-orange-300",
  "bg-teal-300",
];

// Arrow Icon for bento cards
const BentoArrowIcon = memo(({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="m9 18 6-6-6-6" />
  </svg>
));

BentoArrowIcon.displayName = "BentoArrowIcon";

export interface LandingBentoItem {
  name: string;
  description: string;
  href: string;
}

export interface LandingBentoGridProps {
  title: string;
  subtitle?: string;
  items: LandingBentoItem[];
  accentColor: string;
}

// Bento Card Component
interface BentoCardProps {
  item: LandingBentoItem;
  index: number;
  colorClass: string;
}

const BentoCard = memo(({ item, index, colorClass }: BentoCardProps) => {
  return (
    <Link to={item.href} className="block h-full w-full">
      <motion.div
        whileHover="hovered"
        className={`group h-full w-full border-2 border-black ${colorClass}`}
        dir="rtl"
      >
        {/* Layer 2 (middle) */}
        <motion.div
          initial={{ x: 0, y: 0 }}
          variants={{ hovered: { x: -5, y: -5 } }}
          transition={{ type: "spring", bounce: 0.5 }}
          className={`-m-0.5 h-full border-2 border-black ${colorClass}`}
        >
          {/* Layer 3 (top - main content) */}
          <motion.div
            initial={{ x: 0, y: 0 }}
            variants={{ hovered: { x: -5, y: -5 } }}
            transition={{ type: "spring", bounce: 0.5 }}
            className={`relative -m-0.5 flex h-full flex-col justify-between overflow-hidden border-2 border-black ${colorClass} p-4`}
          >
            {/* Arrow + Title */}
            <p className="flex items-center text-sm font-medium uppercase">
              <BentoArrowIcon className="-mr-5 ml-1 h-4 w-4 opacity-0 transition-all duration-300 group-hover:mr-0 group-hover:opacity-100" />
              <span className="font-bold leading-tight">{item.name}</span>
            </p>

            {/* Description + Button */}
            <div>
              <p className="text-xs leading-relaxed line-clamp-2 transition-[margin] duration-300 group-hover:mb-10">
                {item.description}
              </p>
              <span className="absolute bottom-1.5 left-1.5 right-1.5 translate-y-full border-2 border-black bg-white px-3 py-2 text-xs font-bold uppercase text-center opacity-0 transition-all duration-300 hover:bg-black hover:text-white group-hover:translate-y-0 group-hover:opacity-100">
                למידע נוסף
              </span>
            </div>

            {/* Rotating text circle in corner */}
            <motion.svg
              viewBox="0 0 100 100"
              className="absolute -left-2 -top-2 h-14 w-14"
              animate={{ rotate: 360 }}
              transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            >
              <defs>
                <path
                  id={`landingBentoCircle-${index}`}
                  d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"
                />
              </defs>
              <text className="fill-black text-[10px] font-bold uppercase opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <textPath href={`#landingBentoCircle-${index}`}>
                  למידע נוסף * למידע נוסף * למידע נוסף *
                </textPath>
              </text>
            </motion.svg>
          </motion.div>
        </motion.div>
      </motion.div>
    </Link>
  );
});

BentoCard.displayName = "BentoCard";

const LandingBentoGrid = memo(({ title, subtitle, items, accentColor }: LandingBentoGridProps) => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) return;
    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());
    api.on("select", () => setCurrent(api.selectedScrollSnap()));
  }, [api]);

  if (items.length === 0) return null;

  return (
    <section
      ref={sectionRef}
      className="py-16 md:py-24 bg-white relative overflow-hidden"
      dir="rtl"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 md:mb-14 max-w-3xl mx-auto"
        >
          {/* Accent line */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="h-1 w-20 mx-auto mb-6 origin-center"
            style={{ backgroundColor: accentColor }}
          />

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-nexo-charcoal mb-3">
            {title}
          </h2>

          {subtitle && (
            <p className="text-nexo-steel text-base sm:text-lg">
              {subtitle}
            </p>
          )}
        </motion.div>

        {/* Desktop: Grid layout */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 max-w-6xl mx-auto">
          {items.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 + index * 0.05, duration: 0.4 }}
              className="h-[180px]"
            >
              <BentoCard
                item={item}
                index={index}
                colorClass={bentoCardColors[index % bentoCardColors.length]}
              />
            </motion.div>
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
              {items.map((item, index) => (
                <CarouselItem key={index} className="pl-4 basis-[75%]">
                  <div className="h-[160px]">
                    <BentoCard
                      item={item}
                      index={index}
                      colorClass={bentoCardColors[index % bentoCardColors.length]}
                    />
                  </div>
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

LandingBentoGrid.displayName = "LandingBentoGrid";

export default LandingBentoGrid;
