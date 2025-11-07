import Navbar from "./components/sections/Navbar";
import Bio from "./components/sections/Bio";
import CompanyCarousel from "./components/ui/CompanyCarousel";
import GradientBreaker from "./components/ui/GradientBreaker";
import Services from "./components/sections/Services";
import Collaboration from "./components/sections/Collaboration";
import CaseStudiesSection from "./components/sections/CaseStudiesSection";
import ExpertiseBreaker from "./components/sections/ExpertiseBreaker";
import ProcessTimeline from "./components/sections/ProcessTimeline";
import AchievementsTicker from "./components/sections/AchievementsTicker";
import FinalCTA from "./components/sections/FinalCTA";
import Footer from "./components/sections/Footer";
import LazySection from "./components/LazySection";

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

          {/* Badge */}
          <div className="hero-badge">CRM & MARKETING AUTOMATION EXPERT</div>

          {/* Headline */}
          <h1 className="hero-headline">
            I double revenue from owned marketing channels
          </h1>

          {/* Subheadline */}
          <p className="hero-subheadline">
            ROI-driven approach proven with <strong>Allegro</strong>, <strong>Booksy</strong>, and <strong>Accenture</strong>. I combine technical expertise with business strategy to turn automation into your #1 <strong>revenue driver</strong>.
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

          {/* Credibility Line */}
          <p className="hero-credibility">
            <span className="hero-checkmark">✓</span>
            <strong>Join</strong> 15+ companies that <strong>transformed</strong> their CRM & automation with Rafal Oleksiak Consulting
          </p>

        </div>
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

      {/* Case Studies Section */}
      <LazySection>
        <CaseStudiesSection />
      </LazySection>

      {/* Expertise Breaker - Auto-scrolling Tags */}
      <LazySection>
        <ExpertiseBreaker />
      </LazySection>

      {/* Process Timeline - How We'll Work Together */}
      <LazySection>
        <ProcessTimeline />
      </LazySection>

      {/* Breaker 4 - Achievements Ticker */}
      <LazySection>
        <AchievementsTicker />
      </LazySection>

      {/* Final CTA + Contact Form */}
      <LazySection>
        <FinalCTA />
      </LazySection>

      {/* Footer */}
      <LazySection>
        <Footer />
      </LazySection>
    </main>
  );
}
