import {OnInit, OnDestroy, Component, Input, Output, EventEmitter} from "@angular/core";

/**
 * 日期选择公共组件 只需指定最大时间或者最小时间 同时指定情况默认最小时间生效
 * eg:
 *  <zm-date [label]="'生日'" [placeholder]="'请选择生日'" [(currentValue)]="currentDateStr" ></zm-date>
 */
@Component({
  selector:"zm-date",
  template:`
      
            <button *ngIf="!small" ion-item style="border-bottom:1px solid #F7F5F5;">
                <ion-icon  md="md-calendar" ios="ios-calendar-outline" item-start color="primary"></ion-icon>  
                <ion-label item-start><span>{{label}}</span></ion-label>
                
                <ion-datetime 
                cancelText="返回"
                doneText="确定"
                displayFormat="YYYY-MM-DD" 
                [placeholder]="placeholder" 
                [monthNames]="monthList"
                [monthShortNames]="monthList" 
                [min]="minDate" [max]="maxDate" [(ngModel)]="currentValue">
                </ion-datetime>
            
             </button>
             
          <div *ngIf="small"  fxLayout="row" fxLayoutAlign="space-between center"  style="position:relative;">
            <div  fxLayout="row" fxLayoutAlign="start center">
               <ion-icon  md="md-calendar" ios="ios-calendar-outline" item-start color="primary"></ion-icon>  
               <span style="width:60px;">{{label}}</span>
            </div>
            
            
            <ion-datetime  style="padding:0 8px 0 10px !important"
            cancelText="返回"
            doneText="确定"
            displayFormat="YYYY-MM-DD" 
            [placeholder]="placeholder" 
            [monthNames]="monthList"
            [monthShortNames]="monthList" 
            [min]="minDate" [max]="maxDate" [(ngModel)]="currentValue">
            </ion-datetime>
            
          </div>
            `,
  styles:[`
     
  `],
})
export class ZmDatePicker implements OnInit,OnDestroy{

  @Input() label:string="选择日期";
  @Input() small:boolean=true;
  @Input() placeholder:string = "yyyy-mm-dd";
  @Input() minDate:string;
  @Input() maxDate:string;
  @Output() currentValueChange = new EventEmitter();

  weekDaysList = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
  monthList = ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"];

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
