// ✅ FIXED Event.js model
import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  desc: { type: String, required: false },
  image: { type: String, required: false },
  price: { type: Number, required: true },
  availability: { type: Boolean, default: true },
  
  // ✅ MAKE THESE OPTIONAL for admin
  eventDate: { type: Date, required: false },
  eventType: { type: String, required: false },
  email: { type: String, required: false },
  name: { type: String, required: false }
}, { timestamps: true });

export default mongoose.model('Event', eventSchema);
