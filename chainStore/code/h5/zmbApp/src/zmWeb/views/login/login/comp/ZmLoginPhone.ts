import {Component, Input, Output, EventEmitter} from "@angular/core";
import {AppUtils} from "../../../../comModule/AppUtils";
/**
 * Created by helen on 2018/2/28.
 * 电话号码输入框  支持港澳台
 *
 <zm_login_phone [(zmValue)]="viewData.formData.phone" [(zmPass)]="viewData.formData.phonePass"  (valueChecked)="viewData.formData.check()" (click)="clearSubmitError()" ></zm_login_phone>

 <zm_login_password [(zmValue)]="viewData.formData.password" [(zmPass)]="viewData.formData.passwordPass"  (valueChecked)="viewData.formData.check()" (click)="clearSubmitError()" (keyup)="isEnter($event)"></zm_login_password>
 <zm_login_button [text]=" '登录' " [canSubmit]="viewData.formData.canSubmit" (zmClick)="login()" [errorMsg]="viewData.formData.submitErrorMsg"></zm_login_button>
 */

@Component({
  selector:'zm-login-phone',
  template: `
             <ion-item style="border-bottom:1px solid #cccccc;">
              <ion-label  stacked>
                <ion-icon name="phone-portrait"  item-start></ion-icon>
                 手机号
              </ion-label>
             <ion-input type="text"  placeholder="请输入手机号" [(ngModel)] = "zmValue" [ngClass]="{'form-valid-error':!zmPass}" (blur)="checkPhone()"></ion-input>
            </ion-item>
             <div class="c-login-error" color="danger">
                 <div class="text-danger" *ngIf="!zmPass" >
                     {{errorMsg}}
                 </div>
             </div>
            `,
  // styleUrls: ['loginInput.scss'] ionic 不需要引用scss文件，只需要吧scss文件放在对应文件的相同目录

})

export class ZmLoginPhone{

  @Output() valueChecked:EventEmitter<any> = new EventEmitter();
  errorMsg:string="";

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


  constructor(){
  }

  public checkPhone() {

    let phone = "";
    if(!AppUtils.isNullOrWhiteSpace(this.zmValue)){
      phone = this.zmValue;
    }

    if(AppUtils.isNullOrWhiteSpace(phone)){
      this.zmPass = false;
      this.errorMsg = "手机号不能为空";
    }else{
      let regExp = new RegExp("^\\s*[1][1-9]\\d{9}$|^([6|9])\\d{7}$|^[0][9]\\d{8}$|^[6]([8|6])\\d{5}\\s*$");
      let b = regExp.test(phone);
      if (b == false) {
        this.zmPass = false;
        this.errorMsg = "手机号格式错误";
      }else{
        this.zmPass = true;
        this.errorMsg = "";
      }
    }

    //通知外部 value做了检查
    this.valueChecked.emit();
  }
}


