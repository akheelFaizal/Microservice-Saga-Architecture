const { getChannel } = require("../config/rabbitmq");
const AccountService = require("../services/accountService");

async function startFraudClearedConsumer() {
  const channel = await getChannel();

  channel.consume("FraudCleared", async (msg) => {
    if (!msg) return;

    const data = JSON.parse(msg.content.toString());

    await AccountService.credit(data.toAccountId, data.amount); 

    console.log(`📤 Broadcasting TransferCompleted via Exchange: ${data.transactionId}`);
    
    const exchange = "TransferEvents";
    await channel.assertExchange(exchange, "fanout", { durable: true });
    
    channel.publish(
      exchange,
      "", // routing key (ignored by fanout)
      Buffer.from(JSON.stringify({
        transactionId: data.transactionId,
        status: "SUCCESS"
      }))
    );

    channel.ack(msg);
  });

  console.log("FraudCleared consumer started");
}

module.exports = { startFraudClearedConsumer };