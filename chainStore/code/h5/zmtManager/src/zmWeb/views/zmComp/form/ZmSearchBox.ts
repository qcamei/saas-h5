import {Component, Input, Output, EventEmitter} from "@angular/core";
/**
 * Created by helen on 2018/2/28.
 * 查询组件
 *  <zm_search_box [label]=" '项目查询'" [placeholder]="'编号/名称'" [(zmValue)]="viewData.queryParam" (callBack)="queryListByQueryParam()"></zm_search_box>
 */

@Component({
  selector:'zm_search_box',
  template: ` 
      <div class="c-devinfo disFlex align-center">
          <label class=" mg-b-0 fz-14 font-bold mg-r-10">{{label}}</label>
          <input class=" c-devinfo-input" type="text " placeholder="{{placeholder}}" [(ngModel)]="zmValue" (keyup.enter)="queryList()"/>
          <button class="c-devinfo-btn"  (click)="queryList()">查询</button>
      </div>


      
            `,
  styles:[`  


    .c-devinfo-input {
      border-radius: 6px 0 0 6px;
      background: #F4F6FA;
      height: 30px;
      border: 1px solid #ECEFF3;
      padding: 0 10px;
      outline: none;
      font-size: 14px;
    }
    .c-devinfo-btn {
      color: #fff;
      background: #4678fa;
      border: none;
      border-top-right-radius: 6px;
      border-bottom-right-radius: 6px;
      height: 30px;
      width: 58px;
      font-size: 14px;
      margin-left: -5px;
      cursor: pointer;
      outline: none;
      padding: 0 !important;
    }
`]

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
