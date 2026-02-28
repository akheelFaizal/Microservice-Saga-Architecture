// src/routes/transactionRoutes.js
const express = require("express");
const router = express.Router();
const { transfer } = require("../controllers/transactionController");

router.post("/transfer", transfer);

module.exports = router;