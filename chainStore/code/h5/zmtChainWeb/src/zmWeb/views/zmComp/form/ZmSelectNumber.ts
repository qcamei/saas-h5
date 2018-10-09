import {OnInit, Component, Input, Output, EventEmitter} from "@angular/core";
import {AppUtils} from "../../../comModule/AppUtils";

/**
 * 下拉选择select组件
 * eg:
 <zm-select  [label]="'接受状态'" nameValues="未接受:0,已接受:1,已取消:2,已完成:3"  [(zmValue)]="viewData.queryForm.status"   (selectCallback)="getAppointmentByReq()"></zm-select>
 */
@Component({
  selector:"zm-select-number",
  template:`
    <ng-container *ngIf="selectList">

      <mat-form-field style="width:100%" color="accent">      
         <mat-select [placeholder]="label" [(ngModel)]="zmValue" (selectionChange)="selectOption($event)">
            <mat-option *ngIf="!noAll" [value]="allSelect.value">{{allSelect.name}}</mat-option>
            <mat-option *ngFor="let item of selectList" [value]="item[this.value]">{{item[this.name]}}</mat-option>
         </mat-select>
      </mat-form-field>
   </ng-container>
  `,
  styles:[`
  `]
})
export class ZmSelectNumber implements OnInit{

  //方式1 只输入字符串 这个方法输入的值会覆盖方法2 格式 name1:value1,name2:value2,
  @Input() nameValues:string;

  //方式2 输入item列表
  @Input() selectList:Array<any>;

  @Input() name:string = "name";
  @Input() value:string = "value";

  @Input() noAll:boolean = false;
  @Input() label:string;
  @Output() zmValueChange:EventEmitter<any> = new EventEmitter<any>();
  @Output() selectCallback:EventEmitter<any> = new EventEmitter<any>();

  /**
   * zmValue 双向绑定
   */

  private valueTmp: number;
  @Input()
  get zmValue() {
    return this.valueTmp;
  }

  set zmValue(val:number) {
    if(!AppUtils.isNullObj(val)){
      this.valueTmp = val;
      this.zmValueChange.emit(this.valueTmp);
    }
  }

  public allSelect:SelectItem = new SelectItem("全部",-1);

  ngOnInit(): void {
    if(this.nameValues){
      this.selectList = new Array<SelectItem>();
      this.nameValues.split(",").forEach((item)=>{
        let pair = item.split(":");
        let nameTmp = pair[0];
        let valueTmp = pair[1];
        let sItemTmp = new SelectItem(nameTmp,Number(valueTmp));
        this.selectList.push(sItemTmp);
      })
    }

  }


  /**
   * 选择事件
   * @param valueP
   */
  selectOption(selected){
    this.selectCallback.emit(selected);
  }

}

export class SelectItem{
  public name:string;
  public value:number;
  constructor(nameP:string,valueP:number){
    this.name = nameP;
    this.value = valueP;
  }
}

