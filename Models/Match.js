module.exports = class Match{
    stadiumImg;
    constructor(id,matchName, teamHome, teamAway, homeLogo, awayLogo, homeScore, awayScore, status,query) {
        this.id = id;
        this.matchName = matchName;
        this.teamHome = teamHome;
        this.teamAway = teamAway;
        this.homeLogo = homeLogo;
        this.awayLogo = awayLogo;
        this.homeScore = homeScore;
        this.awayScore = awayScore;
        this.status = status;
        this.query = query;
      }
};