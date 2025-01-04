const express = require("express");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const port = 9000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Set up nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail", // or another email service
  auth: {
    user: "umerqamar0333@gmail.com", // Your email
    pass: "kgjm ieyo gcts ovbx",   // Your email password or app password
  },
});

// Function to send confirmation email
const sendConfirmationEmail = async (to, subject, text) => {
  const mailOptions = {
    from: "umerqamar0333@gmail.com",  // sender address
    to,                           // receiver address
    subject,                      // subject
    text,                         // email body
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

// API endpoint to send appointment confirmation
app.post("/send-appointment", async (req, res) => {
  const { expertEmail, clientEmail, appointmentDetails } = req.body;

  try {
    await sendConfirmationEmail(expertEmail, "Appointment Confirmation", `Hello Expert,\n\nYou have a new appointment:\n\n${appointmentDetails}`);
    await sendConfirmationEmail(clientEmail, "Appointment Confirmation", `Hello Client,\n\nYour appointment is confirmed:\n\n${appointmentDetails}`);

    res.status(200).send("Emails sent successfully");
  } catch (error) {
    res.status(500).send("Error sending emails");
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
