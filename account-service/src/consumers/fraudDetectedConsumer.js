const { getChannel } = require("../config/rabbitmq");
const AccountService = require("../services/accountService");

async function startFraudDetectedConsumer() {
  const channel = await getChannel();

  channel.consume("FraudDetected", async (msg) => {
    if (!msg) return;

    const data = JSON.parse(msg.content.toString());

    // Compensation: refund sender
    await AccountService.credit(data.fromAccountId, data.amount);

    console.log(`📤 Broadcasting TransferFailed via Exchange: ${data.transactionId}`);
    
    const exchange = "TransferEvents";
    await channel.assertExchange(exchange, "fanout", { durable: true });

    channel.publish(
      exchange,
      "",
      Buffer.from(JSON.stringify({
        transactionId: data.transactionId,
        status: "FAILED"
      }))
    );

    channel.ack(msg);
  });

  console.log("FraudDetected consumer started");
}

module.exports = { startFraudDetectedConsumer };