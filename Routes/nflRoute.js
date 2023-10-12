const express = require("express");
const router = express.Router();
const { asyncFetch } = require("../Util/asyncFetch");
const { fetchSeasonAndMatchData } = require("../Util/fetchSeasonAndMatches");
const cache = require('../Data/Cache'); 

// Fill Navigation Bar && Get Scores 
// possible query ? season=yyyy&type=n&week=w
router.get('/',async (req, res,next) => {
   let season = (!req.query.season) ? '' : req.query.season;
   let type = (!req.query.type) ? '' : req.query.type;
   let week = (!req.query.week) ? '' : req.query.week;
  
    try{
      const {seasonData,matchData} = await fetchSeasonAndMatchData(season,type,week);
      res.status(200).render('Pages/nfl',{seasonData,matchData});
    }catch(error){
      console.log(error);
      next(error);
    }
});
//why not have client owned cache ? -> sharable links 
router.get('/match/:matchId/:gameQuery',async (req,res,next) =>{
  const gameId = req.params.matchId;
  let query = req.params.gameQuery.split('&');//gives us info on how to re-get matches
  const season = query[0];
  const type = query[1];
  const week = query[2];
  try{
    const {seasonData,matchData} = await fetchSeasonAndMatchData(season,type,week);
    const thisMatch = matchData.filter(match => match.id == gameId)[0];
    let otherMatches = matchData.filter(match => match.id != gameId);
    const plays = await asyncFetch(`${cache.url}/api/nfl/plays/${gameId}`);
    res.status(200).render('Pages/match',{thisMatch,plays,seasonData,matchData:otherMatches});
  }catch(error){

     next(error);
  }
});

module.exports = router;