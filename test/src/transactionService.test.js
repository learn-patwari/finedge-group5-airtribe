const transactionService = require("../../src/services/transactionService");
const Transaction = require("../../src/models/transaction");

jest.mock("../../src/models/transaction");

describe("Transaction Service", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getTransactionById", () => {
    it("should return a transaction by ID", async () => {
      const transaction = { id: "123", type: "credit" };
      Transaction.findById.mockResolvedValue(transaction);

      const result = await transactionService.getTransactionById("123");

      expect(result).toEqual(transaction);
      expect(Transaction.findById).toHaveBeenCalledWith("123");
    });

    it("should return null if transaction not found", async () => {
      Transaction.findById.mockResolvedValue(null);

      const result = await transactionService.getTransactionById("123");

      expect(result).toBeNull();
      expect(Transaction.findById).toHaveBeenCalledWith("123");
    });
  });

  describe("deleteTransaction", () => {
    it("should delete a transaction successfully", async () => {
      const transaction = { id: "123", type: "credit" };
      Transaction.findByIdAndDelete.mockResolvedValue(transaction);

      const result = await transactionService.deleteTransaction("123");

      expect(result).toEqual(transaction);
      expect(Transaction.findByIdAndDelete).toHaveBeenCalledWith("123");
    });

    it("should throw an error if transaction not found", async () => {
      Transaction.findByIdAndDelete.mockResolvedValue(null);

      await expect(transactionService.deleteTransaction("123")).rejects.toThrow("Transaction not found");
    });
  });

  describe("updateTransaction", () => {
    it("should update a transaction successfully", async () => {
      const transaction = { id: "123", type: "credit", amount: 100 };
      const updatedData = { amount: 200 };
      const updatedTransaction = { ...transaction, ...updatedData };

      Transaction.findById.mockResolvedValue(transaction);
      transaction.save = jest.fn().mockResolvedValue(updatedTransaction);

      await transactionService.updateTransaction("123", updatedData);

      expect(Transaction.findById).toHaveBeenCalledWith("123");
      expect(transaction.save).toHaveBeenCalled();
    });

    it("should throw an error if transaction not found", async () => {
      Transaction.findById.mockResolvedValue(null);

      await expect(transactionService.updateTransaction("123", { amount: 200 })).rejects.toThrow("Transaction not found");
    });
  });

  describe("getAllTransactions", () => {
    it("should return all transactions", async () => {
      const transactions = [
        { id: "1", type: "credit" },
        { id: "2", type: "debit" },
      ];
      Transaction.find.mockResolvedValue(transactions);

      const result = await transactionService.getAllTransactions();

      expect(result).toEqual(transactions);
      expect(Transaction.find).toHaveBeenCalled();
    });
  });
});