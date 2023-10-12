const express = require("express");
const router = express.Router();
const sseController = require("../Controllers/sseController");


router.get('/plays/:gameId',sseController.getLivePlayUpdates);
router.get('/matches',sseController.setHeader,sseController.getLiveScoreUpdates);

module.exports = router; 