import { useState } from "react";
import "./Contact.css";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setIsSubmitting(true);

  try {
    const res = await fetch("http://localhost:5000/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (!res.ok) throw new Error("Failed to send");

    alert("Thank you! Your message has been sent.");
    setFormData({ name: "", email: "", message: "" });
  } catch (err) {
    console.error(err);
    alert("Sorry, something went wrong. Please try again.");
  } finally {
    setIsSubmitting(false);
  }
};


  return (
    <section className="contact-page">
      <div className="contact-hero">
        <h1 className="contact-title">Get in Touch</h1>
        <p className="contact-subtitle">
          We'd love to hear about your special event
        </p>
      </div>

      <div className="contact-container">
        {/* CONTACT INFO */}
        <div className="contact-info">
          <h2 className="section-title">Contact Details</h2>
          
          <div className="contact-item">
            <div className="contact-icon">📧</div>
            <div>
              <span className="contact-type">Email</span>
              <a href="mailto:gpflowerdecorations@gmail.com" className="contact-value contact-link">
                gpflowerdecorations@gmail.com
              </a>
            </div>
          </div>

          <div className="contact-item">
            <div className="contact-icon">📞</div>
            <div>
              <span className="contact-type">Phone</span>
              <p className="contact-value">+91 9964118761</p>
            </div>
          </div>

          <div className="contact-item">
            <div className="contact-icon">📍</div>
            <div>
              <span className="contact-type">Location</span>
              <p className="contact-value">Mallikarjuna Complex, Infront of A.P.M.C, Near Court, Nanjanagudi Road, T Narasipura
                
              </p>
            </div>
          </div>

          <div className="map-container">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3891.228737523424!2d74.872!3d12.872!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba665e2b3f4a5c7%3A0x1234567890abcdef!2sVVR3%2BMMP%2C%20Kadri%20Hills%2C%20Kadri%2C%20Mangaluru%2C%20Karnataka%20575004!5e0!3m2!1sen!2sin!4v1734850000000"
              width="100%"
              height="250"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Flower Decor Location - Kadri Hills, Mangaluru"
            />
          </div>

          <p className="contact-note">
            Share your event details with us and we'll get back to you with 
            beautiful décor ideas tailored just for you.
          </p>
        </div>

        {/* FORM */}
        <form className="contact-form" onSubmit={handleSubmit}>
          <h2 className="section-title">Send Us a Message</h2>

          <div className="form-group">
            <label className="form-label">Name <span className="required">*</span></label>
            <input
              type="text"
              name="name"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email <span className="required">*</span></label>
            <input
              type="email"
              name="email"
              placeholder="your.email@example.com"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Message <span className="required">*</span></label>
            <textarea
              name="message"
              placeholder="Describe your event requirements, date, venue, and decoration preferences..."
              rows="6"
              value={formData.message}
              onChange={handleInputChange}
              maxLength="500"
              required
            />
            <div className="form-help">
              <span className="char-count">{formData.message.length}/500 characters</span>
              <span className="response-time">Response within 24 hours</span>
            </div>
          </div>

          <button type="submit" disabled={isSubmitting} className="submit-btn">
            {isSubmitting ? (
              <>
                <span className="spinner"></span>
                Sending...
              </>
            ) : (
              "Send Message"
            )}
          </button>
        </form>
      </div>
    </section>
  );
}
