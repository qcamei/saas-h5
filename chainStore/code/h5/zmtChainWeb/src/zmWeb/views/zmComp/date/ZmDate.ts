import {OnInit, OnDestroy, Component, Input, Output, EventEmitter} from "@angular/core";
import {MAT_DATE_LOCALE, DateAdapter, MAT_DATE_FORMATS} from "@angular/material";
import {MomentDateAdapter, MAT_MOMENT_DATE_FORMATS} from "@angular/material-moment-adapter";

/**
 * 日期选择公共组件 只需指定最大时间或者最小时间 同时指定情况默认最小时间生效
 * eg:
  <zm-date [label]="'生日'" [placeholder]="'请选择生日'" [(curValue)]="curDate" ></zm-date>
 */
@Component({
  selector:"zm-date",
  template:`
    
     <mat-form-field color="accent">
          <input matInput [min]="minDate" [max]="maxDate" [matDatepicker]="picker" [placeholder]="label" [(ngModel)]="tmpDate" (dateChange)="changeDate()">
          <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
          <mat-datepicker #picker></mat-datepicker>
        </mat-form-field>
    
            `,
  providers: [
    // The locale would typically be provided on the root module of your application. We do it at
    // the component level here, due to limitations of our example generation script.
    {provide: MAT_DATE_LOCALE, useValue: 'zh-CN'},

    // `MomentDateAdapter` and `MAT_MOMENT_DATE_FORMATS` can be automatically provided by importing
    // `MatMomentDateModule` in your applications root module. We provide it at the component level
    // here, due to limitations of our example generation script.
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},
  ],
    })


export class ZmDate implements OnInit,OnDestroy{

  @Input() label:string;
  @Input() placeholder:string = "yyyy-mm-dd";
  @Input() minDate:Date;//可选的最小时间 eg:minDate = new Date("2018-3-5")
  @Input() maxDate:Date;//可选的最大时间 eg:maxDate = new Date("2018-3-15")
  @Output() curValueChange = new EventEmitter();

  @Output() callback = new EventEmitter();

  @Input()
  set curValue(value: any) {
    if(!value){
      return;
    }
    //外部设置变化触发
    this._tmpDate = this.toDate(value);
  }

  //mat 控件绑定的是tmpDate，因为input双向绑定的值的类型是moment 不是Date
  private _tmpDate:any;
  get tmpDate(): any {
    return this._tmpDate;
  }

  set tmpDate(value: any) {
    console.log(value);

    this._tmpDate = value;
    let output = this.toOutPutValue(value._d);
    console.log(output);
    this.curValueChange.emit(output);
  }

  private toDate(inputValue:any):Date{
    let dateTmp = new Date(Number(inputValue.year),Number(inputValue.month)-1,Number(inputValue.day));
    return dateTmp;
  }
  private toOutPutValue(date:Date){
    console.log(date);
    let valueTmp:any = {};
    valueTmp.year = date.getFullYear();
    valueTmp.month = date.getMonth()+1;
    valueTmp.day = date.getDate();
    return valueTmp;
  }

  ngOnInit(): void {

  }

  ngOnDestroy(): void {
  }

  changeDate(){
    this.callback.emit();
  }

}
