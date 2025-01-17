//--------------------------------------------
// services/solaceClient.js
//--------------------------------------------
const solace = require("solclientjs");
// Import the `io` we exported in server.js
const { io } = require("../server"); 

class SolaceClient {
  constructor() {
    this.session = null;
    this.isConnected = false;
  }

  connect() {
    if (this.session) return;

    solace.SolclientFactory.init({});
    this.session = solace.SolclientFactory.createSession({
      url: process.env.SOLACE_URL,
      vpnName: process.env.SOLACE_VPN,
      userName: process.env.SOLACE_USERNAME,
      password: process.env.SOLACE_PASSWORD,
    });

    this.session.on(solace.SessionEventCode.UP_NOTICE, () => {
      console.log("Connected to Solace Cloud");
      this.isConnected = true;

      // Subscribe to a wildcard topic to receive all chat messages
      // so we can re-broadcast to Socket.io
      this.session.subscribe(
        solace.SolclientFactory.createTopicDestination("app/chat/>"),
        true,   // request confirmation
        "chat-subscription",
        10000   // timeout
      );
    });

    this.session.on(solace.SessionEventCode.CONNECT_FAILED_ERROR, (error) => {
      console.error("Failed to connect to Solace:", error);
    });

    this.session.on(solace.SessionEventCode.DISCONNECTED, () => {
      console.log("Disconnected from Solace Cloud");
      this.isConnected = false;
    });

    this.session.on(solace.SessionEventCode.MESSAGE, (message) => {
      // This runs whenever a message arrives on subscribed topics
      try {
        const dataStr = message.getBinaryAttachment();
        const data = JSON.parse(dataStr);

        // For example, data = { conversationId, senderId, message, timestamp }
        if (data.conversationId) {
          // Broadcast it to all connected sockets in that "room"
          io.to(data.conversationId).emit("chatMessage", data);
        }
      } catch (err) {
        console.error("Error parsing incoming Solace message:", err);
      }
    });

    // Finally connect
    this.session.connect();
  }

  publish(topic, message) {
    if (!this.isConnected) {
      console.error("Cannot publish. Solace session not connected.");
      return;
    }

    try {
      const solaceMessage = solace.SolclientFactory.createMessage();
      solaceMessage.setDestination(
        solace.SolclientFactory.createTopicDestination(topic)
      );
      solaceMessage.setBinaryAttachment(JSON.stringify(message));
      solaceMessage.setDeliveryMode(solace.MessageDeliveryModeType.DIRECT);
      this.session.send(solaceMessage);
      console.log(`Published to topic "${topic}":`, message);
    } catch (error) {
      console.error("Error publishing to Solace:", error);
    }
  }
}

const solaceClient = new SolaceClient();
solaceClient.connect();

module.exports = solaceClient;