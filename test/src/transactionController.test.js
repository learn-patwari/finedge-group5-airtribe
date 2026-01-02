const Transaction = require("../../src/models/transaction");
const transactionController = require("../../src/controllers/transactionController");
const transactionService = require("../../src/services/transactionService");
const creditService = require("../../src/services/creditService");
const debitService = require("../../src/services/debitService");
const transferService = require("../../src/services/transferService");
const aiHelper = require("../../src/utils/aiHelper");

jest.mock("../../src/models/transaction");
jest.mock("../../src/services/transactionService", () => ({
  getAllTransactions: jest.fn(),
  updateTransaction: jest.fn(),
}));
jest.mock("../../src/services/creditService", () => ({
  getAllCreditTransactions: jest.fn(),
  addCreditTransaction: jest.fn(),
}));
jest.mock("../../src/services/debitService", () => ({
  getAllDebitTransactions: jest.fn(),
  addDebitTransaction: jest.fn(),
}));
jest.mock("../../src/services/transferService", () => ({
  getAllTransferTransactions: jest.fn(),
  addTransferTransaction: jest.fn(),
}));
jest.mock("../../src/utils/aiHelper");

describe("transactionController", () => {
  describe("create", () => {
    it("should create a credit transaction", async () => {
      creditService.addCreditTransaction.mockResolvedValue({ id: "1", type: "credit" });
      aiHelper.autoCategorize.mockReturnValue("category");
      aiHelper.notifyNewTransaction.mockImplementation(() => {});

      const req = { body: { type: "credit", amount: 100 } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const next = jest.fn();

      await transactionController.create(req, res, next);

      expect(creditService.addCreditTransaction).toHaveBeenCalledWith(req.body);
      expect(aiHelper.autoCategorize).toHaveBeenCalledWith(req.body);
      expect(aiHelper.notifyNewTransaction).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ id: "1", type: "credit" });
    });

    it("should create a valid debit transaction", async () => {
      debitService.addDebitTransaction.mockResolvedValue({ id: "1", type: "debit" });
      aiHelper.notifyNewTransaction.mockImplementation(() => {});

      const req = { body: { type: "debit", amount: 50 } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const next = jest.fn();

      await transactionController.create(req, res, next);

      expect(debitService.addDebitTransaction).toHaveBeenCalledWith(req.body);
      expect(aiHelper.notifyNewTransaction).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ id: "1", type: "debit" });
    });

    it("should create a valid transfer transaction", async () => {
      transferService.addTransferTransaction.mockResolvedValue({ id: "1", type: "transfer" });
      aiHelper.notifyNewTransaction.mockImplementation(() => {});

      const req = { body: { type: "transfer", amount: 50, transferAccount: "Account123" } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const next = jest.fn();

      await transactionController.create(req, res, next);

      expect(transferService.addTransferTransaction).toHaveBeenCalledWith(req.body);
      expect(aiHelper.notifyNewTransaction).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ id: "1", type: "transfer" });
    });
    
    it("should throw an error for unsupported transaction types", async () => {
      const req = { body: { type: "unsupported", amount: 100 } };
      const res = {};
      const next = jest.fn();

      await transactionController.create(req, res, next);

      expect(next).toHaveBeenCalledWith(new Error("Unsupported transaction type"));
    });
  });

  describe("getAll", () => {
    it("should fetch all transactions", async () => {
      transactionService.getAllTransactions.mockResolvedValue([{ id: "1" }, { id: "2" }]);

      const req = { query: {} };
      const res = { json: jest.fn() };
      const next = jest.fn();

      await transactionController.getAll(req, res, next);

      expect(transactionService.getAllTransactions).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith([{ id: "1" }, { id: "2" }]);
    });

    it("should fetch all credit transactions", async () => {
      const transactions = [{ id: "1", type: "credit" }, { id: "2", type: "credit" }];
      creditService.getAllCreditTransactions.mockResolvedValue(transactions);

      const result = await creditService.getAllCreditTransactions();

      expect(result).toEqual(transactions);
      expect(result[0].type).toBe("credit");
    });
    
    it("should fetch all debit transactions", async () => {
      const transactions = [{ id: "1", type: "debit" }, { id: "2", type: "debit" }];
      debitService.getAllDebitTransactions.mockResolvedValue(transactions);

      const result = await debitService.getAllDebitTransactions();

      expect(result).toEqual(transactions);      
      expect(result[0].type).toBe("debit");
    });

    it("should fetch all transfer transactions", async () => {
      const transactions = [{ id: "1", type: "transfer" }, { id: "2", type: "transfer" }];
      transferService.getAllTransferTransactions.mockResolvedValue(transactions);

      const result = await transferService.getAllTransferTransactions();

      expect(result).toEqual(transactions);
      expect(result[0].type).toBe("transfer");
    });
  });

  describe("update", () => {
    it("should update an existing transaction", async () => {
      transactionService.updateTransaction.mockResolvedValue({ id: "1", amount: 200 });

      const req = { params: { id: "1" }, body: { amount: 200 } };
      const res = { json: jest.fn() };
      const next = jest.fn();

      await transactionController.update(req, res, next);

      expect(transactionService.updateTransaction).toHaveBeenCalledWith("1", { amount: 200 });
      expect(res.json).toHaveBeenCalledWith({ id: "1", amount: 200 });
    });
  });
});
