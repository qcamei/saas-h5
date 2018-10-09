import {Component, Input, Output, EventEmitter} from '@angular/core';
import 'rxjs/add/operator/switchMap';
import {AppUtils} from "../../../../comModule/AppUtils";
import {SmsMgr} from "../../../../bsModule/sms/SmsMgr";
import {RandomCodeAPIForm} from "../../../../bsModule/sms/apiData/RandomCodeAPIForm";


/**
 * 验证码共用组件
 * <zm-login-vCode [(zmValue)]="viewData.formData.vCode"  [(zmPass)]="viewData.formData.vCodePass"
 *  [phone]="viewData.formData.phone" [phonePass]="viewData.formData.phonePass"
 * (valueChecked)="viewData.formData.check()"  [disabled]="viewData.vCodeDisabled" [zmCheckMark] = "viewData.formData.doCheckMark" ></zm-login-vCode>
 * */

@Component({
  selector: 'zm-login-vCode',
  template: `
       <!-- <ion-toolbar>
              <input class="c-input" type="text" placeholder="请输入验证码" [(ngModel)] = "zmValue"  (ionBlur)="check()"/>
              <ion-buttons end>
                  <button  class="c-vcode-btn" [disabled]="!phonePass || disabled"  (click)="send()">
                      {{btnText}}
                  </button>
              </ion-buttons>
        </ion-toolbar>-->

        <ion-item style="border-bottom:1px solid #cccccc;">
              <ion-label stacked>
                <ion-icon name="lock" item-start class="text-primary"></ion-icon>
                验证码
              </ion-label>
              <ion-input type="text" placeholder="请输入验证码" [(ngModel)]="zmValue" (ionBlur)="check()"></ion-input>
              <button ion-button item-end clear [disabled]="!phonePass || disabled"  (click)="send()"  style="margin-top:76px;font-size:16px;">{{btnText}}</button>
             
              </ion-item>
            <div class="c-login-error">
                 <div class="text-danger"  *ngIf="!zmPass">
                     {{this.errorMsg}}
                 </div>
             </div>
      
      `,
  styles:[`    
    
`]


})
export class ZmLoginVCode {
  constructor() {}

  btnText:string="获取验证码";
  errorMsg:string="";
  active:boolean=false;
  disabled:boolean = false;

  // private disabledTmp: boolean;
  // @Input()
  // get disabled(): boolean {
  //   return this.disabledTmp;
  // }
  // set disabled(value: boolean) {
  //   this.disabledTmp = value;
  //   if(!this.disabled){
  //     this.btnText = "获取验证码";
  //   }
  // }
  @Input() phonePass: boolean;
  @Input() phone: string;

  @Output() valueChecked:EventEmitter<any> = new EventEmitter();


  /**
   * zmValue 双向绑定
   */
  @Output() zmValueChange = new EventEmitter();
  private zmValueTmp:string;

  @Input()
  get zmValue(): string {
    return this.zmValueTmp;
  }
  set zmValue(value: string) {
    this.zmValueTmp = value;
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

  //触发检测双向绑定，当该值有变的时候触发检查
  private zmCheckMarkTmp:string;
  @Input()
  get zmCheckMark():string {
    return this.zmCheckMarkTmp;
  }
  set zmCheckMark(val:string) {
    if(!AppUtils.isNullOrWhiteSpace(val) && val != this.zmCheckMarkTmp ){
      this.zmCheckMarkTmp = val;
      this.check();
    }
  }

  public check() {
    // this.active = true;
    // let vCode = "";
    // if(!AppUtils.isNullOrWhiteSpace(this.zmValueTmp)){
    //   vCode = this.zmValueTmp;
    // }

    // if(AppUtils.isNullOrWhiteSpace(vCode)){
    //   this.zmPass = false;
    //   this.errorMsg = "验证码不能为空";
    // }else{
    //   let regExp = new RegExp("^\\s*([\\d]{4})\\s*$");
    //   let b = regExp.test(vCode);
    //   if (b == false) {
    //     this.zmPass = false;
    //     this.errorMsg = "请输入4位数字的验证码";
    //   }else{
    //     this.zmPass = true;
    //     this.errorMsg = "";
    //   }
    // }
  }



  /**
   * 发送短信验证码点击事件
   *
   */

  public send() {

    let phoneNumber = this.getPhoneNumber();
    let randomCodeAPIForm = new RandomCodeAPIForm();
    randomCodeAPIForm.phoneNumber = phoneNumber;

    SmsMgr.getInstance().sendSms(randomCodeAPIForm).then(
      (restResp) => {
        if (restResp.code == 200) {
          AppUtils.showSuccess("提示","发送验证码成功");
        } else {
          AppUtils.showError("提示",restResp.tips);
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
      this.disabled = false;
      this.btnText = "获取验证码";
      return;
    } else {
      //按钮不可点击
      this.disabled = true;
      this.btnText = wait + "S后重新获取";
      wait--;
    }
    setTimeout(function () {
      fun.time(wait)
    }, 1000)
  }

  private getPhoneNumber(){
    let phoneNumber = "";
    if (!AppUtils.isNullOrWhiteSpace(this.phone)) {
      phoneNumber = AppUtils.trimBlank(this.phone);
    }
    return phoneNumber;
  }
}
