"use client";

import Logo from "../ui/Logo";

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
          <a href="#services" className="nav-link">SERVICES</a>
          <span className="nav-divider">|</span>
          <a href="#work" className="nav-link">WORK</a>
          <span className="nav-divider">|</span>
          <a href="#process" className="nav-link">PROCESS</a>
          <span className="nav-divider">|</span>
          <a href="#contact" className="nav-link">CONTACT</a>
        </div>

        {/* CTA Button - Right */}
        <div className="navbar-cta">
          <a
            href="https://calendly.com/rafaloleksiakconsulting/30min"
            target="_blank"
            rel="noopener noreferrer"
            className="navbar-button"
          >
            BOOK CONSULTATION
          </a>
        </div>
      </div>
    </nav>
  );
}
