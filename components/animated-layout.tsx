'use client'

import React from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

interface AnimatedLayoutProps {
  children: React.ReactNode
  /**
   * Additional tailwind classes that will be merged with the defaults
   */
  className?: string
  /**
   * Override the default transition (0.5s)
   */
  transition?: {
    duration?: number
    delay?: number
    ease?: number[] | string
  }
}

export default function AnimatedLayout({
  children,
  className,
  transition = { duration: 0.5 },
}: AnimatedLayoutProps) {
  // Respect user preference for reduced motion for accessibility
  const shouldReduceMotion = useReducedMotion()
  // Unique key ensures exit/enter animations on route change
  const pathname = usePathname()

  // Variants centralised for reuse and performance (memoised)
  const variants = React.useMemo(
    () => ({
      hidden: {
        opacity: 0,
        y: shouldReduceMotion ? 0 : 20,
      },
      enter: {
        opacity: 1,
        y: 0,
      },
      exit: {
        opacity: 0,
        y: shouldReduceMotion ? 0 : -20,
      },
    }),
    [shouldReduceMotion]
  )

  return (
    <AnimatePresence mode="wait">
      <motion.main
        key={pathname}
        initial="hidden"
        animate="enter"
        exit="exit"
        variants={variants}
        transition={transition}
        className={cn('main-content flex-grow container mx-auto px-4 py-8', className)}
      >
        {children}
      </motion.main>
    </AnimatePresence>
  )
}