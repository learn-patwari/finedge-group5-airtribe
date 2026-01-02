const Transaction = require("../models/transaction");

async function addTransferTransaction(data) {
  if (data.type !== "transfer") {
    throw new Error("Invalid transaction type for transfer");
  }

  if (!data.transferAccount) {
    throw new Error("Transfer account is required for transfer transactions");
  }

  const transaction = new Transaction(data);
  await transaction.save();
  return transaction;
}

async function getAllTransferTransactions() {
  return await Transaction.find({ type: "transfer" });
}

module.exports = {
  addTransferTransaction,
  getAllTransferTransactions,
};