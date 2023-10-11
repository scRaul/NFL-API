require("dotenv").config;
const {asyncFetch} = require('../Util/asyncFetch');
const Season = require('../Models/Season');
const cache = require('../Data/Cache'); // hold things in memory 
const Match = require('../Models/Match');

//   /api/nfl/season/    -> return current season data 
exports.getCurrentSeason = (req,res)=>{
    let year = new Date(Date.now()).getFullYear();
    res.redirect(`/api/nfl/season/${year}`);
}
//  /api/nfl/season/:yyyy   -> return yyyy sesaon's data 
exports.getSeasonData =  async (req,res,next) =>{
    let year = req.params.yyyy;

    if(cache.seasonCache.has(year)){
        console.log('from cache');
        return res.status(200).json(cache.seasonCache.get(year));
    }
    console.log('from api');

    let sUrl = `https://sports.core.api.espn.com/v2/sports/football/leagues/nfl/seasons/${year}`; 
    let preUrl = `https://sports.core.api.espn.com/v2/sports/football/leagues/nfl/seasons/${year}/types/1/weeks`;
    let regUrl =  `https://sports.core.api.espn.com/v2/sports/football/leagues/nfl/seasons/${year}/types/2/weeks`;
    let postUrl =  `https://sports.core.api.espn.com/v2/sports/football/leagues/nfl/seasons/${year}/types/3/weeks`;
    try{
        let seasonData = await asyncFetch(sUrl);
        let preData = await asyncFetch(preUrl);
        let regData = await asyncFetch(regUrl);
        let postDta = await asyncFetch(postUrl);

        if(!seasonData || !preData || !regData || !postDta){
            const error = new Error('Unable to find Season Data');
            error.status = 500;
            throw error;
        }
        let week = (!seasonData.type.week) ? regData.count : seasonData.type.week.number;
        let season = new Season(
            seasonData.year,
            week,
            seasonData.type.id,
            preData.count,
            regData.count,
            postDta.count
        );
        cache.seasonCache.set(year,season);
        return res.status(200).json(season);
    }catch(error){
        console.log(error);
        next(error);
    }

}

//   /nfl/match?season=yyyy&type=n&week=w

exports.getMatches = async (req,res,next) =>{
    let season;

    let year = (!req.query.season) ? '' : req.query.season;
    season = await asyncFetch(`${cache.url}/api/nfl/season/${year}`);

    let type = (!req.query.type) ? season.currentType  : req.query.type;
    let week = (!req.query.week) ? season.currentWeek : req.query.week;
    if(!season.checkWeek(type,week)) week = 1;

    let query = `?dates=${year}&seasontype=${type}&week=${week}`;

    try{
        let matchData = asyncFetch(`http://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard${query}`);
        if(!matchData|| !Array.isArray(scoreData.events)) {
                const error = new Error("unable to connect to api");
                error.status = 500;
                return next(error);
        }
        let matches = [];
        const games = scoreData.events;
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
            matches.push(match);
        }
        //cache matches if query != current Season.week
        let currentSeason = await asyncFetch(`${cache.url}/api/nfl/season`);
        if(currentSeason){
            if( !(type == currentSeason.currentType && week == currentSeason.currentWeek) ){
                matches.forEach(game =>{
                    cache.matchesCache.set(game.id,game);
                });
            }   
        }
        res.status(200).json(matches);
    }catch(error){
        console.log(error);
        next(error);
    }

    res.status(200).json(season)
}

exports.getMatch = async (req,res,next) =>{
    let gameId = req.params.gameId;

    if(cache.matchesCache.has(gameId)){
        return res.status(200).json(cache.matchesCache.get(gameId));
    }
    try{
        let matchData;

    }catch(error){
        console.log(error);
        next(error);
    }




}