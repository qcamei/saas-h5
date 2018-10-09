import {Component, Input, EventEmitter, Output, OnInit, OnChanges} from "@angular/core";
import {AppRouter} from "../../../zmComUtils/AppRouter";
import {TimeSlotEnum} from "./timeSlot/TimeSlotEnum";
import {TimeSlotHelper} from "./timeSlot/TimeSlotHelper";
import {AppUtils} from "../../../../comModule/AppUtils";
import {TimeSlot} from "./timeSlot/TimeSlot";

/**
 * 时间段选择公共组件
 * eg:
 *   <zm-select-timePeriod [timeSlotEnums]="timeSlotEnums" [curValue]="timeSlot" (action)="findList($event)"></zm-select-timePeriod>
 *   this.timeSlotEnums.push(TimeSlotEnum.TODAY);
     this.timeSlotEnums.push(TimeSlotEnum.THIS_MONTH);
     this.timeSlotEnums.push(TimeSlotEnum.LAST_MONTH);
 */
@Component({
  selector: "zm-select-timePeriod",
  template: `
            <button class="item-block" ion-item style="border-bottom:1px solid #F7F5F5;" (click)="openModal()">
              <ion-icon ios="ios-calendar-outline" item-start color="primary"></ion-icon>  
              <ion-label item-end><span style="font-size: 12px">{{label}}</span></ion-label>
            </button>
            `,
  styles: [`
  [item-start] {
    margin: 4px 16px 0 0 !important;
    font-size:18px;
    line-height:33px;
}
 .item-block {
 min-height:3.2rem !important;
}
  `],
})
export class ZmSelectTimePeriod implements OnInit{

  @Input() timeSlotEnums: Array<TimeSlotEnum>;
  @Output() action: EventEmitter<any> = new EventEmitter<any>();
  label: string;

  curValue: TimeSlot;

  ngOnInit() {
    if(AppUtils.isNullObj(this.curValue)){
      if(this.timeSlotEnums && this.timeSlotEnums.length>0){
        this.curValue = TimeSlotHelper.getTimeSlotByEnum(this.timeSlotEnums[0]);
        this.label = TimeSlotHelper.formatTimeSlot(this.curValue);
      }else{
        let toDay = new Date();
        this.curValue = new TimeSlot(AppUtils.getMinTimeInday(toDay), AppUtils.getMaxTimeInday(toDay), TimeSlotEnum.TODAY);
        this.label = TimeSlotHelper.formatTimeSlot(this.curValue);
      }
    }
  }

  openModal() {
    AppRouter.getInstance().goSelectTime(this.timeSlotEnums,this.curValue,this.callback.bind(this));
  }

  callback(timeSlot: TimeSlot) {
    if (AppUtils.isNullObj(timeSlot)) {
      return;
    }
    this.curValue = timeSlot;
    this.label = TimeSlotHelper.formatTimeSlot(timeSlot);
    this.action.emit(timeSlot);
  }

}
