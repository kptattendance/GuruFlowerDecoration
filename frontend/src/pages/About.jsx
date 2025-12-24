import "./About.css";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const fadeUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.8, ease: "easeOut" }
};

export default function About() {
  return (
    <div className="about-page">

      {/* HERO */}
      <section className="about-hero">
        <div className="about-hero-grid">
          <motion.div {...fadeUp} className="about-hero-content">
            <div className="hero-badge">Since 2018</div>
            <h1>Our Story, Our Craft</h1>
            <p>
              Thoughtfully designed floral experiences that turn celebrations into
              lasting memories.
            </p>

            {/* PAGE LINKS */}
            <div className="about-links">
              <Link to="/" className="about-btn primary">Home</Link>
              <Link to="/booking" className="about-btn secondary">Book Event</Link>
              <Link to="/contact" className="about-btn secondary">Contact</Link>
            </div>
          </motion.div>

          <motion.div
            className="about-hero-card"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            whileHover={{ y: -8, scale: 1.02 }}
          >
            <img
              src="https://images.unsplash.com/photo-1526045478516-99145907023c?auto=format&fit=crop&w=900&q=80"
              alt="Floral decoration"
            />
          </motion.div>
        </div>

        {/* SMALL STATIC BUBBLES - TOP ONLY */}
        <div className="float-circle about-fc1" />
        <div className="float-circle about-fc2" />
      </section>

      {/* STORY */}
      <section className="about-section">
        <div className="about-story-grid">
          <motion.div {...fadeUp}>
            <h2>Our Journey</h2>
            <p>
              Our journey began with a simple passion for flowers and an eye for
              detail. What started as small, intimate decorations soon grew into
              full-scale event styling as clients trusted us with their most
              important moments.
            </p>
            <p>
              Over the years, we have evolved into a dedicated floral décor studio,
              blending creativity, precision, and emotion to design experiences
              that feel personal, elegant, and timeless.
            </p>
          </motion.div>

          <motion.img
            {...fadeUp}
            src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=900&q=80"
            alt="Floral event setup"
          />
        </div>
      </section>

      {/* WHAT WE DO */}
      <section className="about-section tight-section">
        <motion.h2 {...fadeUp}>What We Do</motion.h2>
        <div className="what-we-do-grid">
          {[
            "Wedding & Engagement Décor",
            "Birthday & Private Celebrations",
            "Corporate & Brand Events",
            "Festive & Cultural Occasions",
            "Outdoor & Destination Events",
            "Concept & Theme Styling"
          ].map((item, i) => (
            <motion.div
              key={i}
              className="what-card"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              whileHover={{ y: -12 }}
              transition={{ duration: 0.4 }}
              viewport={{ once: true }}
            >
              <h3>{item}</h3>
              <p>
                Customized floral concepts designed to suit the scale, style,
                and emotion of your event.
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FLOWER SPECIALITY - LENGTHIER PARAGRAPH */}
      <section className="about-section tight-section soft-bg">
        <motion.div {...fadeUp}>
          <h2>The Art & Importance of Floral Design</h2>
          <div className="floral-philosophy">
            <p className="center-text large">
              Flowers are more than decoration—they are emotional architects that shape the entire atmosphere of an event.
            </p>
            <p className="center-text">
              Their delicate colors evoke warmth and joy, their graceful forms bring elegance and sophistication, and their natural fragrance creates an immediate sense of welcome. 
              The moment guests step into a venue, our floral arrangements guide their emotions—setting the tone for celebration, creating intimate moments, or establishing grandeur for milestone occasions.
            </p>
            <p className="center-text">
              We specialize in this delicate balance, curating blooms that harmonize with each event's unique story, cultural significance, and emotional purpose. 
              From seasonal palettes that reflect regional traditions to custom installations that tell personal love stories, every arrangement is thoughtfully composed to become the unforgettable backdrop of life's most cherished memories.
            </p>
          </div>
        </motion.div>
      </section>

      {/* INFO */}
      <section className="about-section tight-section soft-bg">
        <div className="info-grid">
          <motion.div className="info-card" whileHover={{ y: -8 }}>
            <h3>Coverage</h3>
            <p>
              We offer services across cities and nearby regions, including
              destination events with advance planning.
            </p>
          </motion.div>

          <motion.div className="info-card" whileHover={{ y: -8 }}>
            <h3>Working Hours</h3>
            <p>
              Monday – Sunday<br />
              9:00 AM – 9:00 PM
            </p>
          </motion.div>

          <motion.div className="info-card" whileHover={{ y: -8 }}>
            <h3>Offers</h3>
            <p>
              Seasonal packages, wedding bundles, and custom pricing for
              large-scale events.
            </p>
          </motion.div>
        </div>
      </section>

      {/* TEAM */}
      <section className="about-section tight-section">
        <motion.h2 {...fadeUp}>Our Team</motion.h2>
        <div className="team-grid">
          {[
            {
              role: "Lead Floral Designer",
              img: "https://randomuser.me/api/portraits/women/44.jpg"
            },
            {
              role: "Event Coordinator",
              img: "https://randomuser.me/api/portraits/men/45.jpg"
            },
            {
              role: "Production Manager",
              img: "https://randomuser.me/api/portraits/men/36.jpg"
            }
          ].map((t, i) => (
            <motion.div
              key={i}
              className="team-card"
              whileHover={{ y: -10 }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <img src={t.img} alt={t.role} />
              <h4>{t.role}</h4>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CONTACT CARDS */}
      <section className="about-section tight-section">
        <motion.h2 {...fadeUp}>Contact Information</motion.h2>

        <div className="contact-card-grid">
          <motion.div
            className="contact-card"
            whileHover={{ y: -8, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="contact-icon">📞</div>
            <h4>Phone</h4>
            <p>+91 9964118761</p>
          </motion.div>

          <motion.div
            className="contact-card"
            whileHover={{ y: -8, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="contact-icon">✉️</div>
            <h4>Email</h4>
            <p>gpflowerdecorations@gmail.com</p>
          </motion.div>

          <motion.div
            className="contact-card"
            whileHover={{ y: -8, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="contact-icon">📍</div>
            <h4>Studio Address</h4>
            <p>Mallikarjuna Complex, Infront of A.P.M.C, Near Court, Nanjanagudi Road, T Narasipura <br/>India</p>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
