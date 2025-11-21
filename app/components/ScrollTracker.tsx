'use client'

import { useEffect, useRef } from 'react'
import { analytics } from '@/app/lib/analytics'

/**
 * Scroll depth tracking component
 *
 * Tracks when user reaches specific scroll milestones:
 * - 25% of page
 * - 50% of page
 * - 75% of page
 * - 100% of page (bottom)
 *
 * Events are fired only once per milestone per session.
 */
export function ScrollTracker() {
  const milestones = useRef(new Set<number>())

  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight
      const scrollTop = window.scrollY
      const clientHeight = window.innerHeight
      const scrollPercentage = Math.round(
        (scrollTop / (scrollHeight - clientHeight)) * 100
      )

      // Define checkpoints
      const checkpoints = [25, 50, 75, 100]

      // Check each checkpoint
      checkpoints.forEach((checkpoint) => {
        if (
          scrollPercentage >= checkpoint &&
          !milestones.current.has(checkpoint)
        ) {
          milestones.current.add(checkpoint)
          analytics.trackScrollDepth(checkpoint)
        }
      })
    }

    // Add scroll listener with passive flag for better performance
    window.addEventListener('scroll', handleScroll, { passive: true })

    // Cleanup
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return null
}
