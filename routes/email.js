const express = require("express");
const { sendEmail } = require("../services/emailService");

const router = express.Router();

router.post("/send-appointment", async (req, res) => {
  const { expertEmail, clientEmail, appointmentDetails } = req.body;

  try {
    // Send emails to expert and client
    await sendEmail(
      expertEmail,
      "Appointment Confirmation",
      `Hello Expert,\n\nYou have a new appointment:\n\n${appointmentDetails}`
    );

    await sendEmail(
      clientEmail,
      "Appointment Confirmation",
      `Hello Client,\n\nYour appointment is confirmed:\n\n${appointmentDetails}`
    );

    res.status(200).send("Emails sent successfully.");
  } catch (error) {
    console.error("Error sending emails:", error);
    res.status(500).send("Error sending emails.");
  }
});

module.exports = router;