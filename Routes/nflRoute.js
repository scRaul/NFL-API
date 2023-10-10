const express = require("express");
const router = express.Router();
const { asyncFetch } = require("../Util/asyncFetch");
const URL = "http://localhost:8080";

let currentWeek = 5;

router.get('/',async (req, res,next) => {
  console.log("Accessed /nfl route");
    try {
      let matchData = await asyncFetch(`${URL}/api/nfl/scores`);
      currentWeek = matchData[0].week;
      if (!matchData) {
        throw new Error("api not available");
      } else {
        res.render("Pages/index", { matchData });
      }
    } catch (error) {
      console.error(error);
      next(error);
    }
});
//401547354
router.get('/game/:gameId', async (req,res,next)=>{
    let gameId = req.params.gameId;
    try {
        let gameData = await asyncFetch(`${URL}/api/nfl/game/${gameId}`);
        if (!gameData) {
          throw new Error("api not available");
        } else {
          res.status(200).render('Pages/game',{week: currentWeek,plays: gameData});
        }
      } catch (error) {
        console.error(error);
        next(error);
      }
});
router.get("/wk/:num", async (req,res,next) =>{
    let num = req.params.num;
    if( num == currentWeek){
      res.redirect('/nfl');
    }
    try {
      let matchData = await asyncFetch(`${URL}/api/nfl/scores/${num}`);
      if (!matchData) {
        throw new Error("api not available");
      } else {
        res.render("Pages/week", { matchData:matchData,currentWeek:currentWeek,week:num });
      }
    } catch (error) {
      console.error(error);
      next(error);
    }
});





module.exports = router; 