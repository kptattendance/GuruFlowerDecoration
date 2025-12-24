import express from 'express';
import Testimonial from '../models/Testimonial.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const testimonials = await Testimonial.find().sort({ createdAt: -1 }).limit(10);
  res.json(testimonials);
});

router.post('/', async (req, res) => {
  const testimonial = new Testimonial(req.body);
  await testimonial.save();
  res.json({ success: true });
});

export default router;
