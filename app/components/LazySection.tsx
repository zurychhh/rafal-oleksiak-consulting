'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'

interface LazySectionProps {
  children: ReactNode
  className?: string
  threshold?: number
  rootMargin?: string
}

export default function LazySection({
  children,
  className = '',
  threshold = 0.1,
  rootMargin = '50px',
}: LazySectionProps) {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          // Once loaded, stop observing
          observer.disconnect()
        }
      },
      {
        threshold,
        rootMargin,
      }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => {
      observer.disconnect()
    }
  }, [threshold, rootMargin])

  return (
    <div ref={sectionRef} className={className}>
      {isVisible ? children : (
        // Placeholder to maintain layout and prevent layout shift
        <div style={{ minHeight: '200px' }} />
      )}
    </div>
  )
}
