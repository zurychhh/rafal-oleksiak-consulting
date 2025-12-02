'use client'

import { useEffect, useRef, useCallback } from 'react'
import styles from './SuccessModal.module.css'
import { trackEvent } from '@/app/lib/analytics'

interface SuccessModalProps {
  isOpen: boolean
  onClose: () => void
  showLamaMessage?: boolean
}

export default function SuccessModal({
  isOpen,
  onClose,
  showLamaMessage = false,
}: SuccessModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)

  const handleClose = useCallback(() => {
    trackEvent({
      action: 'modal_closed',
      category: 'engagement',
      label: showLamaMessage ? 'success_with_lama' : 'success_standard',
    })
    onClose()
    // Scroll to top of page
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [onClose, showLamaMessage])

  // Handle Escape key
  useEffect(() => {
    if (!isOpen) return

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, handleClose])

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === overlayRef.current) {
      handleClose()
    }
  }

  if (!isOpen) return null

  return (
    <div
      ref={overlayRef}
      className={styles.overlay}
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="success-modal-title"
    >
      <div ref={modalRef} className={`${styles.modal} ${styles.modalAnimate}`}>
        {/* Checkmark Icon */}
        <div className={styles.checkmarkCircle}>
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              className={styles.checkmarkPath}
              d="M5 13l4 4L19 7"
              stroke="white"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {/* Headline */}
        <h2 id="success-modal-title" className={styles.headline}>
          Thank You!
        </h2>

        {/* Subtext */}
        <p className={styles.subtext}>
          I'll be in touch within 24 hours.
        </p>

        {/* LAMA Message (conditional) */}
        {showLamaMessage && (
          <div className={styles.lamaBox}>
            <i className="fa-solid fa-chart-line" aria-hidden="true"></i>
            <p>
              Your website audit is being generated and will arrive in your inbox within 2 minutes.
            </p>
          </div>
        )}

        {/* Close Button */}
        <button
          type="button"
          className={styles.button}
          onClick={handleClose}
          aria-label="Close modal"
        >
          Got It
        </button>
      </div>
    </div>
  )
}

