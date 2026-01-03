const express = require("express");
const validateTransaction = require("../middlewares/transactionValidator");
const transactionController = require("../controllers/transactionController");

const router = express.Router();

router.post("/", validateTransaction, transactionController.create);
router.get("/", transactionController.getAll);
router.put("/:id", transactionController.update);

module.exports = router;
