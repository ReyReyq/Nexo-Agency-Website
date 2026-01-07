"use client";

import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState, useCallback, useEffect, useMemo, lazy, Suspense } from "react";
import { Helmet } from "react-helmet-async";
import { Send, Phone, Mail, ArrowUpRight, MessageCircle, Clock, ArrowLeft, ArrowRight, Check, Rocket, AlertCircle, Heart } from "lucide-react";
import GlassNavbar from "@/components/GlassNavbar";
import FAQSection from "@/components/FAQSection";
import PortfolioSection from "@/components/PortfolioSection";
import ErrorBoundary, { SectionErrorFallback } from "@/components/ErrorBoundary";
import confetti from "canvas-confetti";

// Lazy load heavy WebGL Globe component for better performance
const Globe = lazy(() => import("@/components/ui/globe").then(mod => ({ default: mod.Globe })));
import { Link } from "react-router-dom";
import { submitContactForm, type FormData as SubmissionFormData } from "@/utils/formSubmission";

// WhatsApp contact link
const whatsappLink = { href: "https://wa.me/972533622423", label: "WhatsApp" };


// Form types and config
interface FormData {
  name: string;
  phone: string;
  email: string;
  budget: string;
  message: string;
  source: string;
}

const israeliPhoneRegex = /^(?:(?:\+972|972|0)(?:-)?(?:5[0-9])(?:-)?(?:\d{3})(?:-)?(?:\d{4}))$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const budgetOptions = [
  { value: "2-6k", label: "₪2,000 - ₪6,000", description: "פרויקטים קטנים" },
  { value: "6-10k", label: "₪6,000 - ₪10,000", description: "פרויקטים בינוניים" },
  { value: "10-20k", label: "₪10,000 - ₪20,000", description: "פרויקטים מורכבים" },
  { value: "20k+", label: "₪20,000+", description: "פרויקטים מקיפים" },
  { value: "not-sure", label: "עדיין לא בטוח/ה", description: "נשמח לעזור להעריך" },
];

const sourceOptions = [
  { value: "google", label: "גוגל", icon: "🔍" },
  { value: "instagram", label: "אינסטגרם", icon: "📸" },
  { value: "facebook", label: "פייסבוק", icon: "👥" },
  { value: "referral", label: "המלצה מחבר/ה", icon: "💬" },
  { value: "portfolio", label: "ראיתי פרויקט שלכם", icon: "🎯" },
  { value: "other", label: "אחר", icon: "🌟" },
];

const steps = [
  { id: "name", title: "מה השם שלך?", subtitle: "נעים להכיר!", required: true },
  { id: "phone", title: "מה מספר הטלפון שלך?", subtitle: "נחזור אליך תוך 24 שעות", required: true },
  { id: "budget", title: "מה התקציב המשוער?", subtitle: "זה עוזר לנו להתאים את ההצעה", required: true },
  { id: "message", title: "ספרו לנו קצת על הפרויקט", subtitle: "מה אתם מחפשים? מה האתגר?", required: false },
  { id: "source", title: "איך שמעתם עלינו?", subtitle: "סתם סקרנים 😊", required: false },
];

// JSON-LD Structured Data Schema for LocalBusiness
const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "NEXO AGENCY",
  "alternateName": "נקסו",
  "url": "https://nexo.agency",
  "telephone": "+972-53-362-2423",
  "email": "sales@nexoagency.org",
  "description": "סוכנות דיגיטל מובילה בישראל - עיצוב אתרים, פיתוח, שיווק דיגיטלי ומיתוג",
  "address": {
    "@type": "PostalAddress",
    "addressCountry": "IL",
    "addressLocality": "Israel"
  },
  "priceRange": "$$",
  "openingHoursSpecification": {
    "@type": "OpeningHoursSpecification",
    "dayOfWeek": ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"],
    "opens": "09:00",
    "closes": "18:00"
  }
};

