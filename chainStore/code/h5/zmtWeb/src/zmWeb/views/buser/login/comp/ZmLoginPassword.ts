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
  selector:'zm_login_password',
  template: `
             <div class="pos-r mg-b-10">
                 <img src="assets/images/icon/password_hig.png" alt="" class="pos-a" style="top: 14px;left:13px;z-index:12;">
                 <input type="password" class="c-input-default" placeholder="请输入密码" [(ngModel)]="zmValue" (keyup)="checkPassword()"/>
             </div>
             <div class="c-input-error">
                 <div class="text-danger"  *ngIf="!zmPass">
                     {{this.errorMsg}}
                 </div>
             </div>
            `,
  styleUrls: ['./loginInput.scss']
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

  checkPassword(){
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
