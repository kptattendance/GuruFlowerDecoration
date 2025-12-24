import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phoneNumber: { type: String },  // ✅ Added
    eventType: { type: String, required: true },
    eventDate: { type: Date, required: true },
    venue: { type: String },
    guests: { type: String },
    budget: { type: String },
    floralStyle: [String],
    message: String,
  },
  { timestamps: true }
);

export default mongoose.model("Booking", bookingSchema);
