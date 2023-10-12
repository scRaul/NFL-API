module.exports = class Season {
    constructor(year,currentWeek,currentType,preWeeks,regWeeks,postWeeks){
        this.year = year;
        this.currentWeek = currentWeek;
        this.currentType = currentType; // 1 pre 2 reg 3 post
        this.preWeeks = preWeeks;
        this.regWeeks = regWeeks;
        this.postWeeks  = postWeeks;
        this.selectedWeek = currentWeek;
        this.selectedType = currentType;
    }
    static checkWeek(type,week,seasonData){
        if(type == 1 )
            return (week <= seasonData.preWeeks)
        if(type == 2)
            return (week <= seasonData.regWeeks);
        if(type == 3)
            return (week <= seasonData.postWeeks);
        return false;
    }
    getTotalWeeks(){
        if(this.currentType == 1 )
            return this.preWeeks;
        if(this.currentType == 3)
            return this.postWeeks;
        return this.regWeeks;
    }
};