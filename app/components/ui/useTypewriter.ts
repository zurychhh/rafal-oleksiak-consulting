import { useState, useEffect, useRef } from 'react'

interface UseTypewriterOptions {
  text: string
  speed?: number // ms per character
  delay?: number // initial delay before starting
  onComplete?: () => void
}

export function useTypewriter({
  text,
  speed = 50,
  delay = 0,
  onComplete
}: UseTypewriterOptions) {
  const [displayedText, setDisplayedText] = useState('')
  const [isComplete, setIsComplete] = useState(false)
  const onCompleteRef = useRef(onComplete)

  // Keep onComplete ref updated without triggering re-render
  useEffect(() => {
    onCompleteRef.current = onComplete
  }, [onComplete])

  useEffect(() => {
    // Reset state when effect runs
    setDisplayedText('')
    setIsComplete(false)

    let timeout: NodeJS.Timeout
    let charIndex = 0

    const startTyping = () => {
      const typeNextChar = () => {
        if (charIndex < text.length) {
          setDisplayedText(text.slice(0, charIndex + 1))
          charIndex++
          timeout = setTimeout(typeNextChar, speed)
        } else {
          setIsComplete(true)
          onCompleteRef.current?.()
        }
      }

      timeout = setTimeout(typeNextChar, delay)
    }

    startTyping()

    return () => {
      if (timeout) clearTimeout(timeout)
    }
  }, [text, speed, delay]) // onComplete removed from deps

  return { displayedText, isComplete }
}
