const {asyncFetch} = require('../Util/asyncFetch');
const Match = require('../Models/Match');

exports.getCurrentScores = async (req,res,next) =>{
      res.redirect('/api/nfl/scores/wk/thisweek');
}
exports.getScores = async (req,res,next) =>{
   let week = req.params.num;
   let query = (week == 'thisweek') ? "" : `?dates=2023&seasontype=2&week=${week}`;
   let url = `http://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard${query}`;
   let scoreData = await asyncFetch(url);
   if(!scoreData){
      const error = new Error("unable to connect to api");
      error.status = 500;
      return next(error);
   }
  const games = scoreData.events;
  const  matches = [];
  for(const game of games){
    const match = new Match(
       game.shortName,
       game.competitions[0].competitors[0].team.abbreviation,
       game.competitions[0].competitors[1].team.abbreviation,
       game.competitions[0].competitors[0].team.logo,
       game.competitions[0].competitors[1].team.logo,
       game.competitions[0].competitors[0].score,
       game.competitions[0].competitors[1].score,
       game.week,
       game.status
    );
    matches.push(match);
   }

   res.status(200).json(matches);
}