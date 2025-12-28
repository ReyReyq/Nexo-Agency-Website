"use client";

import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState, useCallback, useEffect } from "react";
import { Send, Instagram, Facebook, Linkedin, Phone, Mail, ArrowUpRight, MessageCircle, Clock, Sparkles, ArrowLeft, ArrowRight, Check, Rocket, AlertCircle, ExternalLink } from "lucide-react";
import GlassNavbar from "@/components/GlassNavbar";
import confetti from "canvas-confetti";
import { Link } from "react-router-dom";

const socialLinks = [
  { icon: Instagram, href: "https://instagram.com/nexo.agency", label: "Instagram", color: "hover:bg-gradient-to-br hover:from-purple-500 hover:to-pink-500" },
  { icon: Facebook, href: "https://facebook.com/nexo.agency", label: "Facebook", color: "hover:bg-blue-600" },
  { icon: Linkedin, href: "https://linkedin.com/company/nexo-agency", label: "LinkedIn", color: "hover:bg-blue-700" },
  { icon: MessageCircle, href: "https://wa.me/972501234567", label: "WhatsApp", color: "hover:bg-green-500" },
];


// Featured projects for "See Our Work" section
const featuredProjects = [
  { name: "Sione", category: "מיתוג ואתר", image: "/portfolio/sione-thumb.jpg" },
  { name: "TechFlow", category: "אפליקציה", image: "/portfolio/techflow-thumb.jpg" },
  { name: "RetailPro", category: "חנות אונליין", image: "/portfolio/retailpro-thumb.jpg" },
];

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

  const totalSteps = steps.length;
  const currentStepData = steps[currentStep];
  const progress = ((currentStep + 1) / totalSteps) * 100;

  // Phone number formatter
  const formatPhoneNumber = (value: string): string => {
    const digits = value.replace(/\D/g, "");
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
    return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
  };

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

  // Handle next step
  const handleNext = useCallback(() => {
    const field = currentStepData.id;
    const value = formData[field as keyof FormData];

    if (currentStepData.required && !validateField(field, value)) {
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }

    if (field === "email" && value && !validateField(field, value)) {
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }

    setDirection("forward");
    if (currentStep < totalSteps - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      handleSubmit();
    }
  }, [currentStep, currentStepData, formData, totalSteps, validateField]);

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
  }, []);

  // Handle submit
  const handleSubmit = useCallback(async () => {
    setIsSubmitting(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Fire confetti
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
  }, []);

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

  // Animation variants for form steps
  const slideVariants = {
    enter: (direction: "forward" | "back") => ({
      x: direction === "forward" ? 50 : -50,
      opacity: 0,
    }),
    center: { x: 0, opacity: 1 },
    exit: (direction: "forward" | "back") => ({
      x: direction === "forward" ? -50 : 50,
      opacity: 0,
    }),
  };

  // Render form step content
  const renderStepContent = () => {
    const field = currentStepData.id;

    switch (field) {
      case "budget":
        return (
          <div className="grid grid-cols-1 gap-3 w-full max-w-md mx-auto">
            {budgetOptions.map((option) => (
              <motion.button
                key={option.value}
                type="button"
                onClick={() => {
                  handleInputChange("budget", option.value);
                  setTimeout(handleNext, 200);
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`p-4 rounded-xl border-2 text-right transition-all ${
                  formData.budget === option.value
                    ? "border-primary bg-primary/10"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <p className="font-bold text-foreground">{option.label}</p>
                <p className="text-sm text-muted-foreground">{option.description}</p>
              </motion.button>
            ))}
          </div>
        );

      case "source":
        return (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full max-w-md mx-auto">
            {sourceOptions.map((option) => (
              <motion.button
                key={option.value}
                type="button"
                onClick={() => {
                  handleInputChange("source", option.value);
                  setTimeout(handleNext, 200);
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`p-4 rounded-xl border-2 text-center transition-all ${
                  formData.source === option.value
                    ? "border-primary bg-primary/10"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <span className="text-2xl mb-2 block">{option.icon}</span>
                <p className="text-sm font-medium text-foreground">{option.label}</p>
              </motion.button>
            ))}
          </div>
        );

      case "message":
        return (
          <textarea
            value={formData.message}
            onChange={(e) => handleInputChange("message", e.target.value)}
            placeholder="פרטים על הפרויקט, מטרות, לו״ז..."
            rows={4}
            className="w-full max-w-md mx-auto px-6 py-4 text-lg bg-muted/50 border-2 border-border rounded-2xl focus:border-primary focus:outline-none resize-none text-foreground placeholder:text-muted-foreground text-right"
          />
        );

      default:
        return (
          <input
            ref={inputRef}
            type={field === "email" ? "email" : field === "phone" ? "tel" : "text"}
            value={formData[field as keyof FormData]}
            onChange={(e) => handleInputChange(field, e.target.value)}
            placeholder={
              field === "name" ? "הקלידו את שמכם..."
                : field === "phone" ? "05X-XXX-XXXX"
                : field === "email" ? "example@email.com"
                : ""
            }
            className={`w-full max-w-md mx-auto px-6 py-4 text-xl bg-muted/50 border-2 rounded-2xl focus:outline-none text-foreground placeholder:text-muted-foreground text-right transition-colors ${
              error ? "border-red-500" : "border-border focus:border-primary"
            }`}
            dir={field === "email" ? "ltr" : "rtl"}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <GlassNavbar />

      {/* Hero Section - Clean and Fast */}
      <section className="min-h-screen flex items-center bg-hero-bg relative overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            ref={heroRef}
            initial={{ opacity: 0, y: 60 }}
            animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-5xl mx-auto text-center"
          >
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-hero-fg leading-[0.95] mb-8">
              בואו נבנה משהו
              <br />
              <span className="text-gradient">מדהים ביחד.</span>
            </h1>

            <p className="text-hero-fg/60 text-xl md:text-2xl leading-relaxed max-w-2xl mx-auto mb-12">
              יש לכם רעיון שמחכה לצאת לאור? אנחנו כאן כדי להפוך אותו למציאות דיגיטלית שמייצרת תוצאות.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                onClick={scrollToForm}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group px-8 py-4 bg-primary text-white rounded-full text-lg font-bold flex items-center justify-center gap-3 hover:bg-primary/90 transition-colors"
              >
                <Send className="w-5 h-5" />
                התחילו פרויקט
                <ArrowUpRight className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </motion.button>

              <motion.a
                href="https://wa.me/972501234567"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-hero-fg/10 text-hero-fg rounded-full text-lg font-bold flex items-center justify-center gap-3 hover:bg-hero-fg/20 transition-colors border border-hero-fg/20"
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
              className="text-hero-fg/40 text-sm mt-8 flex items-center justify-center gap-2"
            >
              <Clock className="w-4 h-4" />
              אנחנו משיבים תוך 24 שעות, בדרך כלל הרבה פחות
            </motion.p>
          </motion.div>
        </div>
      </section>


      {/* Contact Section with Embedded Form */}
      <section ref={contactRef} className="py-24 md:py-32 bg-background">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 max-w-6xl mx-auto">
            {/* Left - Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={isContactInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.7 }}
            >
              <h2 className="text-3xl md:text-4xl font-black text-foreground mb-4">
                דברו איתנו ישירות
              </h2>
              <p className="text-muted-foreground text-lg mb-8">
                צוות מרוחק, תוצאות קרובות. אנחנו זמינים בכל ערוץ שנוח לכם.
              </p>

              {/* Contact Cards */}
              <div className="space-y-4 mb-12">
                <a
                  href="mailto:hello@nexo.agency"
                  className="group flex items-center gap-4 p-6 rounded-2xl border border-border hover:border-primary/50 hover:bg-primary/5 transition-all"
                >
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <Mail className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-muted-foreground text-sm mb-1">אימייל</p>
                    <p className="text-foreground text-lg font-medium">hello@nexo.agency</p>
                  </div>
                  <ArrowUpRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </a>

                <a
                  href="tel:+972501234567"
                  className="group flex items-center gap-4 p-6 rounded-2xl border border-border hover:border-primary/50 hover:bg-primary/5 transition-all"
                >
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <Phone className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-muted-foreground text-sm mb-1">טלפון</p>
                    <p className="text-foreground text-lg font-medium">050-123-4567</p>
                  </div>
                  <ArrowUpRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </a>

                <a
                  href="https://wa.me/972501234567"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-4 p-6 rounded-2xl border border-border hover:border-primary/50 hover:bg-primary/5 transition-all"
                >
                  <div className="w-14 h-14 rounded-xl bg-green-500/10 flex items-center justify-center group-hover:bg-green-500/20 transition-colors">
                    <MessageCircle className="w-6 h-6 text-green-500" />
                  </div>
                  <div className="flex-1">
                    <p className="text-muted-foreground text-sm mb-1">וואטסאפ</p>
                    <p className="text-foreground text-lg font-medium">שלחו הודעה מיידית</p>
                  </div>
                  <ArrowUpRight className="w-5 h-5 text-muted-foreground group-hover:text-green-500 transition-colors" />
                </a>
              </div>

              {/* Social */}
              <div>
                <p className="text-muted-foreground text-sm mb-4">עקבו אחרינו</p>
                <div className="flex gap-3">
                  {socialLinks.map((social, index) => (
                    <a
                      key={index}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`w-12 h-12 rounded-xl border border-border flex items-center justify-center text-muted-foreground hover:text-white hover:border-transparent transition-all ${social.color}`}
                      aria-label={social.label}
                    >
                      <social.icon className="w-5 h-5" />
                    </a>
                  ))}
                </div>
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
              <div className="h-full p-8 md:p-12 rounded-3xl bg-background border border-border shadow-xl">
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
                    <h2 className="text-2xl md:text-3xl font-black text-foreground mb-3">בואו נכיר!</h2>
                    <p className="text-muted-foreground mb-2 max-w-sm mx-auto">
                      כמה שאלות קצרות שיעזרו לנו להבין את הפרויקט שלכם ולהכין הצעה מותאמת אישית
                    </p>
                    <p className="text-muted-foreground/60 text-sm mb-8">⏱️ פחות מדקה</p>
                    <motion.button
                      onClick={() => setShowStartScreen(false)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-8 py-4 bg-primary text-white rounded-full text-lg font-bold hover:bg-primary/90 transition-colors"
                    >
                      בואו נתחיל →
                    </motion.button>
                    <p className="text-muted-foreground/50 text-xs mt-6">לחצו Enter להתחיל</p>
                  </motion.div>
                ) : (
                  // Form Steps
                  <>
                    {/* Progress Bar */}
                    <div className="h-1 bg-border rounded-full mb-8 overflow-hidden">
                      <motion.div
                        className="h-full bg-primary"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
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
                        <h3 className="text-2xl md:text-3xl font-black text-foreground mb-2">
                          {currentStepData.title}
                        </h3>
                        <p className="text-muted-foreground mb-8">{currentStepData.subtitle}</p>

                        {renderStepContent()}

                        {/* Error Message */}
                        {error && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center justify-center gap-2 mt-4 text-red-500"
                          >
                            <AlertCircle className="w-4 h-4" />
                            <span className="text-sm">{error.message}</span>
                          </motion.div>
                        )}
                      </motion.div>
                    </AnimatePresence>

                    {/* Navigation */}
                    <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
                      <button
                        onClick={handleBack}
                        disabled={currentStep === 0}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
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
                          className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-full font-bold hover:bg-primary/90 transition-colors disabled:opacity-50"
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

      {/* See Our Work Section (replacing testimonials) */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-black text-foreground mb-4">
              ראו מה יצרנו
            </h2>
            <p className="text-muted-foreground text-lg">
              פרויקטים שהפכו חזון למציאות
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-12">
            {featuredProjects.map((project, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group relative aspect-[4/3] rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-border overflow-hidden"
              >
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Sparkles className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="font-bold text-foreground text-lg mb-1">{project.name}</h3>
                  <p className="text-muted-foreground text-sm">{project.category}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <Link
              to="/portfolio"
              className="inline-flex items-center gap-2 px-6 py-3 bg-foreground text-background rounded-full font-bold hover:bg-foreground/90 transition-colors"
            >
              <span>לכל הפרויקטים</span>
              <ExternalLink className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-24 bg-hero-bg">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-black text-hero-fg mb-6">
              מוכנים לקחת את העסק שלכם
              <br />
              <span className="text-gradient">לשלב הבא?</span>
            </h2>
            <p className="text-hero-fg/60 text-lg mb-8 max-w-xl mx-auto">
              בואו נדבר על איך אנחנו יכולים לעזור לכם להשיג את המטרות שלכם.
            </p>
            <motion.button
              onClick={scrollToForm}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-primary text-white rounded-full text-lg font-bold inline-flex items-center gap-3 hover:bg-primary/90 transition-colors"
            >
              <Send className="w-5 h-5" />
              בואו נתחיל
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-hero-bg border-t border-hero-fg/10 py-8">
        <div className="container mx-auto px-6">
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
        </div>
      </footer>
    </div>
  );
};

export default ContactPage;
