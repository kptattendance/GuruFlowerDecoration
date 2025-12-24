import express from "express";
import mongoose from "mongoose";
import Event from "../models/Event.js";
import fs from "fs";
import path from "path";

const router = express.Router();

router.delete("/events/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid Event ID" });
    }

    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // delete image if exists
    if (event.image) {
      const imgPath = path.join("uploads", event.image);
      if (fs.existsSync(imgPath)) {
        fs.unlinkSync(imgPath);
      }
    }

    await Event.findByIdAndDelete(id);

    res.json({ message: "Event deleted successfully" });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ message: "Delete failed" });
  }
});

export default router;
