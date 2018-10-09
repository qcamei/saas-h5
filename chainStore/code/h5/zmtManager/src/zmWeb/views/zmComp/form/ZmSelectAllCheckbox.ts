import {Component, Input, Output, EventEmitter, OnInit} from "@angular/core";
import {AppUtils} from "../../../comModule/AppUtils";
/**
 * Created by sunbirdjob on 2018/3/8.
 * <select_all_checkbox [lable]=" '全选' "  [(zmValue)] = "isSlectedAll" [(zmList)]="data.productList" (callback)="selectAll()"></select_all_checkbox>
 */

@Component({
  selector:'select_all_checkbox',
  template: `
            <div (click)="selectAll()" class="disFlex align-center" style="justify-content: center;">
                <span class="c-child-checkbox disFlex align-center" >
                <span style="cursor: pointer;width: 16px;height: 16px;display: inline-block;"><img src="assets/images/icon/checkbox.png" alt="" *ngIf="valueTmp" style="display: inherit;"></span>
                  <span style="cursor: pointer;width: 16px;height: 16px;display: inline-block;margin-left: -16px;"><img src="assets/images/icon/checkboxNo.png" alt="" *ngIf="!valueTmp" style="display: inherit;"></span>
                </span>
                <span *ngIf="lable" class="mg-l-10 cur-hand" >{{lable}}</span>
                <ng-content select="content"></ng-content>
            </div>
            `,
  styleUrls: ['./input.scss']
})

export class SellectAllCheckbox implements OnInit{

  @Input() lable:string;
  @Output() callback = new EventEmitter();

  public valueTmp:any;
  @Output() zmValueChange = new EventEmitter();

  @Input()
  get zmValue() {
    return this.valueTmp;
  }
  set zmValue(val) {
    this.valueTmp = val;
    this.zmValueChange.emit(this.valueTmp);
  }



  private listTmp:Array<any>;
  @Output() zmListChange = new EventEmitter();

  @Input()
  get zmList() {
    return this.listTmp;
  }
  set zmList(val) {
    this.listTmp = val;
    if(this.listTmp && this.listTmp.length>0){
      this.check();
    }else{
      this.valueTmp = false;
      this.zmValueChange.emit(this.valueTmp);
    }

    this.zmListChange.emit(this.listTmp);
  }

  ngOnInit(): void {

  }

  selectAll():void{
    if(this.listTmp && this.listTmp.length>0){
      this.valueTmp = !this.valueTmp;
      this.zmValueChange.emit(this.valueTmp);
    }else{
      AppUtils.showWarn("提示","列表为空");
    }

    this.callback.emit();
  }

  check(){
    let checkList = new Array<boolean>();
    for(let item of this.listTmp){
      checkList.push(item.checked);
    }
    if(AppUtils.arrayContains(checkList,false)){
      this.valueTmp = false;
      this.zmValueChange.emit(this.valueTmp);
    }else{
      this.valueTmp = true;
      this.zmValueChange.emit(this.valueTmp);
    }
  }

}
