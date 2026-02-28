require("dotenv").config();
const { startNotificationConsumers } = require("./src/consumers/notificationConsumer");
const { connect } = require("./src/config/rabbitmq");

async function start() {
    await connect();
    await startNotificationConsumers();
    console.log("🚀 Notification Service Running");
}

start();
