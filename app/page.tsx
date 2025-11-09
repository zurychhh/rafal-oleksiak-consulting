import dynamic from 'next/dynamic';
import Navbar from "./components/sections/Navbar";
import LazySection from "./components/LazySection";

// Dynamic imports for below-fold sections to reduce initial bundle size
// Each component gets code-split into separate chunk for on-demand loading
const Bio = dynamic(() => import('./components/sections/Bio'), {
  loading: () => <div style={{ minHeight: '500px' }} />,
});

const CompanyCarousel = dynamic(() => import('./components/ui/CompanyCarousel'), {
  loading: () => <div style={{ minHeight: '200px' }} />,
});

const GradientBreaker = dynamic(() => import('./components/ui/GradientBreaker'), {
  loading: () => <div style={{ minHeight: '100px' }} />,
});

const Services = dynamic(() => import('./components/sections/Services'), {
  loading: () => <div style={{ minHeight: '600px' }} />,
});

const Collaboration = dynamic(() => import('./components/sections/Collaboration'), {
  loading: () => <div style={{ minHeight: '800px' }} />,
});

const CaseStudiesSection = dynamic(() => import('./components/sections/CaseStudiesSection'), {
  loading: () => <div style={{ minHeight: '900px' }} />,
});

const ExpertiseBreaker = dynamic(() => import('./components/sections/ExpertiseBreaker'), {
  loading: () => <div style={{ minHeight: '200px' }} />,
});

const ProcessTimeline = dynamic(() => import('./components/sections/ProcessTimeline'), {
  loading: () => <div style={{ minHeight: '700px' }} />,
});

const AchievementsTicker = dynamic(() => import('./components/sections/AchievementsTicker'), {
  loading: () => <div style={{ minHeight: '150px' }} />,
});

const FinalCTA = dynamic(() => import('./components/sections/FinalCTA'), {
  loading: () => <div style={{ minHeight: '700px' }} />,
});

const Footer = dynamic(() => import('./components/sections/Footer'), {
  loading: () => <div style={{ minHeight: '400px' }} />,
});

export default function Home() {
  return (
    <main>
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#2D3142]">

        {/* Floating Gradient Shapes */}
        <div className="floating-shapes-container">
          <div className="floating-shape floating-shape-1"></div>
          <div className="floating-shape floating-shape-2"></div>
          <div className="floating-shape floating-shape-3"></div>
        </div>

        {/* Content Container */}
        <div className="relative z-10 max-w-5xl mx-auto px-8 text-center">

          {/* Headline */}
          <h1 className="hero-headline">
            I double revenue from owned marketing channels
          </h1>

          {/* Subheadline */}
          <p className="hero-subheadline">
            ROI-driven approach proven with Allegro, Booksy, and Accenture
          </p>

          {/* CTA Button */}
          <a
            href="https://calendly.com/rafaloleksiakconsulting/30min"
            target="_blank"
            rel="noopener noreferrer"
            className="hero-cta-button"
          >
            Book Free Consultation
            <span>→</span>
          </a>

        </div>
      </section>

      {/* Statistics / Credibility Section */}
      <section className="bg-[#2D3142] py-12 text-center">
        <p className="hero-credibility">
          <span className="hero-checkmark">✓</span>
          <strong>Join</strong> 15+ companies that <strong>transformed</strong> their CRM & automation with Rafal Oleksiak Consulting
        </p>
      </section>

      {/* Company Logos Carousel */}
      <CompanyCarousel />

      {/* Bio Section */}
      <Bio />

      {/* Gradient Line Breaker */}
      <GradientBreaker />

      {/* Services Section */}
      <Services />

      {/* Collaboration Section */}
      <LazySection>
        <Collaboration />
      </LazySection>

      {/* Case Studies Section - Not lazy (has nav link) */}
      <CaseStudiesSection />

      {/* Expertise Breaker - Auto-scrolling Tags */}
      <LazySection>
        <ExpertiseBreaker />
      </LazySection>

      {/* Process Timeline - How We'll Work Together - Not lazy (has nav link) */}
      <ProcessTimeline />

      {/* Breaker 4 - Achievements Ticker */}
      <LazySection>
        <AchievementsTicker />
      </LazySection>

      {/* Final CTA + Contact Form - Not lazy (has nav link) */}
      <FinalCTA />

      {/* Footer */}
      <LazySection>
        <Footer />
      </LazySection>
    </main>
  );
}
