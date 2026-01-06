const express = require("express");
const budgetController = require("../controllers/budgetController");
const authenticate = require("../middlewares/authMiddleware");

const router = express.Router();

router.use(authenticate); 

router.post("/", budgetController.createBudget);
router.get("/", budgetController.getAllBudgets);
router.get("/:id", budgetController.getBudget);

module.exports = router;
