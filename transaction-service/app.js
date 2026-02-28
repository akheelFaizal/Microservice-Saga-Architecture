const express = require("express");
const bodyParser = require("body-parser");
const transactionRoutes = require("./src/routes/transactionRoutes");

const app = express();
app.use(bodyParser.json());

app.use("/transaction", transactionRoutes);

module.exports = app;
