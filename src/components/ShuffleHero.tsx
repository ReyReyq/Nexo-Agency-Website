import { motion } from "framer-motion";
import { useEffect, useRef, useState, memo } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

// Memoized image component with lazy loading
const OptimizedGridImage = memo(function OptimizedGridImage({
  src,
  index,
  isVisible
}: {
  src: string;
  index: number;
  isVisible: boolean;
}) {
  const [isLoaded, setIsLoaded] = useState(false);

  // Only load if visible (intersection observer based)
  if (!isVisible) {
    return (
      <div
        className="w-full h-full bg-muted animate-pulse"
        aria-hidden="true"
      />
    );
  }

  return (
    <div className="w-full h-full relative overflow-hidden">
      {/* Placeholder shown until loaded */}
      {!isLoaded && (
        <div
          className="absolute inset-0 bg-muted animate-pulse"
          aria-hidden="true"
        />
      )}
      <img
        src={src}
        alt={`Portfolio preview ${index + 1}`}
        loading="lazy"
        decoding="async"
        width={200}
        height={200}
        onLoad={() => setIsLoaded(true)}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </div>
  );
});

const ShuffleHero = () => {
  return (
    <div className="w-full bg-hero-bg pt-32 pb-12">
      <section className="w-full px-8 py-12 grid grid-cols-1 md:grid-cols-2 items-center gap-8 max-w-6xl mx-auto">
        <div>
          <span className="block mb-4 text-xs md:text-sm text-primary font-medium">
            NEXO Digital
          </span>
          <h3 className="text-4xl md:text-6xl font-semibold text-hero-fg">
            הדיגיטל שלכם
            <br />
            <span className="text-primary">שווה יותר.</span>
          </h3>
          <p className="text-base md:text-lg text-hero-fg/60 my-4 md:my-6">
            השאלה היא לא אם אתם צריכים נוכחות דיגיטלית חזקה.
            השאלה היא למה עדיין אין לכם אחת.
          </p>
          <Link
            to="/contact#contact-form"
            className="inline-flex items-center gap-2 bg-primary text-white font-medium py-2 px-4 rounded transition-all hover:bg-primary/90 active:scale-95"
          >
            בואו נדבר
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>
        <ShuffleGrid />
      </section>
    </div>
  );
};

const shuffle = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  let currentIndex = shuffled.length,
    randomIndex;

  while (currentIndex != 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [shuffled[currentIndex], shuffled[randomIndex]] = [
      shuffled[randomIndex],
      shuffled[currentIndex],
    ];
  }

  return shuffled;
};

const squareData = [
  { id: 1, src: "/images/websites-pictures/portfolio-website-01.webp" },
  { id: 2, src: "/images/websites-pictures/portfolio-website-02.webp" },
  { id: 3, src: "/images/websites-pictures/portfolio-website-03.webp" },
  { id: 4, src: "/images/websites-pictures/portfolio-website-04.webp" },
  { id: 5, src: "/images/websites-pictures/portfolio-website-05.webp" },
  { id: 6, src: "/images/websites-pictures/portfolio-website-06.webp" },
  { id: 7, src: "/images/websites-pictures/portfolio-website-07.webp" },
  { id: 8, src: "/images/websites-pictures/portfolio-website-08.webp" },
  { id: 9, src: "/images/websites-pictures/portfolio-website-17.webp" },
  { id: 10, src: "/images/websites-pictures/portfolio-website-18.webp" },
  { id: 11, src: "/images/websites-pictures/portfolio-website-19.webp" },
  { id: 12, src: "/images/websites-pictures/portfolio-website-20.webp" },
  { id: 13, src: "/images/websites-pictures/portfolio-website-21.webp" },
  { id: 14, src: "/images/websites-pictures/portfolio-website-22.webp" },
  { id: 15, src: "/images/websites-pictures/portfolio-website-23.webp" },
  { id: 16, src: "/images/websites-pictures/portfolio-website-24.webp" },
];

// Generate shuffled square data (not elements - elements created in render)
const generateShuffledData = () => shuffle(squareData);

const ShuffleGrid = () => {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [shuffledData, setShuffledData] = useState(generateShuffledData);
  const [isVisible, setIsVisible] = useState(false);

  // Intersection observer to detect when grid is in viewport
  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect(); // Only need to detect once
        }
      },
      { rootMargin: '100px' } // Start loading slightly before visible
    );

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Shuffle animation loop
  useEffect(() => {
    if (!isVisible) return; // Don't start shuffling until visible

    const shuffleSquares = () => {
      setShuffledData(generateShuffledData());
      timeoutRef.current = setTimeout(shuffleSquares, 3000);
    };

    shuffleSquares();

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [isVisible]);

  return (
    <div
      ref={containerRef}
      className="grid grid-cols-4 grid-rows-4 h-[280px] sm:h-[350px] md:h-[450px] gap-1"
    >
      {shuffledData.map((sq, index) => (
        <motion.div
          key={sq.id}
          layout
          transition={{ duration: 1.5, type: "spring" as const }}
          className="w-full h-full overflow-hidden"
        >
          <OptimizedGridImage
            src={sq.src}
            index={index}
            isVisible={isVisible}
          />
        </motion.div>
      ))}
    </div>
  );
};

export default ShuffleHero;
