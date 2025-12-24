import mongoose from 'mongoose';

const TestimonialSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: String,
  rating: { type: Number, required: true, min: 1, max: 5 },
  message: String,
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Testimonial', TestimonialSchema);
