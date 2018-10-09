import {Component, Input, Output, EventEmitter} from '@angular/core';
import 'rxjs/add/operator/switchMap';
import {SmsMgr} from "../../../bsModule/sms/SmsMgr";
import {RandomCodeAPIForm} from "../../../bsModule/buser/apiData/RandomCodeAPIForm";
import {AppUtils} from "../../../comModule/AppUtils";


/**
 * 验证码共用组件
 * <vCode-comp [(zmValue)]="regForm.verifyCode"  [phone]="regForm.phone"  [disbtn]="disbtn" (callBack)="showSuccess($event)" ></vCode-comp>
 * */

@Component({
  selector: 'vCode-comp',
  template: `
      <div class="">
        <div class="input-group form-group" style="align-items: center;" >
        <label class="text-left font-bold"  style="font-size: 18px;margin-bottom: 0;width: 80px;margin-right: 15px;">验证码</label>
        <input type="text" [ngClass]="{'form-valid-error':verifyCode.invalid && (verifyCode.touched)}"  style="border-right:none !important;height:48px;border-width:2px;border-top-left-radius:0.25rem;border-bottom-left-radius: 0.25rem;" class="form-control c-reg-input" required placeholder="请输入验证码" name="verifyCode" #verifyCode ="ngModel" [(ngModel)] = "zmValue" pattern="^\\s*([\\d]{4})\\s*$" />
            <button type="button" id="regCode" class="btn c-btn-blue c-form-control" [disabled]="phone == null || disbtn"  (click)="send()">
              {{btnValue}}
            </button>
        </div>
        <div  class="c-input-error" style=" height: 30px; font-size: 12px; color: red;margin-left: 100px;">
            <div  class="text-danger"    *ngIf="verifyCode.invalid && (verifyCode.touched)">
              <div *ngIf="verifyCode.errors.required">
                验证码不能为空
              </div>
            <div *ngIf="verifyCode.errors.pattern">
              请输入4位数字的验证码
            </div>
           </div>
         </div>
       </div>
      `,
  styles: [`
  .form-valid-error{
    border: 2px solid #FF4c6a !important;
  }
  .c-form-control{ 
      border-bottom-left-radius:0 !important;
      border-top-left-radius:0 !important;
      line-height:48px;
      height:48px;
      padding: 0 0.75rem;
      }
      .c-reg-input:focus{
        border-color: #0f88de !important;
      }
      `],
})
export class VerifyCodeComp {
  success: boolean = false;
  @Input() disbtn: boolean;
  @Input() phone: string;
  @Output() callBack = new EventEmitter();

  @Output() zmValueChange = new EventEmitter();
  private zmValueTmp:string;

  constructor(private smsMgr: SmsMgr) {
  }

  @Input()
  get zmValue(): string {
    return this.zmValueTmp;
  }

  set zmValue(value: string) {
    this.zmValueTmp = value;
    this.zmValueChange.emit(this.zmValueTmp);
  }

  /**
   * 发送短信验证码点击事件
   *
   */

  btnValue = "获取验证码";
  public send() {

    let phoneNumber = AppUtils.trimBlank(this.phone);
    let randomCodeAPIForm = new RandomCodeAPIForm();
    randomCodeAPIForm.phoneNumber = phoneNumber;

    this.smsMgr.sendSms(randomCodeAPIForm).then(
      (restResp) => {
        if (restResp.code == 200) {
          console.log("验证码发送成功");
        } else {
          console.log(restResp.tips);
        }
      }
    );
    this.time(60);
  }

  /**
   * 60s倒计时
   * */
  public time(wait) {
    let fun = this;
    if (wait == 0) {
      //按钮可点击
      this.disbtn = false;
      this.btnValue = "获取验证码";
      return;
    } else {
      //按钮不可点击
      this.disbtn = true;
      this.btnValue = wait + "S后重新获取";
      wait--;
    }
    setTimeout(function () {
      fun.time(wait)
    }, 1000)
  }

}
