"use client"

import React, {
  ComponentPropsWithoutRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"
import { AnimatePresence, motion, MotionProps } from "framer-motion"

import { cn } from "@/lib/utils"

// Stable animation config object - defined outside component to avoid recreation
const listItemAnimations: MotionProps = {
  initial: { scale: 0, opacity: 0 },
  animate: { scale: 1, opacity: 1, originY: 0 },
  exit: { scale: 0, opacity: 0 },
  transition: { type: "spring", stiffness: 350, damping: 40 },
}

export const AnimatedListItem = React.memo(
  ({ children }: { children: React.ReactNode }) => {
    return (
      <motion.div {...listItemAnimations} layout className="mx-auto w-full">
        {children}
      </motion.div>
    )
  }
)

AnimatedListItem.displayName = "AnimatedListItem"

export interface AnimatedListProps extends ComponentPropsWithoutRef<"div"> {
  children: React.ReactNode
  delay?: number
}

export const AnimatedList = React.memo(
  ({ children, className, delay = 1000, ...props }: AnimatedListProps) => {
    const [index, setIndex] = useState(0)
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
    const isMountedRef = useRef(true)

    const childrenArray = useMemo(
      () => React.Children.toArray(children),
      [children]
    )

    // Memoized state updater to prevent stale closures
    const incrementIndex = useCallback(() => {
      if (isMountedRef.current) {
        setIndex((prevIndex) => (prevIndex + 1) % childrenArray.length)
      }
    }, [childrenArray.length])

    useEffect(() => {
      // Track mounted state for safe state updates
      isMountedRef.current = true

      return () => {
        isMountedRef.current = false
      }
    }, [])

    useEffect(() => {
      // Clear any existing timeout before setting a new one
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }

      if (index < childrenArray.length - 1) {
        timeoutRef.current = setTimeout(incrementIndex, delay)
      }

      // Cleanup function to clear timeout on unmount or dependency change
      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current)
          timeoutRef.current = null
        }
      }
    }, [index, delay, childrenArray.length, incrementIndex])

    const itemsToShow = useMemo(() => {
      return childrenArray.slice(0, index + 1).reverse()
    }, [index, childrenArray])

    return (
      <div
        className={cn(`flex flex-col items-center gap-4`, className)}
        {...props}
      >
        <AnimatePresence>
          {itemsToShow.map((item) => (
            <AnimatedListItem key={(item as React.ReactElement).key}>
              {item}
            </AnimatedListItem>
          ))}
        </AnimatePresence>
      </div>
    )
  }
)

AnimatedList.displayName = "AnimatedList"
