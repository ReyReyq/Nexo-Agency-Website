"use client";

import { motion, useInView } from "framer-motion";
import { useRef, memo } from "react";
import { Phone, Heart, LucideIcon } from "lucide-react";

// Static contact link - Phone only
const CONTACT_LINK: { icon: LucideIcon; href: string; label: string } =
  { icon: Phone, href: "tel:+972533622423", label: "Phone" };

// Nexo Logo SVG - memoized and defined outside component to prevent recreation on each render
const NexoLogo = memo(() => (
  <svg className="w-4 h-4" viewBox="0 0 486 336" fill="currentColor">
    <g transform="translate(0,336) scale(0.1,-0.1)">
      <path d="M410 3350 c-63 -5 -167 -11 -230 -15 -63 -3 -130 -9 -147 -12 l-33 -5 0 -1661 0 -1660 82 6 c158 12 295 68 398 163 77 72 144 201 160 309 6 44 10 491 10 1188 l0 1117 93 0 c244 0 488 -75 697 -214 84 -57 230 -199 1290 -1262 1149 -1151 1198 -1199 1266 -1231 39 -19 100 -38 135 -44 35 -5 209 -8 387 -7 l322 3 -1487 1486 c-1377 1375 -1495 1491 -1588 1551 -229 150 -449 234 -710 272 -49 7 -173 14 -275 15 -102 1 -201 3 -220 5 -19 2 -87 0 -150 -4z"/>
      <path d="M4109 3316 c-83 -22 -133 -62 -314 -253 -99 -103 -247 -258 -330 -343 -83 -85 -226 -234 -317 -330 l-166 -175 208 -214 c115 -117 213 -211 218 -210 8 4 250 259 751 794 119 127 259 275 311 330 53 55 163 171 244 258 l148 157 -353 -1 c-247 0 -368 -4 -400 -13z"/>
      <path d="M2085 1273 c-187 -196 -279 -291 -815 -841 -200 -205 -369 -381 -376 -391 -12 -16 6 -17 339 -14 202 2 375 8 407 14 30 6 89 27 130 46 62 29 94 54 181 142 163 164 729 773 729 785 0 5 -96 106 -213 224 l-213 213 -169 -178z"/>
    </g>
  </svg>
));

NexoLogo.displayName = 'NexoLogo';

const Footer = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <>
    <footer ref={ref} className="bg-nexo-dark text-white py-12 md:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-10">
          {/* Logo & Tagline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="text-center md:text-right"
          >
            <span className="text-3xl font-black text-white tracking-tight">NEXO</span>
            <p className="text-white/40 text-sm mt-2">סוכנות דיגיטלית ליצירת חוויות</p>
          </motion.div>

          {/* Quick Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex items-center gap-4"
          >
            <span className="text-white/40 text-sm hidden md:block">התקשרו אלינו</span>
            <motion.a
              href={CONTACT_LINK.href}
              className="min-w-[44px] min-h-[44px] w-11 h-11 rounded-full bg-white/5 flex items-center justify-center text-white/60 hover:bg-primary hover:text-white transition-all duration-300"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.3, delay: 0.2 }}
              aria-label="טלפון"
            >
              <CONTACT_LINK.icon className="w-4 h-4" />
            </motion.a>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col md:flex-row items-center gap-4 md:gap-8 text-sm"
          >
            <a href="mailto:sales@nexoagency.org" className="text-white/60 hover:text-primary transition-colors py-2 min-h-[44px] flex items-center">
              sales@nexoagency.org
            </a>
            <a href="tel:+972533622423" className="text-white/60 hover:text-primary transition-colors py-2 min-h-[44px] flex items-center">
              053-362-2423
            </a>
            <span className="text-white/40 py-2">תל אביב, ישראל</span>
          </motion.div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/10 pt-8">
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col md:flex-row justify-between items-center gap-4"
          >
            {/* Copyright */}
            <p className="text-white/40 text-sm">
              © 2025 NEXO AGENCY. כל הזכויות שמורות.
            </p>

            {/* Legal Links */}
            <div className="flex gap-4 text-sm">
              <a href="/privacy" className="text-white/40 hover:text-white transition-colors py-2 min-h-[44px] flex items-center px-1">
                מדיניות פרטיות
              </a>
              <a href="/terms" className="text-white/40 hover:text-white transition-colors py-2 min-h-[44px] flex items-center px-1">
                תנאי שימוש
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </footer>

    {/* Credit Section - RTL for Hebrew */}
    <div className="bg-nexo-dark border-t border-white/5 py-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))]" dir="rtl">
      <motion.a
        href="/"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="flex items-center justify-center gap-2 text-white/30 hover:text-white/50 transition-colors duration-300 min-h-[44px] py-2"
      >
        <span className="text-xs font-medium">נוצר באהבה</span>
        <Heart className="w-3.5 h-3.5 text-primary fill-primary animate-pulse" />
        <span className="text-xs font-medium">ע״י</span>
        <NexoLogo />
        <span className="text-xs font-semibold tracking-wider">Nexo</span>
      </motion.a>
    </div>
    </>
  );
};

export default Footer;
