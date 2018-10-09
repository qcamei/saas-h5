import {OnInit, OnDestroy, OnChanges, Component, SimpleChanges, Input, Output, EventEmitter} from "@angular/core";
import {NgbDatepickerConfig, NgbDateStruct, NgbTimepickerConfig} from "@ng-bootstrap/ng-bootstrap";
import {AppUtils} from "../../../comModule/AppUtils";

/**
 * 时间选择公共组件
 * eg:
 *  <zm_time [label]="'设置时间'" [minuteStep]="minuteStep" [seconds]="seconds" [(currentValue)]="currentTime"></zm_time>
 */
@Component({
  selector:"zm_time",
  template:`
            <label class="c-label mg-b-0 font-bold fz-14 mg-l-20 mg-r-10" style="color: #000;">{{label}}</label>
            <ngb-timepicker [(ngModel)]="currentValue" [minuteStep]="minuteStep" [seconds]="seconds"  class="time-list"></ngb-timepicker>
            `
})
export class ZmTime implements OnInit,OnDestroy,OnChanges{

  @Input() label:string;
  @Input() minuteStep:number;
  @Input() seconds:boolean;
  @Output() currentValueChange = new EventEmitter();

  private currentValueTmp:any;

  constructor(private timepickerConfig:NgbTimepickerConfig){

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
