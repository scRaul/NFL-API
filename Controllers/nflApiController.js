require("dotenv").config;
const {asyncFetch} = require('../Util/asyncFetch');
const Season = require('../Models/Season');
const cache = require('../Data/Cache'); // hold things in memory 
const Match = require('../Models/Match');
const { response } = require("express");

//   /api/nfl/season/    -> return current season data 
exports.getCurrentSeason = (req,res)=>{
    let year = new Date(Date.now()).getFullYear();
    res.redirect(`/api/nfl/season/${year}`);
}
//  /api/nfl/season/:yyyy   -> return yyyy sesaon's data 
exports.getSeasonData =  async (req,res,next) =>{
    let year = req.params.yyyy;
    
    //return cached season, if the year != current year  
    if(cache.seasonCache.has(year) && year !=  new Date(Date.now()).getFullYear()){
        return res.status(200).json(cache.seasonCache.get(year));
    }

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
        console.log('49');
        console.log(error);
        next(error);
    }

}
//   /nfl/matches ?season=yyyy&type=n&week=w
exports.getMatches = async (req,res,next) =>{

    let year = (!req.query.season) ? '' : req.query.season;

    let seasonData = await asyncFetch(`${cache.url}/api/nfl/season/${year}`);
    year = seasonData.year;

    let type = (!req.query.type) ? seasonData.currentType  : req.query.type;
    let week = (!req.query.week) ? seasonData.currentWeek : req.query.week;

    //make sure the week is within season bounds if not set to 1
    if(!Season.checkWeek(type,week,seasonData)) week = 1;

    let query = `?dates=${year}&seasontype=${type}&week=${week}`;
    cache.previousQuery = query;

    //check if cache exists 
    if(cache.seasonMatchesCache.has(query)){
        return res.status(200).json(cache.seasonMatchesCache.get(query));
    }

    //else conitnue 

    try{
        let matchData = await asyncFetch(`http://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard${query}`);
        if(!matchData || !Array.isArray(matchData.events)) {
                const error = new Error("unable to connect to match api");
                error.status = 500;
                return next(error);
        }
        let matches = [];
        const games = matchData.events;
        for(const game of games){
            let query = `${game.season.year}&${game.season.type}&${game.week.number}`
          const match = new Match(
             game.id,
             game.shortName,
             game.competitions[0].competitors[0].team.abbreviation,
             game.competitions[0].competitors[1].team.abbreviation,
             game.competitions[0].competitors[0].team.logo,
             game.competitions[0].competitors[1].team.logo,
             game.competitions[0].competitors[0].score,
             game.competitions[0].competitors[1].score,
             game.status,
             query
            );
            matches.push(match);
        }
        //if current year but not curernt week cache 
       if(year == new Date(Date.now()).getFullYear()  ){
            if(type <= seasonData.currentType){
                if(week < seasonData.currentWeek)
                     cache.seasonMatchesCache.set(query,matches);
            }//else not curernt yar therefore cache 
       }else if(year < Date(Date.now()).getFullYear() ){
             cache.seasonMatchesCache.set(query,matches);
       }
        res.status(200).json(matches);
    }catch(error){
        console.log('115');
        console.log(error);
        next(error);
    }
};
//  /nfl/plays/:matchId
exports.getPlays = async (req,res,next) =>{

    let gameId = req.params.matchId;
    let url = `https://sports.core.api.espn.com/v2/sports/football/leagues/nfl/events/${gameId}/competitions/${gameId}/plays?limit=500`
    try{
        let gameData = await asyncFetch(url);
        if(!gameData || !Array.isArray(gameData.items) ){
            const error = new Error("unable to connect to api");
            error.status = 500;
            throw error;
        }
        let plays = [];
        for(const play of gameData.items){
            plays.push(play.alternativeText);
        }
        res.status(200).json(plays);
    }catch(error){  
        console.log('138');
        console.log(error);
        next(error);
    } 
}