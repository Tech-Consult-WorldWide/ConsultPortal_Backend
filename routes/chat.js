const express = require("express");
const solaceClient = require("../services/solaceClient");

const router = express.Router();

router.post("/send-message", (req, res) => {
  const { conversationId, senderId, message } = req.body;

  try {
    const topic = `app/chat/${conversationId}`;
    const eventMessage = {
      conversationId,
      senderId,
      message,
      timestamp: new Date().toISOString(),
    };
    solaceClient.publish(topic, eventMessage);

    res.status(200).send("Message sent successfully.");
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).send("Error sending message.");
  }
});

module.exports = router;