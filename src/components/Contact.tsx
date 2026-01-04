import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState, useCallback, useEffect } from "react";
import { Phone, Mail, ArrowUpRight, Send, Rocket, Check, AlertCircle, ArrowLeft, ArrowRight, MessageCircle, Clock } from "lucide-react";
import confetti from "canvas-confetti";
import { submitContactForm, type FormData as SubmissionFormData } from "@/utils/formSubmission";

// Utility for tracking timeouts for cleanup
const useTimeoutCleanup = () => {
  const timeoutsRef = useRef<Set<ReturnType<typeof setTimeout>>>(new Set());

  const setTrackedTimeout = useCallback((callback: () => void, delay: number) => {
    const timeoutId = setTimeout(() => {
      callback();
      timeoutsRef.current.delete(timeoutId);
    }, delay);
    timeoutsRef.current.add(timeoutId);
    return timeoutId;
  }, []);

  const clearAllTimeouts = useCallback(() => {
    timeoutsRef.current.forEach((id) => clearTimeout(id));
    timeoutsRef.current.clear();
  }, []);

  useEffect(() => {
    return () => {
      clearAllTimeouts();
    };
  }, [clearAllTimeouts]);

  return { setTrackedTimeout, clearAllTimeouts };
};

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
  { id: "source", title: "איך שמעתם עלינו?", subtitle: "סתם סקרנים", required: false },
];

