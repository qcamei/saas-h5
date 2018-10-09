import {
  CalendarEvent,
  // CalendarEventAction,
  // CalendarEventTimesChangedEvent
} from 'angular-calendar';
import {ZmDay, DateUtils} from "../../zmComUtils/DateUtils";
import {TimePlan} from "./TimePlan";

export class ZmCalendarUtils{

  private static Instance: ZmCalendarUtils = new ZmCalendarUtils();

  public static getInstance(): ZmCalendarUtils{
    return ZmCalendarUtils.Instance;
  }

}

export class ZmColors {
  public static red = {
    primary: '#ad2121',
    secondary: '#FAE3E3'
  };
  public static blue = {
    primary: '#1e90ff',
    secondary: '#D1E8FF'
  };
  public static yellow = {
    primary: '#e3bc08',
    secondary: '#FDF1BA'
  };
  public static green={
    primary: '#0be31a',
    secondary: '#acfdab'
  }
}

export class ZmCalendarEvent implements CalendarEvent{
  id:string;
  start:Date;
  end:Date;
  title:string;
  color:any;
  startZmDay:ZmDay;

  public static newFromTimePlan(title:string, timePlan:TimePlan):ZmCalendarEvent{

    let startTime:number = Number( timePlan.startTime);
    let endTime:number = Number( timePlan.endTime);
    let target:ZmCalendarEvent = ZmCalendarEvent.newEvent(new Date(startTime), new Date(endTime));
    target.id = timePlan.id;
    target.title = title;
    return target;
  }

  public static  newEvent(start:Date,end:Date):ZmCalendarEvent{
    let target:ZmCalendarEvent = new ZmCalendarEvent();
    target.start = start;
    target.end = end;
    target.startZmDay = DateUtils.getInstance().getZmDay(start);
    target.color = ZmColors.green;
    return target;
  }

  public static newSingleDayEvent(date:Date):ZmCalendarEvent{
    let target:ZmCalendarEvent = new ZmCalendarEvent();
    target.start = date;
    target.color = ZmColors.green;
    return target;
  }

}

// e.g
// {
//   label: '<i class="fa fa-fw fa-pencil"></i>',
//     onClick: ({ event }: { event: CalendarEvent }): void => {
//   this.handleEvent(event);
// }
export class ZmCalendarEventAction{
  label:string;
  onClick:any;
}
