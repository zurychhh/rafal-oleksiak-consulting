import Navbar from "./components/sections/Navbar";
import Bio from "./components/sections/Bio";
import CompanyCarousel from "./components/ui/CompanyCarousel";
import GradientBreaker from "./components/ui/GradientBreaker";
import Services from "./components/sections/Services";
import Collaboration from "./components/sections/Collaboration";
import CaseStudiesSection from "./components/sections/CaseStudiesSection";

export default function Home() {
  return (
    <main>
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#2D3142]">

        {/* Floating Gradient Shapes */}
        <div className="floating-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
          <div className="shape shape-4"></div>
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
          <button className="hero-cta-button">
            Book Free Consultation
            <span>→</span>
          </button>

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
      <Collaboration />

      {/* Case Studies Section */}
      <CaseStudiesSection />
    </main>
  );
}