const Contact = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const inputRef = useRef<HTMLInputElement>(null);
  const { setTrackedTimeout } = useTimeoutCleanup();
  const isMountedRef = useRef(true);

  // Ref to always access the latest handleNext callback (fixes race condition with state updates)
  const handleNextRef = useRef<() => void>(() => {});

  // Track mount state for async operations
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Form state
  const [showStartScreen, setShowStartScreen] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState<"forward" | "back">("forward");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<{ field: string; message: string } | null>(null);
  const [shake, setShake] = useState(false);

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

  // Handle input change
  const handleInputChange = useCallback((field: string, value: string) => {
    if (field === "phone") {
      value = formatPhoneNumber(value);
    }
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError(null);
  }, []);

  // Handle submit (defined before handleNext which depends on it)
  const handleSubmit = useCallback(async () => {
    if (!isMountedRef.current) return;
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

      // Check if still mounted before updating state
      if (!isMountedRef.current) return;

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
      if (isMountedRef.current) {
        setError({ field: "submit", message: "שגיאה בשליחה, נסו שוב" });
      }
    } finally {
      if (isMountedRef.current) {
        setIsSubmitting(false);
      }
    }
  }, [formData]);

  // Handle next step
  const handleNext = useCallback(() => {
    const field = currentStepData.id;
    const value = formData[field as keyof FormData];

    if (currentStepData.required && !validateField(field, value)) {
      setShake(true);
      setTrackedTimeout(() => setShake(false), 500);
      return;
    }

    if (field === "email" && value && !validateField(field, value)) {
      setShake(true);
      setTrackedTimeout(() => setShake(false), 500);
      return;
    }

    setDirection("forward");
    if (currentStep < totalSteps - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      handleSubmit();
    }
  }, [currentStep, currentStepData, formData, totalSteps, validateField, setTrackedTimeout, handleSubmit]);

  // Keep ref updated with latest handleNext (fixes race condition with auto-advance)
  useEffect(() => {
    handleNextRef.current = handleNext;
  }, [handleNext]);

  // Handle previous step
  const handleBack = useCallback(() => {
    if (currentStep > 0) {
      setDirection("back");
      setCurrentStep((prev) => prev - 1);
      setError(null);
    }
  }, [currentStep]);

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
                  // Use ref to get the latest handleNext callback after state update
                  setTrackedTimeout(() => handleNextRef.current(), 200);
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`p-4 rounded-xl border-2 text-right transition-all ${
                  formData.budget === option.value
                    ? "border-primary bg-primary/10"
                    : "border-[#e5e5e5] hover:border-primary/50 bg-white"
                }`}
              >
                <p className="font-bold text-[#1a1a1a]">{option.label}</p>
                <p className="text-sm text-[#6a6a6a]">{option.description}</p>
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
                  // Use ref to get the latest handleNext callback after state update
                  setTrackedTimeout(() => handleNextRef.current(), 200);
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`p-4 rounded-xl border-2 text-center transition-all ${
                  formData.source === option.value
                    ? "border-primary bg-primary/10"
                    : "border-[#e5e5e5] hover:border-primary/50 bg-white"
                }`}
              >
                <span className="text-2xl mb-2 block">{option.icon}</span>
                <p className="text-sm font-medium text-[#1a1a1a]">{option.label}</p>
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
            className="w-full max-w-md mx-auto px-6 py-4 text-lg bg-white border-2 border-[#e5e5e5] rounded-2xl focus:border-primary focus:outline-none resize-none text-[#1a1a1a] placeholder:text-[#a0a0a0] text-right"
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
            className={`w-full max-w-md mx-auto px-6 py-4 min-h-[44px] text-xl bg-white border-2 rounded-2xl focus:outline-none text-[#1a1a1a] placeholder:text-[#a0a0a0] text-right transition-colors ${
              error ? "border-red-500" : "border-[#e5e5e5] focus:border-primary"
            }`}
            dir={field === "email" ? "ltr" : "rtl"}
          />
        );
    }
  };

  return (
    <section id="contact" className="bg-[#FAFAFA] py-24 md:py-32 relative overflow-hidden">
      {/* Subtle background pattern */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #1a1a1a 1px, transparent 0)`,
          backgroundSize: '40px 40px',
        }}
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ width: 0 }}
            animate={isInView ? { width: 80 } : { width: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="h-1 bg-primary mx-auto mb-6"
          />

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-[#1a1a1a] leading-[1] mb-6">
            בואו נדבר על
            <br />
            <span className="text-primary">הפרויקט שלכם</span>
          </h2>

          <p className="text-[#6a6a6a] text-lg md:text-xl max-w-xl mx-auto">
            השאירו פרטים ונחזור אליכם תוך 24 שעות עם הצעה מותאמת
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto items-start">
          {/* Left Side - Embedded Form */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -40 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="order-1 lg:order-2"
          >
            <div className="bg-white rounded-3xl shadow-[0_0_0_1px_rgba(0,0,0,0.03),0_2px_4px_rgba(0,0,0,0.05),0_12px_24px_rgba(0,0,0,0.05)] p-6 sm:p-8 md:p-12 min-h-[400px] md:min-h-[500px] flex flex-col justify-center">
              {isSuccess ? (
                // Success State
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-8"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", delay: 0.2 }}
                    className="w-24 h-24 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-6"
                  >
                    <Check className="w-12 h-12 text-emerald-500" />
                  </motion.div>
                  <h3 className="text-2xl font-black text-[#1a1a1a] mb-2">תודה רבה!</h3>
                  <p className="text-[#6a6a6a] mb-6">קיבלנו את הפרטים שלך ונחזור אליך בהקדם</p>
                  <div className="flex items-center justify-center gap-2 text-sm text-[#6a6a6a]">
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
                  <h2 className="text-2xl md:text-3xl font-black text-[#1a1a1a] mb-3">בואו נכיר!</h2>
                  <p className="text-[#6a6a6a] mb-2 max-w-sm mx-auto">
                    כמה שאלות קצרות שיעזרו לנו להבין את הפרויקט שלכם ולהכין הצעה מותאמת אישית
                  </p>
                  <p className="text-[#a0a0a0] text-sm mb-8">פחות מדקה</p>
                  <motion.button
                    onClick={() => setShowStartScreen(false)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-4 bg-primary text-white rounded-full text-lg font-bold hover:bg-primary/90 transition-colors"
                  >
                    בואו נתחיל
                  </motion.button>
                  <p className="text-[#c0c0c0] text-xs mt-6">לחצו Enter להתחיל</p>
                </motion.div>
              ) : (
                // Form Steps
                <>
                  {/* Progress Bar */}
                  <div className="h-1 bg-[#e5e5e5] rounded-full mb-8 overflow-hidden">
                    <motion.div
                      className="h-full bg-primary"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>

                  {/* Step Counter */}
                  <div className="text-center mb-2">
                    <span className="text-sm text-[#6a6a6a]">
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
                      className={`text-center flex-1 flex flex-col justify-center ${shake ? "animate-shake" : ""}`}
                    >
                      <h3 className="text-2xl md:text-3xl font-black text-[#1a1a1a] mb-2">
                        {currentStepData.title}
                      </h3>
                      <p className="text-[#6a6a6a] mb-8">{currentStepData.subtitle}</p>

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
                  <div className="flex items-center justify-between mt-8 pt-6 border-t border-[#e5e5e5]">
                    <button
                      onClick={handleBack}
                      disabled={currentStep === 0}
                      className={`flex items-center gap-2 px-4 min-h-[44px] rounded-lg transition-all ${
                        currentStep === 0
                          ? "opacity-0 pointer-events-none"
                          : "text-[#6a6a6a] hover:text-[#1a1a1a]"
                      }`}
                    >
                      <ArrowRight className="w-5 h-5" />
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
                  <p className="text-center text-[#c0c0c0] text-xs mt-4">
                    לחצו Enter להמשיך
                  </p>
                </>
              )}
            </div>
          </motion.div>

          {/* Right Side - Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 40 }}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="order-2 lg:order-1"
            dir="rtl"
          >
            {/* Intro text */}
            <div className="mb-10">
              <h3 className="text-2xl md:text-3xl font-black text-[#1a1a1a] mb-4">
                נשמח לשמוע מכם
              </h3>
              <p className="text-[#6a6a6a] text-lg leading-relaxed">
                מעדיפים ליצור קשר ישירות? אתם מוזמנים לפנות אלינו בכל אחת מהדרכים הבאות.
                אנחנו כאן לענות על כל שאלה ולעזור לכם להתחיל.
              </p>
            </div>

            {/* Contact Cards */}
            <div className="space-y-4 mb-10">
              <motion.a
                href="mailto:sales@nexoagency.com"
                whileHover={{ x: -10, scale: 1.02 }}
                className="group flex items-center gap-4 p-6 rounded-2xl bg-white border border-[#e5e5e5] hover:border-primary/50 hover:shadow-lg transition-all"
              >
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                  <Mail className="w-6 h-6 text-primary group-hover:text-white transition-colors" />
                </div>
                <div className="flex-1 text-right">
                  <p className="text-[#6a6a6a] text-sm mb-1">אימייל</p>
                  <p className="text-[#1a1a1a] text-lg font-bold">sales@nexoagency.com</p>
                </div>
                <ArrowUpRight className="w-5 h-5 text-[#c0c0c0] group-hover:text-primary transition-colors" />
              </motion.a>

              <motion.a
                href="tel:+972533622423"
                whileHover={{ x: -10, scale: 1.02 }}
                className="group flex items-center gap-4 p-6 rounded-2xl bg-white border border-[#e5e5e5] hover:border-primary/50 hover:shadow-lg transition-all"
              >
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                  <Phone className="w-6 h-6 text-primary group-hover:text-white transition-colors" />
                </div>
                <div className="flex-1 text-right">
                  <p className="text-[#6a6a6a] text-sm mb-1">טלפון</p>
                  <p className="text-[#1a1a1a] text-lg font-bold">053-362-2423</p>
                </div>
                <ArrowUpRight className="w-5 h-5 text-[#c0c0c0] group-hover:text-primary transition-colors" />
              </motion.a>

              <motion.a
                href="https://wa.me/972533622423"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ x: -10, scale: 1.02 }}
                className="group flex items-center gap-4 p-6 rounded-2xl bg-white border border-[#e5e5e5] hover:border-emerald-500/50 hover:shadow-lg transition-all"
              >
                <div className="w-14 h-14 rounded-xl bg-emerald-500/10 flex items-center justify-center group-hover:bg-emerald-500 transition-colors">
                  <MessageCircle className="w-6 h-6 text-emerald-500 group-hover:text-white transition-colors" />
                </div>
                <div className="flex-1 text-right">
                  <p className="text-[#6a6a6a] text-sm mb-1">וואטסאפ</p>
                  <p className="text-[#1a1a1a] text-lg font-bold">שלחו הודעה מיידית</p>
                </div>
                <ArrowUpRight className="w-5 h-5 text-[#c0c0c0] group-hover:text-emerald-500 transition-colors" />
              </motion.a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
