import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useEffect, useCallback, memo } from "react";

interface LiquidSideNavProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const navLinks = [
  { label: "בית", href: "/" },
  { label: "שירותים", href: "/services" },
  { label: "עבודות", href: "/portfolio" },
  { label: "אודות", href: "/about" },
  { label: "בלוג", href: "/blog" },
  { label: "צור קשר", href: "/contact" },
];

const LiquidSideNav = ({ isOpen, setIsOpen }: LiquidSideNavProps) => {
  const location = useLocation();

  // Memoized close handler
  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, [setIsOpen]);

  // Close menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname, setIsOpen]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.nav
          className="fixed inset-0 z-50 bg-white"
          initial="closed"
          animate="open"
          exit="closed"
          variants={navVariants}
        >
          {/* Background gradient overlay */}
          <motion.div
            className="absolute inset-0 opacity-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.05 }}
            exit={{ opacity: 0 }}
            style={{
              background: "radial-gradient(circle at 30% 70%, hsl(328 100% 54%) 0%, transparent 50%)",
            }}
          />

          {/* Close Button */}
          <motion.button
            className="absolute top-6 left-6 md:top-8 md:left-8 text-2xl md:text-3xl bg-white text-[#1a1a1a] hover:text-primary border border-transparent hover:border-primary transition-colors p-3 md:p-4 rounded-full z-10"
            whileHover={{ rotate: "90deg", scale: 1.05 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleClose}
          >
            <X className="w-5 h-5 md:w-6 md:h-6" />
          </motion.button>

          {/* Logo in center top */}
          <motion.div
            className="absolute top-6 md:top-8 left-1/2 -translate-x-1/2 z-10"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Link to="/" onClick={handleClose}>
              <img
                src="/logo.svg"
                alt="Nexo"
                width={120}
                height={40}
                decoding="async"
                className="h-8 md:h-10 w-auto"
              />
            </Link>
          </motion.div>

          {/* Navigation Links */}
          <motion.div
            variants={linkWrapperVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="flex flex-col gap-3 md:gap-4 absolute bottom-12 md:bottom-16 right-6 md:right-12 text-right"
            dir="rtl"
          >
            {navLinks.map((link) => (
              <NavLink
                key={link.href}
                text={link.label}
                href={link.href}
                isActive={location.pathname === link.href}
                onClick={handleClose}
              />
            ))}
          </motion.div>

          {/* Email at bottom left */}
          <motion.a
            href="mailto:hello@nexo.agency"
            className="absolute bottom-12 md:bottom-16 left-6 md:left-12 text-[#1a1a1a]/60 hover:text-primary transition-colors text-sm md:text-base font-medium"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            hello@nexo.agency
          </motion.a>
        </motion.nav>
      )}
    </AnimatePresence>
  );
};

// Memoized NavLink component
interface NavLinkProps {
  text: string;
  href: string;
  isActive: boolean;
  onClick: () => void;
}

const NavLink = memo(({ text, href, isActive, onClick }: NavLinkProps) => {
  return (
    <motion.div variants={navLinkVariants}>
      <Link
        to={href}
        onClick={onClick}
        className={`
          inline-block z-10 w-fit font-black text-5xl md:text-7xl transition-colors
          ${isActive ? "text-primary" : "text-[#1a1a1a] hover:text-primary"}
        `}
      >
        <motion.span
          className="inline-block"
          whileHover={{
            y: -10,
            rotate: "-5deg",
            transition: {
              type: "spring",
              damping: 5,
              stiffness: 200,
            },
          }}
        >
          {text}
        </motion.span>
      </Link>
    </motion.div>
  );
});

NavLink.displayName = 'NavLink';

// Animation variants - Slowed down for smoother, more elegant opening
const navVariants = {
  open: {
    x: "0%",
    borderTopLeftRadius: "0vw",
    borderBottomLeftRadius: "0vw",
    opacity: 1,
    transition: {
      type: "spring",
      damping: 50,
      stiffness: 180,
    },
  },
  closed: {
    x: "100%",
    borderTopLeftRadius: "50vw",
    borderBottomLeftRadius: "50vw",
    opacity: 0,
    transition: {
      type: "spring",
      damping: 40,
      stiffness: 250,
    },
  },
};

const linkWrapperVariants = {
  open: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
  closed: {
    transition: {
      staggerChildren: 0.05,
      staggerDirection: -1,
    },
  },
};

const navLinkVariants = {
  open: {
    x: 0,
    opacity: 1,
    transition: {
      type: "spring",
      damping: 30,
      stiffness: 120,
    },
  },
  closed: {
    x: 50,
    opacity: 0,
    transition: {
      type: "spring",
      damping: 20,
      stiffness: 200,
    },
  },
};

export default LiquidSideNav;
