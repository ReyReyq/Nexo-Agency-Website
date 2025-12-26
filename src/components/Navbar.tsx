import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";

const navLinks = [
  { label: "בית", href: "/" },
  { label: "שירותים", href: "/services" },
  { label: "עבודות", href: "/portfolio" },
  { label: "אודות", href: "/about" },
  { label: "בלוג", href: "/blog" },
  { label: "צור קשר", href: "/contact" },
];

// Animation variants - synced with Hero animations (both start at 100ms, both finish ~1.3s)
const navContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12, // Match Hero's stagger (0.12s)
      delayChildren: 0.1, // Start at 100ms with Hero
    },
  },
};

const navItemVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8, // Match Hero text duration (0.8s)
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

const logoVariants = {
  hidden: { opacity: 0, x: 30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.8, // Match Hero text duration
      delay: 0.1, // Start at 100ms with Hero
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

const emailVariants = {
  hidden: { opacity: 0, x: -30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.8, // Match Hero text duration
      delay: 0.1, // Start at 100ms with Hero
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isPastHero, setIsPastHero] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      setIsPastHero(window.scrollY > window.innerHeight - 100);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  return (
    <>
      <motion.nav
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? isPastHero
              ? "glass py-3 shadow-sm"
              : "glass-dark py-3"
            : "bg-transparent py-6"
        }`}
      >
        <div className="container mx-auto px-6 flex items-center justify-between">
          {/* Email - far left */}
          <motion.div
            className="hidden lg:flex items-center"
            variants={emailVariants}
            initial="hidden"
            animate="visible"
          >
            <a
              href="mailto:hello@nexo.agency"
              className={`text-sm font-bold transition-colors duration-300 ${
                isPastHero ? "text-foreground" : "text-hero-fg"
              }`}
            >
              hello@nexo.agency
            </a>
          </motion.div>

          {/* Nav Links - center */}
          <motion.div
            className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2"
            variants={navContainerVariants}
            initial="hidden"
            animate="visible"
          >
            {navLinks.map((link) => (
              <motion.div
                key={link.href}
                variants={navItemVariants}
              >
                <Link
                  to={link.href}
                  className={`text-sm font-bold transition-colors duration-300 link-underline ${
                    location.pathname === link.href
                      ? "text-primary"
                      : isPastHero
                      ? "text-foreground hover:text-primary"
                      : "text-hero-fg hover:text-primary"
                  }`}
                >
                  {link.label}
                </Link>
              </motion.div>
            ))}
          </motion.div>

          {/* Mobile Menu Button - shown on left for mobile */}
          <motion.div
            className="md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            <Button
              variant="ghost"
              size="icon"
              className={`transition-colors ${
                isPastHero ? "text-foreground" : "text-hero-fg"
              }`}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </motion.div>

          {/* Logo - right side */}
          <motion.div
            variants={logoVariants}
            initial="hidden"
            animate="visible"
          >
            <Link
              to="/"
              className="flex items-center transition-all duration-300"
            >
              <img
                src="/logo.svg"
                alt="Nexo"
                className={`h-8 md:h-10 w-auto transition-all duration-300 ${
                  isPastHero ? "" : "brightness-0 invert"
                }`}
              />
            </Link>
          </motion.div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-background pt-24 md:hidden"
          >
            <div className="flex flex-col items-center gap-8 p-8">
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    to={link.href}
                    className={`text-2xl font-bold transition-colors ${
                      location.pathname === link.href
                        ? "text-primary"
                        : "text-foreground hover:text-primary"
                    }`}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
