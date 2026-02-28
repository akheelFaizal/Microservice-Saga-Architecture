require("dotenv").config();
const app = require("./app");
const sequelize = require("./src/config/db");
const { startConsumer } = require("./src/consumers/transferComplete");

const PORT = process.env.PORT;

(async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connected!");
    await sequelize.sync({ alter: true }); // creates table if not exists
    await startConsumer();
    app.listen(PORT, () => console.log(`Transaction Service running on port ${PORT}`));
  } catch (err) {
    console.error("Initialization Failed:", err);
  }
})();
