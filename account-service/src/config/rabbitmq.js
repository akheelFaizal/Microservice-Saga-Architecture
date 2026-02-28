const amqp = require("amqplib");

let channel;

async function connectRabbitMQ() {
  const connection = await amqp.connect({
    protocol: "amqp",
    hostname: process.env.RABBITMQ_HOST,
    port: process.env.RABBITMQ_PORT,
    username: process.env.RABBITMQ_USER,
    password: process.env.RABBITMQ_PASS,
  });

  channel = await connection.createChannel();
  await channel.assertQueue("TransferInitiated", { durable: true });
  await channel.assertQueue("TransferCompleted", { durable: true });
  await channel.assertQueue("MoneyDebited", { durable: true });
  await channel.assertQueue("FraudDetected", { durable: true });
  await channel.assertQueue("FraudCleared", { durable: true });
  console.log("RabbitMQ connected and queue asserted");
}

async function getChannel() {
  if (!channel) await connectRabbitMQ();
  return channel;
}

module.exports = { connectRabbitMQ, getChannel };