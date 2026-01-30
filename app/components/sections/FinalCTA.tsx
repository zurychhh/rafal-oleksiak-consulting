"use client";

import { useEffect, FormEvent, useState } from "react";
import styles from "./FinalCTA.module.css";
import { analytics } from '@/app/lib/analytics';

interface FinalCTAProps {
  onSuccess?: () => void;
}

export default function FinalCTA({ onSuccess }: FinalCTAProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    // Only run after hydration
    if (!isMounted) return;

    // Floating labels functionality
    const inputs = document.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>(
      `.${styles.formInput}, .${styles.formTextarea}`
    );

    const cleanupFunctions: Array<() => void> = [];

    inputs.forEach((input) => {
      const label = input.parentElement?.querySelector<HTMLLabelElement>(
        `.${styles.floatingLabel}`
      );

      if (!label) return;

      // Float on focus
      const handleFocus = () => {
        label.classList.add(styles.floated);
      };

      // Float if has value, unfloat if empty
      const handleBlur = () => {
        if (input.value === "") {
          label.classList.remove(styles.floated);
        }
      };

      input.addEventListener("focus", handleFocus);
      input.addEventListener("blur", handleBlur);

      // Check on load if already has value
      if (input.value !== "") {
        label.classList.add(styles.floated);
      }

      // Store cleanup function
      cleanupFunctions.push(() => {
        input.removeEventListener("focus", handleFocus);
        input.removeEventListener("blur", handleBlur);
      });
    });

    // Return cleanup function
    return () => {
      cleanupFunctions.forEach(cleanup => cleanup());
    };
  }, [isMounted]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    const formData = new FormData(form);

    const submitButton = form.querySelector('button[type="submit"]') as HTMLButtonElement;
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = 'Sending...';
    }

    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          formType: 'consultation',
          fullName: formData.get('fullName'),
          email: formData.get('email'),
          website: formData.get('website'),
          challenge: formData.get('challenge'),
          consent: formData.get('marketingConsent') === 'on',
          auditRequested: true, // Audit always runs, independent of marketing consent
        }),
      });

      if (response.ok) {
        // Track successful form submission
        analytics.trackFormSubmission('contact_form', true);

        // Capture form values before reset (needed for audit)
        const auditData = {
          website: formData.get('website') as string,
          email: formData.get('email') as string,
          fullName: formData.get('fullName') as string,
          marketingConsent: formData.get('marketingConsent') === 'on',
        };

        // Show final success screen (fullscreen, non-dismissable)
        onSuccess?.();

        form.reset();
        document.querySelectorAll(`.${styles.floatingLabel}`).forEach((label) => {
          label.classList.remove(styles.floated);
        });

        // Trigger LAMA Audit in background (always runs, independent of marketing consent)
        if (auditData.website && auditData.email) {
          fetch('/api/lama/audit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              url: auditData.website,
              email: auditData.email,
              fullName: auditData.fullName,
              marketingConsent: auditData.marketingConsent,
            }),
          }).catch((err) => console.error('[LAMA] Audit request failed:', err));
        }
      } else {
        // Track failed form submission
        analytics.trackFormSubmission('contact_form', false);

        const error = await response.json();
        alert('Something went wrong. Please try again or email me directly at rafal@oleksiakconsulting.com');
        console.error('Form error:', error);
      }
    } catch (error) {
      // Track failed form submission (network error)
      analytics.trackFormSubmission('contact_form', false);

      alert('Something went wrong. Please try again or email me directly at rafal@oleksiakconsulting.com');
      console.error('Network error:', error);
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = 'Double My CRM Revenue →';
      }
    }
  };

  return (
    <section className={styles.finalCTA} id="contact">
      {/* Floating shapes */}
      <div className={`${styles.floatingShape} ${styles.shape1}`}></div>
      <div className={`${styles.floatingShape} ${styles.shape2}`}></div>
      <div className={`${styles.floatingShape} ${styles.shape3}`}></div>

      <div className={styles.container}>
        <div className={styles.grid}>
          {/* LEFT COLUMN */}
          <div className={styles.leftColumn}>
            <h2 className={styles.headline}>You're Losing Customers Between Click and Checkout. Let's Fix That.</h2>

            <p className={styles.description}>
              Free audit + 30-minute strategy call. No fluff — just data, real actions, and a clear roadmap to more revenue.
            </p>

            <p className={styles.subdescription}>
              You'll walk away with: (1) 3 quick wins, (2) ROI projection, (3) Roadmap to 2x revenue
            </p>

            {/* Credibility */}
            <div className={styles.credibility}>
              <p className={styles.credibilityText}>
                Trusted by Allegro, Booksy, Accenture, mBank
              </p>

              <div className={styles.logoGrid}>
                <div className={styles.logoItem}>Allegro</div>
                <div className={styles.logoItem}>Accenture</div>
                <div className={styles.logoItem}>Booksy</div>
                <div className={styles.logoItem}>mBank</div>
              </div>
            </div>

            {/* Alternative contact */}
            <div className={styles.alternativeContact}>
              <p>
                Connect on LinkedIn:{" "}
                <a
                  href="https://www.linkedin.com/in/rafa%C5%82-oleksiak-3b322981/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  LinkedIn Profile →
                </a>
              </p>
              <p className={styles.directContact}>
                Or reach me directly:{" "}
                <a href="mailto:rafal@oleksiakconsulting.com" className={styles.contactLink}>
                  rafal@oleksiakconsulting.com
                </a>
                {" "} | {" "}
                <a href="tel:+48571903167" className={styles.contactLink}>
                  +48 571 903 167
                </a>
              </p>
            </div>
          </div>

          {/* RIGHT COLUMN - FORM */}
          <div className={styles.rightColumn}>
            <div className={styles.formCard}>
              <form
                id="consultation-form"
                className={styles.form}
                onSubmit={handleSubmit}
              >
                {/* Full Name */}
                <div className={styles.floatingLabelContainer}>
                  <label className={styles.floatingLabel} htmlFor="fullName">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    required
                    className={styles.formInput}
                    autoComplete="name"
                  />
                </div>

                {/* Email */}
                <div className={styles.floatingLabelContainer}>
                  <label className={styles.floatingLabel} htmlFor="email">
                    Work Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    className={styles.formInput}
                    autoComplete="email"
                    inputMode="email"
                  />
                </div>

                {/* Website */}
                <div className={styles.floatingLabelContainer}>
                  <label className={styles.floatingLabel} htmlFor="website">
                    Company Website
                  </label>
                  <input
                    type="text"
                    id="website"
                    name="website"
                    required
                    className={styles.formInput}
                    autoComplete="url"
                    placeholder="e.g. yourcompany.com"
                  />
                </div>

                {/* Challenge Textarea */}
                <div>
                  <label htmlFor="challenge" className={styles.textareaLabel}>
                    What's your biggest conversion or revenue challenge?
                  </label>
                  <textarea
                    id="challenge"
                    name="challenge"
                    className={styles.formTextarea}
                    rows={4}
                  ></textarea>
                </div>

                {/* Info about audit delivery */}
                <p className={styles.auditInfoText}>
                  Enter your email to receive your free audit results.
                </p>

                {/* Marketing Consent - OPTIONAL, unbundled from audit (GDPR Art. 7(4)) */}
                <div className={styles.checkboxContainer}>
                  <input
                    type="checkbox"
                    id="marketingConsent"
                    name="marketingConsent"
                    className={styles.customCheckbox}
                  />
                  <label htmlFor="marketingConsent" className={styles.checkboxLabel}>
                    I'd like to receive occasional emails with tips on lead acquisition, CRM, and marketing automation.
                  </label>
                </div>

                {/* Submit Button - FREE Audit */}
                <button type="submit" className={styles.ctaButton}>
                  Double My CRM Revenue <span>→</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
