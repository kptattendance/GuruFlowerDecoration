import express from "express";

const router = express.Router();

/* ===============================
   CREATE BOOKING + SEND EMAILS
================================ */
router.post("/", async (req, res) => {
  try {
    const transporter = req.app.get("transporter");
    const ADMIN_EMAIL = req.app.get("ADMIN_EMAIL");

    if (!transporter) {
      throw new Error("Email transporter not configured");
    }

    const booking = req.body;

    // Basic validation (prevents silent crashes)
    if (!booking.email || !booking.name || !booking.eventType || !booking.eventDate) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const bookingId = "BK" + Date.now();

    // 🔥 WAIT for emails to be sent
    await Promise.all([
      sendEmailToUser(booking, bookingId, transporter),
      sendAdminNotification(booking, bookingId, transporter, ADMIN_EMAIL),
    ]);

    res.status(201).json({
      message: "Booking created successfully",
      bookingId,
    });
  } catch (error) {
    console.error("❌ Booking error:", error);
    res.status(500).json({ error: error.message });
  }
});

/* ===============================
   GET BOOKINGS (TEMP)
================================ */
router.get("/", (req, res) => {
  res.json([]);
});

/* ===============================
   EMAIL HELPERS (FIXED)
================================ */

async function sendEmailToUser(booking, bookingId, transporter) {
  const mailOptions = {
    from: `"Flower Decor" <${process.env.GMAIL_USER}>`,
    to: booking.email,
    subject: `🎉 Booking Confirmed! ID: ${bookingId}`,
    html: `
      <h2>Your Decoration Booking is Confirmed!</h2>
      <p><strong>Booking ID:</strong> ${bookingId}</p>
      <p><strong>Name:</strong> ${booking.name}</p>
      <p><strong>Event:</strong> ${booking.eventType}</p>
      <p><strong>Date:</strong> ${new Date(booking.eventDate).toLocaleDateString()}</p>
      <p><strong>Venue:</strong> ${booking.venue || "TBD"}</p>
      <p><strong>Guests:</strong> ${booking.guestCount || "Not specified"}</p>
      <p><strong>Budget:</strong> ${booking.budget || "Not specified"}</p>
      <p><strong>Style:</strong> ${booking.floralStyle || "Not specified"}</p>
      <p>We will contact you within 24 hours.</p>
    `,
  };

  await transporter.sendMail(mailOptions);
  console.log(`✅ Email sent to user: ${booking.email}`);
}

async function sendAdminNotification(
  booking,
  bookingId,
  transporter,
  ADMIN_EMAIL
) {
  const adminOptions = {
    from: `"Flower Decor" <${process.env.GMAIL_USER}>`,
    to: ADMIN_EMAIL,
    subject: `📩 New Booking Received - ${bookingId}`,
    html: `
      <h2>New Booking Received</h2>
      <p><strong>ID:</strong> ${bookingId}</p>
      <p><strong>Name:</strong> ${booking.name}</p>
      <p><strong>Email:</strong> ${booking.email}</p>
      <p><strong>Phone:</strong> ${booking.phoneNumber || "N/A"}</p>
      <p><strong>Event:</strong> ${booking.eventType}</p>
      <p><strong>Date:</strong> ${new Date(booking.eventDate).toLocaleDateString()}</p>
      <p><strong>Guests:</strong> ${booking.guestCount || "N/A"}</p>
      <p><strong>Budget:</strong> ${booking.budget || "N/A"}</p>
    `,
  };

  await transporter.sendMail(adminOptions);
  console.log("✅ Admin email sent");
}

export default router;
