// consumers/notificationConsumer.js

const { getChannel } = require("../config/rabbitmq");

async function startNotificationConsumers() {
  const channel = await getChannel();

  const exchange = "TransferEvents";
  await channel.assertExchange(exchange, "fanout", { durable: true });

  // Dedicated queue for notification service
  const queueName = "Notification_Queue";
  await channel.assertQueue(queueName, { durable: true });
  await channel.bindQueue(queueName, exchange, "");

  console.log(`Bound ${queueName} to ${exchange}`);

  channel.consume(queueName, async (msg) => {
    console.log("📥 Received event on Notification_Queue");
    if (!msg) return;

    const data = JSON.parse(msg.content.toString());
    console.log("📦 Event data:", data);

    if (data.status === "SUCCESS") {
        console.log("✅ Transaction Completed:", data.transactionId);
        console.log(`📧 Email sent: Your transaction ${data.transactionId} was successful.`);
    } else {
        console.log("❌ Transaction Failed:", data.transactionId);
        console.log(`📧 Email sent: Your transaction ${data.transactionId} failed.`);
    }

    channel.ack(msg);
  });

  console.log("🔔 Notification consumers started...");
}

module.exports = { startNotificationConsumers };