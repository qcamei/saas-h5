import {
  getSeconds,
  getMinutes,
  getHours,
  getDate,
  getMonth,
  getYear,
  getDaysInMonth,
  setSeconds,
  setMinutes,
  setHours,
  setDate,
  setMonth,
  setYear,
  // isSameDay,
  isSameMonth,
  subDays,
  addDays,
  isBefore,
  isAfter,
} from 'date-fns';

export class DateUtils{

  private static Instance: DateUtils = new DateUtils();

  public static getInstance(): DateUtils{
    return DateUtils.Instance;
  }

  public isBefore(date, dateToCompare):boolean{
    return isBefore(date,dateToCompare);
  }

  public isAfter(date, dateToCompare):boolean{
    return isAfter(date,dateToCompare);
  }


  public subDays(date:Date,count:number):Date{
    return subDays(date, count)
  }
  public addDays(date:Date,count:number):Date{
    return addDays(date, count)
  }

  public isSameDay(source:Date,target:Date):boolean{

    let dateYear = getYear(source);
    let dateMonth = getMonth(source);
    let dateDay = getDaysInMonth(source);

    let targetYear = getYear(target);
    let targetMonth = getMonth(target);
    let targetDay = getDaysInMonth(target);
    return dateDay == targetDay && dateMonth == targetMonth && dateYear == targetYear;
  }

  public getDay(date){
    return getDaysInMonth(date);
  }

  public isDayBefore(date, target){
    let isbefore = false;

    let dateYear = getYear(date);
    let dateMonth = getMonth(date);
    let dateDay = getDaysInMonth(date);

    let targetYear = getYear(target);
    let targetMonth = getMonth(target);
    let targetDay = getDaysInMonth(target);

    if(dateYear < targetYear){
      isbefore = true;
    }else if(dateYear == targetYear){
        if(dateMonth < targetMonth){
          isbefore = true;
        }else if(dateMonth == targetMonth){
          isbefore = dateDay < targetDay;
        }
    }
    return isbefore;
  }

  public isDayAfter(date, target){
    return  !this.isSameDay(date,target) && !this.isBefore(date,target);
  }

  public isSameMonth(source:Date,target:Date):boolean{
    return isSameMonth(source,target);
  }

  public getZmDay(date:Date):ZmDay{

    let target:ZmDay = new ZmDay();
    target.date = date;
    target.year = getYear(date);
    target.month = getMonth(date)+1;
    target.day = getDate(date);
    return target;

  }


  public getZmTime(date:Date):ZmTime{

    let target:ZmTime = new ZmTime();
    target.hour = getHours(date);
    target.minute = getMinutes(date);
    target.second = getSeconds(date);
    return target;
  }

  public newDate(dateData:ZmDay, timeData:ZmTime):Date{

    let date:Date = this.setZmDay(new Date(),dateData);
    date = this.setZmTime(date,timeData);
    return date;
  }

  public setZmDay(date:Date, dateData:ZmDay):Date{

    let newDate: Date = setYear(
      setMonth(
        setDate(date, dateData.day),
        dateData.month - 1
      ),
      dateData.year
    );
    return newDate;
  }

  public setZmTime(date:Date, timeData:ZmTime):Date{

    if(!timeData){
      return;
    }

    let newDate: Date = setHours(
      setMinutes(
        setSeconds(date, timeData.second),
        timeData.minute
      ),
      timeData.hour
    );
    return newDate;
  }

  /**
   * 时间格式化 yyyy-MM-dd hh:mm:ss
   * @param {Date} date
   * @returns {string}
   */
  public formatDate(date: Date){
    let year = date.getFullYear();
    let month = this.addZeroIfAbsent(date.getMonth()+1);
    let day = this.addZeroIfAbsent(date.getDate());
    let hour = this.addZeroIfAbsent(date.getHours());
    let minute = this.addZeroIfAbsent(date.getMinutes());
    let second = this.addZeroIfAbsent(date.getSeconds());
    let time= year+'-'+month+'-'+day+' '+hour+':'+minute+':'+second;
    return time;
  }

  public addZeroIfAbsent(num: number):string{
    if(num < 10){
      return "0" + num;
    }else{
      return ""+ num;
    }
  }

}

export class ZmDateSpan{

  title:string;
  id:string;
  start:ZmDate;
  end:ZmDate;

  public static newZmDateSpan(start:Date, end:Date){

    let target:ZmDateSpan = new ZmDateSpan();
    target.start = ZmDate.fromDate(start);
    target.end = ZmDate.fromDate(end);
    return target;
  }


}

export class ZmTimeSpan{

  start:ZmTime;
  end:ZmTime;

  public static newTimeSpan(date:Date){

    let target:ZmTimeSpan = new ZmTimeSpan();
    target.start = ZmTime.fromDate(date);
    target.end = ZmTime.fromDate(date);
    return target;
  }
}

export class ZmDate{

  public static fromDate(date:Date):ZmDate{
    let zmDate:ZmDay = ZmDay.fromDate(date);
    let zmTime:ZmTime = ZmTime.fromDate(date);

    return  ZmDate.newZmDate(zmDate,zmTime);;
  }
  public static newZmDate(date:ZmDay, time:ZmTime){

    let target:ZmDate = new ZmDate();
    target.day = date;
    target.time = time;
    return target;
  }

  day:ZmDay;
  time:ZmTime;

  public toDate():Date{
    return DateUtils.getInstance().newDate(this.day,this.time);
  }

  public getTime():number{
    return this.toDate().getTime();
  }

}


export class ZmDay{
    date:Date;
    year: number;
    month: number;
    day: number;

    public static fromDate(date:Date):ZmDay{
      return DateUtils.getInstance().getZmDay(date);
    }
    public static newCur():ZmDay{
      return ZmDay.fromDate(new Date());
    }

    public equals(target:ZmDay):boolean{
      return this.year==target.year && this.month == target.month && this.day == target.day;
    }

    public setYear(year:number):ZmDay{
      this.year = year;
      return this;
    }

    public setMonth(month:number):ZmDay{
      this.month = month;
      return this;
    }

    public setDay(day:number):ZmDay{
      this.day = day;
      return this;
    }

}

export class ZmTime{
    hour:number;
    minute:number;
    second:number;

    public static fromDate(date:Date):ZmTime{
      return DateUtils.getInstance().getZmTime(date);
    }

    public static newCur():ZmTime{
      return ZmTime.fromDate(new Date());
    }

    public setHour(hour:number):ZmTime{
      this.hour = hour;
      return this;
    }

    public setMinute(minute:number):ZmTime{
      this.minute = minute;
      return this;
    }

    public setSecond(second:number):ZmTime{
      this.second = second;
      return this;
    }

}
