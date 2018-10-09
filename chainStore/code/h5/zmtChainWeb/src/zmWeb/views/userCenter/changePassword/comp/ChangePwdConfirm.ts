import {Component, Input, Output, EventEmitter, OnChanges} from "@angular/core";
import {AppUtils} from "../../../../comModule/AppUtils";
/**
 <change_pwd_confirm [(zmValue)]="viewData.resetFormData.pwdConfirm" [(zmPass)]="viewData.resetFormData.pwdConfirmPass"
 [password] = "viewData.resetFormData.password"  (valueChecked)="viewData.resetFormData.check()" ></change_pwd_confirm>

 */

@Component({
  selector: 'change_pwd_confirm',
  template: `
                 <div class="disFlex align-center">
                   <label class="c-input-label">确认新密码</label>
                    <input type="password" class="c-input" placeholder="请输入6-16位新密码"
                    [(ngModel)] ="zmValue" [ngClass]="{'form-valid-error':active && !zmPass}" (keyup)="check()" />
                 </div>
          
                 <div class="c-input-error">
                      <div *ngIf="!zmPass">
                          {{errorMsg}}
                      </div>
                 </div>    

            `,
  styleUrls: ['./input.scss']

})

export class ChangePwdConfirm implements OnChanges{
  constructor() {
  }

  @Input() password: string;
  @Output() valueChecked: EventEmitter<any> = new EventEmitter();

  errorMsg: string = "";
  active: boolean = false;

  /**
   * zmValue 双向绑定
   */
  private zmValueTmp: string;
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
  private zmPassTmp: boolean;
  @Output() zmPassChange = new EventEmitter();

  @Input()
  get zmPass(): boolean {
    return this.zmPassTmp;
  }

  set zmPass(val: boolean) {
    this.zmPassTmp = val;
    this.zmPassChange.emit(this.zmPassTmp);
  }

  private zmCheckMarkTmp: string;
  //zmCheckMark 不一样的时候做检测，一般是由提交按钮发起的
  @Input()
  get zmCheckMark(): string {
    return this.zmCheckMarkTmp;
  }

  set zmCheckMark(val: string) {
    if (!AppUtils.isNullOrWhiteSpace(val) && val != this.zmCheckMarkTmp) {
      this.zmCheckMarkTmp = val;
      this.check();
    }
  }

  ngOnChanges(){

  }

  public check() {
    this.active = true;
    let confirmpwd = this.zmValueTmp;
    if (AppUtils.isNullOrWhiteSpace(confirmpwd)) {
      this.zmPass = false;
      this.errorMsg = "密码不能为空";
    } else {
      if (!confirmpwd.match(/^\s*([\da-zA-Z]{6,16})\s*$/)) {
        this.zmPass = false;
        this.errorMsg = "密码至少为6-16位数字或字母";
      } else {
        this.zmPass = true;
        this.errorMsg = "";
      }
    }

    if (!AppUtils.isNullOrWhiteSpace(confirmpwd)
      && (!AppUtils.isNullOrWhiteSpace(this.password))) {
      if (confirmpwd != this.password) {
        this.zmPass = false;
        this.errorMsg = "两次密码不一致";
      } else {
        this.zmPass = true;
        this.errorMsg = "";
      }
    }


    //通知外部 value做了检查
    this.valueChecked.emit();
  }


}


