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
          <button className="navbar-button">
            BOOK CONSULTATION
          </button>
        </div>
      </div>
    </nav>
  );
}
