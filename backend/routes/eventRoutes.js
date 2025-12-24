import express from "express";
import mongoose from "mongoose";
import Event from "../models/Event.js";

const router = express.Router();

/* GET ALL EVENTS */
router.get("/", async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (error) {
    console.error("Fetch events error:", error);
    res.status(500).json({ message: "Failed to fetch events" });
  }
});

/* GET SINGLE EVENT BY ID */
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // ✅ HARD GUARD (PREVENTS ARRAY / OBJECT)
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid Event ID" });
    }

    const event = await Event.findById(id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.json(event);
  } catch (error) {
    console.error("Get event error:", error);
    res.status(500).json({ message: "Failed to fetch event" });
  }
});

/* ADD EVENT */
router.post("/", async (req, res) => {
  try {
    const event = new Event(req.body);
    await event.save();
    res.status(201).json({ message: "Event added successfully", event });
  } catch (error) {
    console.error("Event add error:", error);
    res.status(500).json({ message: "Failed to add event" });
  }
});

export default router;
