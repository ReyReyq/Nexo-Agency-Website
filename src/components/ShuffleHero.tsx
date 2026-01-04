import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

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

const shuffle = (array) => {
  let currentIndex = array.length,
    randomIndex;

  while (currentIndex != 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
};

const squareData = [
  { id: 1, src: "/images/websites-pictures/Gemini%20Generated%20Image%20%281%29.png" },
  { id: 2, src: "/images/websites-pictures/Gemini%20Generated%20Image%20%282%29.png" },
  { id: 3, src: "/images/websites-pictures/Gemini%20Generated%20Image%20%283%29.png" },
  { id: 4, src: "/images/websites-pictures/Gemini%20Generated%20Image%20%284%29.png" },
  { id: 5, src: "/images/websites-pictures/Gemini%20Generated%20Image%20%285%29.png" },
  { id: 6, src: "/images/websites-pictures/Gemini%20Generated%20Image%20%286%29.png" },
  { id: 7, src: "/images/websites-pictures/Gemini%20Generated%20Image%20%287%29.png" },
  { id: 8, src: "/images/websites-pictures/Gemini%20Generated%20Image%20%288%29.png" },
  { id: 9, src: "/images/websites-pictures/Google%20Gemini%20Image%20%281%29.png" },
  { id: 10, src: "/images/websites-pictures/Google%20Gemini%20Image%20%282%29.png" },
  { id: 11, src: "/images/websites-pictures/Google%20Gemini%20Image%20%283%29.png" },
  { id: 12, src: "/images/websites-pictures/Google%20Gemini%20Image%20%284%29.png" },
  { id: 13, src: "/images/websites-pictures/Google%20Gemini%20Image%20%285%29.png" },
  { id: 14, src: "/images/websites-pictures/Google%20Gemini%20Image%20%286%29.png" },
  { id: 15, src: "/images/websites-pictures/Google%20Gemini%20Image%20%287%29.png" },
  { id: 16, src: "/images/websites-pictures/Google%20Gemini%20Image%20%288%29.png" },
];

const generateSquares = () => {
  return shuffle(squareData).map((sq) => (
    <motion.div
      key={sq.id}
      layout
      transition={{ duration: 1.5, type: "spring" }}
      className="w-full h-full"
      style={{
        backgroundImage: `url(${sq.src})`,
        backgroundSize: "cover",
      }}
    ></motion.div>
  ));
};

const ShuffleGrid = () => {
  const timeoutRef = useRef(null);
  const [squares, setSquares] = useState(generateSquares());

  useEffect(() => {
    shuffleSquares();

    return () => clearTimeout(timeoutRef.current);
  }, []);

  const shuffleSquares = () => {
    setSquares(generateSquares());

    timeoutRef.current = setTimeout(shuffleSquares, 3000);
  };

  return (
    <div className="grid grid-cols-4 grid-rows-4 h-[280px] sm:h-[350px] md:h-[450px] gap-1">
      {squares.map((sq) => sq)}
    </div>
  );
};

export default ShuffleHero;
