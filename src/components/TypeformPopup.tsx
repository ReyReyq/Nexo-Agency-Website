"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowLeft, ArrowRight, Check, Send, Rocket, AlertCircle } from "lucide-react";
import confetti from "canvas-confetti";

interface TypeformPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

type Direction = "forward" | "back";

interface FormData {
  name: string;
  phone: string;
  email: string;
  budget: string;
  message: string;
  source: string;
}

interface ValidationError {
  field: string;
  message: string;
}

// Israeli phone regex: 05X-XXX-XXXX or 05XXXXXXXX or +972...
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

const TypeformPopup = ({ isOpen, onClose }: TypeformPopupProps) => {
  const [showStartScreen, setShowStartScreen] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState<Direction>("forward");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<ValidationError | null>(null);
  const [shake, setShake] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const confettiInstanceRef = useRef<ReturnType<typeof confetti.create> | null>(null);

  const [formData, setFormData] = useState<FormData>({
    name: "",
    phone: "",
    email: "",
    budget: "",
    message: "",
    source: "",
  });

  // Track if phone was filled for abandonment tracking
  const phoneFilledRef = useRef(false);
  const formSubmittedRef = useRef(false);

  // Steps configuration - optimized for faster completion
  const steps = [
    { id: "name", title: "מה השם שלך?", subtitle: "נעים להכיר!", required: true },
    { id: "phone", title: "מה מספר הטלפון שלך?", subtitle: "נחזור אליך תוך 24 שעות", required: true },
    { id: "email", title: "מה האימייל שלך?", subtitle: "לשליחת הצעת מחיר מפורטת", required: false },
    { id: "budget", title: "מה התקציב המשוער?", subtitle: "זה עוזר לנו להתאים את ההצעה", required: true },
    { id: "message", title: "ספרו לנו קצת על הפרויקט", subtitle: "מה אתם מחפשים? מה האתגר?", required: false },
    { id: "source", title: "איך שמעתם עלינו?", subtitle: "סתם סקרנים 😊", required: false },
  ];

  const totalSteps = steps.length;
  const currentStepData = steps[currentStep];
  const progress = ((currentStep + 1) / totalSteps) * 100;

  // Phone number formatter
  const formatPhoneNumber = (value: string): string => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, "");

    // Format as 05X-XXX-XXXX
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
    return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
  };

  // Validate phone number
  const validatePhone = (phone: string): string | null => {
    const cleaned = phone.replace(/[-\s]/g, "");

    if (cleaned.length === 0) {
      return "נא להזין מספר טלפון";
    }

    if (cleaned.length < 10) {
      return "מספר הטלפון קצר מדי";
    }

    if (!cleaned.startsWith("05") && !cleaned.startsWith("972") && !cleaned.startsWith("+972")) {
      return "נא להזין מספר טלפון ישראלי תקין";
    }

    if (!/^(?:(?:\+?972|0)5\d{8})$/.test(cleaned)) {
      return "מספר הטלפון אינו תקין";
    }

    return null;
  };

  // Validate email
  const validateEmail = (email: string): string | null => {
    if (email.length === 0) return null; // Optional field

    if (!emailRegex.test(email)) {
      return "כתובת האימייל אינה תקינה";
    }

    return null;
  };

  // Create confetti instance when canvas is available and trigger when success
  useEffect(() => {
    if (isSuccess) {
      // Give time for the canvas to render in the DOM
      const timer = setTimeout(() => {
        const canvas = canvasRef.current;
        const modal = modalRef.current;

        if (!canvas || !modal) {
          console.log("Canvas or modal not available:", { canvas: !!canvas, modal: !!modal });
          // Fallback to global confetti
          triggerGlobalConfetti();
          return;
        }

        // Set canvas dimensions
        const rect = modal.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;
        console.log("Canvas dimensions set:", rect.width, rect.height);

        // Create confetti instance bound to the modal's canvas
        try {
          confettiInstanceRef.current = confetti.create(canvas, {
            resize: false,
            useWorker: false,
          });
          console.log("Confetti instance created");
          triggerConfetti();
        } catch (e) {
          console.error("Failed to create confetti instance:", e);
          triggerGlobalConfetti();
        }
      }, 150);

      return () => clearTimeout(timer);
    }

    // Cleanup on unmount or when success changes
    return () => {
      if (confettiInstanceRef.current) {
        confettiInstanceRef.current.reset();
        confettiInstanceRef.current = null;
      }
    };
  }, [isSuccess]);

  // Trigger confetti celebration - inside the modal canvas
  // Shoots from bottom corners with slower, gentler animation
  const triggerConfetti = () => {
    const myConfetti = confettiInstanceRef.current;
    if (!myConfetti) return;

    const colors = ["#ff6b35", "#f7c59f", "#2ec4b6", "#ffffff", "#ec4899"];
    const defaults = {
      colors,
      gravity: 0.3,      // Very slow fall
      ticks: 400,        // Long-lasting particles
      decay: 0.96,       // Slow fade
      drift: 0,          // No horizontal drift
      startVelocity: 25, // Slower initial velocity
    };

    // First wave - bottom left corner shooting up-right
    myConfetti({
      ...defaults,
      particleCount: 40,
      angle: 60,         // Shooting up and to the right
      spread: 50,
      origin: { x: 0.1, y: 0.95 },  // Bottom left
      scalar: 1.2,
    });

    // First wave - bottom right corner shooting up-left
    myConfetti({
      ...defaults,
      particleCount: 40,
      angle: 120,        // Shooting up and to the left
      spread: 50,
      origin: { x: 0.9, y: 0.95 },  // Bottom right
      scalar: 1.2,
    });

    // Second wave - slightly delayed
    setTimeout(() => {
      if (!confettiInstanceRef.current) return;
      // Bottom left
      confettiInstanceRef.current({
        ...defaults,
        particleCount: 35,
        angle: 70,
        spread: 45,
        origin: { x: 0.15, y: 0.9 },
        scalar: 1.1,
      });
      // Bottom right
      confettiInstanceRef.current({
        ...defaults,
        particleCount: 35,
        angle: 110,
        spread: 45,
        origin: { x: 0.85, y: 0.9 },
        scalar: 1.1,
      });
    }, 400);

    // Third wave - gentle follow-up
    setTimeout(() => {
      if (!confettiInstanceRef.current) return;
      // Bottom left
      confettiInstanceRef.current({
        ...defaults,
        particleCount: 30,
        angle: 55,
        spread: 60,
        origin: { x: 0.05, y: 1 },
        scalar: 1,
        startVelocity: 20,
      });
      // Bottom right
      confettiInstanceRef.current({
        ...defaults,
        particleCount: 30,
        angle: 125,
        spread: 60,
        origin: { x: 0.95, y: 1 },
        scalar: 1,
        startVelocity: 20,
      });
    }, 800);

    // Final gentle burst
    setTimeout(() => {
      if (!confettiInstanceRef.current) return;
      confettiInstanceRef.current({
        ...defaults,
        particleCount: 25,
        angle: 65,
        spread: 40,
        origin: { x: 0.1, y: 0.95 },
        startVelocity: 18,
      });
      confettiInstanceRef.current({
        ...defaults,
        particleCount: 25,
        angle: 115,
        spread: 40,
        origin: { x: 0.9, y: 0.95 },
        startVelocity: 18,
      });
    }, 1200);
  };

  // Fallback global confetti if canvas approach fails
  const triggerGlobalConfetti = () => {
    console.log("Using global confetti fallback");
    const colors = ["#ff6b35", "#f7c59f", "#2ec4b6", "#ffffff", "#ec4899"];

    // Initial burst
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { x: 0.5, y: 0.4 },
      colors,
      zIndex: 10002,
    });

    // Side bursts
    setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.5 },
        colors,
        zIndex: 10002,
      });
      confetti({
        particleCount: 50,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.5 },
        colors,
        zIndex: 10002,
      });
    }, 150);

    // Final burst
    setTimeout(() => {
      confetti({
        particleCount: 80,
        spread: 100,
        origin: { x: 0.5, y: 0.5 },
        colors,
        zIndex: 10002,
      });
    }, 300);
  };

  // Form abandonment tracking - send partial data if user leaves with phone filled
  const sendAbandonmentData = useCallback(() => {
    if (phoneFilledRef.current && !formSubmittedRef.current && formData.phone) {
      const abandonmentData = {
        type: "form_abandonment",
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        currentStep,
        timestamp: new Date().toISOString(),
      };

      // Use sendBeacon for reliable delivery even when page is closing
      const blob = new Blob([JSON.stringify(abandonmentData)], { type: "application/json" });
      navigator.sendBeacon("/api/form-abandonment", blob);
      console.log("Form abandonment tracked:", abandonmentData);
    }
  }, [formData, currentStep]);

  // Track page visibility for abandonment
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden" && isOpen) {
        sendAbandonmentData();
      }
    };

    const handleBeforeUnload = () => {
      if (isOpen) {
        sendAbandonmentData();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isOpen, sendAbandonmentData]);

  // Track when phone is filled
  useEffect(() => {
    if (formData.phone.replace(/[-\s]/g, "").length >= 10) {
      phoneFilledRef.current = true;
    }
  }, [formData.phone]);

  // Reset form when closed
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setShowStartScreen(true);
        setCurrentStep(0);
        setIsSuccess(false);
        setError(null);
        phoneFilledRef.current = false;
        formSubmittedRef.current = false;
        setFormData({
          name: "",
          phone: "",
          email: "",
          budget: "",
          message: "",
          source: "",
        });
      }, 300);
    }
  }, [isOpen]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen || isSuccess || showStartScreen) return;

      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "Enter" && !e.shiftKey) {
        const activeElement = document.activeElement;
        if (activeElement?.tagName !== "TEXTAREA") {
          e.preventDefault();
          handleNext();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, currentStep, formData, isSuccess, showStartScreen]);

  // Trigger shake animation
  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  // Validation for current step
  const validateCurrentStep = (): ValidationError | null => {
    const step = steps[currentStep];

    switch (step.id) {
      case "name":
        if (formData.name.trim().length < 2) {
          return { field: "name", message: "נא להזין שם מלא" };
        }
        break;

      case "phone":
        const phoneError = validatePhone(formData.phone);
        if (phoneError) {
          return { field: "phone", message: phoneError };
        }
        break;

      case "email":
        const emailError = validateEmail(formData.email);
        if (emailError) {
          return { field: "email", message: emailError };
        }
        break;

      case "budget":
        if (!formData.budget) {
          return { field: "budget", message: "נא לבחור טווח תקציב" };
        }
        break;
    }

    return null;
  };

  const canProceed = useCallback(() => {
    const step = steps[currentStep];

    switch (step.id) {
      case "name":
        return formData.name.trim().length >= 2;
      case "phone":
        return formData.phone.replace(/[-\s]/g, "").length >= 10;
      case "email":
        return true; // Optional
      case "budget":
        return formData.budget !== "";
      case "message":
        return true; // Optional
      case "source":
        return true; // Optional
      default:
        return true;
    }
  }, [currentStep, formData]);

  const handleNext = useCallback(() => {
    // Validate current step
    const validationError = validateCurrentStep();
    if (validationError) {
      setError(validationError);
      triggerShake();
      return;
    }

    setError(null);

    if (currentStep < totalSteps - 1) {
      setDirection("forward");
      setCurrentStep((prev) => prev + 1);
    } else {
      handleSubmit();
    }
  }, [currentStep, totalSteps, formData]);

  const handleBack = useCallback(() => {
    if (currentStep > 0) {
      setError(null);
      setDirection("back");
      setCurrentStep((prev) => prev - 1);
    }
  }, [currentStep]);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    formSubmittedRef.current = true; // Mark as submitted to prevent abandonment tracking
    setIsSubmitting(false);
    setIsSuccess(true);
    // Confetti is triggered via useEffect when isSuccess becomes true
    console.log("Form submitted:", formData);
  };

  const updateFormData = (field: keyof FormData, value: string | string[]) => {
    setError(null);
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePhoneChange = (value: string) => {
    const formatted = formatPhoneNumber(value);
    updateFormData("phone", formatted);
  };

  const startForm = () => {
    setShowStartScreen(false);
  };

  // Animation variants
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { type: "spring", duration: 0.5, bounce: 0.15 },
    },
    exit: { opacity: 0, scale: 0.95, y: 20, transition: { duration: 0.2 } },
  };

  const slideVariants = {
    initial: (dir: Direction) => ({
      x: dir === "forward" ? 80 : -80,
      opacity: 0,
    }),
    animate: {
      x: 0,
      opacity: 1,
      transition: { type: "tween", duration: 0.35, ease: [0.25, 0.1, 0.25, 1] },
    },
    exit: (dir: Direction) => ({
      x: dir === "forward" ? -80 : 80,
      opacity: 0,
      transition: { type: "tween", duration: 0.25, ease: [0.42, 0, 1, 1] },
    }),
  };

  const shakeVariants = {
    shake: {
      x: [0, -10, 10, -10, 10, 0],
      transition: { duration: 0.4 },
    },
  };

  // Render start screen
  const renderStartScreen = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="text-center py-8 md:py-12"
      dir="rtl"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", delay: 0.2, duration: 0.6 }}
        className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center mx-auto mb-8"
      >
        <Rocket className="w-12 h-12 text-white" />
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-3xl md:text-4xl font-black mb-4 text-foreground"
      >
        בואו נכיר!
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="text-lg text-foreground/60 mb-3 max-w-md mx-auto"
      >
        כמה שאלות קצרות שיעזרו לנו להבין את הפרויקט שלכם ולהכין הצעה מותאמת אישית
      </motion.p>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-sm text-foreground/40 mb-8"
      >
        ⏱️ פחות מדקה
      </motion.p>

      <motion.button
        onClick={startForm}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6, type: "spring" }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="px-10 py-4 bg-primary text-white rounded-full font-bold text-lg shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-shadow"
      >
        בואו נתחיל →
      </motion.button>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="text-xs text-foreground/30 mt-6"
      >
        לחצו Enter להתחיל
      </motion.p>
    </motion.div>
  );

  // Handle Enter on start screen
  useEffect(() => {
    const handleStartEnter = (e: KeyboardEvent) => {
      if (!isOpen || !showStartScreen) return;
      if (e.key === "Enter") {
        startForm();
      }
    };

    window.addEventListener("keydown", handleStartEnter);
    return () => window.removeEventListener("keydown", handleStartEnter);
  }, [isOpen, showStartScreen]);

  const renderStepContent = () => {
    const inputClasses = `w-full text-2xl md:text-3xl bg-transparent border-b-2 pb-3 outline-none transition-colors ${
      error?.field === currentStepData.id
        ? "border-red-500 text-red-500"
        : "border-foreground/20 focus:border-primary text-foreground placeholder:text-foreground/30"
    }`;

    switch (currentStepData.id) {
      case "name":
        return (
          <motion.div animate={shake ? "shake" : ""} variants={shakeVariants}>
            <input
              ref={inputRef}
              type="text"
              value={formData.name}
              onChange={(e) => updateFormData("name", e.target.value)}
              placeholder="השם שלך..."
              autoFocus
              className={inputClasses}
              dir="rtl"
            />
            {error?.field === "name" && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-500 text-sm mt-3 flex items-center gap-2"
              >
                <AlertCircle className="w-4 h-4" />
                {error.message}
              </motion.p>
            )}
          </motion.div>
        );

      case "phone":
        return (
          <motion.div animate={shake ? "shake" : ""} variants={shakeVariants}>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => handlePhoneChange(e.target.value)}
              placeholder="050-000-0000"
              autoFocus
              maxLength={12}
              className={`${inputClasses} tracking-wider`}
              dir="ltr"
            />
            {error?.field === "phone" && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-500 text-sm mt-3 flex items-center gap-2"
                dir="rtl"
              >
                <AlertCircle className="w-4 h-4" />
                {error.message}
              </motion.p>
            )}
            <p className="text-xs text-foreground/30 mt-3" dir="rtl">
              מספר טלפון ישראלי בלבד
            </p>
          </motion.div>
        );

      case "email":
        return (
          <motion.div animate={shake ? "shake" : ""} variants={shakeVariants}>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => updateFormData("email", e.target.value)}
              placeholder="email@example.com"
              autoFocus
              className={`${inputClasses} ${error?.field === "email" ? "border-red-500" : ""}`}
              dir="ltr"
            />
            {error?.field === "email" && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-500 text-sm mt-3 flex items-center gap-2"
                dir="rtl"
              >
                <AlertCircle className="w-4 h-4" />
                {error.message}
              </motion.p>
            )}
          </motion.div>
        );

      case "budget":
        return (
          <div className="flex flex-col gap-3">
            {budgetOptions.map((option, index) => (
              <motion.button
                key={option.value}
                onClick={() => {
                  updateFormData("budget", option.value);
                  setTimeout(handleNext, 300);
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-right ${
                  formData.budget === option.value
                    ? "border-primary bg-primary/5"
                    : "border-foreground/10 hover:border-foreground/30"
                }`}
              >
                <span
                  className={`w-8 h-8 rounded-lg border-2 flex items-center justify-center text-sm font-medium ${
                    formData.budget === option.value
                      ? "border-primary bg-primary text-white"
                      : "border-foreground/20"
                  }`}
                >
                  {String.fromCharCode(65 + index)}
                </span>
                <div className="flex-1">
                  <span className="text-lg font-medium">{option.label}</span>
                  <span className="text-sm text-foreground/40 mr-2">• {option.description}</span>
                </div>
              </motion.button>
            ))}
          </div>
        );

      case "message":
        return (
          <textarea
            value={formData.message}
            onChange={(e) => updateFormData("message", e.target.value)}
            placeholder="ספרו לנו על הפרויקט, האתגרים, מה חשוב לכם..."
            rows={4}
            autoFocus
            className="w-full text-lg bg-transparent border-2 border-foreground/20 focus:border-primary p-4 rounded-xl outline-none text-foreground placeholder:text-foreground/30 transition-colors resize-none"
            dir="rtl"
          />
        );

      case "source":
        return (
          <div className="grid grid-cols-2 gap-3">
            {sourceOptions.map((option, index) => (
              <motion.button
                key={option.value}
                onClick={() => {
                  updateFormData("source", option.value);
                  setTimeout(handleSubmit, 300);
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-right ${
                  formData.source === option.value
                    ? "border-primary bg-primary/5"
                    : "border-foreground/10 hover:border-foreground/30"
                }`}
              >
                <span className="text-xl">{option.icon}</span>
                <span className="font-medium">{option.label}</span>
              </motion.button>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  const renderSuccess = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center py-12"
      dir="rtl"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", delay: 0.2 }}
        className="w-20 h-20 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center mx-auto mb-6"
      >
        <Check className="w-10 h-10 text-white" />
      </motion.div>
      <motion.h3
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-3xl font-bold mb-4 text-foreground"
      >
        איזה כיף, {formData.name.split(" ")[0]}! 🎉
      </motion.h3>
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="text-lg text-foreground/70 mb-2"
      >
        הפרטים נשמרו בהצלחה
      </motion.p>
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="text-foreground/50 mb-2"
      >
        נחזור אליך תוך 24 שעות עם הצעה מותאמת אישית
      </motion.p>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-sm text-foreground/40"
      >
        מתרגשים להתחיל איתך! 💜
      </motion.p>
      <motion.button
        onClick={onClose}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="mt-8 px-8 py-3 bg-primary text-white rounded-full font-medium"
      >
        סגירה
      </motion.button>
    </motion.div>
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[10001] flex items-center justify-center p-4"
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          transition={{ duration: 0.3 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            ref={modalRef}
            className="relative w-full max-w-2xl bg-background rounded-2xl shadow-2xl overflow-hidden"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Confetti Canvas - positioned inside modal */}
            {isSuccess && (
              <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full pointer-events-none"
                style={{ zIndex: 100 }}
              />
            )}

            {/* Progress Bar */}
            {!isSuccess && !showStartScreen && (
              <div className="absolute top-0 left-0 right-0 h-1 bg-foreground/10">
                <motion.div
                  className="h-full bg-primary"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                />
              </div>
            )}

            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 left-4 w-10 h-10 rounded-full bg-foreground/5 hover:bg-foreground/10 flex items-center justify-center transition-colors z-10"
            >
              <X className="w-5 h-5 text-foreground/60" />
            </button>

            {/* Content */}
            <div className="p-8 md:p-12 pt-16" dir="rtl">
              <AnimatePresence mode="wait">
                {showStartScreen ? (
                  <motion.div key="start" exit={{ opacity: 0, x: -50 }}>
                    {renderStartScreen()}
                  </motion.div>
                ) : isSuccess ? (
                  renderSuccess()
                ) : (
                  <>
                    {/* Step Counter */}
                    <div className="text-sm text-foreground/40 mb-2">
                      {currentStep + 1} / {totalSteps}
                    </div>

                    {/* Question */}
                    <AnimatePresence mode="wait" custom={direction}>
                      <motion.div
                        key={currentStep}
                        custom={direction}
                        variants={slideVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                      >
                        <h2 className="text-2xl md:text-3xl font-bold mb-2 text-foreground">
                          {currentStepData.title}
                        </h2>
                        <p className="text-foreground/50 mb-8">
                          {currentStepData.subtitle}
                        </p>

                        {/* Input */}
                        {renderStepContent()}

                        {/* Keyboard Hint */}
                        {!["budget", "source"].includes(currentStepData.id) && (
                          <p className="text-sm text-foreground/30 mt-6">
                            לחצו <strong>Enter ↵</strong> להמשיך
                          </p>
                        )}
                      </motion.div>
                    </AnimatePresence>

                    {/* Navigation - RTL: Continue on RIGHT (first in DOM), Back on LEFT (second in DOM) */}
                    <div className="flex justify-between items-center mt-10 pt-6 border-t border-foreground/10">
                      {/* Continue button - appears on RIGHT in RTL */}
                      <motion.button
                        onClick={handleNext}
                        disabled={!canProceed() || isSubmitting}
                        whileHover={canProceed() ? { scale: 1.02 } : {}}
                        whileTap={canProceed() ? { scale: 0.98 } : {}}
                        className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all ${
                          canProceed()
                            ? "bg-primary text-white hover:bg-primary/90"
                            : "bg-foreground/10 text-foreground/30 cursor-not-allowed"
                        }`}
                      >
                        {isSubmitting ? (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                          />
                        ) : currentStep === totalSteps - 1 ? (
                          <>
                            <Send className="w-4 h-4" />
                            <span>שליחה</span>
                          </>
                        ) : (
                          <>
                            <span>המשך</span>
                            <ArrowLeft className="w-4 h-4" />
                          </>
                        )}
                      </motion.button>

                      {/* Back button - appears on LEFT in RTL */}
                      <button
                        onClick={handleBack}
                        disabled={currentStep === 0}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                          currentStep === 0
                            ? "opacity-30 cursor-not-allowed"
                            : "hover:bg-foreground/5"
                        }`}
                      >
                        <span>חזרה</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TypeformPopup;
