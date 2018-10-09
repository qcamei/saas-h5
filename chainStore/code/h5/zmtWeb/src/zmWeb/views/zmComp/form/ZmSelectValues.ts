import {OnInit, OnDestroy, Component, Input, Output, EventEmitter} from "@angular/core";

/**
 * 下拉选择select组件


 <zm-select-values [label]="'类型'" [allValue]="-1" [valueList]="valueList" (onSelect)="changeOption($event)"></zm-select-values>
 */
@Component({
  selector:"zm-select-values",
  template:`
      <mat-form-field style="width:100%">
      
         <mat-select [placeholder]="label" [(ngModel)]="zmValue"   (selectionChange)="selectOption($event)">
            <mat-option *ngIf="allValue" [value]="allValue">全部</mat-option>
            <mat-option *ngFor="let item of valueList" [value]="item">{{item}}</mat-option>
         </mat-select>
         
      
      </mat-form-field>

  `,
  styles:[`
  `]
})
export class ZmSelectValues implements OnInit,OnDestroy{

  //方式1 只输入字符串 这个方法输入的值会覆盖方法2 格式 value1,value2,
  @Input() values:string;

  //方式2 输入item列表
  @Input() valueList:Array<any>;

  @Input() allValue:number;

  @Input() label:string;
  @Output() zmValueChange:EventEmitter<any> = new EventEmitter<any>();
  @Output() onSelect:EventEmitter<any> = new EventEmitter<any>();

  /**
   * zmValue 双向绑定
   */

  private valueTmp: any;
  @Input()
  get zmValue() {
    return this.valueTmp;
  }

  set zmValue(val:any) {
    this.valueTmp = val;
    this.zmValueChange.emit(this.valueTmp);
  }

  ngOnInit(): void {
    if(this.values){
      this.valueList = new Array<any>();
      this.values.split(",").forEach((item)=>{
          this.valueList.push(item);
      })
    }
  }

  ngOnDestroy(): void {

  }

  /**
   * 选择事件
   * @param valueP
   */
  selectOption(selected){
    this.onSelect.emit(null);
  }

}


