import {Component, Input, Output, EventEmitter} from "@angular/core";
/**
 * Created by helen on 2018/2/28.
 * 登录电话号码输入框  支持港澳台
 * <zm_input_phone [(zmValue)]="target.value"></zm_input_phone>
 */

@Component({
  selector:'zm_login_phone',
  template: `
             <div class="input-group  form-group pos-r">
                 <img src="assets/images/icon/phone_hig.png" alt="" class="pos-a"  style="top: 14px;left:13px;z-index:12;">
                 <input  type="text" required placeholder="请输入手机号" class="c-login-input" name="phone" #phone="ngModel" [(ngModel)] = "zmValue"
                      pattern="^\\s*[1][1-9]\\d{9}$|^([6|9])\\d{7}$|^[0][9]\\d{8}$|^[6]([8|6])\\d{5}\\s*$"
                       [ngClass]="{'form-valid-error':phone.invalid && (phone.touched)}">
             </div>
             <div  class="c-login-error">
                 <div class="text-danger" *ngIf="phone.invalid && (phone.touched)" >
                     <div  *ngIf="phone.errors.required">
                          手机号不能为空
                     </div>
                     <div *ngIf="phone.errors.pattern">
                          手机号格式错误!
                     </div>
                 </div>
             </div>
            `,
  styles:[`
  .c-login-input{
      width: 100%;
      border: none !important;
      color:#000;
      font-size: 16px;
      height: 48px;
      border-radius: 0.375rem;
      border-width: 2px;
      padding-left: 40px;
      background-color: #ffffff;
    }
`]

})

export class ZmLoginPhone{

  @Output() zmValueChange = new EventEmitter();
  private valueTmp:string;

  @Input()
  get zmValue() {
    return this.valueTmp;
  }
  set zmValue(val) {
    this.valueTmp = val;
    this.zmValueChange.emit(this.valueTmp);
  }

  constructor(){

  }


}
