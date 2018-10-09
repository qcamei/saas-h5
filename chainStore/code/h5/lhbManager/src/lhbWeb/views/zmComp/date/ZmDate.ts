import {OnInit, OnDestroy, OnChanges, Component, SimpleChanges, Input, Output, EventEmitter} from "@angular/core";
import {NgbDatepickerConfig, NgbDateStruct} from "@ng-bootstrap/ng-bootstrap";
import {AppUtils} from "../../../comModule/AppUtils";

/**
 * 日期选择公共组件
 * eg:
 *  <zm_date [label]="'生日'" [placeholder]="'请选择生日'" [(currentValue)]="currentDate"></zm_date>
 */
@Component({
  selector:"zm_date",
  template:`
            <label class="c-label">{{label}}</label>
            <input class="form-control col-8 c-input-data"  (click)="a.toggle()"  placeholder="{{placeholder}}"  name="dp" [(ngModel)]="currentValue" ngbDatepicker #a="ngbDatepicker" readonly>
            <button class="input-group-addon c-client-data" (click)="a.toggle()" type="button">
                <i class="fa fa-calendar-o" aria-hidden="true" style=" cursor: pointer;"></i>
            </button>
            `
})
export class ZmDate implements OnInit,OnDestroy,OnChanges{

  @Input() label:string;
  @Input() placeholder:string = "yyyy-mm-dd";
  @Input() minDate:any;
  @Input() maxDate:any;
  @Output() currentValueChange = new EventEmitter();

  private currentValueTmp:any;

  constructor(private datepickerConfig:NgbDatepickerConfig){

    datepickerConfig.markDisabled = (date: NgbDateStruct) => {
      const d = new Date(date.year, date.month - 1, date.day);
      return d < new Date("2018-3-5");
    };
    if(!AppUtils.isNullObj(this.minDate)){
      datepickerConfig.minDate = this.minDate;
    }
    if(!AppUtils.isNullObj(this.maxDate)){
      datepickerConfig.maxDate = this.maxDate;
    }
    datepickerConfig.outsideDays = 'hidden';
    this.currentValueTmp = {year:2018,month:3,day:8}
  }

  @Input()
  get currentValue(): any {
    return this.currentValueTmp;
  }

  set currentValue(value: any) {
    this.currentValueTmp = value;
    this.currentValueChange.emit(this.currentValueTmp);
  }

  ngOnInit(): void {

  }

  ngOnDestroy(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
  }
}
