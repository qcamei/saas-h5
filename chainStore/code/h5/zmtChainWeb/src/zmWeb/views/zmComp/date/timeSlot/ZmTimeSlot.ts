import {
  Output,
  Component,
  EventEmitter,
  Input,
  DoCheck,
  KeyValueDiffers,
} from "@angular/core";
import {TimeSlotEnum} from "./TimeSlotEnum";
import {TimeSlot} from "./TimeSlot";
import {TimeSlotHelper} from "./TimeSlotHelper";
import {DateWrap} from "./DateWrap";
import {AppUtils} from "../../../../comModule/AppUtils";

@Component({
  selector: 'zm-time-slot',
  template: `
    <div class="container" fxLayout="row wrap" fxLayoutAlign="start" fxLayoutGap="10px" fxLayout.xs="column"
         style="margin-bottom:15px;">
      <zm-search-date [label]="startLabel" [placeholder]="startPlaceholder" [(curValue)]="minTime"
                      (curValueChange)="callback()"></zm-search-date>
      <div class="mr-12">
        <zm-search-date [label]="endLabel" [placeholder]="endPlaceholder" [(curValue)]="maxTime"
                        (curValueChange)="callback()"></zm-search-date>
      </div>

      <zm-btn-Date [values]="values" (zmbtnClick)="onZmbtnClick($event)"
                   [itemActiveIndex]="itemIndex"></zm-btn-Date>
    </div>    `,
  styles: [`

  `]
})
/**
 * 时间段选择组件
 */
export class ZmTimeSlot implements DoCheck {

  @Input() startLabel: string = "起始时间";
  @Input() endLabel: string = "结束时间";

  @Input() startPlaceholder: string = "请选择起始时间";
  @Input() endPlaceholder: string = "请选择结束时间";

  values: Array<string> = new Array<string>();//时间段显示文本,比如 今天、昨天、明天
  @Input() itemIndex: number = 1;
  @Output() zmTimeSlotCb: EventEmitter<TimeSlot> = new EventEmitter();
  @Output() itemActiveIndexChange: EventEmitter<any> = new EventEmitter<any>();
  @Output() zmValueChange: EventEmitter<any> = new EventEmitter<any>();

  differ: any;//用于监听 timeSlotEnums 变化
  minTime: DateWrap = TimeSlotHelper.getDateWrapByTimeSlot(0);//最小时间
  maxTime: DateWrap = TimeSlotHelper.getDateWrapByTimeSlot(Date.now());//最大时间

  timeSlot: TimeSlot;//当前时间段

  @Input()
  get itemActiveIndex() {
    return this.itemIndex;
  }

  set itemActiveIndex(val: number) {
    this.itemIndex = val;
    this.itemActiveIndexChange.emit(this.itemIndex);
  }

  @Input()
  get zmValue() {
    return this.timeSlot;
  }

  set zmValue(val: TimeSlot) {
    if (AppUtils.isNullObj(val)) return;
    this.timeSlot = val;
    this.minTime = TimeSlotHelper.getDateWrapByTimeSlot(this.timeSlot.getMinTime());
    this.maxTime = TimeSlotHelper.getDateWrapByTimeSlot(this.timeSlot.getMaxTime());
    this.zmValueChange.emit(this.timeSlot);
  }

  @Input() timeSlotEnums: Array<TimeSlotEnum>;

  constructor(differs: KeyValueDiffers) {
    this.differ = differs.find([]).create();
  }

  /**
   * docheck 生命周期方法回调
   */
  ngDoCheck(): void {
    var changes = this.differ.diff(this.timeSlotEnums);//监听 this.timeSlotEnums 值的变化
    if (!changes) return;
    this.buildValus();//刷新 values
  }

  /**
   * 构建 values 数组
   */
  buildValus(): void {
    if (!this.timeSlotEnums) return;
    this.values = new Array<string>();
    this.timeSlotEnums.forEach((timeSlotEnum: TimeSlotEnum, index: number, timeSlotEnums: TimeSlotEnum[]) => {
      let label: string = TimeSlotHelper.getLabelByEnum(timeSlotEnum);
      if (label) {
        this.values.push(label);
      }
    });
    this.onZmbtnClick(this.itemIndex);
  }

  /**
   * 点击 时间段 按钮回调
   * @param index
   */
  onZmbtnClick(index): void {
    this.itemActiveIndex = index;
    if (!this.timeSlotEnums) return;
    let timeSlotEnum = this.timeSlotEnums[this.itemIndex];
    let timeSlot: TimeSlot = TimeSlotHelper.getTimeSlotByEnum(timeSlotEnum);
    this.minTime = TimeSlotHelper.getDateWrapByTimeSlot(timeSlot.getMinTime());
    this.maxTime = TimeSlotHelper.getDateWrapByTimeSlot(timeSlot.getMaxTime());
    this.callback();//手动回调时间段变化
  }

  /**
   * 回调
   */
  callback() {
    let minTimeStamp = TimeSlotHelper.getMinTimeStampByDateWrap(this.minTime);
    let maxTimeStamp = TimeSlotHelper.getMaxTimeStampByDateWrap(this.maxTime);
    let timeSlot = new TimeSlot(minTimeStamp, maxTimeStamp);
    this.zmValue = timeSlot;
    this.zmTimeSlotCb.emit(timeSlot);
  }
}
