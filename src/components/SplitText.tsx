import { useMemo } from "react";
import { motion } from "framer-motion";

interface SplitTextProps {
  text: string;
  className?: string;
  delay?: number;
  staggerChildren?: number;
}

// Static child variant - never changes, so defined outside component
const childVariant = {
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      damping: 12,
      stiffness: 100,
    },
  },
  hidden: {
    opacity: 0,
    y: 20,
  },
};

const SplitText = ({
  text,
  className = "",
  delay = 0,
  staggerChildren = 0.03
}: SplitTextProps) => {
  // Memoize words array to prevent recalculation on every render
  const words = useMemo(() => text.split(" "), [text]);

  // Memoize container variant since it depends on props
  const containerVariant = useMemo(() => ({
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren,
        delayChildren: delay,
      },
    },
  }), [staggerChildren, delay]);

  return (
    <motion.span
      className={`inline-flex flex-wrap gap-x-2 ${className}`}
      variants={containerVariant}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
    >
      {words.map((word, index) => (
        <motion.span
          key={index}
          variants={childVariant}
          className="inline-block"
        >
          {word}
        </motion.span>
      ))}
    </motion.span>
  );
};

export default SplitText;
