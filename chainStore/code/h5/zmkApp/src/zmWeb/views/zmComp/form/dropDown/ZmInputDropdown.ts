import {Output, Component, EventEmitter, Input} from "@angular/core";
import {AppUtils} from "../../../../comModule/AppUtils";
/**
 * Created by zenmind on 2018/2/23.
 *
 e.g
 <zm-btn-dropdown [itemList]="viewData.formData.select" [(zmValue)]="viewData.formData.select" [(zmPass)]="viewData.formData.selectPass"
 label="选取分类"  (valueChecked)="viewData.formData.check()" [zmCheckMark]="viewData.formData.zmCheckMark" ></zm-btn-dropdown>
 */


@Component({
  selector:'zm-input-dropdown',
  template: `
            <ion-item>
              <ion-label>{{label}}</ion-label>
              <ion-select [(ngModel)]="zmValue" (blur)="check()">
                <ion-option *ngFor="let item of itemList" [value]="item.id">{{item.name}}</ion-option>
              </ion-select>
            </ion-item>
            <div class="c-input-error">
                  <div *ngIf="!zmPass">
                      {{errorMsg}}
                  </div>
             </div>   

             <!--<div class="disFlex align-center">-->
                    <!--<span style="color:#ff355d;">*</span><label class="c-input-label">{{label}}</label>-->
                    <!--<select class="c-input" [ngClass]="{'form-valid-error':active && !zmPass}" [(ngModel)]="zmValue"  (blur)="check()">-->
                      <!--<option *ngFor="let item of itemList" [value]="item.id">{{item.name}}</option>-->
                    <!--</select>-->
             <!--</div>-->
             
              
          `
})
export class ZmInputDropdown{

  constructor(){ }

  active = false;
  errorMsg:string;

  @Input() itemList:Array<DropDownItem>;
  @Input() label: string;
  @Output() valueChecked:EventEmitter<any> = new EventEmitter();


  /**
   * zmvalue 双向绑定
   */
  private zmValueTmp:string;
  @Output() zmValueChange = new EventEmitter();

  @Input()
  get zmValue() {
    return this.zmValueTmp;
  }
  set zmValue(val) {
    this.zmValueTmp = val;
    this.zmValueChange.emit(this.zmValueTmp);
  }

  /**
   * zmPass 双向绑定
   */
  private zmPassTmp:boolean;
  @Output() zmPassChange = new EventEmitter();

  @Input()
  get zmPass():boolean {
    return this.zmPassTmp;
  }
  set zmPass(val:boolean) {
    this.zmPassTmp = val;
    this.zmPassChange.emit(this.zmPassTmp);
  }

  private zmCheckMarkTmp:string;
  //zmCheckMark 不一样的时候做检测，一般是由提交按钮发起的
  @Input()
  get zmCheckMark():string {
    return this.zmCheckMarkTmp;
  }
  set zmCheckMark(val:string) {
    if(AppUtils.isNullOrWhiteSpace(this.zmCheckMarkTmp)){
      this.zmCheckMarkTmp = val;
    }else if(!AppUtils.isNullOrWhiteSpace(val) && val != this.zmCheckMarkTmp ){
      this.zmCheckMarkTmp = val;
      this.check();
    }
  }


  public check() {
    this.active = true;

    let name = this.zmValue;

    if(AppUtils.isNullOrWhiteSpace(name)){
      this.zmPass = false;
      this.errorMsg = this.label+"不能为空 ";
    }else{
      this.zmPass = true;
      this.errorMsg = "";
    }
    //通知外部 value做了检查
    this.valueChecked.emit();
  }
}

export interface DropDownItem {

  id:string;
  name:string;

}
