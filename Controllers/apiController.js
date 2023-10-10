const {asyncFetch} = require('../Util/asyncFetch');
const Match = require('../Models/Match');

let currentType = 2;
let currentWeek = 1;
let currentYear = 2023;
exports.getCurrentScores = async (req,res,next) =>{
      // let url = 'https://sports.core.api.espn.com/v2/sports/football/leagues/nfl/events/';
      // let seasonData = asyncFetch(url);
      // if(!seasonData){
      //    const error = new Error("unable to connect to api");
      //    error.status = 500;
      //    return next(error);
      // }
      // currentType = seasonData.$meta.parameters.seasontypes[0];
      // currentYear = seasonData.$meta.parameters.season[0];
      // currentWeek = seasonData.$meta.parameters.week[0];
      res.redirect(`/api/nfl/scores/thisweek`);
      next();
}
exports.getScores = async (req,res,next) =>{
   let week = req.params.num;
   let query = (week == 'thisweek') ? "" : `?dates=2023&seasontype=2&week=${week}`;
   let url = `http://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard${query}`;
   let scoreData = await asyncFetch(url);
   if (!scoreData || !Array.isArray(scoreData.events)) {
      const error = new Error("unable to connect to api");
      error.status = 500;
      return next(error);
   }
  const games = scoreData.events;
  const  matches = [];
  for(const game of games){
    const match = new Match(
       game.id,
       game.shortName,
       game.competitions[0].competitors[0].team.abbreviation,
       game.competitions[0].competitors[1].team.abbreviation,
       game.competitions[0].competitors[0].team.logo,
       game.competitions[0].competitors[1].team.logo,
       game.competitions[0].competitors[0].score,
       game.competitions[0].competitors[1].score,
       game.week.number,
       game.status,
       game.date,
       game.competitions[0].venue.id
    );
    let venu = await asyncFetch(`https://sports.core.api.espn.com/v2/sports/football/leagues/nfl/venues/${match.venueId}?lang=en&region=us`);
      if (venu && venu.images && venu.images[0] && venu.images[0].href) {
         match.stadiumImg = venu.images[0].href;
     }
    matches.push(match);
   }

   res.status(200).json(matches);
}
exports.getPlayByPlay = async (req,res,next) =>{
   let gameId = req.params.gameId;
   let url = `https://sports.core.api.espn.com/v2/sports/football/leagues/nfl/events/${gameId}/competitions/${gameId}/plays?limit=500`
   let gameData = await asyncFetch(url);
   if(!gameData){
      const error = new Error("unable to connect to api");
      error.status = 500;
      return next(error);
   }
   let plays = [];
   for(const play of gameData.items){
      plays.push(play.alternativeText);
   }


   res.status(200).json(plays);


}
