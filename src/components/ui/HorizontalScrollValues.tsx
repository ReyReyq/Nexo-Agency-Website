import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { LucideIcon } from "lucide-react";

interface ValueItem {
  icon: LucideIcon;
  title: string;
  desc: string;
}

interface HorizontalScrollValuesProps {
  values: ValueItem[];
}

const HorizontalScrollValues = ({ values }: HorizontalScrollValuesProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // Track scroll position for parallax
  const { scrollXProgress } = useScroll({
    container: scrollRef,
  });

  // Update active index based on scroll
  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    const handleScroll = () => {
      const scrollLeft = scrollContainer.scrollLeft;
      const cardWidth = scrollContainer.offsetWidth;
      const newIndex = Math.round(scrollLeft / cardWidth);
      setActiveIndex(Math.min(newIndex, values.length - 1));
    };

    scrollContainer.addEventListener("scroll", handleScroll);
    return () => scrollContainer.removeEventListener("scroll", handleScroll);
  }, [values.length]);

  const scrollToIndex = (index: number) => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    const cardWidth = scrollContainer.offsetWidth;
    scrollContainer.scrollTo({
      left: index * cardWidth,
      behavior: "smooth",
    });
  };

  return (
    <div ref={containerRef} className="relative">
      {/* Scroll Container */}
      <div
        ref={scrollRef}
        className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {values.map((value, index) => {
          const IconComponent = value.icon;

          return (
            <motion.div
              key={value.title}
              className="min-w-full snap-center px-4 md:px-8"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="relative h-[320px] sm:h-[380px] md:h-[450px] rounded-3xl bg-gradient-to-br from-primary/10 via-hero-bg to-hero-bg border border-primary/20 overflow-hidden">
                {/* Background decoration */}
                <div className="absolute top-0 right-0 w-1/2 h-full opacity-10">
                  <div className="absolute top-10 right-10 w-64 h-64 rounded-full bg-primary blur-3xl" />
                  <div className="absolute bottom-10 right-32 w-48 h-48 rounded-full bg-primary/50 blur-2xl" />
                </div>

                {/* Content */}
                <div className="relative z-10 h-full flex flex-col justify-center p-8 md:p-16 max-w-4xl">
                  {/* Number indicator */}
                  <span className="text-8xl md:text-9xl font-black text-primary/10 absolute top-4 right-8 md:top-8 md:right-16">
                    0{index + 1}
                  </span>

                  {/* Icon */}
                  <motion.div
                    className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-primary/20 flex items-center justify-center mb-6"
                    whileHover={{ rotate: 10, scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <IconComponent className="w-8 h-8 md:w-10 md:h-10 text-primary" />
                  </motion.div>

                  {/* Title */}
                  <h3 className="text-3xl md:text-5xl font-black text-hero-fg mb-4 md:mb-6">
                    {value.title}
                  </h3>

                  {/* Description */}
                  <p className="text-lg md:text-xl text-hero-fg/70 leading-relaxed max-w-2xl">
                    {value.desc}
                  </p>
                </div>

                {/* Scroll hint for first card */}
                {index === 0 && (
                  <motion.div
                    className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 text-hero-fg/40"
                    animate={{ x: [0, 10, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  >
                    <span className="text-sm">גלול לצד</span>
                    <svg className="w-5 h-5 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </motion.div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Progress Dots */}
      <div className="flex justify-center gap-3 mt-8">
        {values.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollToIndex(index)}
            className="group relative p-2"
            aria-label={`Go to value ${index + 1}`}
          >
            <motion.div
              className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                activeIndex === index
                  ? "bg-primary"
                  : "bg-hero-fg/20 group-hover:bg-hero-fg/40"
              }`}
              animate={{
                scale: activeIndex === index ? 1.3 : 1,
              }}
              transition={{ type: "spring", stiffness: 300 }}
            />
            {activeIndex === index && (
              <motion.div
                className="absolute inset-0 m-auto w-3 h-3 rounded-full bg-primary/30"
                animate={{ scale: [1, 2, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ repeat: Infinity, duration: 2 }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Navigation Arrows */}
      <div className="hidden md:flex absolute top-1/2 -translate-y-1/2 left-4 right-4 justify-between pointer-events-none">
        <motion.button
          onClick={() => scrollToIndex(Math.max(0, activeIndex - 1))}
          className={`w-12 h-12 rounded-full bg-hero-bg/80 backdrop-blur-sm border border-primary/20 flex items-center justify-center pointer-events-auto transition-opacity ${
            activeIndex === 0 ? "opacity-30 cursor-not-allowed" : "opacity-100 hover:bg-primary/20"
          }`}
          whileHover={activeIndex !== 0 ? { scale: 1.1 } : {}}
          whileTap={activeIndex !== 0 ? { scale: 0.95 } : {}}
          disabled={activeIndex === 0}
        >
          <svg className="w-6 h-6 text-hero-fg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </motion.button>

        <motion.button
          onClick={() => scrollToIndex(Math.min(values.length - 1, activeIndex + 1))}
          className={`w-12 h-12 rounded-full bg-hero-bg/80 backdrop-blur-sm border border-primary/20 flex items-center justify-center pointer-events-auto transition-opacity ${
            activeIndex === values.length - 1 ? "opacity-30 cursor-not-allowed" : "opacity-100 hover:bg-primary/20"
          }`}
          whileHover={activeIndex !== values.length - 1 ? { scale: 1.1 } : {}}
          whileTap={activeIndex !== values.length - 1 ? { scale: 0.95 } : {}}
          disabled={activeIndex === values.length - 1}
        >
          <svg className="w-6 h-6 text-hero-fg rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </motion.button>
      </div>
    </div>
  );
};

export default HorizontalScrollValues;
