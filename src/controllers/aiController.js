const aiHelper = require("../utils/aiHelper");

async function getSavingsSuggestions(req, res, next) {
  try {
    const suggestions = await aiHelper.suggestSavings();
    res.json(suggestions);
  } catch (err) {
    next(err);
  }
}

module.exports = { getSavingsSuggestions };