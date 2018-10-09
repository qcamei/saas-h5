import {Component, Input, Output, EventEmitter, OnInit} from "@angular/core";
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
  selector:'zm_login_phone',
  template: `
             <div class=" pos-r mg-b-10">
                 <img src="assets/images/icon/phone_hig.png" alt="" class="pos-a"  style="top: 14px;left:13px;z-index:12;">
                 <input  type="text" required placeholder="请输入手机号" class="c-login-input" name="phone" [(ngModel)] = "zmValue" [ngClass]="{'form-valid-error':!zmPassTmp}" (keyup)="checkPhone()">
             </div>
             <div class="c-login-error">
                 <div class="text-danger" *ngIf="!zmPassTmp" >
                     {{errorMsg}}
                 </div>
             </div>
            `,
  styleUrls: ['./loginInput.scss']
})

export class ZmLoginPhone implements OnInit{

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
  public zmPassTmp:boolean;
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

  ngOnInit(){
    if(AppUtils.isNullOrWhiteSpace(this.zmValueTmp)){
      this.zmPassTmp = true;
    }
  }

  public checkPhone() {

    let phone = "";
    if(!AppUtils.isNullOrWhiteSpace(this.zmValueTmp)){
      phone = this.zmValueTmp;
    }

    if(AppUtils.isNullOrWhiteSpace(phone)){
      this.zmPass = false;
      this.errorMsg = "手机号不能为空";
    }else{
        this.zmPass = true;
        this.errorMsg = "";
    }

    //通知外部 value做了检查
    this.valueChecked.emit();
  }
}


