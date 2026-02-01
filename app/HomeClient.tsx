'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import Navbar from "./components/sections/Navbar"
import LazySection from "./components/LazySection"
import HeroCTA from "./components/ui/HeroCTA"
import Services from './components/sections/Services'
import CaseStudiesSection from './components/sections/CaseStudiesSection'
import ProcessTimeline from './components/sections/ProcessTimeline'
import Accelerators from './components/sections/Accelerators'
import FinalCTA from './components/sections/FinalCTA'
import Footer from './components/sections/Footer'
import FinalSuccessScreen from './components/ui/FinalSuccessScreen'
import CookieConsent from './components/ui/CookieConsent'

const Bio = dynamic(() => import('./components/sections/Bio'), {
  loading: () => <div style={{ minHeight: '500px' }} />,
})

const CompanyCarousel = dynamic(() => import('./components/ui/CompanyCarousel'), {
  loading: () => <div style={{ minHeight: '200px' }} />,
})

const GradientBreaker = dynamic(() => import('./components/ui/GradientBreaker'), {
  loading: () => <div style={{ minHeight: '100px' }} />,
})

const Collaboration = dynamic(() => import('./components/sections/Collaboration'), {
  loading: () => <div style={{ minHeight: '800px' }} />,
})

const LamaAuditSection = dynamic(() => import('./components/sections/LamaAuditSection'), {
  loading: () => <div style={{ minHeight: '600px' }} />,
})

const ExpertiseBreaker = dynamic(() => import('./components/sections/ExpertiseBreaker'), {
  loading: () => <div style={{ minHeight: '200px' }} />,
})

const AchievementsTicker = dynamic(() => import('./components/sections/AchievementsTicker'), {
  loading: () => <div style={{ minHeight: '150px' }} />,
})

export default function HomeClient() {
  const [showFinalScreen, setShowFinalScreen] = useState(false)

  return (
    <>
      {/* Main content - hidden when final screen is active */}
      <main style={{ display: showFinalScreen ? 'none' : 'block' }}>
        <Navbar />

        {/* Hero Section */}
        <section id="hero" className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-[#2D3142]">
          <div className="floating-shapes-container">
            <div className="floating-shape floating-shape-1"></div>
            <div className="floating-shape floating-shape-2"></div>
            <div className="floating-shape floating-shape-3"></div>
          </div>

          <div className="relative z-10 max-w-5xl mx-auto px-8 text-center hero-content-container">
            <h1 className="hero-headline">
              From first click to loyal customers. Together.
            </h1>

            <p className="hero-subheadline">
              I optimize your traffic quality, fix UX bottlenecks, automate processes, and shift you from paid to free traffic through a CRM 2.0 approach. 15 years in ecommerce. Start with a free website audit.
            </p>

            <HeroCTA />
          </div>
        </section>

        {/* Statistics / Credibility Section */}
        <section className="bg-[#2D3142] py-8 text-center">
          <p className="hero-credibility">
            <span className="hero-checkmark">✓</span>
            Trusted by Allegro, Booksy, Accenture, and mBank for ecommerce & CRM transformation
          </p>
        </section>

        <CompanyCarousel />
        <Bio />
        <GradientBreaker />
        <Services />
        <Collaboration onSuccess={() => setShowFinalScreen(true)} />
        <CaseStudiesSection />

        <LazySection>
          <ExpertiseBreaker />
        </LazySection>

        <ProcessTimeline />
        <Accelerators />

        <LazySection>
          <AchievementsTicker />
        </LazySection>

        <LamaAuditSection />

        {/* Final CTA with callback to show final screen */}
        <FinalCTA onSuccess={() => setShowFinalScreen(true)} />

        <Footer />
      </main>

      {/* Final Success Screen - fullscreen overlay, renders on top of everything */}
      {showFinalScreen && <FinalSuccessScreen isOpen={true} />}

      {/* Cookie consent banner - GDPR compliance */}
      <CookieConsent />
    </>
  )
}
