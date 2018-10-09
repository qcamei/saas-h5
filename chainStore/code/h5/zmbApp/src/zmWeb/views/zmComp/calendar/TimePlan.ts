
import {ZmTime, ZmDay, ZmDate, ZmDateSpan} from "../../zmComUtils/DateUtils";
export class TimePlan {
    constructor(){}
    id:string;
    startTime:number;
    endTime:number;
    cancel:boolean;
    cancelInfo:string;

    public static newTimePlan(){
      return new TimePlan();
    }

    public setStart(day:ZmDay,time:ZmTime):TimePlan{
      let zmDate:ZmDate = ZmDate.newZmDate(day,time);
      this.startTime = zmDate.getTime();
      return this;
    }

    public setEnd(day:ZmDay,time:ZmTime):TimePlan{
      let zmDate:ZmDate = ZmDate.newZmDate(day,time);
      this.endTime = zmDate.getTime();
      return this;
    }

    public setId(id:string):TimePlan{
      this.id = id;
      return this;
    }


  public static fromZmDateSpan(dateSpan:ZmDateSpan):TimePlan{

    return TimePlan.newTimePlan().setStart(dateSpan.start.day,dateSpan.start.time)
      .setEnd(dateSpan.end.day,dateSpan.end.time)
      .setId(dateSpan.id);

  }

}
