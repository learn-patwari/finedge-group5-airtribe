const Transaction = require("../models/transaction");

async function addCreditTransaction(data) {
  if (data.type !== "credit") {
    throw new Error("Invalid transaction type for credit");
  }

  const transaction = new Transaction(data);
  await transaction.save();
  return transaction;
}

async function getAllCreditTransactions() {
  return await Transaction.find({ type: "credit" });
}

module.exports = {
  addCreditTransaction,
  getAllCreditTransactions,
};