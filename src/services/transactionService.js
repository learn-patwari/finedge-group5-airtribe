const Transaction = require("../models/transaction");

async function getTransactionById(id) {
  return await Transaction.findById(id);
}

async function deleteTransaction(id) {
  const transaction = await Transaction.findByIdAndDelete(id);
  if (!transaction) {
    throw new Error("Transaction not found");
  }
  return transaction;
}

async function updateTransaction(id, data) {
  const transaction = await Transaction.findById(id);

  if (!transaction) {
    throw new Error("Transaction not found");
  }

  // Update only the fields provided in the data object
  Object.keys(data).forEach((key) => {
    transaction[key] = data[key];
  });

  await transaction.save();
  return transaction;
}

async function getAllTransactions() {
  return await Transaction.find();
}

module.exports = {
  getTransactionById,
  deleteTransaction,
  getAllTransactions,
  updateTransaction
};