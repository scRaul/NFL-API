const express = require("express");
const router = express.Router();
const nflApiController = require('../Controllers/nflApiController');


router.get('/nfl/season',nflApiController.getCurrentSeason); // return current season data 
router.get('/nfl/season/:yyyy',nflApiController.getSeasonData); // reuturn season data for prioor years
// query ?season=yyyy&type=n&week=w
router.get('/nfl/matches',nflApiController.getMatches); // return matches for query 
router.get('/nfl/plays/:matchId',nflApiController.getPlays); // return play by  play for a match 

module.exports = router; 