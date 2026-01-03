const express = require("express");
const aiController = require("../controllers/aiController");

const router = express.Router();

router.get("/savings", aiController.getSavingsSuggestions);

module.exports = router;
