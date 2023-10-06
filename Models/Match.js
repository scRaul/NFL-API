module.exports = class Match{
    constructor(matchName, teamHome, teamAway, homeLogo, awayLogo, homeScore, awayScore, week, status) {
        this.matchName = matchName;
        this.teamHome = teamHome;
        this.teamAway = teamAway;
        this.homeLogo = homeLogo;
        this.awayLogo = awayLogo;
        this.homeScore = homeScore;
        this.awayScore = awayScore;
        this.week = week;
        this.status = status;
      }
};