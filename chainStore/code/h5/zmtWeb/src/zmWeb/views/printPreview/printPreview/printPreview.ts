import {ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit} from "@angular/core";
import {TimeSlotEnum} from "../../zmComp/date/timeSlot/TimeSlotEnum";
import {TimeSlot} from "../../zmComp/date/timeSlot/TimeSlot";

@Component({
  selector: 'printPreview',
  templateUrl: 'printPreview.html',
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class PrintPreviewPage implements OnInit, OnDestroy {

  //日历组件
  public todayvalue: boolean = false;
  public tomorrowvalue: boolean = false;
  public hebdomadvalue: boolean = true;

  @Input() timeSlotEnums: Array<TimeSlotEnum>;

  constructor() {
    this.timeSlotEnums = new Array<TimeSlotEnum>();//默认情况是，今天、昨天、过去的七天内
    this.timeSlotEnums.push(TimeSlotEnum.TODAY);
    this.timeSlotEnums.push(TimeSlotEnum.YESTERDAY);
    this.timeSlotEnums.push(TimeSlotEnum.THIS_MONTH);
    this.timeSlotEnums.push(TimeSlotEnum.LAST_MONTH);
  }


  ngOnInit(): void {
  }

  ngOnDestroy(): void {

  }

  checkLogs() {

  }

  /**
   * 时间段选择组件回调
   * @param {TimeSlot} timeSlot
   */
  onTimeSlotCb(timeSlot: TimeSlot) {
    console.log("时间段选择。。。。",timeSlot);
  }
}


