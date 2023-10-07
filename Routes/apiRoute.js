const express = require("express");
const router = express.Router();
const apiController = require('../Controllers/apiController');

router.get('/nfl/scores',apiController.getCurrentScores);
router.get('/nfl/scores/wk/:num',apiController.getScores);



module.exports = router; 