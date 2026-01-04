"use client"

import { cn } from "@/lib/utils"
import { AnimatedList } from "./animated-list"
import React, { useState, useEffect, useMemo } from "react"
import {
  MessageCircle,
  ShoppingCart,
  UserPlus,
  Star,
  TrendingUp,
  Mail,
  Heart,
  DollarSign,
  Bell,
  Sparkles,
  Share2,
  Award,
  Users,
  Globe,
  Package,
  Calendar,
  CheckCircle,
  ThumbsUp,
  Gift,
  Repeat,
  Bookmark,
  CreditCard,
  Zap,
  Target
} from "lucide-react"

interface NotificationItem {
  name: string
  description: string
  icon: React.ReactNode
  color: string
  time: string
}

const allNotifications: NotificationItem[] = [
  // Sales notifications
  {
    name: "מכירה חדשה",
    description: "הזמנה #1247 - ₪890",
    time: "עכשיו",
    icon: <ShoppingCart className="w-4 h-4" />,
    color: "#10B981",
  },
  {
    name: "מכירה חדשה",
    description: "הזמנה #1248 - ₪1,250",
    time: "לפני 2 דק׳",
    icon: <DollarSign className="w-4 h-4" />,
    color: "#10B981",
  },
  {
    name: "מכירה חדשה",
    description: "הזמנה #1249 - ₪3,400",
    time: "לפני 5 דק׳",
    icon: <ShoppingCart className="w-4 h-4" />,
    color: "#10B981",
  },
  {
    name: "מכירה גדולה",
    description: "הזמנה #1250 - ₪7,890",
    time: "לפני 8 דק׳",
    icon: <DollarSign className="w-4 h-4" />,
    color: "#059669",
  },
  {
    name: "מכירה חדשה",
    description: "הזמנה #1251 - ₪450",
    time: "לפני 12 דק׳",
    icon: <ShoppingCart className="w-4 h-4" />,
    color: "#10B981",
  },
  {
    name: "מכירה חדשה",
    description: "הזמנה #1252 - ₪2,100",
    time: "לפני 15 דק׳",
    icon: <CreditCard className="w-4 h-4" />,
    color: "#10B981",
  },
  {
    name: "מכירה VIP",
    description: "הזמנה #1253 - ₪12,500",
    time: "לפני 18 דק׳",
    icon: <Sparkles className="w-4 h-4" />,
    color: "#8B5CF6",
  },

  // User signups
  {
    name: "משתמש חדש נרשם",
    description: "david.cohen@gmail.com",
    time: "לפני 3 דק׳",
    icon: <UserPlus className="w-4 h-4" />,
    color: "#8B5CF6",
  },
  {
    name: "משתמש חדש נרשם",
    description: "sarah.levi@outlook.com",
    time: "לפני 7 דק׳",
    icon: <UserPlus className="w-4 h-4" />,
    color: "#8B5CF6",
  },
  {
    name: "משתמש חדש נרשם",
    description: "yossi.m@walla.co.il",
    time: "לפני 11 דק׳",
    icon: <UserPlus className="w-4 h-4" />,
    color: "#8B5CF6",
  },
  {
    name: "משתמש חדש נרשם",
    description: "michal.bar@gmail.com",
    time: "לפני 14 דק׳",
    icon: <UserPlus className="w-4 h-4" />,
    color: "#8B5CF6",
  },
  {
    name: "משתמש חדש נרשם",
    description: "oren.k@hotmail.com",
    time: "לפני 20 דק׳",
    icon: <UserPlus className="w-4 h-4" />,
    color: "#8B5CF6",
  },

  // Leads from contact forms
  {
    name: "ליד חדש",
    description: "טופס יצירת קשר - מיכאל",
    time: "לפני 4 דק׳",
    icon: <Mail className="w-4 h-4" />,
    color: "#F59E0B",
  },
  {
    name: "ליד חדש",
    description: "טופס יצירת קשר - רונית",
    time: "לפני 9 דק׳",
    icon: <Mail className="w-4 h-4" />,
    color: "#F59E0B",
  },
  {
    name: "ליד חדש",
    description: "טופס יצירת קשר - אבי",
    time: "לפני 16 דק׳",
    icon: <Mail className="w-4 h-4" />,
    color: "#F59E0B",
  },
  {
    name: "ליד חדש",
    description: "טופס יצירת קשר - נועה",
    time: "לפני 22 דק׳",
    icon: <Mail className="w-4 h-4" />,
    color: "#F59E0B",
  },
  {
    name: "ליד חם",
    description: "בקשת הצעת מחיר - דני",
    time: "לפני 25 דק׳",
    icon: <Zap className="w-4 h-4" />,
    color: "#EF4444",
  },

  // Reviews
  {
    name: "ביקורת 5 כוכבים",
    description: "שירות מעולה, ממליץ בחום!",
    time: "לפני 6 דק׳",
    icon: <Star className="w-4 h-4" />,
    color: "#EAB308",
  },
  {
    name: "ביקורת 5 כוכבים",
    description: "מוצר איכותי, הגיע מהר",
    time: "לפני 13 דק׳",
    icon: <Star className="w-4 h-4" />,
    color: "#EAB308",
  },
  {
    name: "ביקורת 5 כוכבים",
    description: "חוויית קנייה מדהימה",
    time: "לפני 19 דק׳",
    icon: <Star className="w-4 h-4" />,
    color: "#EAB308",
  },
  {
    name: "ביקורת 4 כוכבים",
    description: "מרוצה מאוד, אחזור שוב",
    time: "לפני 28 דק׳",
    icon: <Star className="w-4 h-4" />,
    color: "#EAB308",
  },
  {
    name: "ביקורת 5 כוכבים",
    description: "תודה על השירות המצוין!",
    time: "לפני 35 דק׳",
    icon: <Star className="w-4 h-4" />,
    color: "#EAB308",
  },

  // Traffic notifications
  {
    name: "תנועה גבוהה",
    description: "+340% מבקרים היום",
    time: "לפני 10 דק׳",
    icon: <TrendingUp className="w-4 h-4" />,
    color: "#EC4899",
  },
  {
    name: "שיא מבקרים",
    description: "+520% תנועה בשעה האחרונה",
    time: "לפני 17 דק׳",
    icon: <TrendingUp className="w-4 h-4" />,
    color: "#EC4899",
  },
  {
    name: "עלייה בתנועה",
    description: "+180% מבקרים מגוגל",
    time: "לפני 24 דק׳",
    icon: <TrendingUp className="w-4 h-4" />,
    color: "#EC4899",
  },
  {
    name: "תנועה אורגנית",
    description: "+95% עלייה השבוע",
    time: "לפני 32 דק׳",
    icon: <TrendingUp className="w-4 h-4" />,
    color: "#EC4899",
  },

  // Social media engagement
  {
    name: "לייק חדש",
    description: "הפוסט שלכם קיבל 50 לייקים",
    time: "לפני 5 דק׳",
    icon: <Heart className="w-4 h-4" />,
    color: "#EF4444",
  },
  {
    name: "שיתוף חדש",
    description: "הפוסט שותף 23 פעמים",
    time: "לפני 12 דק׳",
    icon: <Share2 className="w-4 h-4" />,
    color: "#3B82F6",
  },
  {
    name: "תגובה חדשה",
    description: "12 תגובות חדשות על הפוסט",
    time: "לפני 18 דק׳",
    icon: <MessageCircle className="w-4 h-4" />,
    color: "#3B82F6",
  },
  {
    name: "לייקים בפייסבוק",
    description: "100 לייקים בשעה האחרונה",
    time: "לפני 23 דק׳",
    icon: <ThumbsUp className="w-4 h-4" />,
    color: "#1877F2",
  },
  {
    name: "עוקב חדש",
    description: "150 עוקבים חדשים באינסטגרם",
    time: "לפני 30 דק׳",
    icon: <Users className="w-4 h-4" />,
    color: "#E4405F",
  },

  // Achievement milestones
  {
    name: "יעד הושג!",
    description: "יעד המכירות החודשי הושג!",
    time: "לפני 15 דק׳",
    icon: <Target className="w-4 h-4" />,
    color: "#14B8A6",
  },
  {
    name: "אבן דרך",
    description: "1,000 לקוחות מרוצים!",
    time: "לפני 21 דק׳",
    icon: <Award className="w-4 h-4" />,
    color: "#F59E0B",
  },
  {
    name: "הישג חדש",
    description: "500 הזמנות החודש!",
    time: "לפני 27 דק׳",
    icon: <Bell className="w-4 h-4" />,
    color: "#14B8A6",
  },
  {
    name: "שיא חדש",
    description: "שיא מכירות יומי נשבר!",
    time: "לפני 33 דק׳",
    icon: <Sparkles className="w-4 h-4" />,
    color: "#6366F1",
  },

  // Newsletter subscriptions
  {
    name: "מנוי חדש לניוזלטר",
    description: "maya.s@gmail.com נרשמה",
    time: "לפני 8 דק׳",
    icon: <Mail className="w-4 h-4" />,
    color: "#6366F1",
  },
  {
    name: "מנוי חדש לניוזלטר",
    description: "guy.r@yahoo.com נרשם",
    time: "לפני 14 דק׳",
    icon: <Mail className="w-4 h-4" />,
    color: "#6366F1",
  },
  {
    name: "מנוי חדש לניוזלטר",
    description: "shira.k@walla.co.il נרשמה",
    time: "לפני 26 דק׳",
    icon: <Mail className="w-4 h-4" />,
    color: "#6366F1",
  },

  // Cart abandonments recovered
  {
    name: "עגלה שוחזרה",
    description: "לקוח חזר והשלים הזמנה - ₪780",
    time: "לפני 11 דק׳",
    icon: <ShoppingCart className="w-4 h-4" />,
    color: "#22C55E",
  },
  {
    name: "עגלה שוחזרה",
    description: "לקוח חזר והשלים הזמנה - ₪1,450",
    time: "לפני 19 דק׳",
    icon: <Repeat className="w-4 h-4" />,
    color: "#22C55E",
  },
  {
    name: "עגלה שוחזרה",
    description: "לקוח חזר להשלים רכישה",
    time: "לפני 29 דק׳",
    icon: <ShoppingCart className="w-4 h-4" />,
    color: "#22C55E",
  },

  // Returning customers
  {
    name: "לקוח חוזר",
    description: "רכישה חוזרת - ₪560",
    time: "לפני 7 דק׳",
    icon: <Repeat className="w-4 h-4" />,
    color: "#8B5CF6",
  },
  {
    name: "לקוח חוזר",
    description: "רכישה חוזרת - ₪2,300",
    time: "לפני 16 דק׳",
    icon: <Repeat className="w-4 h-4" />,
    color: "#8B5CF6",
  },
  {
    name: "לקוח VIP חוזר",
    description: "רכישה חוזרת - ₪4,800",
    time: "לפני 31 דק׳",
    icon: <Gift className="w-4 h-4" />,
    color: "#D946EF",
  },

  // International orders
  {
    name: "הזמנה בינלאומית",
    description: "הזמנה מארה״ב - $280",
    time: "לפני 9 דק׳",
    icon: <Globe className="w-4 h-4" />,
    color: "#0EA5E9",
  },
  {
    name: "הזמנה בינלאומית",
    description: "הזמנה מגרמניה - €150",
    time: "לפני 22 דק׳",
    icon: <Globe className="w-4 h-4" />,
    color: "#0EA5E9",
  },
  {
    name: "הזמנה בינלאומית",
    description: "הזמנה מצרפת - €320",
    time: "לפני 34 דק׳",
    icon: <Globe className="w-4 h-4" />,
    color: "#0EA5E9",
  },

  // Product reviews
  {
    name: "ביקורת מוצר",
    description: "״המוצר הכי טוב שקניתי״",
    time: "לפני 13 דק׳",
    icon: <ThumbsUp className="w-4 h-4" />,
    color: "#10B981",
  },
  {
    name: "ביקורת מוצר",
    description: "״איכות מעולה, ממליץ!״",
    time: "לפני 25 דק׳",
    icon: <ThumbsUp className="w-4 h-4" />,
    color: "#10B981",
  },

  // Appointment bookings
  {
    name: "פגישה נקבעה",
    description: "פגישת ייעוץ - יום ראשון 10:00",
    time: "לפני 6 דק׳",
    icon: <Calendar className="w-4 h-4" />,
    color: "#0891B2",
  },
  {
    name: "פגישה נקבעה",
    description: "שיחת הדגמה - יום שלישי 14:00",
    time: "לפני 17 דק׳",
    icon: <Calendar className="w-4 h-4" />,
    color: "#0891B2",
  },
  {
    name: "פגישה נקבעה",
    description: "פגישת מכירות - מחר 11:00",
    time: "לפני 28 דק׳",
    icon: <Calendar className="w-4 h-4" />,
    color: "#0891B2",
  },

  // Support tickets resolved
  {
    name: "פנייה נסגרה",
    description: "פנייה #892 נפתרה בהצלחה",
    time: "לפני 10 דק׳",
    icon: <CheckCircle className="w-4 h-4" />,
    color: "#22C55E",
  },
  {
    name: "פנייה נסגרה",
    description: "פנייה #893 נפתרה בהצלחה",
    time: "לפני 20 דק׳",
    icon: <CheckCircle className="w-4 h-4" />,
    color: "#22C55E",
  },
  {
    name: "פנייה נסגרה",
    description: "פנייה #894 - לקוח מרוצה!",
    time: "לפני 36 דק׳",
    icon: <CheckCircle className="w-4 h-4" />,
    color: "#22C55E",
  },

  // Messages
  {
    name: "הודעה חדשה",
    description: "האתר שלכם נראה מדהים!",
    time: "לפני 4 דק׳",
    icon: <MessageCircle className="w-4 h-4" />,
    color: "#3B82F6",
  },
  {
    name: "הודעה חדשה",
    description: "מתי אפשר לקבל הצעת מחיר?",
    time: "לפני 15 דק׳",
    icon: <MessageCircle className="w-4 h-4" />,
    color: "#3B82F6",
  },

  // Wishlist/Saves
  {
    name: "מוצר נשמר",
    description: "15 אנשים שמרו את המוצר",
    time: "לפני 11 דק׳",
    icon: <Bookmark className="w-4 h-4" />,
    color: "#F59E0B",
  },
  {
    name: "מוצר נשמר",
    description: "32 אנשים הוסיפו לרשימת משאלות",
    time: "לפני 23 דק׳",
    icon: <Heart className="w-4 h-4" />,
    color: "#EF4444",
  },

  // Package updates
  {
    name: "משלוח נשלח",
    description: "הזמנה #1240 יצאה למשלוח",
    time: "לפני 8 דק׳",
    icon: <Package className="w-4 h-4" />,
    color: "#64748B",
  },
  {
    name: "משלוח הגיע",
    description: "הזמנה #1235 נמסרה ללקוח",
    time: "לפני 18 דק׳",
    icon: <Package className="w-4 h-4" />,
    color: "#22C55E",
  },

  // Site updates
  {
    name: "עדכון האתר",
    description: "השינויים עלו לאוויר בהצלחה",
    time: "לפני 30 דק׳",
    icon: <Sparkles className="w-4 h-4" />,
    color: "#6366F1",
  },
]

