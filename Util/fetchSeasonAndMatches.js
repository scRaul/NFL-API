const cache = require('../Data/Cache');
const {asyncFetch} = require('./asyncFetch');
exports.fetchSeasonAndMatchData = async (season, type, week) => {
    try {
      let seasonData = await asyncFetch(`${cache.url}/api/nfl/season/${season}`);
      if (!seasonData) {
        const error = new Error('Failed to get season data');
        error.status = 500;
        throw error;
      }
      if (week !== '') seasonData.selectedWeek = week;
      if (type !== '') seasonData.selectedType = type;
  
      let query = `?season=${season}&type=${type}&week=${week}`;
      let matchData = await asyncFetch(`${cache.url}/api/nfl/matches${query}`);
      if (!matchData) {
        const error = new Error('Failed to get matches data');
        error.status = 500;
        throw error;
      }
  
      return { seasonData, matchData };
    } catch (error) {
      throw error;
    }
};