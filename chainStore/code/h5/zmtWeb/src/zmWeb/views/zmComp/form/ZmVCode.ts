import {Component, Input, Output, EventEmitter} from '@angular/core';
import 'rxjs/add/operator/switchMap';
import {RandomCodeAPIForm} from "../../../bsModule/buser/apiData/RandomCodeAPIForm";
import {AppUtils} from "../../../comModule/AppUtils";
import {SmsMgr} from "../../../bsModule/sms/SmsMgr";


/**
 * 验证码共用组件
 * <zm-vCode [(zmValue)]="viewData.formData.vCode"  [(zmPass)]="viewData.formData.vCodePass"
 *  [phone]="viewData.formData.phone" [phonePass]="viewData.formData.phonePass"
 * (valueChecked)="viewData.formData.check()"  [disabled]="viewData.vCodeDisabled" [zmCheckMark] = "viewData.formData.doCheckMark" ></zm-vCode>
 * */

@Component({
  selector: 'zm-vCode',
  template: `
          <div class="disFlex align-center">
              <label class="c-input-label">验证码</label>
              <input type="text" [ngClass]="{'form-valid-error':active && !zmPass}"  style="border-top-left-radius:0.375rem;border-bottom-left-radius: 0.375rem;" 
                   class="c-input flex" placeholder="请输入验证码" [(ngModel)] = "zmValue"  (blur)="check()" />
                  <button type="button"  class="c-reg-btn c-btn-blue " [disabled]="!phonePass || disabled"  (click)="send()">
                      {{btnText}}
                  </button>
          </div>
          <div class="c-input-error">
                <div *ngIf="!zmPass">
                    {{errorMsg}}
                </div>
          </div>      
      
      `,
  styleUrls: ['./input.scss']
})
export class ZmVCode {
  constructor(private smsMgr: SmsMgr) {}

  btnText:string="获取验证码";
  errorMsg:string="";
  active:boolean=false;
  disabled:boolean = false;

  private disabledTmp: boolean;
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
    this.active = true;
    let vCode = "";
    if(!AppUtils.isNullOrWhiteSpace(this.zmValueTmp)){
      vCode = this.zmValueTmp;
    }

    if(AppUtils.isNullOrWhiteSpace(vCode)){
      this.zmPass = false;
      this.errorMsg = "验证码不能为空";
    }else{
      let regExp = new RegExp("^\\s*([\\d]{4})\\s*$");
      let b = regExp.test(vCode);
      if (b == false) {
        this.zmPass = false;
        this.errorMsg = "请输入4位数字的验证码";
      }else{
        this.zmPass = true;
        this.errorMsg = "";
      }
    }
  }



  /**
   * 发送短信验证码点击事件
   *
   */

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

}
