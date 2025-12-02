"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./ProcessTimeline.module.css";

interface Stage {
  number: string;
  title: string;
  description: string;
  position: 'top' | 'bottom';
  icon: string;
}

export default function ProcessTimeline() {
  const timelineRef = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);

  const stages: Stage[] = [
    {
      number: "01",
      title: "Discovery: Understanding Your Revenue Gap",
      description: "I analyze your CRM setup, identify the revenue gap, set KPIs - not vanity metrics.",
      position: "top",
      icon: "search"
    },
    {
      number: "02",
      title: "Roadmap: Your 90-Day Action Plan",
      description: "I create roadmap showing what to do in days 1-30, 31-60, 61-90. Every initiative has estimated ROI.",
      position: "bottom",
      icon: "path"
    },
    {
      number: "03",
      title: "Quick Wins: Measurable Results in 30 Days",
      description: "I implement 3-5 quick wins showing immediate ROI. Typical wins: 15-25% improvement.",
      position: "top",
      icon: "lightning"
    },
    {
      number: "04",
      title: "Execution: Building Your Revenue Engine",
      description: "I implement the full framework while training your team - no vendor lock-in, just capability building.",
      position: "bottom",
      icon: "arrow"
    },
    {
      number: "05",
      title: "Optimization: Continuous 5-10% Improvements",
      description: "I establish monthly optimization sprints delivering 5-10% compound improvements.",
      position: "top",
      icon: "chart"
    }
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !revealed) {
            // Trigger sequential reveal
            revealStagesSequentially();
            setRevealed(true);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "50px"
      }
    );

    if (timelineRef.current) {
      observer.observe(timelineRef.current);
    }

    // Fallback timer for mobile - always show after 1 second if not triggered
    const fallbackTimer = setTimeout(() => {
      if (!revealed) {
        revealStagesSequentially();
        setRevealed(true);
      }
    }, 1000);

    return () => {
      if (timelineRef.current) {
        observer.unobserve(timelineRef.current);
      }
      clearTimeout(fallbackTimer);
    };
  }, [revealed]);

  const revealStagesSequentially = () => {
    const stageElements = document.querySelectorAll(`.${styles.timelineStage}`);
    stageElements.forEach((stage, index) => {
      setTimeout(() => {
        stage.classList.add(styles.revealed);
      }, index * 350); // 350ms stagger between each stage
    });
  };

  const renderIcon = (icon: string) => {
    switch (icon) {
      case "search":
        return (
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            <circle cx="16" cy="16" r="10" stroke="#7B2CBF" strokeWidth="2"/>
            <path d="M23 23L30 30" stroke="#7B2CBF" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        );
      case "path":
        return (
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            <circle cx="10" cy="20" r="4" stroke="#7B2CBF" strokeWidth="2"/>
            <circle cx="20" cy="12" r="4" stroke="#7B2CBF" strokeWidth="2"/>
            <circle cx="30" cy="20" r="4" stroke="#7B2CBF" strokeWidth="2"/>
            <path d="M13 18L17 14M23 14L27 18" stroke="#7B2CBF" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        );
      case "lightning":
        return (
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            <path d="M22 8L12 24H20L18 32L28 16H20L22 8Z" stroke="#7B2CBF" strokeWidth="2" strokeLinejoin="round"/>
          </svg>
        );
      case "arrow":
        return (
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            <path d="M20 30V10M20 10L12 18M20 10L28 18" stroke="#7B2CBF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      case "chart":
        return (
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            <path d="M8 28L14 20L20 24L32 10" stroke="#7B2CBF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M26 10H32V16" stroke="#7B2CBF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <section className={styles.processTimeline} id="how-we-work">
      <div className={styles.container}>

        {/* Header */}
        <h2 className={styles.headline}>My 5-Step Process: From Audit to Revenue Growth</h2>
        <p className={styles.description}>
          First results in 30 days. Full transformation in 6-12 months. No consultants who disappear after delivering a 200-page PDF.
        </p>

        {/* Timeline */}
        <div className={styles.timelineWrapper} ref={timelineRef}>

          {/* Base Line */}
          <div className={styles.timelineLine}></div>

          {/* Stages */}
          {stages.map((stage, index) => (
            <div
              key={stage.number}
              className={`${styles.timelineStage} ${styles[`stage${stage.number}`]}`}
            >
              {/* Content Above/Below */}
              <div className={`${styles.stageContent} ${styles[`content${stage.position.charAt(0).toUpperCase() + stage.position.slice(1)}`]}`}>
                <div className={styles.icon}>
                  {renderIcon(stage.icon)}
                </div>
                <h3 className={styles.stageTitle}>{stage.title}</h3>
                <p className={styles.stageDescription}>{stage.description}</p>
              </div>

              {/* Connector Line */}
              <div className={`${styles.connector} ${styles[`connector${stage.position.charAt(0).toUpperCase() + stage.position.slice(1)}`]}`}></div>

              {/* Node */}
              <div className={styles.node}>
                <span className={styles.nodeNumber}>{stage.number}</span>
              </div>
            </div>
          ))}

        </div>

      </div>
    </section>
  );
}
