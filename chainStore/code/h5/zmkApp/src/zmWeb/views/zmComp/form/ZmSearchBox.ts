import {Component, Input, Output, EventEmitter, ViewChild} from "@angular/core";
/**
 * Created by helen on 2018/2/28.
 * 查询组件
 *  <zm-search-box [label]=" '项目查询'" [placeholder]="'编号/名称'" [(zmValue)]="viewData.queryParam" (callBack)="queryListByQueryParam()"></zm-search-box>
 */

@Component({
  selector: 'zm-search-box',
  template: ` 
 
               <ion-searchbar #search placeholder="{{placeholder}}" [showCancelButton]="false" [(ngModel)]="zmValue" (ionInput) = "queryList()"></ion-searchbar>
                 
 
            `,

})

export class ZmSearchBox {

  @Input() label: string;
  @Input() placeholder: string;
  @Output() zmValueChange = new EventEmitter();
  @Output() callBack = new EventEmitter();
  private valueTmp: string;

  @ViewChild('search') searchObj;

  @Input()
  get zmValue() {
    return this.valueTmp;
  }

  set zmValue(val) {
    this.valueTmp = val;
    this.zmValueChange.emit(this.valueTmp);
  }

  constructor() {

  }

  /**查询列表*/
  queryList() {
    this.callBack.emit();//回调各自实现
  }

  focus(){
    this.searchObj.nativeElement.onfocus();
  }
}
