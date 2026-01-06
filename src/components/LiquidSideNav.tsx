import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useEffect, useCallback, memo, useRef } from "react";
import FocusTrap from "focus-trap-react";

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
  // Track the previous pathname to only close on actual route changes, not initial mount
  const prevPathnameRef = useRef(location.pathname);

  // Memoized close handler
  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, [setIsOpen]);

  // Close menu on route change (but not on initial mount)
  useEffect(() => {
    if (prevPathnameRef.current !== location.pathname) {
      prevPathnameRef.current = location.pathname;
      setIsOpen(false);
    }
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
        <FocusTrap
          active={isOpen}
          focusTrapOptions={{
            initialFocus: false,
            allowOutsideClick: true,
            returnFocusOnDeactivate: true,
            escapeDeactivates: true,
            onDeactivate: handleClose,
          }}
        >
          <motion.nav
            className="fixed inset-0 z-50 bg-white pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)]"
            initial="closed"
            animate="open"
            exit="closed"
            variants={navVariants}
            role="dialog"
            aria-modal="true"
            aria-label="תפריט ניווט"
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
            className="absolute top-4 left-4 sm:top-6 sm:left-6 md:top-8 md:left-8 text-2xl md:text-3xl bg-white text-nexo-charcoal hover:text-primary border border-transparent hover:border-primary transition-colors p-3 md:p-4 rounded-full z-10 min-w-[44px] min-h-[44px] flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-white"
            whileHover={{ rotate: "90deg", scale: 1.05 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleClose}
            aria-label="סגור תפריט"
          >
            <X className="w-5 h-5 md:w-6 md:h-6" />
          </motion.button>

          {/* Logo in center top */}
          <motion.div
            className="absolute top-4 sm:top-6 md:top-8 left-1/2 -translate-x-1/2 z-10"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Link to="/" onClick={handleClose} className="min-h-[44px] flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-lg" aria-label="Nexo - חזרה לדף הבית">
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
          <motion.ul
            variants={linkWrapperVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="flex flex-col gap-2 sm:gap-3 md:gap-4 absolute bottom-8 sm:bottom-12 md:bottom-16 right-4 sm:right-6 md:right-8 lg:right-12 text-right p-4 sm:p-6 md:p-8 list-none"
            dir="rtl"
            role="list"
            aria-label="קישורי ניווט"
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
          </motion.ul>

          {/* Email at bottom left */}
          <motion.a
            href="mailto:sales@nexoagency.org"
            aria-label="שלח אימייל אל sales@nexoagency.org"
            className="absolute bottom-8 sm:bottom-12 md:bottom-16 left-4 sm:left-6 md:left-8 lg:left-12 text-nexo-charcoal/60 hover:text-primary transition-colors text-sm md:text-base font-medium min-h-[44px] flex items-center rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-white"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            sales@nexoagency.org
          </motion.a>
        </motion.nav>
        </FocusTrap>
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
    <motion.li variants={navLinkVariants} role="listitem">
      <Link
        to={href}
        onClick={onClick}
        aria-current={isActive ? "page" : undefined}
        className={`
          inline-block z-10 w-fit font-black text-2xl sm:text-3xl md:text-5xl lg:text-7xl transition-colors min-h-[44px] flex items-center rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-white
          ${isActive ? "text-primary" : "text-nexo-charcoal hover:text-primary"}
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
    </motion.li>
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
      type: "spring" as const,
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
      type: "spring" as const,
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
      type: "spring" as const,
      damping: 30,
      stiffness: 120,
    },
  },
  closed: {
    x: 50,
    opacity: 0,
    transition: {
      type: "spring" as const,
      damping: 20,
      stiffness: 200,
    },
  },
};

export default LiquidSideNav;
