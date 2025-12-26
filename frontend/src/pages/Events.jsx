import "./Events.css";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Events() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleCards, setVisibleCards] = useState(6);
  const [stats, setStats] = useState({ events: 0, weddings: 0, clients: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    fetchEvents();
    const interval = setInterval(() => {
      setStats((prev) => ({
        events: prev.events < 250 ? prev.events + 2 : 250,
        weddings: prev.weddings < 150 ? prev.weddings + 1 : 150,
        clients: prev.clients < 500 ? prev.clients + 3 : 500,
      }));
    }, 30);
    return () => clearInterval(interval);
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        "https://guru-flower-decoration-backend.vercel.app/api/events"
      );
      const data = await res.json();

      const eventServices = data
        .map((event) => ({
          _id: event._id,
          name: event.title,
          image: event.image
            ? `https://guru-flower-decoration-backend.vercel.app/uploads/${event.image}`
            : getEventImage(event.title),
          available: event.availability,
          price: event.price,
          description: event.desc,
        }))
        .filter((event) => event.available);

      setServices(eventServices);
    } catch (error) {
      console.log("Using static data", error);
      fetchServicesFallback();
    } finally {
      setLoading(false);
    }
  };

  const fetchServicesFallback = async () => {
    try {
      const res = await fetch(
        "https://guru-flower-decoration-backend.vercel.app/api/services/services"
      );
      const data = await res.json();
      setServices(data.filter((service) => service.availability));
    } catch (error) {
      console.log("No data available", error);
    }
  };

  const getEventImage = (title) => {
    const images = {};
    const key = title.toLowerCase();
    return (
      images[key] ||
      "https://images.unsplash.com/photo-1604014237800-1c9102c219da?w=400&q=80"
    );
  };

  const loadMore = () =>
    setVisibleCards((prev) => Math.min(prev + 4, services.length));

  const bookEvent = (service) => {
    navigate("/booking", { state: { service, type: "event" } });
  };

  if (loading) {
    return (
      <section className="events-gallery">
        <div className="loading-center">Loading live events...</div>
      </section>
    );
  }

  return (
    <section className="events-gallery">
      <motion.h1 className="events-title">Live Events Gallery</motion.h1>

      <motion.div className="stats-grid">
        <div className="stat-item">
          <strong>{services.length.toLocaleString()}+</strong>
          <span>Live Events</span>
        </div>
        <div className="stat-item">
          <strong>{stats.weddings}+</strong>
          <span>Weddings</span>
        </div>
        <div className="stat-item">
          <strong>{stats.clients.toLocaleString()}+</strong>
          <span>Happy Clients</span>
        </div>
      </motion.div>

      <motion.div className="events-content">
        <p>Every event in life carries emotions...</p>
      </motion.div>

      <motion.p className="events-subtitle">
        Live available events across different occasions
      </motion.p>

      <div className="gallery-grid">
        <AnimatePresence>
          {services.slice(0, visibleCards).map((service, index) => (
            <motion.div
              key={service._id}
              className={`gallery-card ${!service.available ? "sold-out" : ""}`}
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              whileHover={{ scale: service.available ? 1.02 : 1 }}
              transition={{ delay: index * 0.05 }}
            >
              <img src={service.image} alt={service.name} loading="lazy" />
              <motion.div className="overlay">
                <motion.h3 whileHover={{ y: -5 }}>{service.name}</motion.h3>
                {service.available && (
                  <div className="event-availability">
                    <span>₹{service.price?.toLocaleString()}</span>
                    <button
                      className="book-event-btn"
                      onClick={() => bookEvent(service)}
                    >
                      Book Now
                    </button>
                  </div>
                )}
              </motion.div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {visibleCards < services.length && (
        <motion.button
          className="load-more-btn"
          whileHover={{ scale: 1.05 }}
          onClick={loadMore}
        >
          Load More Events ✨
        </motion.button>
      )}
    </section>
  );
}
