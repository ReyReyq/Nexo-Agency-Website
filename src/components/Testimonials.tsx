import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Quote, ChevronRight, ChevronLeft, Star } from "lucide-react";

// Animation variants - defined outside component to prevent recreation
const testimonialVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
    scale: 0.9,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 300 : -300,
    opacity: 0,
    scale: 0.9,
  }),
};

// Avatar images - using local optimized images for better performance
const testimonials = [
  {
    name: "דנה כהן",
    role: "מנכ״לית, TechFlow",
    image: "/images/gallery/editorial-woman-smile.jpg",
    content: "NEXO שינו לנו את הפנים של העסק. האתר החדש הכפיל את כמות הפניות תוך חודשיים. הצוות מקצועי, יצירתי ותמיד זמין. ממליצה בחום!",
    rating: 5,
  },
  {
    name: "יוסי לוי",
    role: "בעלים, CloudNine",
    image: "/images/gallery/portrait-professional-man.jpg",
    content: "עבדנו עם הרבה סוכנויות, אבל NEXO זה משהו אחר לגמרי. הם לא רק בנו לנו אתר - הם הבינו את העסק שלנו ויצרו חוויה שמוכרת.",
    rating: 5,
  },
  {
    name: "מיכל אברהם",
    role: "סמנכ״לית שיווק, GrowthLabs",
    image: "/images/gallery/editorial-woman-laughing.jpg",
    content: "הפתרון של ה-AI שהם פיתחו לנו חסך לנו 20 שעות עבודה בשבוע. השירות יוצא דופן והתוצאות מדברות בעד עצמן.",
    rating: 5,
  },
  {
    name: "אבי שמעון",
    role: "מייסד, StartupHub",
    image: "/images/gallery/portrait-business-man.jpg",
    content: "המיתוג שקיבלנו מ-NEXO הפך אותנו ממותג סטארט-אפ קטן למותג שנראה כמו חברה גדולה. עבודה מקצועית ברמה הגבוהה ביותר.",
    rating: 5,
  },
];

const AUTOPLAY_INTERVAL = 6000;
const TESTIMONIALS_COUNT = testimonials.length;

const Testimonials = () => {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isMountedRef = useRef(true);

  // Memoized star arrays to prevent recreation on each render
  const starArrays = useMemo(() =>
    testimonials.map(t => [...Array(t.rating)]),
    []
  );

  // Helper to start/restart the autoplay interval
  const startAutoplay = useCallback(() => {
    // Clear any existing interval first
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    // Only start if component is still mounted
    if (isMountedRef.current) {
      intervalRef.current = setInterval(() => {
        if (isMountedRef.current) {
          setDirection(1);
          setCurrent((prev) => (prev + 1) % TESTIMONIALS_COUNT);
        }
      }, AUTOPLAY_INTERVAL);
    }
  }, []);

  // Helper to stop autoplay
  const stopAutoplay = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    isMountedRef.current = true;
    startAutoplay();

    return () => {
      isMountedRef.current = false;
      stopAutoplay();
    };
  }, [startAutoplay, stopAutoplay]);

  // Memoized navigate function - restarts interval after manual navigation
  const navigate = useCallback((dir: number) => {
    stopAutoplay();
    setDirection(dir);
    setCurrent((prev) => {
      if (dir === 1) return (prev + 1) % TESTIMONIALS_COUNT;
      return prev === 0 ? TESTIMONIALS_COUNT - 1 : prev - 1;
    });
    startAutoplay();
  }, [startAutoplay, stopAutoplay]);

  // Memoized navigation handlers
  const handlePrev = useCallback(() => navigate(-1), [navigate]);
  const handleNext = useCallback(() => navigate(1), [navigate]);

  // Memoized dot click handler - uses functional update to avoid stale closure
  const handleDotClick = useCallback((index: number) => {
    stopAutoplay();
    setCurrent((prevCurrent) => {
      setDirection(index > prevCurrent ? 1 : -1);
      return index;
    });
    startAutoplay();
  }, [startAutoplay, stopAutoplay]);

  return (
    <section className="py-24 md:py-32 bg-background overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, type: "spring" }}
            className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6"
          >
            <Quote className="w-8 h-8 text-primary" />
          </motion.div>
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-black text-foreground leading-tight mb-4">
            מה הלקוחות
            <br />
            <span className="text-gradient">אומרים עלינו</span>
          </h2>
        </motion.div>

        {/* Testimonials Carousel */}
        <div className="relative max-w-4xl mx-auto">
          <div className="relative min-h-[320px] sm:min-h-[360px] md:min-h-[400px] flex items-center justify-center">
            <AnimatePresence custom={direction} mode="wait">
              <motion.div
                key={current}
                custom={direction}
                variants={testimonialVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="absolute w-full"
              >
                <div className="glass rounded-3xl p-8 md:p-12 text-center">
                  {/* Stars */}
                  <div className="flex justify-center gap-1 mb-6">
                    {starArrays[current].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.1 }}
                      >
                        <Star className="w-6 h-6 fill-primary text-primary" />
                      </motion.div>
                    ))}
                  </div>

                  {/* Quote */}
                  <p className="text-xl md:text-2xl lg:text-3xl text-foreground font-medium leading-relaxed mb-8">
                    "{testimonials[current].content}"
                  </p>

                  {/* Author */}
                  <div className="flex items-center justify-center gap-4">
                    <img
                      src={testimonials[current].image}
                      alt={testimonials[current].name}
                      loading="lazy"
                      decoding="async"
                      width={56}
                      height={56}
                      className="w-14 h-14 rounded-full object-cover border-2 border-primary"
                    />
                    <div className="text-right">
                      <div className="font-bold text-foreground text-lg">
                        {testimonials[current].name}
                      </div>
                      <div className="text-muted-foreground">
                        {testimonials[current].role}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handlePrev}
              className="w-12 h-12 rounded-full border border-border flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all"
            >
              <ChevronRight className="w-5 h-5" />
            </motion.button>

            {/* Dots */}
            <div className="flex gap-1">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => handleDotClick(index)}
                  className="p-3 -m-1 flex items-center justify-center min-w-[44px] min-h-[44px]"
                  aria-label={`Go to testimonial ${index + 1}`}
                >
                  <span
                    className={`block h-2 rounded-full transition-all duration-300 ${
                      index === current
                        ? "w-8 bg-primary"
                        : "w-2 bg-border hover:bg-muted-foreground"
                    }`}
                  />
                </button>
              ))}
            </div>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleNext}
              className="w-12 h-12 rounded-full border border-border flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
