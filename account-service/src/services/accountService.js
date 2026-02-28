const Account = require("../models/account");

class AccountService {
  static async createAccount(user_id, balance = 0) {
    return await Account.create({ user_id, balance });
  }

  static async getAccount(id) {
    const account = await Account.findByPk(id);
    if (!account) throw new Error("Account not found");
    return account;
  }

  static async debit(id, amount) {
    const account = await this.getAccount(id);
    if (account.balance < amount) throw new Error("Insufficient balance");
    account.balance -= amount;
    await account.save();
    return account;
  }

  static async credit(id, amount) {
    const account = await this.getAccount(id);
    account.balance += amount;
    await account.save();
    return account;
  }
}

module.exports = AccountService;