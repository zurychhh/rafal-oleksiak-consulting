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
          auditRequested: formData.get('auditRequested') === 'on',
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
        alert('Something went wrong. Please try again or email me directly at contact@oleksiakconsulting.com');
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
        submitButton.textContent = 'Book Free Consultation';
      }
    }
  };

  return (
    <section className={styles.finalCTA} id="free-consultation">
      {/* Floating shapes */}
      <div className={`${styles.floatingShape} ${styles.shape1}`}></div>
      <div className={`${styles.floatingShape} ${styles.shape2}`}></div>
      <div className={`${styles.floatingShape} ${styles.shape3}`}></div>

      <div className={styles.container}>
        <div className={styles.grid}>
          {/* LEFT COLUMN */}
          <div className={styles.leftColumn}>
            <h2 className={styles.headline}>Get Your Free Consultation</h2>

            <p className={styles.description}>
              Schedule free consultation to explore how we can double your
              revenue from owned channels. No commitment required.
            </p>

            <p className={styles.subdescription}>
              Discuss your challenges, review your current setup, and receive
              strategic recommendations tailored to your business goals.
            </p>

            {/* Credibility */}
            <div className={styles.credibility}>
              <p className={styles.credibilityText}>
                Join 15+ companies that transformed their CRM & automation
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
                Prefer email? Reach out directly at{" "}
                <a href="mailto:contact@oleksiakconsulting.com">
                  contact@oleksiakconsulting.com
                </a>
              </p>
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
                    Email Address
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
                <div className={styles.floatingLabelContainer}>
                  <label className={styles.floatingLabel} htmlFor="challenge">
                    What's your biggest challenge?
                  </label>
                  <textarea
                    id="challenge"
                    name="challenge"
                    required
                    className={styles.formTextarea}
                    rows={4}
                    placeholder="Tell me about your current situation and what you're looking to achieve..."
                  ></textarea>
                </div>

                {/* Audit Request Checkbox */}
                <div className={styles.checkboxContainer}>
                  <input
                    type="checkbox"
                    id="auditRequested"
                    name="auditRequested"
                    className={styles.customCheckbox}
                  />
                  <label htmlFor="auditRequested" className={styles.checkboxLabel}>
                    <strong>☐ Wyślij mi darmowy audit strony</strong> (wyniki w 90 sekund)
                  </label>
                </div>

                {/* Consent Checkbox */}
                <div className={styles.checkboxContainer}>
                  <input
                    type="checkbox"
                    id="consent"
                    name="consent"
                    required
                    className={styles.customCheckbox}
                  />
                  <label htmlFor="consent" className={styles.checkboxLabel}>
                    I agree to receive strategic insights and updates from Rafał
                    about CRM, Marketing Automation, and revenue growth
                    strategies
                  </label>
                </div>

                {/* Submit Button */}
                <button type="submit" className={styles.ctaButton}>
                  Book Free Consultation <span>→</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
