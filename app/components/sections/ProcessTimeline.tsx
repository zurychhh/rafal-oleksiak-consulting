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
      title: "Discovery & Goal Setting",
      description: "Understanding your business context and setting clear KPIs that align with strategic objectives.",
      position: "top",
      icon: "search"
    },
    {
      number: "02",
      title: "Strategic Roadmap",
      description: "Creating detailed action plan with prioritized initiatives and transparent roadmap.",
      position: "bottom",
      icon: "path"
    },
    {
      number: "03",
      title: "Quick Wins Implementation",
      description: "Delivering immediate results within 30 days to build momentum and demonstrate ROI.",
      position: "top",
      icon: "lightning"
    },
    {
      number: "04",
      title: "Full-Scale Execution",
      description: "Executing transformation with sustainable solutions and building team capabilities.",
      position: "bottom",
      icon: "arrow"
    },
    {
      number: "05",
      title: "Optimization & Growth",
      description: "Measuring results against KPIs and continuously improving through data-driven optimization.",
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
        threshold: 0.3,
        rootMargin: "-100px"
      }
    );

    if (timelineRef.current) {
      observer.observe(timelineRef.current);
    }

    return () => {
      if (timelineRef.current) {
        observer.unobserve(timelineRef.current);
      }
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
    <section className={styles.processTimeline} id="process">
      <div className={styles.container}>

        {/* Header */}
        <h2 className={styles.headline}>How We'll Work Together</h2>
        <p className={styles.description}>
          Every project starts with understanding your business goals and ends with measurable ROI.
          I combine strategic thinking with hands-on technical expertise to deliver results that
          matter—not just implementation, but transformation that drives revenue.
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
