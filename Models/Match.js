module.exports = class Match{
    stadiumImg;
    constructor(id,matchName, teamHome, teamAway, homeLogo, awayLogo, homeScore, awayScore, week, status,date,venueId) {
        this.id = id;
        this.matchName = matchName;
        this.teamHome = teamHome;
        this.teamAway = teamAway;
        this.homeLogo = homeLogo;
        this.awayLogo = awayLogo;
        this.homeScore = homeScore;
        this.awayScore = awayScore;
        this.week = week;
        this.status = status;
        this.date = date;
        this.venueId = venueId;
      }
};