// Fisher-Yates shuffle algorithm
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

const Notification = React.memo(({ name, description, icon, color, time }: NotificationItem) => {
  return (
    <figure
      className={cn(
        "relative mx-auto min-h-fit w-full max-w-[280px] cursor-pointer overflow-hidden rounded-xl p-3",
        "transition-all duration-200 ease-in-out hover:scale-[102%]",
        "bg-white shadow-lg border border-gray-100",
        "dark:bg-gray-900 dark:border-gray-800",
      )}
    >
      <div className="flex flex-row items-center gap-3">
        <div
          className="flex size-9 items-center justify-center rounded-xl"
          style={{ backgroundColor: `${color}15` }}
        >
          <span style={{ color }}>{icon}</span>
        </div>
        <div className="flex flex-col overflow-hidden flex-1">
          <figcaption className="flex flex-row items-center text-sm font-semibold text-gray-900 dark:text-white">
            <span className="truncate">{name}</span>
            <span className="mx-1.5 text-gray-400">·</span>
            <span className="text-xs font-normal text-gray-500 dark:text-gray-400">
              {time}
            </span>
          </figcaption>
          <p className="text-xs font-medium text-gray-600 dark:text-gray-400 truncate" dir="rtl">
            {description}
          </p>
        </div>
      </div>
    </figure>
  )
})

