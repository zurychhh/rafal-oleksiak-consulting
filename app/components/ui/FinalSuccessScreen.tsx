'use client'

import { useEffect, useState } from 'react'
import styles from './FinalSuccessScreen.module.css'
import { useTypewriter } from './useTypewriter'

interface FinalSuccessScreenProps {
  isOpen: boolean
}

export default function FinalSuccessScreen({ isOpen }: FinalSuccessScreenProps) {
  const [showContent, setShowContent] = useState(false)
  const [showSection, setShowSection] = useState({
    headline: false,
    notification1: false,
    notification2: false,
    pathsIntro: false,
    path1: false,
    farewell: false,
    terminal: false,
  })

  // Timing calculations (ms)
  const SPEED = 25 // ms per character (faster typing)
  const CRT_ANIMATION = 800 // CRT shutdown animation duration

  // Calculate text lengths and cumulative delays
  const text1 = 'TRANSMISSION RECEIVED.'
  const text2 = 'Your free website audit is being generated now.'
  const text3 = 'Check your inbox — results arriving within seconds.'
  const text4 = 'Your recommended next step:'
  const text5 = 'BOOK A STRATEGY CALL'
  const text6 = 'Review your audit results, then schedule a free 30-min call to discuss your roadmap to 2x CRM revenue. No cost. No obligation.'
  const text10 = 'SEE YOU IN YOUR INBOX'

  // Calculate cumulative delays for cascade effect
  let cumulativeDelay = CRT_ANIMATION + 200

  const headlineDelay = cumulativeDelay
  cumulativeDelay += (text1.length * SPEED) + 1200

  const notification1Delay = cumulativeDelay
  cumulativeDelay += (text2.length * SPEED) + 800

  const notification2Delay = cumulativeDelay
  cumulativeDelay += (text3.length * SPEED) + 1500

  const pathsIntroDelay = cumulativeDelay
  cumulativeDelay += (text4.length * SPEED) + 1000

  const path1TitleDelay = cumulativeDelay
  const path1DescDelay = cumulativeDelay + 600
  cumulativeDelay += (text5.length * (SPEED - 10)) + 600 + (text6.length * SPEED) + 1500

  const farewellDelay = cumulativeDelay

  // Typewriter hooks with calculated delays
  const headline = useTypewriter({
    text: text1,
    speed: SPEED,
    delay: headlineDelay,
  })

  const notification1 = useTypewriter({
    text: text2,
    speed: SPEED,
    delay: notification1Delay,
  })

  const notification2 = useTypewriter({
    text: text3,
    speed: SPEED,
    delay: notification2Delay,
  })

  const pathsIntro = useTypewriter({
    text: text4,
    speed: SPEED,
    delay: pathsIntroDelay,
  })

  const path1Title = useTypewriter({
    text: text5,
    speed: SPEED - 10,
    delay: path1TitleDelay,
  })

  const path1Desc = useTypewriter({
    text: text6,
    speed: SPEED,
    delay: path1DescDelay,
  })

  const farewell = useTypewriter({
    text: text10,
    speed: SPEED + 10,
    delay: farewellDelay,
  })

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'

      // Set showContent immediately for CRT animation
      setTimeout(() => {
        setShowContent(true)
      }, 100)

      // Schedule showing each section BEFORE its typewriter starts
      setTimeout(() => setShowSection(s => ({ ...s, headline: true })), headlineDelay - 50)
      setTimeout(() => setShowSection(s => ({ ...s, notification1: true })), notification1Delay - 50)
      setTimeout(() => setShowSection(s => ({ ...s, notification2: true })), notification2Delay - 50)
      setTimeout(() => setShowSection(s => ({ ...s, pathsIntro: true })), pathsIntroDelay - 50)
      setTimeout(() => setShowSection(s => ({ ...s, path1: true })), path1TitleDelay - 50)
      setTimeout(() => setShowSection(s => ({ ...s, farewell: true })), farewellDelay - 50)
      setTimeout(() => setShowSection(s => ({ ...s, terminal: true })), farewellDelay + (text10.length * (SPEED + 10)) + 1000)
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen, headlineDelay, notification1Delay, notification2Delay, pathsIntroDelay, path1TitleDelay, farewellDelay, text10.length, SPEED])

  if (!isOpen) return null

  return (
    <div className={styles.overlay}>
      {/* Visual effects */}
      <div className={styles.grain}></div>
      <div className={styles.vignette}></div>
      <div className={styles.scanlines}></div>

      {/* Main content */}
      <div className={`${styles.mainContent} ${showContent ? styles.crtEffect : ''}`}>
        <div className={styles.container}>
          {/* Header Section */}
          {showSection.headline && (
            <div className={styles.headerSection}>
              <h1 className={styles.headline}>
                {headline.displayedText}
                {!headline.isComplete && headline.displayedText && <span className={styles.cursor}>█</span>}
              </h1>
              {headline.isComplete && (
                <div className={styles.gradientLine}></div>
              )}
            </div>
          )}

          {/* Notification Section */}
          {showSection.notification1 && (
            <div className={styles.notificationSection}>
              <p className={styles.bodyTextLarge}>
                {notification1.displayedText}
                {!notification1.isComplete && notification1.displayedText && <span className={styles.cursor}>█</span>}
              </p>
              {showSection.notification2 && (
                <p className={styles.bodyText}>
                  {notification2.displayedText.split('seconds').map((part, i, arr) => (
                    i < arr.length - 1 ? (
                      <span key={i}>
                        {part}<span className={styles.blueHighlight}>seconds</span>
                      </span>
                    ) : part
                  ))}
                  {!notification2.isComplete && notification2.displayedText && <span className={styles.cursor}>█</span>}
                </p>
              )}
            </div>
          )}

          {/* Paths Section */}
          {showSection.pathsIntro && (
            <div className={styles.pathsSection}>
              <p className={styles.pathsIntro}>
                {pathsIntro.displayedText}
                {!pathsIntro.isComplete && pathsIntro.displayedText && <span className={styles.cursor}>█</span>}
              </p>

              {pathsIntro.isComplete && (
                <div className={styles.pathsGrid}>
                  {/* Recommended Action - Book a Call */}
                  {showSection.path1 && (
                    <div className={`${styles.pathCard} ${styles.purpleAccent}`}>
                      <div className={styles.pathContent}>
                        <span className={`${styles.pathNumber} ${styles.purple}`}>[RECOMMENDED]</span>
                        <div className={styles.pathDetails}>
                          <h3 className={styles.pathTitle}>
                            {path1Title.displayedText}
                            {!path1Title.isComplete && path1Title.displayedText && <span className={styles.cursorSmall}>█</span>}
                          </h3>
                          {path1Title.isComplete && (
                            <p className={styles.pathDescription}>
                              {path1Desc.displayedText}
                              {!path1Desc.isComplete && path1Desc.displayedText && <span className={styles.cursorSmall}>█</span>}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

            </div>
          )}

          {/* Farewell Section */}
          {showSection.farewell && (
            <div className={styles.farewellSection}>
              <div className={styles.gradientLine}></div>

              <h2 className={styles.farewell}>
                {farewell.displayedText}
                {!farewell.isComplete && farewell.displayedText && <span className={styles.cursor}>█</span>}
              </h2>

              {showSection.terminal && (
                <div className={styles.terminalText}>
                  <p>[CONVERSION_COMPLETED]</p>
                  <p>Process ID: #ROC-2025-LEAD</p>
                  <p className={styles.terminalCursor}>Status: ACTIVE</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
