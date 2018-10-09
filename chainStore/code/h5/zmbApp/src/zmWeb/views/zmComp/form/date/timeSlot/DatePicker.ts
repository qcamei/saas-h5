import {OnInit, OnDestroy, Component, Input, Output, EventEmitter} from "@angular/core";

/**
 * 日期选择公共组件 只需指定最大时间或者最小时间 同时指定情况默认最小时间生效
 * eg:
 *
 */
@Component({
  selector:"date-pic",
  template:`

              <ion-label item-start *ngIf="label"><span>{{label}}</span></ion-label>
              <ion-datetime 
              cancelText="返回"
              doneText="确定"
              displayFormat="YYYY-MM-DD" 
              [placeholder]="placeholder" 
              [monthNames]="monthList"
              [monthShortNames]="monthList" 
              [min]="minDate" [max]="maxDate" [(ngModel)]="currentValue">
              </ion-datetime>            
          
            `,
  styles:[`
.datetime-ios {
     padding: 0 !important; 
}
  `],
})
export class DatePicker implements OnInit,OnDestroy{

  @Input() label:string;
  @Input() placeholder:string = "yyyy-MM-dd";
  @Input() minDate:string="2016-10-31";
  @Input() maxDate:string;
  @Output() currentValueChange = new EventEmitter();

  private currentValueTmp;
  @Input()
  get currentValue(): string {
    return this.currentValueTmp;
  }

  set currentValue(value: string) {
    this.currentValueTmp = value;
    this.currentValueChange.emit(this.currentValueTmp);
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
  }

}
