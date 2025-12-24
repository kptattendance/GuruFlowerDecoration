import express from "express";
import Service from "../models/Service.js";

const router = express.Router();

/* GET ALL SERVICES */
router.get("/services", async (req, res) => {
  try {
    const services = await Service.find().sort({ createdAt: -1 });
    res.json(services);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch services" });
  }
});

/* ADD SERVICE */
router.post("/services", async (req, res) => {
  try {
    const service = new Service(req.body);
    await service.save();
    res.status(201).json(service);
  } catch (err) {
    console.error("Service save error:", err);
    res.status(500).json({ message: err.message });
  }
});

/* UPDATE AVAILABILITY */
router.put("/services/:id", async (req, res) => {
  try {
    await Service.findByIdAndUpdate(req.params.id, req.body);
    res.json({ message: "Updated" });
  } catch (err) {
    res.status(500).json({ message: "Update failed" });
  }
});

/* DELETE SERVICE */
router.delete("/services/:id", async (req, res) => {
  try {
    await Service.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed" });
  }
});

export default router;
