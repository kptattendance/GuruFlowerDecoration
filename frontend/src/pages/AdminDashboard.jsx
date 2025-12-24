import { useState, useEffect } from 'react';
import { useUser, SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react';
import './AdminDashboard.css';

export default function AdminDashboard() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [services, setServices] = useState([]);
  const [events, setEvents] = useState([]); // ✅ SEPARATE EVENTS STATE
  const [newService, setNewService] = useState({ 
    title: '', desc: '', availability: true, price: 0 
  });
  const [newEvent, setNewEvent] = useState({ 
    title: '', desc: '', availability: true, price: 0, image: '' 
  });
  const [stats, setStats] = useState({ services: 0, testimonials: 0 });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('services');
  const [eventImagePreview, setEventImagePreview] = useState(null);
  const [uploadingEventImage, setUploadingEventImage] = useState(false);

  const getUserName = () => {
    return user?.firstName || user?.lastName || 
           (user?.primaryEmailAddress?.emailAddress?.split('@')[0]) || 'Admin';
  };

  useEffect(() => {
    if (isSignedIn && isLoaded) {
      loadData();
    }
  }, [isSignedIn, isLoaded]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [statsRes, servicesRes, eventsRes] = await Promise.all([
        fetch('http://localhost:5000/api/admin/stats'),
        fetch('http://localhost:5000/api/admin/services'),
        fetch('http://localhost:5000/api/events')
      ]);
      
      if (statsRes.ok) setStats(await statsRes.json());
      if (servicesRes.ok) setServices(await servicesRes.json());
      if (eventsRes.ok) setEvents(await eventsRes.json());
    } catch (error) {
      console.log('Load error:', error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Reset forms when switching tabs
  useEffect(() => {
    if (activeTab === 'services') {
      setNewEvent({ title: '', desc: '', availability: true, price: 0, image: '' });
      setEventImagePreview(null);
    } else {
      setNewService({ title: '', desc: '', availability: true, price: 0 });
    }
  }, [activeTab]);

  // ✅ FIXED: Proper image upload to backend
  const handleEventImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    setUploadingEventImage(true);
    try {
      const res = await fetch('http://localhost:5000/api/upload', {
        method: 'POST',
        body: formData
      });
      
      if (res.ok) {
        const { filename } = await res.json();
        setNewEvent(prev => ({ ...prev, image: filename }));
        setEventImagePreview(URL.createObjectURL(file));
      }
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Image upload failed');
    } finally {
      setUploadingEventImage(false);
    }
  };

  // ✅ FIXED: Services form handler
  const addService = async (e) => {
    e.preventDefault();
    console.log('Adding service:', newService);
    try {
      const res = await fetch('http://localhost:5000/api/admin/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newService)
      });
      
      if (res.ok) {
        setNewService({ title: '', desc: '', availability: true, price: 0 });
        loadData();
        alert('Service added successfully! ✅');
      } else {
        alert('Failed to add service');
      }
    } catch (error) {
      console.error('Service error:', error);
      alert('Failed to add service');
    }
  };

  // ✅ FIXED: Events form handler - CORRECT ENDPOINT
  const addEvent = async (e) => {
    e.preventDefault();
    console.log('Adding event:', newEvent);
    
    try {
      const res = await fetch('http://localhost:5000/api/events/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newEvent)
      });
      
      if (res.ok) {
        setNewEvent({ title: '', desc: '', availability: true, price: 0, image: '' });
        setEventImagePreview(null);
        loadData();
        alert('Event added successfully! ✨');
      } else {
        alert('Failed to add event');
      }
    } catch (error) {
      console.error('Event error:', error);
      alert('Failed to add event');
    }
  };

  const toggleItem = async (id, availability, isEvent = false) => {
    try {
      const endpoint = isEvent ? `http://localhost:5000/api/events/${id}` : `http://localhost:5000/api/admin/services/${id}`;
      await fetch(endpoint, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ availability: !availability })
      });
      loadData();
    } catch (error) {
      alert('Failed to update');
    }
  };

 const deleteItem = async (id, isEvent = false) => {
  if (!window.confirm('Delete this item?')) return;

  try {
    const endpoint = isEvent
      ? `http://localhost:5000/api/delete/events/${id}`   // ✅ FIXED
      : `http://localhost:5000/api/admin/services/${id}`;

    const res = await fetch(endpoint, {
      method: 'DELETE',
    });

    if (!res.ok) {
      throw new Error('Delete failed');
    }

    // ✅ Update UI instantly without breaking layout
    if (isEvent) {
      setEvents(prev => prev.filter(e => e._id !== id));
    } else {
      setServices(prev => prev.filter(s => s._id !== id));
    }

  } catch (error) {
    console.error(error);
    alert('Failed to delete');
  }
};


  if (!isLoaded) return <div className="loading-center">Loading...</div>;

  return (
    <>
      <SignedIn>
        <div className="admin-wrapper">
          <div className="admin-container">
            {/* HEADER */}
            <header className="admin-header">
              <div className="header-content">
                <div>
                  <h1 className="page-title">Admin Dashboard</h1>
                  <p className="welcome-text">Welcome back, <span className="user-name">{getUserName()}</span></p>
                </div>
                <div className="header-stats">
                  <div className="stat-item">
                    <div className="stat-number">{stats.services}</div>
                    <div className="stat-label">Total Services</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-number">{stats.testimonials}</div>
                    <div className="stat-label">Testimonials</div>
                  </div>
                </div>
              </div>
            </header>

            {/* TABS */}
            <div className="admin-tabs">
              <button 
                className={`tab-btn ${activeTab === 'services' ? 'active' : ''}`}
                onClick={() => setActiveTab('services')}
              >
                Services ({services.length})
              </button>
              <button 
                className={`tab-btn ${activeTab === 'events' ? 'active' : ''}`}
                onClick={() => setActiveTab('events')}
              >
                Events ({events.length})
              </button>
            </div>

            {/* FORMS */}
            <div className="admin-card">
              <h2 className="card-title">
                {activeTab === 'services' ? 'Add New Service' : 'Add Event Decoration'}
              </h2>
              
              {activeTab === 'services' ? (
                <form onSubmit={addService} className="service-form">
                  <div className="form-grid">
                    <input
                      className="form-field"
                      placeholder="Service Title"
                      value={newService.title}
                      onChange={(e) => setNewService({...newService, title: e.target.value})}
                      required
                    />
                    <input
                      className="form-field"
                      type="number"
                      placeholder="Price (₹)"
                      value={newService.price}
                      onChange={(e) => setNewService({...newService, price: Number(e.target.value)})}
                      required
                    />
                  </div>
                  <textarea
                    className="form-field"
                    placeholder="Service Description"
                    value={newService.desc}
                    onChange={(e) => setNewService({...newService, desc: e.target.value})}
                    rows="4"
                  />
                  <div className="form-actions">
                    <label className="toggle-container">
                      <input
                        type="checkbox"
                        checked={newService.availability}
                        onChange={(e) => setNewService({...newService, availability: e.target.checked})}
                      />
                      <span className="toggle-switch"></span>
                      Available
                    </label>
                    <button type="submit" className="btn-primary">Add Service</button>
                  </div>
                </form>
              ) : (
                <form onSubmit={addEvent} className="service-form">
                  <div className="form-grid">
                    <input
                      className="form-field"
                      placeholder="Event Name (Wedding, Birthday, Haldi...)"
                      value={newEvent.title}
                      onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                      required
                    />
                    <input
                      className="form-field"
                      type="number"
                      placeholder="Price (₹)"
                      value={newEvent.price}
                      onChange={(e) => setNewEvent({...newEvent, price: Number(e.target.value)})}
                      required
                    />
                  </div>

                  <div className="image-upload-section">
                    <label className="image-upload-label">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleEventImageUpload}
                        className="image-input"
                      />
                      <span>{uploadingEventImage ? 'Uploading...' : '📷 Upload Event Image'}</span>
                    </label>
                    
                    {eventImagePreview && (
                      <div className="image-preview">
                        <img src={eventImagePreview} alt="Preview" />
                        <button 
                          type="button" 
                          className="remove-image"
                          onClick={() => {
                            setNewEvent({...newEvent, image: ''});
                            setEventImagePreview(null);
                          }}
                        >
                          ✕
                        </button>
                      </div>
                    )}
                  </div>

                  <textarea
                    className="form-field"
                    placeholder="Event Description"
                    value={newEvent.desc}
                    onChange={(e) => setNewEvent({...newEvent, desc: e.target.value})}
                    rows="4"
                  />
                  
                  <div className="form-actions">
                    <label className="toggle-container">
                      <input
                        type="checkbox"
                        checked={newEvent.availability}
                        onChange={(e) => setNewEvent({...newEvent, availability: e.target.checked})}
                      />
                      <span className="toggle-switch"></span>
                      Show on Events Page
                    </label>
                    <button type="submit" className="btn-primary" disabled={uploadingEventImage}>
                      Add Event ✨
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* LIST */}
            <div className="admin-card">
              <div className="card-header">
                <h2 className="card-title">
                  {activeTab === 'services' 
                    ? `Services Management (${services.length})` 
                    : `Events Management (${events.length})`
                  }
                </h2>
              </div>
              {loading ? (
                <div className="loading-state">Loading...</div>
              ) : (activeTab === 'services' ? services.length : events.length) === 0 ? (
                <div className="empty-state">
                  <h3>No {activeTab === 'services' ? 'Services' : 'Events'}</h3>
                  <p>Add your first {activeTab === 'services' ? 'service' : 'event'}</p>
                </div>
              ) : (
                <div className="services-list">
                  {(activeTab === 'services' ? services : events).map((item) => (
                    <div key={item._id} className="service-item">
                      {activeTab === 'events' && item.image && (
                        <div className="service-image-small">
                          <img src={`http://localhost:5000/uploads/${item.image}`} alt={item.title} />
                        </div>
                      )}
                      <div className="service-info">
                        <h3 className="service-title">{item.title}</h3>
                        <p className="service-description">{item.desc}</p>
                        <div className="service-price">₹{item.price?.toLocaleString()}</div>
                      </div>
                      <div className="service-actions">
                        <label className="toggle-container">
                          <input
                            type="checkbox"
                            checked={item.availability}
                            onChange={() => toggleItem(item._id, item.availability, activeTab === 'events')}
                          />
                          <span className="toggle-switch"></span>
                        </label>
                        <button className="btn-danger" onClick={() => deleteItem(item._id, activeTab === 'events')}>
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
}
