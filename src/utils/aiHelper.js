/**
 * Suggest budget based on average monthly expense
 */
export function suggestMonthlyBudget(transactions) {
  const monthly = {};

  transactions.forEach(t => {
    if (t.type !== "expense") return;

    const month = new Date(t.date).toISOString().slice(0, 7);
    monthly[month] = (monthly[month] || 0) + t.amount;
  });

  const values = Object.values(monthly);
  const avg = values.reduce((a, b) => a + b, 0) / (values.length || 1);

  return {
    suggestedBudget: Math.round(avg),
    message: "Based on your spending history"
  };
}

/**
 * Auto categorize expense using keywords
 */
export function autoCategorize(description = "") {
  const rules = {
    food: ["hotel", "restaurant", "swiggy", "zomato"],
    travel: ["uber", "ola", "bus", "train"],
    shopping: ["amazon", "flipkart", "mall"],
    rent: ["rent"],
    bills: ["electricity", "water", "gas"]
  };

  const text = description.toLowerCase();

  for (const category in rules) {
    if (rules[category].some(k => text.includes(k))) {
      return category;
    }
  }

  return "others";
}

/**
 * Generate saving tips
 */
export function getSavingTips(summary) {
  if (summary.expense > summary.income * 0.8) {
    return "Your expenses are high. Try reducing discretionary spending.";
  }

  if (summary.balance < 1000) {
    return "Consider setting a small savings goal.";
  }

  return "Good job! Your spending is under control.";
}