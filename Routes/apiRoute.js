const express = require("express");
const router = express.Router();
const apiController = require('../Controllers/apiController');
const nflApiController = require('../Controllers/nflApiController');


router.get('/nfl/scores',apiController.getCurrentScores);
router.get('/nfl/scores/:num',apiController.getScores);
router.get('/nfl/game/:gameId',apiController.getPlayByPlay);


router.get('/nfl/season',nflApiController.getCurrentSeason);
router.get('/nfl/season/:yyyy',nflApiController.getSeasonData);
// query ?season=yyyy&type=n&week=w
router.get('/nfl/match',nflApiController.getMatches);
router.get('/nfl/match/:gameId',nflApiController.getMatch);

module.exports = router; 