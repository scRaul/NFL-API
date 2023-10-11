module.exports = class Season {
    constructor(year,currentWeek,currentType,preWeeks,regWeeks,postWeeks){
        this.year = year;
        this.currentWeek = currentWeek;
        this.currentType = currentType;
        this.preWeeks = preWeeks;
        this.regWeeks = regWeeks;
        this.postWeeks  = postWeeks;
    }
    checkWeek(type,week){
        if(type == 1 )
            return (week <= this.preWeeks)
        if(type == 2)
            return (week <= this.regWeeks);
        if(type == 3)
            return (week <= this.postWeeks);
        return false;
    }
};