import {Output, Component, EventEmitter, OnInit, OnDestroy, Input} from "@angular/core";
import {AppUtils} from "../../../../comModule/AppUtils";

/**
 * 密码输入公共组件
 * eg:
 *  <zm_login_phone [(zmValue)]="viewData.formData.phone" [(zmPass)]="viewData.formData.phonePass"  (valueChecked)="viewData.formData.check()" (click)="clearSubmitError()" ></zm_login_phone>

   <zm_login_password [(zmValue)]="viewData.formData.password" [(zmPass)]="viewData.formData.passwordPass"  (valueChecked)="viewData.formData.check()" (click)="clearSubmitError()" (keyup)="isEnter($event)"></zm_login_password>
   <zm_login_button [text]=" '登录' " [canSubmit]="viewData.formData.canSubmit" (zmClick)="login()" [errorMsg]="viewData.formData.submitErrorMsg"></zm_login_button>
 */
@Component({
  selector:'zm-login-password',
  template: `

            <ion-item>
              <ion-label stacked>
                <ion-icon name="lock" item-start class="text-primary"></ion-icon>
                验证码
              </ion-label>
              <ion-input type="password" placeholder="请输入验证码" [(ngModel)]="zmValue" (keyup)="checkVerifyCode()"></ion-input>
              <button *ngIf="true" ion-button item-end clear style="margin-top:51px;font-size:16px;">发送验证码</button>
              <button *ngIf="false" ion-button item-end clear style="margin-top:51px;font-size:16px;">等待 53 s</button>
              </ion-item>
            <div class="c-login-error">
                 <div class="text-danger"  *ngIf="!zmPass">
                     {{this.errorMsg}}
                 </div>
             </div>
            `,
})
export class ZmLoginPassword implements OnInit,OnDestroy {
  constructor(){}

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

  ngOnInit():void{

  }

  ngOnDestroy(): void {

  }

  checkVerifyCode(){
    if(AppUtils.isNullOrWhiteSpace(this.zmValueTmp)){
      this.zmPass = false;
      this.errorMsg = "验证码不能为空";
    }else{
      if(this.zmValueTmp.match(/^\s*([\d]{1,6})\s*$/)){
        this.zmPass = true;
        this.errorMsg = "";
      }else{
        this.zmPass = false;
        this.errorMsg = "验证码为1-6位数字";
      }
    }

    //通知外部 value做了检查
    this.valueChecked.emit();
  }

}
