// src/controllers/transactionController.js
const Transaction = require("../models/transaction");
const rabbitmq = require("../config/rabbitmq"); // connection helper

async function transfer(req, res) {
  try {
    const { fromAccountId, toAccountId, amount } = req.body;

    // 1️⃣ Create transaction with PENDING
    const transaction = await Transaction.create({
      from_account: fromAccountId,
      to_account: toAccountId,
      amount,
      status: "PENDING",
    });

    // 2️⃣ Publish event to RabbitMQ
    const event = {
      transactionId: transaction.id,
      fromAccountId,
      toAccountId,
      amount,
    };

    await rabbitmq.publish("TransferInitiated", event);

    res.json({ transaction, message: "Transfer initiated, saga started." });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

module.exports = { transfer };