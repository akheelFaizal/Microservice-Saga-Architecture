require("dotenv").config();
const app = require("./app");
const sequelize = require("./src/config/db");
const { connectRabbitMQ } = require("./src/config/rabbitmq");
const { startConsumer } = require("./src/consumers/transferConsumer");
const { startFraudClearedConsumer } = require("./src/consumers/fraudClearedConsumer");
const { startFraudDetectedConsumer } = require("./src/consumers/fraudDetectedConsumer");

const PORT = process.env.PORT || 3000;

(async () => {
  try { 
    await sequelize.authenticate();
    console.log("Database connected!");
    await sequelize.sync(); // creates table if not exists
      // 2️⃣ Connect RabbitMQ
    await connectRabbitMQ();

    // 3️⃣ Start consumers
    await startConsumer();
    await startFraudClearedConsumer();
    await startFraudDetectedConsumer();
    app.listen(PORT, () => console.log(`Account Service running on port ${PORT}`));
  } catch (err) {
    console.error("Unable to connect to DB", err);
  }
})();
