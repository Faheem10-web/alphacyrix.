import React, { useState, useEffect } from 'react';

export default function Header({ onOpenModal }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 18);

      const sections = Array.from(document.querySelectorAll('section[id], footer[id]'));
      let currentId = 'hero';
      sections.forEach(section => {
        const sectionTop = section.offsetTop - 120;
        if (window.scrollY >= sectionTop) {
          currentId = section.id;
        }
      });
      setActiveSection(currentId);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e, targetId) => {
    setIsMobileOpen(false);
    setActiveSection(targetId);
  };

  return (
    <header className={`site-header ${isScrolled ? 'scrolled' : ''}`} id="siteHeader">
      <div className="header-inner container">
        {/* Brand Logo */}
        <a href="#hero" className="brand-logo" aria-label="Alphacyrix Home" onClick={(e) => handleNavClick(e, 'hero')}>
          <img src="/logo.png" alt="Alphacyrix Logo" className="logo-image" />
        </a>

        {/* Nav Links */}
        <nav className={`nav-menu ${isMobileOpen ? 'mobile-open' : ''}`} id="navMenu">
          <a
            href="#hero"
            className={`nav-link ${activeSection === 'hero' ? 'active' : ''}`}
            onClick={(e) => handleNavClick(e, 'hero')}
          >
            Home
          </a>
          <a
            href="#work"
            className={`nav-link ${activeSection === 'work' ? 'active' : ''}`}
            onClick={(e) => handleNavClick(e, 'work')}
          >
            Work
          </a>
          <a
            href="#services"
            className={`nav-link ${activeSection === 'services' ? 'active' : ''}`}
            onClick={(e) => handleNavClick(e, 'services')}
          >
            Services
          </a>
          <a
            href="#about"
            className={`nav-link ${activeSection === 'about' ? 'active' : ''}`}
            onClick={(e) => handleNavClick(e, 'about')}
          >
            About
          </a>
          <a
            href="#careers"
            className={`nav-link ${activeSection === 'careers' ? 'active' : ''}`}
            onClick={(e) => handleNavClick(e, 'careers')}
          >
            Careers
          </a>
          <a
            href="#contact"
            className={`nav-link ${activeSection === 'contact' ? 'active' : ''}`}
            onClick={(e) => handleNavClick(e, 'contact')}
          >
            Contact
          </a>
        </nav>

        {/* CTA Action */}
        <div className="header-actions">
          <button className="btn-pill-white" id="openProjectModalBtn" onClick={onOpenModal}>
            Start a project
          </button>
          <button
            className="mobile-toggle"
            id="mobileToggle"
            aria-label="Toggle navigation"
            onClick={() => setIsMobileOpen(prev => !prev)}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>
    </header>
  );
}
