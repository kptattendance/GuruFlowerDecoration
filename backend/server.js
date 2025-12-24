import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

import testimonialRoutes from "./routes/testimonials.js";
import serviceRoutes from "./routes/serviceRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import deleteRoutes from "./routes/deleteRoutes.js";
import bookingsRoutes from "./routes/bookingsRoutes.js";

import multer from "multer";
import nodemailer from "nodemailer";
import path from "path";

dotenv.config();
connectDB();

/* ---------------- DEBUG ENV ---------------- */
console.log("GMAIL_USER:", process.env.GMAIL_USER ? "SET" : "MISSING");
console.log("GMAIL_PASS:", process.env.GMAIL_PASS ? "SET" : "MISSING");
console.log("ADMIN_EMAIL:", process.env.ADMIN_EMAIL);

/* ---------------- EXPRESS APP ---------------- */
const app = express();

/* ---------------- MIDDLEWARE ---------------- */
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use("/uploads", express.static("uploads"));

/* ---------------- EMAIL SETUP ---------------- */
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS, // MUST be App Password
  },
});

// Verify email on startup
transporter.verify((error) => {
  if (error) {
    console.log("❌ GMAIL ERROR:", error.message);
  } else {
    console.log("✅ GMAIL READY!");
  }
});

/* ---------------- GLOBAL APP CONFIG ---------------- */
app.set("transporter", transporter);
app.set("ADMIN_EMAIL", process.env.ADMIN_EMAIL || "admin@flowerdecor.com");

/* ---------------- FILE UPLOAD ---------------- */
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

app.post("/api/upload", upload.single("image"), (req, res) => {
  res.json({ filename: req.file.filename });
});

/* ---------------- ROOT ---------------- */
app.get("/", (req, res) => {
  res.send("API is running 🚀");
});

/* ---------------- ROUTES ---------------- */
app.use("/api/services", serviceRoutes);
app.use("/api/testimonials", testimonialRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/delete", deleteRoutes);
app.use("/api/bookings", bookingsRoutes);

/* ---------------- START SERVER ---------------- */
app.listen(5000, () => {
  console.log("Server running on port 5000 ✅");
});
