require("dotenv").config();
const {startMoneyDebitedConsumer} = require("./src/consumers/moneyDebitedConsumer");
const { connect } = require("./src/config/rabbitmq");

async function start() {
    await connect();
    await startMoneyDebitedConsumer();
}

start();