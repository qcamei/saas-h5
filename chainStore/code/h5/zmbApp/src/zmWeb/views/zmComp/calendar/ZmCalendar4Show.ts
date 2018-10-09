import {OnInit, Component, Input, Output, EventEmitter} from "@angular/core";

import {Subject} from "rxjs";
import {ZmCalendarEvent} from "./ZmCalendarUtils";
import {DateUtils} from "../../zmComUtils/DateUtils";

/**
 * 日期选择公共组件 只需指定最大时间或者最小时间 同时指定情况默认最小时间生效
 * eg:

    <zm-calendar-edit [eventList]="viewData.eventList" (onDayClick)="onDayClick($event)" ></zm-calendar-edit>
 */
@Component({
  selector:"zm-calendar-show",
  template:`

          <ion-grid style="padding:14px 14px 0px 14px;">
                <ion-row>
                    <ion-segment ion-text [(ngModel)]="viewMode" color="secondary">
                      <ion-segment-button value="week" style="height: 20px;line-height: normal;">
                        按周
                      </ion-segment-button>
                      <ion-segment-button value="month" style="height: 20px;line-height: normal;">
                        按月
                      </ion-segment-button>
                      
                    </ion-segment>
                 </ion-row>
          </ion-grid>

         <ion-card style="padding-left: 10px; padding-right: 10px;padding-bottom: 10px;"  [ngSwitch]="viewMode">
            
               <ion-item>
                   <button ion-button item-start clear mwlCalendarPreviousView [view]="viewMode" [(viewDate)]="viewDate" >
                        <ion-icon name="arrow-back"></ion-icon>
                   </button>
                  <ion-label style="text-align: center;" *ngSwitchCase="'month'">
                      {{ viewDate | calendarDate:('monthViewTitle'):locale }}
                      <div mwlCalendarToday  [(viewDate)]="viewDate" style="font-size: 0.6em">
                        返回今天
                      </div>
                  </ion-label>
                  <ion-label style="text-align: center;" *ngSwitchCase="'week'">
                      {{ viewDate | calendarDate:('weekViewTitle'):locale }}
                      <div mwlCalendarToday  [(viewDate)]="viewDate" style="font-size: 0.6em">
                        返回今天
                      </div>
                  </ion-label>
                  <button ion-button item-end clear  mwlCalendarNextView [view]="viewMode" [(viewDate)]="viewDate" >
                     <ion-icon name="arrow-forward"></ion-icon>
                  </button>
                </ion-item>
          
                <mwl-calendar-week-view
                  *ngSwitchCase="'week'"
                  [headerTemplate]="weekHeadTemplate"
                  [eventTemplate] = "weekEventTemplate"
                  [viewDate]="viewDate"
                  [events]="eventList"
                  
                  [locale]="locale"
                  [refresh]="refresh">
                  
                </mwl-calendar-week-view>
                
                <mwl-calendar-month-view 
                    *ngSwitchCase="'month'"
                    [viewDate]="viewDate"
                    [events]="eventList"
                    [locale]="locale"
                    [refresh]="refresh"
                    [activeDayIsOpen]="false"
                     [cellTemplate]="monthCellTemplate" 
                    (dayClicked)="dayClicked($event.day)">
                </mwl-calendar-month-view>
         </ion-card>
              
              
                <ng-template #monthCellTemplate let-day="day" let-locale="locale">
                     <div class="cal-cell-top" style="position: relative;min-height:40px">
                        <div class="day-badge" *ngIf="day.badgeTotal">{{ day.badgeTotal }}</div>
                        <span class="cal-day-number">{{ day.date | calendarDate:'monthViewDayNumber'}}</span>
                      </div>
               </ng-template>
               
               <ng-template
                        #weekHeadTemplate
                        let-days="days"
                        let-locale="locale"
                        let-dayHeaderClicked="dayHeaderClicked">
                       
                        <div class="cal-day-headers"  style="border: solid 0px;" >
                                  <div class="cal-header" style="border: solid 0px;font-weight: bold"
                                    *ngFor="let day of days; trackBy:trackByWeekDayHeaderDate"
                                    [class.cal-past]="day.isPast"
                                    [class.cal-today]="day.isToday"
                                    [class.cal-future]="day.isFuture"
                                    [class.cal-weekend]="day.isWeekend"
                                    [ngClass]="day.cssClass"
                                    (mwlClick)="dayClicked(day)">
                                     <div>{{ day.date | calendarDate:'monthViewColumnHeader':locale }}</div>
                                  </div>
                          
                        </div>
                        
                        <div class="cal-day-headers">
                          
                                  <div class="cal-header" style="position: relative;height:40px;"
                                    *ngFor="let day of days; trackBy:trackByWeekDayHeaderDate"
                                    [class.cal-past]="day.isPast"
                                    [class.cal-today]="day.isToday"
                                    [class.cal-future]="day.isFuture"
                                    [class.cal-weekend]="day.isWeekend"
                                    [class.cal-drag-over]="day.dragOver"
                                    [ngClass]="day.cssClass"
                                    (mwlClick)="dayClicked(day)">
                                        <div class="day-badge" *ngIf="getEventSize(day.date) > 0">{{ getEventSize(day.date) }}</div>
                                        <span style="font-size: 1.2em">{{ day.date | calendarDate:'monthViewDayNumber'}}</span>
                                  </div>
                        </div>
               </ng-template>
               
               <ng-template #weekEventTemplate>
              </ng-template>
              
              
            `,
            styles:[`
                .day-badge{
                      text-align: center;
                      font-size: 2px;
                      position: absolute;
                      left: 1px;
                      bottom: 1px;
                      color: white;
                      background-color: blue;
                      width: 15px;
                      height: 15px;
                      line-height: 15px;
                      -moz-border-radius: 3px; 
                      -webkit-border-radius: 3px; 
                }
          `]
})
export class ZmCalendar4Show implements OnInit{

