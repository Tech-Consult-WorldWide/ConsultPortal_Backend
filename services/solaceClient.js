const solace = require("solclientjs");

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
    });

    this.session.on(solace.SessionEventCode.CONNECT_FAILED_ERROR, (error) => {
      console.error("Failed to connect to Solace:", error);
    });

    this.session.on(solace.SessionEventCode.DISCONNECTED, () => {
      console.log("Disconnected from Solace Cloud");
      this.isConnected = false;
    });

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