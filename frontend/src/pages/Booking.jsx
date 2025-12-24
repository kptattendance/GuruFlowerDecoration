import { useState } from "react";
import "./Booking.css";

export default function Booking() {
  const [bookingData, setBookingData] = useState({
    name: "",
    email: "",
    phoneNumber: "",  // ✅ ADDED MISSING FIELD
    eventType: "",
    eventDate: "",
    venue: "",
    guestCount: "",
    budget: "",
    floralStyle: "",
    requests: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    setBookingData({
      ...bookingData,
      [e.target.name]: e.target.value
    });
  };

  // ✅ SINGLE CLEAN handleSubmit (REMOVED DUPLICATE)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch('http://localhost:5000/api/bookings/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData)
      });
      
      const data = await response.json();
      
      if (response.ok) {
        alert(`🎉 Booking confirmed! ID: ${data.bookingId}`);
        // ✅ COMPLETE RESET (all fields)
        setBookingData({ 
          name: "", email: "", phoneNumber: "", eventType: "", 
          eventDate: "", venue: "", guestCount: "", budget: "", 
          floralStyle: "", requests: "" 
        });
      } else {
        alert(`❌ ${data.error}`);
      }
    } catch (error) {
      alert('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const eventTypes = ["Wedding", "Birthday", "Anniversary", "Corporate", "Baby Shower", "Engagement"];
  const floralStyles = ["Classic Floral", "Modern Minimal", "Royal Luxury", "Boho Chic", "Vintage", "Balloon Art"];
  const budgetOptions = ["₹5K-₹15K", "₹15K-₹30K", "₹30K-₹50K", "₹50K+", "Discuss"];

  return (
    <section className="booking-page">
      <div className="booking-hero">
        <h1 className="booking-title">Book Your Decoration</h1>
        <p className="booking-subtitle">Create unforgettable moments</p>
      </div>

      <div className="booking-container">
        <div className="cards-row">
          {/* LEFT CARD */}
          <div className="booking-card left-card">
            <h3 className="section-title">👤 Basic Info</h3>
            
            <div className="form-group">
              <label>Name *</label>
              <input name="name" placeholder="Your name" value={bookingData.name} onChange={handleInputChange} required />
            </div>

            <div className="form-group">
              <label>Email *</label>
              <input type="email" name="email" placeholder="email@example.com" value={bookingData.email} onChange={handleInputChange} required />
            </div>

            <div className="form-group">
              <label>Event *</label>
              <select name="eventType" value={bookingData.eventType} onChange={handleInputChange} required>
                <option value="">Select</option>
                {eventTypes.map((type, i) => <option key={i} value={type}>{type}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label>Date *</label>
              <input type="date" name="eventDate" value={bookingData.eventDate} onChange={handleInputChange} required />
            </div>

            <div className="form-group">
              <label>Phone Number *</label>
              <input type="tel" name="phoneNumber" value={bookingData.phoneNumber} onChange={handleInputChange} required />
            </div>
          </div>

          {/* RIGHT CARD */}
          <div className="booking-card right-card">
            <h3 className="section-title">🎉 Event Details</h3>
            
            <div className="form-group">
              <label>Venue</label>
              <input name="venue" placeholder="Hotel/City" value={bookingData.venue} onChange={handleInputChange} />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Guests</label>
                <input type="number" name="guestCount" placeholder="100" value={bookingData.guestCount} onChange={handleInputChange} />
              </div>
              <div className="form-group">
                <label>Budget</label>
                <select name="budget" value={bookingData.budget} onChange={handleInputChange}>
                  <option value="">Select</option>
                  {budgetOptions.map((opt, i) => <option key={i} value={opt}>{opt}</option>)}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Style *</label>
              <select name="floralStyle" value={bookingData.floralStyle} onChange={handleInputChange} required>
                <option value="">Choose</option>
                {floralStyles.map((style, i) => <option key={i} value={style}>{style}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label>Requests</label>
              <textarea name="requests" rows="3" placeholder="Special requirements..." value={bookingData.requests} onChange={handleInputChange} />
            </div>
          </div>
        </div>

        {/* DARK BOOK NOW BUTTON */}
        <div className="submit-section">
          <form id="booking-form" onSubmit={handleSubmit}>
            <button type="submit" disabled={isSubmitting} className="dark-submit-btn">
              {isSubmitting ? (
                <>
                  <span className="spinner"></span>
                  Sending...
                </>
              ) : (
                <>
                  <span className="btn-icon">📋</span>
                  Book Now
                </>
              )}
            </button>
          </form>
          <p className="submit-note">Free quote within 24 hours</p>
        </div>
      </div>

      <div className="business-info">
        <div className="info-card">
          <h4>📍 Flower Decor Mangaluru</h4>
          <p>gpflowerdecorators@gmail.com | +91 98765 43210<br/>Mallikarjuna Complex, Infront of A.P.M.C, Near Court, Nanjanagudi Road, T Narasipura</p>
        </div>
      </div>
    </section>
  );
}
