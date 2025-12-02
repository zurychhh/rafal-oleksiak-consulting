"use client";

import { useEffect, FormEvent } from "react";
import styles from "./FinalCTA.module.css";
import { analytics } from '@/app/lib/analytics';

export default function FinalCTA() {
  useEffect(() => {
    // Floating labels functionality
    const inputs = document.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>(
      `.${styles.formInput}, .${styles.formTextarea}`
    );

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

      // Cleanup
      return () => {
        input.removeEventListener("focus", handleFocus);
        input.removeEventListener("blur", handleBlur);
      };
    });
  }, []);

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
          consent: formData.get('consent') === 'on',
          auditRequested: formData.get('consent') === 'on', // LAMA audit requires consent
        }),
      });

      if (response.ok) {
        // Track successful form submission
        analytics.trackFormSubmission('contact_form', true);

        alert("Thank you! I'll be in touch within 24 hours.");
        form.reset();
        document.querySelectorAll(`.${styles.floatingLabel}`).forEach((label) => {
          label.classList.remove(styles.floated);
        });
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

      alert('Something went wrong. Please try again or email me directly at contact@oleksiakconsulting.com');
      console.error('Network error:', error);
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = 'Yes, I Want to Double CRM Revenue →';
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
            <h2 className={styles.headline}>Ready to Double Your CRM Revenue?</h2>

            <p className={styles.description}>
              In this 30-minute call, I'll show you where you're leaving money on the table. No pitch, no pressure.
            </p>

            <p className={styles.subdescription}>
              You'll walk away with: (1) 3 quick wins, (2) ROI projection, (3) Roadmap to 2x revenue
            </p>

            {/* Credibility */}
            <div className={styles.credibility}>
              <p className={styles.credibilityText}>
                Trusted by Allegro, Booksy, Accenture, McDonald's, mBank
              </p>

              <div className={styles.logoGrid}>
                <div className={styles.logoItem}>Allegro</div>
                <div className={styles.logoItem}>Accenture</div>
                <div className={styles.logoItem}>McDonald's</div>
                <div className={styles.logoItem}>mBank</div>
                <div className={styles.logoItem}>Booksy</div>
              </div>
            </div>

            {/* Alternative contact */}
            <div className={styles.alternativeContact}>
              <p>
                Connect on LinkedIn:{" "}
                <a
                  href="https://www.linkedin.com/in/rafal-oleksiak"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  LinkedIn Profile →
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
                    type="url"
                    id="website"
                    name="website"
                    required
                    className={styles.formInput}
                    autoComplete="url"
                    inputMode="url"
                  />
                </div>

                {/* Challenge Textarea */}
                <div>
                  <label htmlFor="challenge" className={styles.textareaLabel}>
                    What's blocking you from doubling CRM revenue?
                  </label>
                  <textarea
                    id="challenge"
                    name="challenge"
                    required
                    className={styles.formTextarea}
                    rows={4}
                  ></textarea>
                </div>

                {/* Combined Consent Checkbox - LAMA Audit requires marketing consent */}
                <div className={styles.checkboxContainer}>
                  <input
                    type="checkbox"
                    id="consent"
                    name="consent"
                    required
                    className={styles.customCheckbox}
                  />
                  <label htmlFor="consent" className={styles.checkboxLabel}>
                    <strong>Yes, send me a free LAMA Audit</strong> (results in 90 seconds - 5 categories analyzed). 
                    I also want CRM insights (1 email/month, no spam, unsubscribe anytime).
                  </label>
                </div>

                {/* Submit Button */}
                <button type="submit" className={styles.ctaButton}>
                  Yes, I Want to Double CRM Revenue <span>→</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
