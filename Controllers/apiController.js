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
       game.id,
       game.shortName,
       game.competitions[0].competitors[0].team.abbreviation,
       game.competitions[0].competitors[1].team.abbreviation,
       game.competitions[0].competitors[0].team.logo,
       game.competitions[0].competitors[1].team.logo,
       game.competitions[0].competitors[0].score,
       game.competitions[0].competitors[1].score,
       game.week,
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
//play by play 
//https://sports.core.api.espn.com/v2/sports/football/leagues/nfl/events/401249063/competitions/401249063/plays?limit=300