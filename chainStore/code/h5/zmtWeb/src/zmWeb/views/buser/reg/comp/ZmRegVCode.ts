import {Component, Input, Output, EventEmitter} from '@angular/core';
import 'rxjs/add/operator/switchMap';
import {AppUtils} from "../../../../comModule/AppUtils";
import {SmsMgr} from "../../../../bsModule/sms/SmsMgr";
import {RandomCodeAPIForm} from "../../../../bsModule/buser/apiData/RandomCodeAPIForm";


/**
 * 验证码共用组件
 * <zm_reg_vCode [(zmValue)]="viewData.formData.vCode"  [(zmPass)]="viewData.formData.vCodePass"
 [areaCode]="viewData.formData.areaCode" [phone]="viewData.formData.phone" [phonePass]="viewData.formData.phonePass"
 (valueChecked)="viewData.formData.check()" ></zm_reg_vCode>
 * */

@Component({
  selector: 'zm_reg_vCode',
  template: `
          <div class="disFlex align-center">
              <label class="c-input-label">验证码</label>
              <input  type="text" [ngClass]="{'form-valid-error':active && !zmPass}"
                   class="c-input flex" placeholder="请输入验证码" [(ngModel)] = "zmValue"  (keyup)="check()" />
                  <button type="button" mat-raised-button color="accent"  class="ml-4 py-4 zmCurHand" [disabled]="!phonePass || disabled"  (click)="send()">
                      {{btnText}}
                  </button>
          </div>
          <div class="c-input-error">
                <div *ngIf="!zmPass">
                    {{errorMsg}}
                </div>
          </div>      
      
      `,
  styleUrls: ['./regInput.scss']
})
export class ZmRegVCode {
  constructor(private smsMgr: SmsMgr) {}

  btnText:string="获取验证码";
  errorMsg:string="";
  active:boolean=false;
  disabled:boolean = false;

  @Input() phonePass: boolean;
  @Input() phone: string;
  @Input() areaCode: string;

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

    this.valueChecked.emit();
  }



  /**
   * 发送短信验证码点击事件
   *
   */

  public send() {

    let phoneNumber = this.getPhoneNumber();
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

  private getPhoneNumber(){
    let phoneNumber  = AppUtils.trimBlank(this.phone);
    let areaCode = AppUtils.trimBlank(this.areaCode);
    return areaCode+phoneNumber;
  }
}