  constructor(){
  }

  @Input() eventList: Array<ZmCalendarEvent> = new Array<ZmCalendarEvent>();
  @Output() onDayClick: EventEmitter<any> = new EventEmitter();

  @Input() viewMode:string='week';
  @Input() viewDate: Date = new Date();
  refresh: Subject<any> = new Subject();
  locale:string="zh-cn";

  // private eventDateMap:ZmMap<ZmCalendarEvent> = ZmMap.newMap<ZmCalendarEvent>();

  ngOnInit(){
    // this.eventList.push(ZmCalendarEvent.newSingleDayEvent(new Date()));
    let event = ZmCalendarEvent.newSingleDayEvent(DateUtils.getInstance().addDays(new Date(),1));
    event.title = "今日预约事件";
    // this.eventList.push(event);
    // this.eventList.push(ZmCalendarEvent.newSingleDayEvent(DateUtils.getInstance().addDays(new Date(),2)));
    this.eventList.push(ZmCalendarEvent.newEvent(DateUtils.getInstance().addDays(new Date(),-1),DateUtils.getInstance().addDays(new Date(),1)));

  }
  getEventSize(date):number {
    return this.getEvent(date).length;
  }

  getEvent(date):Array<ZmCalendarEvent> {
    let targetList:Array<ZmCalendarEvent> = new Array<ZmCalendarEvent>();
    this.eventList.forEach((eventItem)=>{
        let eventStartDate = eventItem.start;
        let eventEndDate = eventItem.end;


        if(DateUtils.getInstance().isSameDay(date,eventStartDate) || DateUtils.getInstance().isSameDay(date,eventEndDate)){
          targetList.push(eventItem);
        }

        if(DateUtils.getInstance().isDayAfter(date,eventStartDate) && DateUtils.getInstance().isDayBefore(date,eventEndDate)){
            targetList.push(eventItem);
        }

    });
    return targetList;
  }

  dayClicked(item){
    let date = item.date;
    this.onDayClick.emit(this.getEvent(date));
  }


}
