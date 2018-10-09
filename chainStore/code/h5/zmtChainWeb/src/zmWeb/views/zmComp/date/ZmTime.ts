import {OnInit, Component, Input, Output, EventEmitter} from "@angular/core";

/**
 * 时间选择公共组件
 * eg:
 *  <zm-time [label]="'设置时间'"   [(currentValue)]="currentTime"></zm-time>
 */
@Component({
  selector:"zm-time",
  template:`
      
          <div class="disFlex align-center">
            <label class="c-label mg-b-0 font-bold fz-14 mg-l-20 mg-r-10" style="color: #000;">{{label}}</label>
            <div>
              <div class="text-center cur-hand" (click)="addHour()"><i class="fa fa-chevron-up font-c1"></i></div>
                 <input type="number" oninput="if(value < 0 || value>23)value = null"  class="c-input" placeholder="HH"  [(ngModel)]="currentValue.hour">
              <div  class="text-center cur-hand" (click)="subHour()" ><i class="fa fa-chevron-down font-c1"></i></div>
            </div>
            <div class="font-bold mg-lr-10" style="color: #6f7173">:</div>
            <div>
              <div  class="text-center cur-hand"  (click)="addMinute()"><i class="fa fa-chevron-up font-c1"></i></div>
                 <input type="number" oninput="if(value < 0 || value>59)value = null" class="c-input" placeholder="MM" [(ngModel)]="currentValue.minute" >
              <div  class="text-center cur-hand" (click)="subMinute()"><i class="fa fa-chevron-down font-c1"></i></div>
          </div>
          </div>
  `,
  styles:[`
    input[type=number] {
    -moz-appearance: textfield;
    }
    input[type=number]::-webkit-inner-spin-button,
    input[type=number]::-webkit-outer-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
    .disFlex {
      display: -webkit-box;
      display: -ms-flexbox;
      display: -webkit-flex;
      display: -moz-box;
      display: flex;
    }

    .align-center {
      -webkit-box-align: center;
      -ms-flex-align: center;
      -webkit-align-items: center;
      -moz-box-align: center;
      align-items: center;
    }
    
    .mg-b-0{
      margin-bottom:0;
    } 
    .mg-l-20{
      margin-left: 20px;
    } 
    .mg-r-10{
      margin-right: 10px;
    } 
    .font-bold{
      font-weight: bold;
    } 
    .fz-14{
      font-size: 14px;
    } 
    .text-center{
      text-align: center;
    } 
    .cur-hand{
      cursor: pointer;
    } 
    .font-c1{
      color:#03a9f4;
    } 
    .mg-lr-10{
      margin-left:10px;
      margin-right:10px;
    }   
    .c-input{
      display: block;
      padding: 0.375rem 0.75rem;
      width: 60px;
      text-align: center;
      font-size: 14px;
      color: #495057;
      background-color: #fff;
      background-image: none;
      background-clip: padding-box;
      border: 2px solid #ced4da;
      border-radius: 0.25rem;
      outline: none;
    }
  `]
})
export class ZmTime implements OnInit{

  @Input() label:string;

  @Output() currentValueChange = new EventEmitter();
  private currentValueTmp:ZmTimeData;
    constructor(){
  }
  ngOnInit(): void {
    if(!this.currentValue){
      this.currentValue = new ZmTimeData(12,12,12);
    }
  }

  @Input()
  get currentValue(): ZmTimeData {
    return this.currentValueTmp;
  }

  set currentValue(value: ZmTimeData){
    if(value.minute>0 && value.minute<=30){
      value.minute=30;
    }else if(value.minute>30){
      value.minute=0;
      value.hour++;
    }
    this.currentValueTmp = value;
    this.currentValueChange.emit(this.currentValueTmp);
  }

    addHour(){
      if(this.currentValue.hour<23){
        this.currentValue.hour++;
      }else if (this.currentValue.hour===23){
        this.currentValue.hour = 0;
      } else{
        this.currentValue.hour = this.currentValue.hour;
      }
    }
  subHour(){
    if(this.currentValue.hour>0){
      this.currentValue.hour--;
    }else{
      this.currentValue.hour = this.currentValue.hour;
    }
  }
  addMinute(){
    if(this.currentValue.minute<59){
      this.currentValue.minute=parseInt(this.currentValue.minute.toString())+30;
      if(this.currentValue.minute==60){
        this.currentValue.minute=0;
        this.addHour();
      }
    }else if (this.currentValue.minute===59){
      this.currentValue.minute = 0;
    }
    else{
      this.currentValue.minute = this.currentValue.minute;
    }
  }
  subMinute(){
    if(this.currentValue.minute>0){
      this.currentValue.minute=parseInt(this.currentValue.minute.toString())-30;
    }else{
      this.currentValue.minute = this.currentValue.minute;
    }
  }
}
    export class ZmTimeData{
        hour:number;
        minute:number;
        second:number;
      constructor(hourP,minuteP,secondP?){
        this.hour = hourP;
        this.minute = minuteP;
        this.second = secondP?secondP:0;
      }
    }
