import { Link, useLocation } from "react-router-dom";
import "./Header.css";
import { useState, useEffect } from "react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/about", label: "About" },
    { to: "/services", label: "Services" },
    { to: "/events", label: "Events" },
    { to: "/contact", label: "Contact" },
  ];

  // Close menu when location changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  return (
    <header className="header">
      <div>
        <Link to="/" className="logo">
          <img src="/images/logo.png" alt="GP Flower Decorators Logo" />
          <span>GP Flower Decorators</span>
        </Link>
      </div>

      <button
        className={`mobile-menu-btn ${isMenuOpen ? "active" : ""}`}
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        <span className="hamburger-line"></span>
        <span className="hamburger-line"></span>
        <span className="hamburger-line"></span>
      </button>

      <nav className={`nav ${isMenuOpen ? "nav-open" : ""}`}>
        {navLinks.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className={`nav-link ${
              location.pathname === link.to ? "active" : ""
            }`}
          >
            {link.label}
          </Link>
        ))}
        <Link to="/booking" className="book-btn">
          Book Now
        </Link>
      </nav>
    </header>
  );
}
