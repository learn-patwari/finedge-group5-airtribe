const creditService = require("../services/creditService");
const debitService = require("../services/debitService");
const transferService = require("../services/transferService");
const transactionService = require("../services/transactionService");

async function create(req, res, next) {
  try {
    const { type } = req.body;

    let result;
    if (type === "credit") {
      result = await creditService.addCreditTransaction(req.body);
    } else if (type === "debit") {
      result = await debitService.addDebitTransaction(req.body);
    } else if (type === "transfer") {
      result = await transferService.addTransferTransaction(req.body);
    } else {
      throw new Error("Unsupported transaction type");
    }

    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
}

async function getAll(req, res, next) {
  try {
    const { type } = req.query;

    let result;
    if (type === "credit") {
      result = await creditService.getAllCreditTransactions();
    } else if (type === "debit") {
      result = await debitService.getAllDebitTransactions();
    } else if (type === "transfer") {
      result = await transferService.getAllTransferTransactions();
    } else {
      result = await transactionService.getAllTransactions();
    }

    res.json(result);
  } catch (err) {
    next(err);
  }
}

async function update(req, res, next) {
  try {
    const { id } = req.params;
    const updatedTransaction = await transactionService.updateTransaction(id, req.body);
    res.json(updatedTransaction);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  create,
  getAll,
  update
};