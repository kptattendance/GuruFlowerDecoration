import express from 'express';
import Service from '../models/Service.js';
import Testimonial from '../models/Testimonial.js';

const router = express.Router();

router.get('/stats', async (req, res) => {
  const services = await Service.countDocuments();
  const testimonials = await Testimonial.countDocuments();
  res.json({ services, testimonials });
});

router.get('/services', async (req, res) => {
  const services = await Service.find();
  res.json(services);
});

router.post('/services', async (req, res) => {
  const service = new Service(req.body);
  await service.save();
  res.json(service);
});

router.put('/services/:id', async (req, res) => {
  const service = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(service);
});

router.delete('/services/:id', async (req, res) => {
  await Service.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

export default router;
