import {Component, Input, Output, EventEmitter} from "@angular/core";
/**
 * Created by helen on 2018/2/28.
 * 查询组件
 *  <zm_search_box [label]=" '项目查询'" [placeholder]="'编号/名称'" [(zmValue)]="viewData.queryParam" (callBack)="queryListByQueryParam()"></zm_search_box>
 */

@Component({
  selector:'zm_search_box',
  template: ` 
       <div fxLayout="row">
           <div>
                  <mat-form-field  color="accent">
                    <input matInput placeholder="{{placeholder}}"  [(ngModel)]="zmValue" (keyup.enter)="queryList()" >
                  </mat-form-field>
           </div>
           <div fxFlexAlign="center">
            <button button="submit" mat-raised-button  color="accent" (click)="queryList()">查询</button>
           </div>
       </div>
`

})

export class ZmSearchBox{

  @Input() label: string;
  @Input() placeholder:string;
  @Output() zmValueChange = new EventEmitter();
  @Output() callBack = new EventEmitter();
  private valueTmp:string;


  @Input()
  get zmValue() {
    return this.valueTmp;
  }
  set zmValue(val) {
    this.valueTmp = val;
    this.zmValueChange.emit(this.valueTmp);
  }

  constructor(){

  }

  /**查询列表*/
  queryList() {
    this.callBack.emit();//回调各自实现
  }
}