// BreadcrumbList JSON-LD Schema
const contactBreadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "דף הבית", "item": "https://nexo.agency/" },
    { "@type": "ListItem", "position": 2, "name": "צור קשר", "item": "https://nexo.agency/contact" }
  ]
};

const ContactPage = () => {
  const heroRef = useRef(null);
  const contactRef = useRef(null);
  const formRef = useRef<HTMLDivElement>(null);

  const isHeroInView = useInView(heroRef, { once: true });
  const isContactInView = useInView(contactRef, { once: true });

  // Inline form state
  const [showStartScreen, setShowStartScreen] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState<"forward" | "back">("forward");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<{ field: string; message: string } | null>(null);
  const [shake, setShake] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<FormData>({
    name: "",
    phone: "",
    email: "",
    budget: "",
    message: "",
    source: "",
  });

  // Memoized computed values to prevent recalculation on every render
  const totalSteps = useMemo(() => steps.length, []);
  const currentStepData = useMemo(() => steps[currentStep], [currentStep]);
  const progress = useMemo(() => ((currentStep + 1) / totalSteps) * 100, [currentStep, totalSteps]);

  // Phone number formatter - memoized to prevent recreation on every render
  const formatPhoneNumber = useCallback((value: string): string => {
    const digits = value.replace(/\D/g, "");
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
    return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
  }, []);

  // Scroll to form function
  const scrollToForm = useCallback(() => {
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, []);

  // Validation
  const validateField = useCallback((field: string, value: string): boolean => {
    setError(null);

    switch (field) {
      case "name":
        if (!value.trim()) {
          setError({ field: "name", message: "נא להזין שם" });
          return false;
        }
        if (value.trim().length < 2) {
          setError({ field: "name", message: "השם קצר מדי" });
          return false;
        }
        return true;

      case "phone":
        const cleanPhone = value.replace(/\D/g, "");
        if (!cleanPhone) {
          setError({ field: "phone", message: "נא להזין מספר טלפון" });
          return false;
        }
        if (!israeliPhoneRegex.test(cleanPhone) && !israeliPhoneRegex.test("0" + cleanPhone)) {
          setError({ field: "phone", message: "מספר טלפון לא תקין" });
          return false;
        }
        return true;

      case "email":
        if (value && !emailRegex.test(value)) {
          setError({ field: "email", message: "כתובת אימייל לא תקינה" });
          return false;
        }
        return true;

      case "budget":
        if (!value) {
          setError({ field: "budget", message: "נא לבחור תקציב משוער" });
          return false;
        }
        return true;

      default:
        return true;
    }
  }, []);

  // Refs to track timeouts for cleanup
  const shakeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const autoAdvanceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Refs to always access the latest callbacks (fixes race condition with state updates)
  const handleSubmitRef = useRef<() => Promise<void>>(async () => {});

  // Handle previous step
  const handleBack = useCallback(() => {
    if (currentStep > 0) {
      setDirection("back");
      setCurrentStep((prev) => prev - 1);
      setError(null);
    }
  }, [currentStep]);

  // Handle input change
  const handleInputChange = useCallback((field: string, value: string) => {
    if (field === "phone") {
      value = formatPhoneNumber(value);
    }
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError(null);
  }, [formatPhoneNumber]);

  // Handle submit - defined before handleNext since handleNext depends on it
  const handleSubmit = useCallback(async () => {
    setIsSubmitting(true);

    try {
      // Prepare form data for submission
      const submissionData: SubmissionFormData = {
        name: formData.name,
        phone: formData.phone.replace(/\D/g, ''), // Send clean phone number
        email: formData.email || undefined,
        budget: formData.budget || undefined,
        message: formData.message || undefined,
        source: formData.source || undefined,
      };

      // Submit to Airtable and Monday.com
      const result = await submitContactForm(submissionData);

      if (!result.success) {
        throw new Error(result.error || 'Submission failed');
      }

      // Fire confetti on success
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#ec4899", "#f472b6", "#f9a8d4"],
      });

      setIsSuccess(true);
    } catch {
      setError({ field: "submit", message: "שגיאה בשליחה, נסו שוב" });
    } finally {
      setIsSubmitting(false);
    }
  }, [formData]);

  // Keep ref updated with latest handleSubmit (fixes race condition with auto-advance)
  useEffect(() => {
    handleSubmitRef.current = handleSubmit;
  }, [handleSubmit]);

  // Handle selection with auto-advance (for budget/source options)
  const handleSelectionWithAutoAdvance = useCallback((field: string, value: string) => {
    handleInputChange(field, value);
    // Clear any existing auto-advance timeout
    if (autoAdvanceTimeoutRef.current) {
      clearTimeout(autoAdvanceTimeoutRef.current);
    }
    autoAdvanceTimeoutRef.current = setTimeout(() => {
      setDirection("forward");
      // Check if we're on the last step - submit instead of advancing
      setCurrentStep((prev) => {
        if (prev >= totalSteps - 1) {
          // On last step, trigger submit using ref to get latest callback
          handleSubmitRef.current();
          return prev; // Don't change step
        }
        return prev + 1;
      });
    }, 200);
  }, [handleInputChange, totalSteps]);

  // Handle next step
  const handleNext = useCallback(() => {
    const field = currentStepData.id;
    const value = formData[field as keyof FormData];

    // Clear any existing shake timeout
    if (shakeTimeoutRef.current) {
      clearTimeout(shakeTimeoutRef.current);
    }

    if (currentStepData.required && !validateField(field, value)) {
      setShake(true);
      shakeTimeoutRef.current = setTimeout(() => setShake(false), 500);
      return;
    }

    if (field === "email" && value && !validateField(field, value)) {
      setShake(true);
      shakeTimeoutRef.current = setTimeout(() => setShake(false), 500);
      return;
    }

    setDirection("forward");
    if (currentStep < totalSteps - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      handleSubmit();
    }
  }, [currentStep, currentStepData, formData, totalSteps, validateField, handleSubmit]);

  // Focus input on step change
  useEffect(() => {
    if (inputRef.current && !["budget", "source"].includes(currentStepData?.id)) {
      inputRef.current.focus();
    }
  }, [currentStep, currentStepData?.id]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey && !isSubmitting) {
        e.preventDefault();
        if (showStartScreen) {
          setShowStartScreen(false);
        } else {
          handleNext();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleNext, isSubmitting, showStartScreen]);

  // Cleanup all timeouts on unmount
  useEffect(() => {
    return () => {
      if (shakeTimeoutRef.current) {
        clearTimeout(shakeTimeoutRef.current);
      }
      if (autoAdvanceTimeoutRef.current) {
        clearTimeout(autoAdvanceTimeoutRef.current);
      }
    };
  }, []);

  // Animation variants for form steps - memoized to prevent object recreation
  const slideVariants = useMemo(() => ({
    enter: (direction: "forward" | "back") => ({
      x: direction === "forward" ? 50 : -50,
      opacity: 0,
    }),
    center: { x: 0, opacity: 1 },
    exit: (direction: "forward" | "back") => ({
      x: direction === "forward" ? -50 : 50,
      opacity: 0,
    }),
  }), []);

  // Render form step content - memoized to prevent recreation on every render
  const renderStepContent = useCallback(() => {
    if (!currentStepData) return null;
    const field = currentStepData.id;

    switch (field) {
      case "budget":
        return (
          <div className="grid grid-cols-1 gap-2 sm:gap-3 w-full max-w-md mx-auto">
            {budgetOptions.map((option) => (
              <motion.button
                key={option.value}
                type="button"
                onClick={() => handleSelectionWithAutoAdvance("budget", option.value)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`p-3 sm:p-4 min-h-[44px] rounded-xl border-2 text-right transition-all ${
                  formData.budget === option.value
                    ? "border-primary bg-primary/10"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <p className="font-bold text-foreground text-sm sm:text-base">{option.label}</p>
                <p className="text-xs sm:text-sm text-muted-foreground">{option.description}</p>
              </motion.button>
            ))}
          </div>
        );

      case "source":
        return (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 w-full max-w-md mx-auto">
            {sourceOptions.map((option) => (
              <motion.button
                key={option.value}
                type="button"
                onClick={() => handleSelectionWithAutoAdvance("source", option.value)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`p-3 sm:p-4 min-h-[44px] rounded-xl border-2 text-center transition-all ${
                  formData.source === option.value
                    ? "border-primary bg-primary/10"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <span className="text-xl sm:text-2xl mb-1 sm:mb-2 block">{option.icon}</span>
                <p className="text-xs sm:text-sm font-medium text-foreground">{option.label}</p>
              </motion.button>
            ))}
          </div>
        );

      case "message":
        return (
          <div className="relative w-full max-w-md mx-auto">
            <label htmlFor="message" className="sr-only">הודעה</label>
            <textarea
              id="message"
              name="message"
              aria-label="הודעה"
              aria-invalid={error?.field === "message" ? "true" : "false"}
              aria-describedby={error?.field === "message" ? "message-error" : undefined}
              value={formData.message}
              onChange={(e) => handleInputChange("message", e.target.value)}
              placeholder="פרטים על הפרויקט, מטרות, לו״ז..."
              rows={4}
              className="w-full px-4 sm:px-6 py-3 sm:py-4 text-base sm:text-lg bg-muted/50 border-2 border-border rounded-2xl focus:border-primary focus:outline-none resize-none text-foreground placeholder:text-muted-foreground text-right"
            />
            {error?.field === "message" && (
              <span id="message-error" role="alert" className="text-red-500 text-sm mt-1 block text-right">
                {error.message}
              </span>
            )}
          </div>
        );

      default:
        const fieldLabels: Record<string, string> = {
          name: "שם מלא",
          phone: "טלפון",
          email: "אימייל",
        };
        const isRequired = field === "name" || field === "phone";
        const hasError = error?.field === field;
        return (
          <div className="relative w-full max-w-md mx-auto">
            <label htmlFor={field} className="sr-only">{fieldLabels[field] || field}</label>
            <input
              ref={inputRef}
              id={field}
              name={field}
              aria-label={fieldLabels[field] || field}
              aria-required={isRequired}
              aria-invalid={hasError ? "true" : "false"}
              aria-describedby={hasError ? `${field}-error` : undefined}
              type={field === "email" ? "email" : field === "phone" ? "tel" : "text"}
              value={formData[field as keyof FormData]}
              onChange={(e) => handleInputChange(field, e.target.value)}
              placeholder={
                field === "name" ? "הקלידו את שמכם..."
                  : field === "phone" ? "05X-XXX-XXXX"
                  : field === "email" ? "example@email.com"
                  : ""
              }
              className={`w-full px-4 sm:px-6 py-3 sm:py-4 min-h-[44px] text-lg sm:text-xl bg-muted/50 border-2 rounded-2xl focus:outline-none text-foreground placeholder:text-muted-foreground text-right transition-colors ${
                hasError ? "border-red-500" : "border-border focus:border-primary"
              }`}
              dir={field === "email" ? "ltr" : "rtl"}
            />
            {hasError && (
              <span id={`${field}-error`} role="alert" className="text-red-500 text-sm mt-1 block text-right">
                {error.message}
              </span>
            )}
          </div>
        );
    }
  }, [currentStepData?.id, formData.budget, formData.source, formData.message, formData, error, handleInputChange, handleSelectionWithAutoAdvance]);

  return (
    <>
      <Helmet>
        <title>צור קשר - נקסו | NEXO AGENCY</title>
        <meta name="description" content="צרו קשר עם נקסו. נשמח לשמוע על הפרויקט שלכם ולהציע פתרון מותאם אישית." />
        <link rel="canonical" href="https://nexo.agency/contact" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="צור קשר - נקסו" />
        <meta property="og:description" content="צרו קשר עם נקסו. נשמח לשמוע על הפרויקט שלכם ולהציע פתרון מותאם אישית." />
        <meta property="og:url" content="https://nexo.agency/contact" />
        <meta property="og:locale" content="he_IL" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="צור קשר - נקסו" />
        <meta name="twitter:description" content="צרו קשר עם נקסו. נשמח לשמוע על הפרויקט שלכם ולהציע פתרון מותאם אישית." />
        <meta property="og:image" content="https://nexo.agency/og-image.jpg" />
        <meta name="twitter:image" content="https://nexo.agency/og-image.jpg" />
        <link rel="alternate" hreflang="he" href="https://nexo.agency/contact" />
        <link rel="alternate" hreflang="x-default" href="https://nexo.agency/contact" />
        <script type="application/ld+json">
          {JSON.stringify(localBusinessSchema)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(contactBreadcrumbSchema)}
        </script>
      </Helmet>

      <div className="min-h-screen bg-background overflow-x-hidden">
        <GlassNavbar />

      <main id="main-content">
      {/* Hero Section - Clean and Fast */}
      <section className="min-h-screen min-h-[100dvh] flex items-center bg-hero-bg relative overflow-hidden">
        {/* Globe Background - Centered with lazy loading */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 lg:w-[500px] lg:h-[500px] opacity-60">
            <ErrorBoundary fallback={<SectionErrorFallback />}>
              <Suspense fallback={<div className="animate-pulse bg-muted h-full w-full rounded-full" />}>
                <Globe className="w-full h-full" />
              </Suspense>
            </ErrorBoundary>
          </div>
        </div>
        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-hero-bg via-transparent to-hero-bg pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-hero-bg via-transparent to-hero-bg pointer-events-none" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            ref={heroRef}
            initial={{ opacity: 0, y: 60 }}
            animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-5xl mx-auto text-center"
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-hero-fg leading-[0.95] mb-6 sm:mb-8">
              בואו נבנה משהו
              <br />
              <span className="text-gradient">מדהים ביחד.</span>
            </h1>

            <p className="text-hero-fg/80 text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed max-w-2xl mx-auto mb-8 sm:mb-12">
              יש לכם רעיון שמחכה לצאת לאור? אנחנו כאן כדי להפוך אותו למציאות דיגיטלית שמייצרת תוצאות.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                onClick={scrollToForm}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group px-6 sm:px-8 py-3 sm:py-4 min-h-[44px] bg-primary text-white rounded-full text-base sm:text-lg font-bold flex items-center justify-center gap-2 sm:gap-3 hover:bg-primary/90 transition-colors"
              >
                <Send className="w-5 h-5" />
                התחילו פרויקט
                <ArrowUpRight className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </motion.button>

              <motion.a
                href="https://wa.me/972533622423"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 sm:px-8 py-3 sm:py-4 min-h-[44px] bg-hero-fg/10 text-hero-fg rounded-full text-base sm:text-lg font-bold flex items-center justify-center gap-2 sm:gap-3 hover:bg-hero-fg/20 transition-colors border border-hero-fg/20"
              >
                <MessageCircle className="w-5 h-5" />
                שלחו וואטסאפ
              </motion.a>
            </div>

            {/* Response Time Promise */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={isHeroInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.6 }}
              className="text-hero-fg/70 text-sm mt-8 flex items-center justify-center gap-2"
            >
              <Clock className="w-4 h-4" />
              אנחנו משיבים תוך 24 שעות, בדרך כלל הרבה פחות
            </motion.p>
          </motion.div>
        </div>
      </section>


      {/* Contact Section with Embedded Form */}
      <section id="contact-form" ref={contactRef} className="py-16 sm:py-24 md:py-32 bg-background scroll-mt-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 md:gap-16 max-w-6xl mx-auto">
            {/* Left - Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={isContactInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.7 }}
            >
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-foreground mb-4">
                דברו איתנו ישירות
              </h2>
              <p className="text-muted-foreground text-sm sm:text-base md:text-lg mb-6 sm:mb-8">
                צוות מרוחק, תוצאות קרובות. אנחנו זמינים בכל ערוץ שנוח לכם.
              </p>

              {/* Contact Cards */}
              <div className="space-y-3 sm:space-y-4 mb-8 sm:mb-12">
                <a
                  href="mailto:sales@nexoagency.org"
                  className="group flex items-center gap-3 sm:gap-4 p-4 sm:p-6 rounded-2xl border border-border hover:border-primary/50 hover:bg-primary/5 transition-all min-h-[44px]"
                >
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors shrink-0">
                    <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-muted-foreground text-xs sm:text-sm mb-1">אימייל</p>
                    <p className="text-foreground text-base sm:text-lg font-medium truncate">sales@nexoagency.org</p>
                  </div>
                  <ArrowUpRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                </a>

                <a
                  href="tel:+972533622423"
                  className="group flex items-center gap-3 sm:gap-4 p-4 sm:p-6 rounded-2xl border border-border hover:border-primary/50 hover:bg-primary/5 transition-all min-h-[44px]"
                >
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors shrink-0">
                    <Phone className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-muted-foreground text-xs sm:text-sm mb-1">טלפון</p>
                    <p className="text-foreground text-base sm:text-lg font-medium">053-362-2423</p>
                  </div>
                  <ArrowUpRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                </a>

                <a
                  href="https://wa.me/972533622423"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3 sm:gap-4 p-4 sm:p-6 rounded-2xl border border-border hover:border-primary/50 hover:bg-primary/5 transition-all min-h-[44px]"
                >
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-green-500/10 flex items-center justify-center group-hover:bg-green-500/20 transition-colors shrink-0">
                    <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-muted-foreground text-xs sm:text-sm mb-1">וואטסאפ</p>
                    <p className="text-foreground text-base sm:text-lg font-medium">שלחו הודעה מיידית</p>
                  </div>
                  <ArrowUpRight className="w-5 h-5 text-muted-foreground group-hover:text-green-500 transition-colors shrink-0" />
                </a>
              </div>

              {/* Quick WhatsApp */}
              <div>
                <p className="text-muted-foreground text-sm mb-4">צרו קשר מהיר</p>
                <a
                  href={whatsappLink.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 px-5 py-3 rounded-xl bg-green-500/10 border border-green-500/20 text-green-600 hover:bg-green-500 hover:text-white hover:border-transparent transition-all min-h-[44px]"
                  aria-label={whatsappLink.label}
                >
                  <MessageCircle className="w-5 h-5" />
                  <span className="font-medium">שלחו הודעה בוואטסאפ</span>
                </a>
              </div>
            </motion.div>

            {/* Right - Embedded Form */}
            <motion.div
              ref={formRef}
              initial={{ opacity: 0, x: 40 }}
              animate={isContactInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="scroll-mt-24"
            >
              <div className="h-full p-5 sm:p-8 md:p-12 rounded-3xl bg-background border border-border shadow-xl">
                {isSuccess ? (
                  // Success State
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-12"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", delay: 0.2 }}
                      className="w-24 h-24 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-6"
                    >
                      <Check className="w-12 h-12 text-green-500" />
                    </motion.div>
                    <h3 className="text-2xl font-black text-foreground mb-2">תודה רבה! 🎉</h3>
                    <p className="text-muted-foreground mb-6">קיבלנו את הפרטים שלך ונחזור אליך בהקדם</p>
                    <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span>בדרך כלל תוך כמה שעות</span>
                    </div>
                  </motion.div>
                ) : showStartScreen ? (
                  // Welcome Start Screen
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-8"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", delay: 0.1 }}
                      className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6"
                    >
                      <Rocket className="w-10 h-10 text-primary" />
                    </motion.div>
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-foreground mb-3">בואו נכיר!</h2>
                    <p className="text-muted-foreground mb-2 max-w-sm mx-auto">
                      כמה שאלות קצרות שיעזרו לנו להבין את הפרויקט שלכם ולהכין הצעה מותאמת אישית
                    </p>
                    <p className="text-muted-foreground/60 text-sm mb-8">⏱️ פחות מדקה</p>
                    <motion.button
                      onClick={() => setShowStartScreen(false)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-6 sm:px-8 py-3 sm:py-4 min-h-[44px] bg-primary text-white rounded-full text-base sm:text-lg font-bold hover:bg-primary/90 transition-colors"
                    >
                      בואו נתחיל →
                    </motion.button>
                    <p className="text-muted-foreground/50 text-xs mt-6">לחצו Enter להתחיל</p>
                  </motion.div>
                ) : (
                  // Form Steps
                  <>
                    {/* Progress Bar - GPU-accelerated with scaleX */}
                    <div className="h-1 bg-border rounded-full mb-8 overflow-hidden">
                      <motion.div
                        className="h-full w-full bg-primary origin-right"
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: progress / 100 }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>

                    {/* Step Counter */}
                    <div className="text-center mb-2">
                      <span className="text-sm text-muted-foreground">
                        שאלה {currentStep + 1} מתוך {totalSteps}
                      </span>
                    </div>

                    {/* Step Content */}
                    <AnimatePresence mode="wait" custom={direction}>
                      <motion.div
                        key={currentStep}
                        custom={direction}
                        variants={slideVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ duration: 0.3 }}
                        className={`text-center ${shake ? "animate-shake" : ""}`}
                      >
                        <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-foreground mb-2">
                          {currentStepData.title}
                        </h3>
                        <p className="text-muted-foreground text-sm sm:text-base mb-6 sm:mb-8">{currentStepData.subtitle}</p>

                        {renderStepContent()}

                        {/* Error Message - for submit errors only (field errors are shown inline) */}
                        {error && error.field === "submit" && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            role="alert"
                            aria-live="assertive"
                            className="flex items-center justify-center gap-2 mt-4 text-red-500"
                          >
                            <AlertCircle className="w-4 h-4" aria-hidden="true" />
                            <span className="text-sm">{error.message}</span>
                          </motion.div>
                        )}
                      </motion.div>
                    </AnimatePresence>

                    {/* Navigation */}
                    <div className="flex items-center justify-between mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-border">
                      <button
                        onClick={handleBack}
                        disabled={currentStep === 0}
                        aria-label="הקודם"
                        className={`flex items-center gap-2 px-3 sm:px-4 py-2 min-h-[44px] rounded-lg transition-all ${
                          currentStep === 0
                            ? "opacity-0 pointer-events-none"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        <ArrowRight className="w-4 h-4" />
                        <span>הקודם</span>
                      </button>

                      {!["budget", "source"].includes(currentStepData.id) && (
                        <motion.button
                          onClick={handleNext}
                          disabled={isSubmitting}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 min-h-[44px] bg-primary text-white rounded-full font-bold hover:bg-primary/90 transition-colors disabled:opacity-50"
                        >
                          {isSubmitting ? (
                            <>
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                              >
                                <Rocket className="w-5 h-5" />
                              </motion.div>
                              <span>שולח...</span>
                            </>
                          ) : currentStep === totalSteps - 1 ? (
                            <>
                              <span>שליחה</span>
                              <Send className="w-4 h-4" />
                            </>
                          ) : (
                            <>
                              <span>המשך</span>
                              <ArrowLeft className="w-4 h-4" />
                            </>
                          )}
                        </motion.button>
                      )}
                    </div>

                    {/* Keyboard Hint */}
                    <p className="text-center text-muted-foreground/50 text-xs mt-4">
                      לחצו Enter להמשיך
                    </p>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      <PortfolioSection />

      {/* FAQ Section */}
      <FAQSection />

      {/* CTA Section */}
      <section className="bg-hero-bg py-16 sm:py-24 md:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-hero-fg mb-4">
              מוכנים לקחת את העסק שלכם
              <br />
              <span className="text-primary">לשלב הבא?</span>
            </h2>
            <p className="text-hero-fg/80 text-base sm:text-lg md:text-xl max-w-2xl mx-auto mb-8 sm:mb-10">
              בואו נדבר על איך אנחנו יכולים לעזור לכם להשיג את המטרות שלכם.
            </p>
            <motion.a
              href="#contact-form"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 sm:py-4 min-h-[44px] bg-primary text-white rounded-full text-base sm:text-lg font-bold hover:bg-primary/90 transition-colors"
            >
              <Send className="w-5 h-5" />
              בואו נתחיל
            </motion.a>
          </motion.div>
        </div>
      </section>
      </main>

      {/* Footer */}
      <footer className="bg-hero-bg border-t border-hero-fg/10 py-6 sm:py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4">
              <span className="text-2xl font-black text-hero-fg">NEXO</span>
              <span className="text-hero-fg/30">|</span>
              <p className="text-hero-fg/50 text-sm">© 2025 כל הזכויות שמורות</p>
            </div>
            <div className="flex gap-6 text-sm text-hero-fg/50">
              <a href="/privacy" className="hover:text-hero-fg transition-colors">מדיניות פרטיות</a>
              <a href="/terms" className="hover:text-hero-fg transition-colors">תנאי שימוש</a>
            </div>
          </div>

          {/* Credit Section */}
          <div className="mt-6 pt-6 border-t border-hero-fg/10 flex items-center justify-center" dir="rtl">
            <a
              href="/"
              className="flex items-center gap-2 text-hero-fg/30 hover:text-hero-fg/50 transition-colors duration-300"
            >
              <span className="text-xs font-medium">נוצר באהבה</span>
              <Heart className="w-3.5 h-3.5 text-primary fill-primary animate-pulse" />
              <span className="text-xs font-medium">ע״י</span>
              <svg className="w-4 h-4" viewBox="0 0 486 336" fill="currentColor">
                <g transform="translate(0,336) scale(0.1,-0.1)">
                  <path d="M410 3350 c-63 -5 -167 -11 -230 -15 -63 -3 -130 -9 -147 -12 l-33 -5 0 -1661 0 -1660 82 6 c158 12 295 68 398 163 77 72 144 201 160 309 6 44 10 491 10 1188 l0 1117 93 0 c244 0 488 -75 697 -214 84 -57 230 -199 1290 -1262 1149 -1151 1198 -1199 1266 -1231 39 -19 100 -38 135 -44 35 -5 209 -8 387 -7 l322 3 -1487 1486 c-1377 1375 -1495 1491 -1588 1551 -229 150 -449 234 -710 272 -49 7 -173 14 -275 15 -102 1 -201 3 -220 5 -19 2 -87 0 -150 -4z"/>
                  <path d="M4109 3316 c-83 -22 -133 -62 -314 -253 -99 -103 -247 -258 -330 -343 -83 -85 -226 -234 -317 -330 l-166 -175 208 -214 c115 -117 213 -211 218 -210 8 4 250 259 751 794 119 127 259 275 311 330 53 55 163 171 244 258 l148 157 -353 -1 c-247 0 -368 -4 -400 -13z"/>
                  <path d="M2085 1273 c-187 -196 -279 -291 -815 -841 -200 -205 -369 -381 -376 -391 -12 -16 6 -17 339 -14 202 2 375 8 407 14 30 6 89 27 130 46 62 29 94 54 181 142 163 164 729 773 729 785 0 5 -96 106 -213 224 l-213 213 -169 -178z"/>
                </g>
              </svg>
              <span className="text-xs font-semibold tracking-wider">Nexo</span>
            </a>
          </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default ContactPage;
