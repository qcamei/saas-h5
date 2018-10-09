import {OnInit, OnDestroy, Component, Input, Output, EventEmitter} from "@angular/core";
import {NgbDatepickerConfig, NgbDateStruct} from "@ng-bootstrap/ng-bootstrap";
import {AppUtils} from "../../../comModule/AppUtils";

/**
 * 日期搜索公共组件
 * eg:
 *  <zm_search_date [label]="'预约时间'" [placeholder]="'请选择预约时间'" [(curValue)]="curDate" (callback)=""></zm_search_date>
 */
@Component({
  selector:"zm_search_date",
  template:`
    
        <div  *ngIf="!isBig" class="disFlex align-center position-relative">
          <label class="mg-b-0 font-bold fz-14">{{label}}</label>
          <input class=" c-input-data" placeholder="请选择时间22" (click)="e.toggle()" readonly name="dp" ngbDatepicker
                 #e="ngbDatepicker" [(ngModel)]="curValue" [ngModelOptions]="{standalone: true}"  (ngModelChange)="changeDate()">
          <button class="input-group-addon c-client-data disFlex" (click)="e.toggle()" type="button">
            <i class="fa fa-calendar-o" aria-hidden="true" style=" cursor: pointer;font-size: 14px;"></i>
          </button>
        </div>

        <div *ngIf="isBig" class="disFlex align-center position-relative" style="width:100%;">
          <label class="mg-b-0 font-bold fz-14">{{label}}</label>
          <input class=" c-input-data-big" placeholder="请选择时间" (click)="e.toggle()" readonly name="dp" ngbDatepicker
                 #e="ngbDatepicker" [(ngModel)]="curValue" [ngModelOptions]="{standalone: true}"  (ngModelChange)="changeDate()">
          <button class="input-group-addon-big c-client-datadisFlex" (click)="e.toggle()" type="button">
            <i class="fa fa-calendar-o" aria-hidden="true" style=" cursor: pointer;font-size: 14px;"></i>
          </button>
        </div>
       
            `,
  styles:[`

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
    .font-bold{
      font-weight: bold;
    } 
    .fz-14{
      font-size: 14px;
    }
  
    .c-client-data {
      outline: none;
      height: 30px;
      border: 2px solid #dadfe6 !important;
      border-top-left-radius: 0 !important;;
      border-bottom-left-radius: 0 !important;
      border-top-right-radius: 0.375rem;
      border-bottom-right-radius: 0.375rem;
      background: transparent;
  }
  .c-client-data:focus {
    border-color: #dadfe6;
  }


  .c-input-data {
    border-top-left-radius: 0.375rem;
    border-bottom-left-radius: 0.375rem;
    border: 2px solid #dadfe6;
    border-right: none;
    height: 30px;
    font-size: 14px;
    padding-left: 10px;
    margin-left: 10px;
    outline: none;
    width: 150px;
  }
  .c-input-data-big {
    border-top-left-radius: 0.375rem;
    border-bottom-left-radius: 0.375rem;
    border: 1px solid #dadfe6;
    border-right: none;
    height: 37px;
    font-size: 14px;
    padding-left: 10px;
    outline: none;
    width: 100%;
  }

  .input-group-addon-big {
    padding: 0.375rem 0.75rem;
    margin-bottom: 0;
    font-size: 1rem;
    font-weight: 400;
    line-height: 1.5;
    color: #495057;
    text-align: center;
    background-color: #e9ecef;
    border: 1px solid #ced4da;
    border-radius: 0.25rem;
}
  `]
})
export class ZmSearchDate implements OnInit,OnDestroy {

  @Input() isBig:boolean;
  @Input() label:string;
  @Input() placeholder:string = "yyyy-mm-dd";
  @Input() minDate:Date;//可选的最小时间 eg:minDate = new Date("2018-3-5")
  @Input() maxDate:Date;//可选的最大时间 eg:maxDate = new Date("2018-3-15")
  @Output() curValueChange = new EventEmitter();

  @Output() callback = new EventEmitter();

  private curValueTmp:any;

  constructor(private datepickerConfig:NgbDatepickerConfig){
    datepickerConfig.outsideDays = 'hidden';
  }

  @Input()
  get curValue(): any {
    return this.curValueTmp;
  }

  set curValue(value: any) {
    this.curValueTmp = value;
    this.curValueChange.emit(this.curValueTmp);
  }

  ngOnInit(): void {
    if(!AppUtils.isNullObj(this.minDate)){
      this.datepickerConfig.markDisabled = (date: NgbDateStruct) => {
        const d = new Date(date.year, date.month-1, date.day);
        const minDate = new Date(this.minDate.getFullYear(), this.minDate.getMonth(), this.minDate.getDate());
        return d.getTime() < minDate.getTime();
      };
    }
    if(!AppUtils.isNullObj(this.maxDate)){
      this.datepickerConfig.markDisabled = (date: NgbDateStruct) => {
        const d = new Date(date.year, date.month - 1, date.day);
        return d > this.maxDate;
      };
    }
  }

  ngOnDestroy(): void {
  }

  changeDate(){
    this.callback.emit();
  }

}

