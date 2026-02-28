const { getChannel } = require("../config/rabbitmq");
const AccountService = require("../services/accountService");

async function startConsumer() {
    const channel = await getChannel();

    channel.consume("TransferInitiated", async (msg) => {
    const data = JSON.parse(msg.content.toString());
    try {
        await AccountService.debit(data.fromAccountId, data.amount);
        channel.sendToQueue(
            "MoneyDebited",
            Buffer.from(JSON.stringify(data))
        );
        channel.ack(msg);

    } catch (err) {
      console.log(err);
    }
    });

    console.log("TransferInitiated consumer started");
}

module.exports = { startConsumer };