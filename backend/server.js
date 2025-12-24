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

dotenv.config();
connectDB();

const app = express();

/* MIDDLEWARE */
app.use(cors());
app.use(express.json({ limit: "50mb" }));

/* EMAIL */
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

app.set("transporter", transporter);
app.set("ADMIN_EMAIL", process.env.ADMIN_EMAIL);

/* UPLOAD */
const storage = multer.diskStorage({
  destination: "/tmp",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

app.post("/api/upload", upload.single("image"), (req, res) => {
  res.json({ filename: req.file.filename });
});

/* ROUTES */
app.use("/api/services", serviceRoutes);
app.use("/api/testimonials", testimonialRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/delete", deleteRoutes);
app.use("/api/bookings", bookingsRoutes);

/* ROOT */
app.get("/", (req, res) => {
  res.send("API is running on Vercel 🚀");
});

/* ✅ EXPORT (NO app.listen) */
export default app;
