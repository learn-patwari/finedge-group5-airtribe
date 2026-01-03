const aiController = require("../../src/controllers/aiController");
const aiHelper = require("../../src/utils/aiHelper");

jest.mock("../../src/utils/aiHelper");

describe("aiController", () => {
  describe("getSavingsSuggestions", () => {
    it("should return savings suggestions", async () => {
      aiHelper.suggestSavings.mockResolvedValue({ averageExpenses: 500, suggestedSavings: 100 });

      const req = {};
      const res = { json: jest.fn() };
      const next = jest.fn();

      await aiController.getSavingsSuggestions(req, res, next);

      expect(aiHelper.suggestSavings).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({ averageExpenses: 500, suggestedSavings: 100 });
    });
  });
});