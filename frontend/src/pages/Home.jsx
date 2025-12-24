import "./Home.css";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";

export default function Home() {
  const heroImages = [
    "/images/hero1.png",
    "/images/hero2.png",
    "/images/hero3.png",
    "https://images.unsplash.com/photo-1603211501083-0a1735ecf7a1?auto=format&fit=crop&w=800&q=80"
  ];

  const services = [
    { icon: "💐", title: "Wedding Decorations", desc: "Luxury floral mandaps, stage setups with fresh flowers, LED lighting & personalized themes for 200-1000 guests" },
    { icon: "🎂", title: "Birthday Celebrations", desc: "Helium balloon arches, 3D backdrops, chocolate fountains & age-specific themes for kids/adults" },
    { icon: "🏢", title: "Corporate Events", desc: "Professional branding, logo backdrops, stage lighting & premium setups for conferences & product launches" },
    { icon: "🎉", title: "Festive Occasions", desc: "Diwali rangoli, Christmas trees, Holi themes & regional festival decorations with cultural elements" },
    { icon: "🌿", title: "Outdoor Events", desc: "Weatherproof tents, garden canopies, fairy lights & natural floral arrangements for lawns & terraces" },
    { icon: "🕯️", title: "Theme Parties", desc: "Custom Hollywood, vintage, royal, ethnic & fantasy themes with props, lighting & immersive backdrops" }
  ];

  const [testimonials, setTestimonials] = useState([]);
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [currentHero, setCurrentHero] = useState(0);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [stats, setStats] = useState({ events: 0, ratings: 0, years: 0 });
  const [formVisible, setFormVisible] = useState(false);

  const fetchTestimonials = async () => {
    try {
      const res = await fetch("/api/testimonials");
      const data = await res.json();
      setTestimonials(data);
    } catch {
      setTestimonials([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rating || !formData.name.trim()) {
      alert("Please select rating and name ⭐");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, rating })
      });
      const result = await res.json();

      if (result.success) {
        setFormData({ name: "", email: "", message: "" });
        setRating(0);
        setHoverRating(0);
        fetchTestimonials();
        
        // Success toast notification
        toast.success("Thank you for your feedback! 🌷", {
          duration: 4000,
          position: "top-right",
          style: {
            background: "linear-gradient(135deg, var(--primary-color), #f3279e)",
            color: "#fff",
            fontFamily: "'Poppins', sans-serif",
            fontWeight: "600",
            borderRadius: "12px",
            boxShadow: "0 12px 30px rgba(184, 50, 128, 0.4)"
          }
        });
      }
    } catch (error) {
      toast.error("Oops! Something went wrong. Please try again.", {
        duration: 4000,
        position: "top-right"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const heroTimer = setInterval(() => {
      setCurrentHero((p) => (p + 1) % heroImages.length);
    }, 4000);
    return () => clearInterval(heroTimer);
  }, []);

  useEffect(() => {
    const statsTimer = setInterval(() => {
      setStats((p) => ({
        events: p.events < 500 ? p.events + 5 : 500,
        ratings: p.ratings < 49 ? p.ratings + 1 : 49,
        years: p.years < 10 ? p.years + 1 : 10
      }));
    }, 50);
    return () => clearInterval(statsTimer);
  }, []);

  useEffect(() => {
    setTimeout(() => setFormVisible(true), 2000);
    fetchTestimonials();
  }, []);

  return (
    <div className="home">
      {/* Toast Container */}
      <Toaster />
      
      {/* HERO */}
      <section className="hero hero-new">
        <div className="hero-left">
          <h1>
            Designing <span>Moments</span><br />
            That Bloom Forever
          </h1>
          <p>
            From intimate gatherings to grand celebrations, we design floral
            experiences that turn moments into memories.
          </p>
          <Link to="/booking" className="about-btn secondary">Book Event</Link>
           {/* SMALL STATIC BUBBLES - TOP ONLY */}
        <div className="float-circle about-fc1" />
        <div className="float-circle about-fc2" />
      

          <div className="hero-stats">
            <div><strong>{stats.events}+</strong><span>Events</span></div>
            <div><strong>{(stats.ratings / 10).toFixed(1)}★</strong><span>Ratings</span></div>
            <div><strong>{stats.years}+</strong><span>Years</span></div>
          </div>
        </div>

        <div className="hero-right">
          {heroImages.map((img, i) => (
            <img key={i} src={img} className={`hero-img ${currentHero === i ? "active" : ""}`} />
          ))}
        </div>
      </section>

      {/* SERVICES */}
      <section className="services">
        <h2>Our Specializations</h2>
        <div className="service-grid">
          {services.map((s, i) => (
            <div className="service-card" key={i}>
              <div className="service-icon">{s.icon}</div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="testimonials">
        <h2>What Our Clients Say</h2>

        <div className="marquee">
          <div className="marquee-track">
            {[...testimonials, ...testimonials].map((t, i) => (
              <div className="testimonial-card" key={i}>
                <h4 className="testimonial-name">{t.name}</h4>

                <div className="testimonial-stars">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span key={star}>
                      {star <= t.rating ? "★" : "☆"}
                    </span>
                  ))}
                </div>

                <p className="testimonial-text">{t.message}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEEDBACK */}
      <section className="feedback feedback-designed">
        <div className={`feedback-card ${formVisible ? "form-visible" : "form-hidden"}`}>
          <div className="feedback-header">
            <h2>🌷 Share Your Experience</h2>
            <p>Your feedback helps us create even more beautiful moments</p>
          </div>

          <form className={`feedback-form fancy ${formVisible ? "animate-form" : ""}`} onSubmit={handleSubmit}>
            <div className="row">
              <input
                type="text"
                placeholder="Your Name *"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
              <input
                type="email"
                placeholder="Email (optional)"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div className="rating-section">
              <span className="rate-label">Rate us</span>
              <div className="stars">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={`star ${(hoverRating || rating) >= star ? "active" : ""}`}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                  >
                    ★
                  </span>
                ))}
              </div>
            </div>

            <textarea
              placeholder="Tell us about your experience..."
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            />

            <button className={`submit-btn ${rating > 0 ? "active" : ""}`} disabled={loading}>
              {loading ? "Sending..." : "Send Feedback ✨"}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
