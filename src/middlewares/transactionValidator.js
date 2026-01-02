function validateTransaction(req, res, next) {
  const { type, amount, currency, occurredAt, paymentMethod, status, description, notes, tags, transferAccount } = req.body;

  if (!type || !amount) {
    return next(new Error("Missing required fields: type and amount"));
  }

  if (!["credit", "debit", "transfer"].includes(type)) {
    return next(new Error("Invalid transaction type"));
  }

  if (typeof amount !== "number" || amount < 0) {
    return next(new Error("Invalid amount"));
  }

  if (currency && typeof currency !== "string") {
    return next(new Error("Invalid currency"));
  }

  if (occurredAt && isNaN(new Date(occurredAt).getTime())) {
    return next(new Error("Invalid occurredAt date"));
  }

  if (paymentMethod && !["cash", "card", "upi", "bank_transfer", "wallet", "other"].includes(paymentMethod)) {
    return next(new Error("Invalid payment method"));
  }

  if (status && !["pending", "success", "cancelled"].includes(status)) {
    return next(new Error("Invalid status"));
  }

  if (description && description.length > 500) {
    return next(new Error("Description exceeds maximum length of 500 characters"));
  }

  if (notes && notes.length > 1000) {
    return next(new Error("Notes exceed maximum length of 1000 characters"));
  }

  if (tags && !Array.isArray(tags)) {
    return next(new Error("Tags must be an array of strings"));
  }

  if (type === "transfer" && !transferAccount) {
    return next(new Error("Transfer account is required for transfer transactions"));
  }

  next();
}

module.exports = validateTransaction;