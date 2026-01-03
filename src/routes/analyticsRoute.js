const express = require("express");
const analyticsController = require("../controllers/analyticsController");

const router = express.Router();

router.get("/filter", analyticsController.filterTransactions);
router.get("/totals", analyticsController.calculateTotals);
router.get("/trends", analyticsController.getMonthlyTrends);

module.exports = router;
