const analyticsController = require("../../src/controllers/analyticsController");
const analytics = require("../../src/utils/analytics");

jest.mock("../../src/utils/analytics");

describe("analyticsController", () => {
  describe("filterTransactions", () => {
    it("should filter transactions by category", async () => {
      analytics.filterTransactions.mockResolvedValue([{ id: "1", category: "groceries" }]);

      const req = { query: { category: "groceries" } };
      const res = { json: jest.fn() };
      const next = jest.fn();

      await analyticsController.filterTransactions(req, res, next);

      expect(analytics.filterTransactions).toHaveBeenCalledWith({ category: "groceries" });
      expect(res.json).toHaveBeenCalledWith([{ id: "1", category: "groceries" }]);
    });
  });

  describe("calculateTotals", () => {
    it("should calculate totals", async () => {
      analytics.calculateTotals.mockResolvedValue({ totalIncome: 1000, totalExpenses: 500, balance: 500 });

      const req = {};
      const res = { json: jest.fn() };
      const next = jest.fn();

      await analyticsController.calculateTotals(req, res, next);

      expect(analytics.calculateTotals).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({ totalIncome: 1000, totalExpenses: 500, balance: 500 });
    });
  });
});