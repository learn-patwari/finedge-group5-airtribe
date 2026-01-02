const Transaction = require("../models/transaction");

async function addDebitTransaction(data) {
  if (data.type !== "debit") {
    throw new Error("Invalid transaction type for debit");
  }

  const transaction = new Transaction(data);
  await transaction.save();
  return transaction;
}

async function getAllDebitTransactions() {
  return await Transaction.find({ type: "debit" });
}

module.exports = {
  addDebitTransaction,
  getAllDebitTransactions,
};