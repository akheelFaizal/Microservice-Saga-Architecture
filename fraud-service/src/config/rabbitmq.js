const amqp = require("amqplib");
let channel;

async function connect() {
    const conn = await amqp.connect({
        protocol: "amqp",
        hostname: process.env.RABBITMQ_HOST,
        port: process.env.RABBITMQ_PORT,
        username: process.env.RABBITMQ_USER,
        password: process.env.RABBITMQ_PASS,
    });
    channel = await conn.createChannel();
}

async function getChannel() {
    if (!channel) await connect();
    return channel;
}

async function publish(queue, message) {
    if (!channel) await connect();
    await channel.assertQueue(queue, { durable: true });
    channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));
}

module.exports = { publish, getChannel, connect };
 