Notification.displayName = "Notification"

interface LaunchNotificationsProps {
  className?: string
}

export function LaunchNotifications({ className }: LaunchNotificationsProps) {
  const [key, setKey] = useState(0)

  // Memoize shuffled notifications - only re-shuffle when key changes
  const notifications = useMemo(
    () => shuffleArray(allNotifications),
    [key] // Re-shuffle only when key changes
  );

  // Memoize total duration calculation
  const totalDuration = useMemo(
    () => notifications.length * 1800,
    [notifications.length]
  );

  // Restart the loop after all notifications have been shown
  useEffect(() => {
    if (notifications.length === 0) return

    const timeout = setTimeout(() => {
      setKey(prev => prev + 1) // This triggers a re-shuffle and restart
    }, totalDuration + 1000) // Add 1 second buffer

    return () => clearTimeout(timeout)
  }, [notifications.length, totalDuration, key])

  if (notifications.length === 0) return null

  return (
    <div
      className={cn(
        "relative flex h-[280px] sm:h-[320px] md:h-[350px] w-full flex-col overflow-hidden rounded-2xl bg-transparent p-4",
        className,
      )}
      dir="rtl"
    >
      <AnimatedList key={key} delay={1800}>
        {notifications.map((item, idx) => (
          <Notification {...item} key={`${key}-${idx}`} />
        ))}
      </AnimatedList>

      {/* Fade overlay at bottom */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white/90 to-transparent dark:from-gray-950/90" />
    </div>
  )
}

export default LaunchNotifications
