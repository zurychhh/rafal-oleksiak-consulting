"use client";

import Logo from "../ui/Logo";
import MobileNav from "./MobileNav";

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo - Left */}
        <div className="navbar-logo">
          <Logo />
        </div>

        {/* Navigation Links - Center-Right */}
        <div className="navbar-links">
          <a href="#bio" className="nav-link">WHO</a>
          <span className="nav-divider">|</span>
          <a href="#revenue-driving-services" className="nav-link">WHAT</a>
          <span className="nav-divider">|</span>
          <a href="#how-we-work" className="nav-link">HOW</a>
          <span className="nav-divider">|</span>
          <a href="#lama-audit" className="nav-link">WHY</a>
          <span className="nav-divider">|</span>
          <a href="#contact" className="nav-link">WHEN</a>
        </div>

        {/* Blog Link + RADAR + CTA Button - Right */}
        <div className="navbar-cta">
          <a href="/radar" className="navbar-blog-link">
            RADAR
          </a>
          <a href="/blog" className="navbar-blog-link">
            BLOG
          </a>
          <a
            href="https://calendly.com/rafaloleksiakconsulting/30min"
            target="_blank"
            rel="noopener noreferrer"
            className="navbar-button"
          >
            BOOK CONSULTATION
          </a>
        </div>

        {/* Mobile Navigation - Hidden on desktop */}
        <MobileNav />
      </div>
    </nav>
  );
}
