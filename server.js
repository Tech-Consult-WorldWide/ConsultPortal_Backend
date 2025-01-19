const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();

const availabilityRoutes = require("./routes/availability");
const chatRoutes = require("./routes/chat");
const emailRoutes = require("./routes/email");

const app = express();
const port = process.env.PORT || 9000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use(availabilityRoutes);
app.use(chatRoutes);
app.use(emailRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});