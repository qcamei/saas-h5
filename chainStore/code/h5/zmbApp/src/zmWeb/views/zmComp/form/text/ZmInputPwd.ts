import {Component, Input, Output, EventEmitter} from "@angular/core";
import {AppUtils} from "../../../../comModule/AppUtils";
/**
 *
 <zm-input-pwd [(zmValue)]="viewData.formData.password" [(zmPass)]="viewData.formData.passwordPass"
 (valueChecked)="viewData.formData.check()"  ></zm-input-pwd>
 */

@Component({
  selector:'zm-input-pwd',
  template: `
              <ion-item>
                <ion-label stacked>
                  <!--<ion-icon name="lock" item-start class="text-primary"></ion-icon>-->
                  密码
                </ion-label>
                <ion-input type="password"  placeholder="请输入6-16位密码数字或字母" [(ngModel)] = "zmValue" (ionBlur)="check()"></ion-input>
              </ion-item>
              <div class="input-error">
                    <div *ngIf="!zmPass">
                        {{errorMsg}}
                    </div>
               </div>    
            `,

})

export class ZmInputPwd{
  constructor(){}

  @Output() valueChecked:EventEmitter<any> = new EventEmitter();
  errorMsg:string="";
  active:boolean=false;

  /**
   * zmValue 双向绑定
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
    if(AppUtils.isNullOrWhiteSpace(this.zmValueTmp)){
      this.zmPass = false;
      this.errorMsg = "密码不能为空";
    }else{
      if(this.zmValueTmp.match(/^\s*([\da-zA-Z]{6,16})\s*$/)){
        this.zmPass = true;
        this.errorMsg = "";
      }else{
        this.zmPass = false;
        this.errorMsg = "密码至少为6-16位数字或字母";
      }
    }

    //通知外部 value做了检查
    this.valueChecked.emit();
  }
}


