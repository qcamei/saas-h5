import {Component, Input, Output, EventEmitter} from "@angular/core";
/**
 * Created by helen on 2018/2/28.
 * 查询组件
 *  <zm_search_box [label]=" '项目查询'" [placeholder]="'编号/名称'" [(zmValue)]="viewData.queryParam" (callBack)="queryListByQueryParam()"></zm_search_box>
 */

@Component({
  selector:'zm_search_box',
  template: ` 
        <div class="c-prdlist-input">
        <label class="col-form-label mg-r-10 font-bold">{{label}}</label>
        <input class=" c-search-input" type="text" placeholder="{{placeholder}}" [(ngModel)]="zmValue" (keyup.enter)="queryList()"/>
        <button class="c-search-btn" (click)="queryList()">查询</button>
      </div>
            `,
  styles:[`
  .c-search-input{
      border-radius: 6px 0 0 6px;
      background: #F4F6FA;
      height: 30px;
      border: 1px solid #ECEFF3;
      padding: 0 10px;
      font-size: 14px;
      outline: none;
  }
   .c-search-btn{
      color: #fff;
      background: #4678fa;
      border: none;
      border-top-right-radius: 6px;
      border-bottom-right-radius: 6px;
      height: 30px;
      padding: 0 15px;
      font-size: 14px;
      margin-left: -5px;
      cursor: pointer;
      outline: none;
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
