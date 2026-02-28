// src/models/transaction.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Transaction = sequelize.define("Transaction", {
  from_account: { type: DataTypes.STRING, allowNull: false },
  to_account: { type: DataTypes.STRING, allowNull: false },
  amount: { type: DataTypes.DECIMAL, allowNull: false },
  status: {
    type: DataTypes.ENUM("PENDING", "SUCCESS", "FAILED"),
    defaultValue: "PENDING"
  },
}, { timestamps: true });

module.exports = Transaction;