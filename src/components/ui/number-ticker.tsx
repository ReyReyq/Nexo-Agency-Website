"use client"

import { ComponentPropsWithoutRef, useEffect, useMemo, useRef } from "react"
import { useInView, useMotionValue, useSpring } from "framer-motion"

import { cn } from "@/lib/utils"

interface NumberTickerProps extends ComponentPropsWithoutRef<"span"> {
  value: number
  startValue?: number
  direction?: "up" | "down"
  delay?: number
  decimalPlaces?: number
}

export function NumberTicker({
  value,
  startValue = 0,
  direction = "up",
  delay = 0,
  className,
  decimalPlaces = 0,
  ...props
}: NumberTickerProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const motionValue = useMotionValue(direction === "down" ? value : startValue)
  const springValue = useSpring(motionValue, {
    damping: 60,
    stiffness: 100,
  })
  const isInView = useInView(ref, { once: true, margin: "0px" })

  // Memoize the NumberFormat instance to avoid creating it on every animation frame
  const numberFormatter = useMemo(
    () =>
      new Intl.NumberFormat("en-US", {
        minimumFractionDigits: decimalPlaces,
        maximumFractionDigits: decimalPlaces,
      }),
    [decimalPlaces]
  )

  useEffect(() => {
    if (isInView) {
      const timer = setTimeout(() => {
        motionValue.set(direction === "down" ? startValue : value)
      }, delay * 1000)
      return () => clearTimeout(timer)
    }
  }, [motionValue, isInView, delay, value, direction, startValue])

  useEffect(() => {
    const unsubscribe = springValue.on("change", (latest) => {
      if (ref.current) {
        // Use memoized formatter and format the number directly
        const formattedNumber = numberFormatter.format(latest)

        // Pad with zero if needed (e.g., 1 becomes 01)
        const paddedNumber = formattedNumber.padStart(2, "0")
        ref.current.textContent = paddedNumber
      }
    })

    return () => {
      unsubscribe()
    }
  }, [springValue, numberFormatter])

  return (
    <span
      ref={ref}
      className={cn(
        "inline-block tracking-wider text-black tabular-nums dark:text-white",
        className
      )}
      {...props}
    >
      {startValue}
    </span>
  )
}
