const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
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

// Create HTTP server and Socket.io server
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Or your actual frontend URL
  },
});

io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);

  socket.on("joinChat", (conversationId) => {
    socket.join(conversationId);
    console.log(`Socket ${socket.id} joined room ${conversationId}`);
  });

  // (We’ll fill this out in Step 3 to tie into Solace publish if wanted)
  socket.on("sendMessage", (data) => {
    console.log("Received 'sendMessage' from client:", data);
    // e.g. { conversationId, senderId, message }
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

// Start the server
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

module.exports = { io }; // Export io if you need it in other files