// Footer.jsx - Added upward scroll on route change
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { useEffect as useEffectRouter } from "react"; // For scroll effect
import "./Footer.css";

export default function Footer() {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Exact route matching
  const routes = {
    home: "/Home",
    about: "/About",
    services: "/Services",
    contact: "/Contact",
    booking: "/Booking",
  };

  // ✅ SCROLL TO TOP ON ROUTE CHANGE (UPWARD TRANSITION)
  useEffectRouter(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname]);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const iconVariants = {
    hover: { scale: 1.1, rotate: 5, transition: { duration: 0.2 } },
  };

  const isActiveRoute = (route) => location.pathname === route;

  // ✅ Navigate with upward scroll
  const navigateWithScroll = (path) => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    navigate(path);
  };

  return (
    <footer className="footer">
      <div className="footer-main">
        <motion.div
          className="footer-grid"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {/* BRAND */}
          <motion.div className="footer-col brand-col" variants={itemVariants}>
            <motion.div
              className="brand-logo"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              onClick={scrollToTop}
            >
              <Link to="/" className="logo">
                <img src="/images/logo.png" alt="GP Flower Decorators Logo" />
                <span className="logo-text">GP Flower Decorators</span>
              </Link>
            </motion.div>
            <motion.p
              className="brand-desc"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Premium floral & event décor services crafted with elegance and
              care.
            </motion.p>

            <div className="social-row">
              <motion.i
                className="fa-brands fa-instagram"
                variants={iconVariants}
                whileHover="hover"
                title="Instagram"
              />
              <motion.i
                className="fa-brands fa-facebook-f"
                variants={iconVariants}
                whileHover="hover"
                title="Facebook"
              />
              <motion.i
                className="fa-brands fa-x-twitter"
                variants={iconVariants}
                whileHover="hover"
                title="Twitter"
              />
              <motion.i
                className="fa-brands fa-linkedin-in"
                variants={iconVariants}
                whileHover="hover"
                title="LinkedIn"
              />
            </div>
          </motion.div>

          {/* POLICY */}
          <motion.div className="footer-col" variants={itemVariants}>
            <h4>Policy Info</h4>
            {[
              "Terms & Conditions",
              "Privacy Policy",
              "Disclaimer",
              "Shipping Policy",
              "Cancellation Policy",
            ].map((item, idx) => (
              <motion.a
                key={item}
                href="#"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * idx }}
                whileHover={{ x: 8 }}
              >
                {item}
              </motion.a>
            ))}
          </motion.div>

          {/* COMPANY - WITH UPWARD SCROLL */}
          <motion.div className="footer-col" variants={itemVariants}>
            <h4>Company</h4>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              whileHover={{ x: 8 }}
            >
              <Link
                to={routes.home}
                className={isActiveRoute(routes.home) ? "active-route" : ""}
                onClick={() => navigateWithScroll(routes.home)}
              >
                Home
              </Link>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              whileHover={{ x: 8 }}
            >
              <Link
                to={routes.about}
                className={isActiveRoute(routes.about) ? "active-route" : ""}
                onClick={() => navigateWithScroll(routes.about)}
              >
                About Us
              </Link>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              whileHover={{ x: 8 }}
            >
              <Link
                to={routes.services}
                className={isActiveRoute(routes.services) ? "active-route" : ""}
                onClick={() => navigateWithScroll(routes.services)}
              >
                Services
              </Link>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              whileHover={{ x: 8 }}
            >
              <Link
                to={routes.booking}
                className={isActiveRoute(routes.booking) ? "active-route" : ""}
                onClick={() => navigateWithScroll(routes.booking)}
              >
                Booking Now
              </Link>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              whileHover={{ x: 8 }}
            >
              <Link
                to={routes.contact}
                className={isActiveRoute(routes.contact) ? "active-route" : ""}
                onClick={() => navigateWithScroll(routes.contact)}
              >
                Contact Us
              </Link>
            </motion.div>
          </motion.div>

          {/* CONTACT */}
          <motion.div className="footer-col" variants={itemVariants}>
            <h4>Get in Touch</h4>
            <motion.p whileHover={{ x: 8 }}>
              <i className="fa-solid fa-phone"></i> +91 9964118761
            </motion.p>
            <motion.p whileHover={{ x: 8 }}>
              <i className="fa-solid fa-envelope"></i>{" "}
              gpflowerdecorations@gmail.com
            </motion.p>
            <motion.p whileHover={{ x: 8 }}>
              <i className="fa-solid fa-location-dot"></i> Mallikarjuna Complex,
              Infront of A.P.M.C, Near Court, Nanjanagudi Road, T Narasipura
            </motion.p>

            <div className="visitor-inline">
              <i className="fa-solid fa-users"></i>
              <span>25,000+ Visitors</span>
            </div>
          </motion.div>

          {/* MAP */}
          <motion.div className="footer-col map-col" variants={itemVariants}>
            <h4>Find Us</h4>
            <motion.div
              className="map-box"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <iframe
                title="GP Flower Decorations Location"
                src="https://www.google.com/maps?q=VVR3+MMP,+Kadri+Hills,+Kadri,+Mangaluru,+Karnataka+575004&output=embed"
                loading="lazy"
              />
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      <div className="footer-bottom">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          © 2025 All Rights Reserved | GP Flower Decoration
        </motion.p>
      </div>

      {/* Scroll to Top */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            className="scroll-top show"
            onClick={scrollToTop}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            whileHover={{ scale: 1.15, rotate: 360 }}
            whileTap={{ scale: 0.95 }}
          >
            <i className="fa-solid fa-arrow-up"></i>
          </motion.button>
        )}
      </AnimatePresence>
    </footer>
  );
}
