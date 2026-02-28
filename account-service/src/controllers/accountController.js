const express = require("express");
const router = express.Router();
const AccountService = require("../services/accountService");

router.post("/", async (req, res) => {
  try {
    const { user_id, balance } = req.body;
    const account = await AccountService.createAccount(user_id, balance);
    res.json(account);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const account = await AccountService.getAccount(req.params.id);
    res.json(account);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/debit", async (req, res) => {
  try {
    const { accountId, amount } = req.body;
    const updated = await AccountService.debit(accountId, amount);
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.post("/credit", async (req, res) => {
  try {
    const { accountId, amount } = req.body;
    const updated = await AccountService.credit(accountId, amount);
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;