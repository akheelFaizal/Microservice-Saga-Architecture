const { getChannel } = require("../config/rabbitmq");
const Transaction = require("../models/transaction");

async function startConsumer() {
    const channel = await getChannel();
    const exchange = "TransferEvents";
    const queueName = "Transaction_Queue";

    await channel.assertExchange(exchange, "fanout", { durable: true });
    await channel.assertQueue(queueName, { durable: true });
    await channel.bindQueue(queueName, exchange, "");

    channel.consume(queueName, async (msg) => {
        if (!msg) return;
        const data = JSON.parse(msg.content.toString());
        console.log(`📥 Received ${data.status} event for transaction ${data.transactionId}`);
        
        await Transaction.update(
            { status: data.status },
            { where: { id: data.transactionId } }
        );
        channel.ack(msg);
    });
    console.log(`Transaction consumer started on ${queueName}`);
}

module.exports = { startConsumer };