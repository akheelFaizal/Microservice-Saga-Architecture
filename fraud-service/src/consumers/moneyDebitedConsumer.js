const { getChannel, publish } = require("../config/rabbitmq");

async function startMoneyDebitedConsumer () {
    const channel = await getChannel();
    
    channel.consume("MoneyDebited", (msg) => {
        if(!msg) return;
        const data = JSON.parse(msg.content.toString());
        console.log(`Money Debited: ${data.amount}`);
        const FRAUD_LIMIT = 1000;
        if (data.amount > FRAUD_LIMIT) {
            console.log("Fraud Detected");
            publish("FraudDetected", data);
        } else {
            console.log("Fraud Cleared");
            publish("FraudCleared", data);
        }
        channel.ack(msg);
    });
    console.log("MoneyDebited consumer started");

}

module.exports = { startMoneyDebitedConsumer  };