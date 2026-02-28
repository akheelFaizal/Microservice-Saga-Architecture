const express = require("express");
const bodyParser = require("body-parser");
const accountRoutes = require("./src/controllers/accountController");

const app = express();
app.use(bodyParser.json());

app.use("/account", accountRoutes);

module.exports = app;