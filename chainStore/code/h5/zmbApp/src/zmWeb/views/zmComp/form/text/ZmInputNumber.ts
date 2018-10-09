import {Component, Input, Output, EventEmitter} from "@angular/core";
import {AppUtils} from "../../../../comModule/AppUtils";
/**
 * Created by helen on 2018/2/28.
 * 编号输入框
 *  <zm-input-number [label]=" '项目编号'" [placeholder]="'请输入项目编号'" [(zmValue)]="viewData.defaultNumber"></zm-input-number>
 */

@Component({
  selector:'zm-input-number',
  template: ` 
              <ion-item>
                <ion-label stacked> {{label}}</ion-label>
                <ion-input [placeholder]="placeholder" type="text" [disabled]="disabled" [(ngModel)]= "zmValue" (ionBlur)="check()"></ion-input>
              </ion-item> 
              
              <div class="input-error">
                  <div *ngIf="!zmPass">
                      {{errorMsg}}
                  </div>
              </div>   
 
            `,
  styles:[`
  
`]

})

export class ZmInputNumber{

  @Input() label: string;
  @Input() placeholder:string;
  @Output() valueChecked:EventEmitter<any> = new EventEmitter();
  errorMsg:string="";
  active:boolean=false;

  @Output() zmValueChange = new EventEmitter();
  private zmValueTmp:string;
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

    // let target = this.zmValue;

    this.zmPass = true;
    this.errorMsg = "";
    //通知外部 value做了检查
    this.valueChecked.emit();
  }

}
