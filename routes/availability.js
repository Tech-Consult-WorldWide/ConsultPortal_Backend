const express = require("express");
const solaceClient = require("../services/solaceClient");

const router = express.Router();

router.post("/update-availability", (req, res) => {
  const { expertId, status } = req.body;

  try {
    const topic = `app/expert/status/${expertId}`;
    const eventMessage = {
      expertId,
      status,
      timestamp: new Date().toISOString(),
    };
    solaceClient.publish(topic, eventMessage);

    res.status(200).send("Availability updated successfully.");
  } catch (error) {
    console.error("Error updating availability:", error);
    res.status(500).send("Error updating availability.");
  }
});

module.exports = router;