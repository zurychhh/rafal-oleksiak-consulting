'use client'

import { useEffect } from 'react'

export default function FontAwesomeLoader() {
  useEffect(() => {
    // Dynamically load Font Awesome CSS asynchronously to prevent render blocking
    // Use requestIdleCallback for non-critical resource loading
    const loadFontAwesome = () => {
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
      link.integrity = 'sha512-iecdLmaskl7CVkqkXNQ/ZH/XLlvWZOJyj7Yy7tcenmpD1ypASozpmT/E0iPtmFIB46ZmdtAc9eNBvH0H/ZpiBw=='
      link.crossOrigin = 'anonymous'
      link.media = 'print' // Load as non-render-blocking
      link.onload = () => {
        link.media = 'all' // Switch to all media after load
      }
      document.head.appendChild(link)
    }

    // Use requestIdleCallback if available, otherwise setTimeout
    if ('requestIdleCallback' in window) {
      requestIdleCallback(loadFontAwesome, { timeout: 2000 })
    } else {
      setTimeout(loadFontAwesome, 100)
    }
  }, [])

  return null
}
