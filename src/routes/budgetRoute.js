const express = require("express");
const budgetContoller = require("../controllers/budgetController");

const router = express.Router();

router.post("/", budgetContoller.createBudget);
router.get("/:id", budgetContoller.getBudget);
router.get("/", budgetContoller.getAllBudgets);

module.exports = router;
