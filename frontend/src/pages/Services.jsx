import { useEffect, useState, useRef } from "react";
import "./Services.css";
import { useNavigate } from "react-router-dom";

export default function Services() {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All Decorations");
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef(null);

  // 🔹 Helper to generate a safe, stable ID
  const makeServiceId = (service) =>
    (service._id || service.title || "")
      .toString()
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9\-]/g, "");

  // Fetch services from backend
  useEffect(() => {
    setLoading(true);
    const loadServices = async () => {
      try {
        const url = new URL("http://localhost:5000/api/admin/services");
        const res = await fetch(url);
        const data = await res.json();

        const enhanced = data.map((service) => ({
          ...service,
          rating: service.rating || 4.8,
          reviews: service.reviews || 150,
          duration: service.duration || "4-6 hours",
          capacity: service.capacity || "50-100 guests",
          available: service.availability !== false,
          price: service.price || 25000,
          originalPrice:
            service.originalPrice || (service.price ? service.price * 1.3 : 30000),
          image: service.image
            ? `http://localhost:5000/uploads/${service.image}`
            : service.imageUrl ||
              "https://images.unsplash.com/photo-1517457373958-b7bdd458720e?w=500&auto=format&fit=crop&q=80",
          description: service.desc || service.title,
        }));
        setServices(enhanced);
      } catch (error) {
        console.error("Error loading services:", error);
        setServices(
          [
            {
              icon: "💐",
              title: "Wedding Decorations",
              desc: "Luxury floral mandaps...",
              available: true,
              price: 45000,
              image:
                "https://images.unsplash.com/photo-1603211501083-0a1735ecf7a1?w=500&auto=format&fit=crop&q=80",
            },
            {
              icon: "🎂",
              title: "Birthday Celebrations",
              desc: "Helium balloon arches...",
              available: true,
              price: 25000,
              image:
                "https://images.unsplash.com/photo-1517457373958-b7bdd458720e?w=500&auto=format&fit=crop&q=80",
            },
          ].map((s) => ({
            ...s,
            rating: 4.8,
            reviews: 150,
            duration: "4-6 hours",
            capacity: "50-100 guests",
            description: s.desc,
            originalPrice: s.price * 1.3,
          }))
        );
      } finally {
        setLoading(false);
      }
    };

    loadServices();
  }, []);

  // Suggestions for search
  const getSuggestions = () => {
    if (!searchTerm.trim()) return [];
    return services
      .filter((service) =>
        service.title.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .slice(0, 6)
      .map((service) => ({
        title: service.title,
        category: selectedCategory,
        id: makeServiceId(service), // 🔹 use normalized id
      }));
  };

  const suggestions = getSuggestions();

  // Category-aware filtering
  const cityCategories = [
    "Ahmedabad",
    "Bangalore",
    "Chennai",
    "Delhi NCR",
    "Hyderabad",
    "Gurugram",
    "Kolkata",
    "Mumbai",
  ];

  const otherDecorCategories = [
    "Cabana Decorations",
    "Canopy Decorations",
    "Car Boot Decorations",
    "Ceremony Decorations",
    "Flower Decorations",
    "Office Decorations",
    "Room Decorations",
    "Stage Decorations",
  ];

  const filteredServices = services
    .filter((service) => {
      const title = service.title?.toLowerCase() || "";
      const desc = service.description?.toLowerCase() || "";
      const cat = selectedCategory.toLowerCase();

      if (selectedCategory === "All Decorations") return true;

      // Ensure suggestion target is never filtered out by category
      if (searchTerm && title === searchTerm.toLowerCase()) return true;

      const occasionMatch = title.includes(cat) || desc.includes(cat);

      const isCity = cityCategories.map((c) => c.toLowerCase()).includes(cat);
      const isOther = otherDecorCategories
        .map((c) => c.toLowerCase())
        .includes(cat);

      if (isCity || isOther) return true;
      return occasionMatch;
    })
    .filter((service) => {
      if (!searchTerm) return true;
      const term = searchTerm.toLowerCase();
      return (
        service.title?.toLowerCase().includes(term) ||
        service.description?.toLowerCase().includes(term)
      );
    });

  // 🔹 Suggestion click → scroll to card
  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion.title);
    setShowSuggestions(false);
    setSelectedCategory("All Decorations"); // ensure it’s visible

    setTimeout(() => {
      const element = document.getElementById(`service-${suggestion.id}`);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
        element.classList.add("highlight");
        setTimeout(() => element.classList.remove("highlight"), 3000);
      }
    }, 200);
  };

  const handleInputFocus = () => searchTerm && setShowSuggestions(true);
  const handleInputBlur = () => setTimeout(() => setShowSuggestions(false), 200);
  const clearSearch = () => setSearchTerm("");

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="services-page">
      {/* INTRO */}
      <div className="service-intro">
        <h2>Premium Event Decoration Services</h2>
        <p>Transform your special occasions with professional decoration services.</p>
        <div className="intro-stats">
          <div className="stat-card">
            <span className="stat-number">{services.length}</span>
            <div className="stat-label">Total Services</div>
          </div>
          <div className="stat-card">
            <span className="stat-number">4.9</span>
            <div className="stat-label">Average Rating</div>
          </div>
          <div className="stat-card">
            <span className="stat-number">
              {services.filter((s) => s.available).length}
            </span>
            <div className="stat-label">Available Now</div>
          </div>
        </div>
      </div>

      <h1 className="services-title">Our Services</h1>

      {/* SEARCH */}
      <div className="search-section" ref={searchRef}>
        <div className="search-container">
          <input
            className="search-input"
            placeholder="Search services by name or occasion..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
          />
          {searchTerm && (
            <button className="clear-search" onClick={clearSearch}>
              ✕
            </button>
          )}
        </div>

        {showSuggestions && suggestions.length > 0 && (
          <div className="search-dropdown">
            {suggestions.map((suggestion, index) => (
              <div
                key={index}
                className="suggestion-item"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                <div className="suggestion-main">
                  <div className="suggestion-title">{suggestion.title}</div>
                  <div className="suggestion-meta">
                    <span>{suggestion.category}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="search-results-count">
          {filteredServices.length} services available
        </div>
      </div>

      {/* CATEGORIES – 3 columns */}
      <div className="category-cards category-cards-3col">
        {/* By Occasions */}
        <div className="category-card">
          <h2>By Occasions</h2>
          <ul>
            {[
              "All Decorations",
              "Anniversary",
              "Baby Shower",
              "Baby Welcome",
              "Birthday",
              "Christmas",
              "Festival",
              "Kid's Birthday",
            ].map((item) => (
              <li
                key={item}
                className={selectedCategory === item ? "active" : ""}
                onClick={() => setSelectedCategory(item)}
              >
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Other Decorations */}
        <div className="category-card">
          <h2>Other Decorations</h2>
          <ul>
            {[
              "Cabana Decorations",
              "Canopy Decorations",
              "Car Boot Decorations",
              "Ceremony Decorations",
              "Flower Decorations",
              "Office Decorations",
              "Room Decorations",
              "Stage Decorations",
            ].map((item) => (
              <li
                key={item}
                className={selectedCategory === item ? "active" : ""}
                onClick={() => setSelectedCategory(item)}
              >
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* City Wise */}
        <div className="category-card">
          <h2>City Wise</h2>
          <ul>
            {[
              "Ahmedabad",
              "Bangalore",
              "Chennai",
              "Delhi NCR",
              "Hyderabad",
              "Gurugram",
              "Kolkata",
              "Mumbai",
            ].map((item) => (
              <li
                key={item}
                className={selectedCategory === item ? "active" : ""}
                onClick={() => setSelectedCategory(item)}
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* SERVICES GRID */}
      <div className="services-grid">
        {loading ? (
          <div className="no-services">
            <div className="loading-spinner"></div>
            Loading services...
          </div>
        ) : filteredServices.length === 0 ? (
          <div className="no-services">
            <h3>No services found</h3>
            <p>
              {searchTerm
                ? `No results for "${searchTerm}"`
                : `No services for "${selectedCategory}"`}
            </p>
            <div className="suggestions">
              <span onClick={() => setSearchTerm("Wedding")}>
                Wedding Decorations
              </span>
              <span onClick={() => setSearchTerm("Birthday")}>
                Birthday Decorations
              </span>
            </div>
          </div>
        ) : (
          filteredServices.map((service, index) => (
            <div
              key={service._id || index}
              id={`service-${makeServiceId(service)}`} // 🔹 matches suggestion.id
              className="service-card"
              style={{ animationDelay: `${index * 0.08}s` }}
            >
              <div className="service-image-container">
                <img src={service.image} alt={service.title} />
                {service.originalPrice && (
                  <div className="discount-badge">
                    {Math.round(
                      ((service.originalPrice - service.price) /
                        service.originalPrice) *
                        100
                    )}
                    % OFF
                  </div>
                )}
              </div>

              <div className="service-info">
                <div className="service-icon-large">{service.icon}</div>
                <h3 className="service-title">{service.title}</h3>

                <div className="rating-badge">
                  ★ {service.rating.toFixed(1)} (
                  {service.reviews.toLocaleString()})
                </div>

                <div className="service-description">
                  <p>{service.description}</p>
                </div>

                <div className="service-meta">
                  <div className="meta-item">
                    <span>⏱️</span>
                    <span>{service.duration}</span>
                  </div>
                  <div className="meta-item">
                    <span>👥</span>
                    <span>{service.capacity}</span>
                  </div>
                </div>

                <div className="service-footer">
                  <div className="pricing-container">
                    <span className="current-price">
                      ₹{service.price?.toLocaleString()}
                    </span>
                    {service.originalPrice && (
                      <span className="original-price">
                        ₹{service.originalPrice.toLocaleString()}
                      </span>
                    )}
                  </div>

                  <span
                    className={`status-badge ${
                      service.available ? "available" : "booked"
                    }`}
                  >
                    {service.available ? "Available Now" : "Currently Booked"}
                  </span>

                  <button
                    className="book-now-btn"
                    onClick={() =>
                      navigate("/booking", { state: { service } })
                    }
                    disabled={!service.available}
                  >
                    {service.available ? "Book Now" : "Not Available"}
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
