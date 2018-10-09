import {Component, Input, Output, EventEmitter} from "@angular/core";
import {AppUtils} from "../../../../comModule/AppUtils";
/**
 <change_pwd_phone [(zmValue)]="viewData.resetFormData.phone" [(zmPass)]="viewData.resetFormData.phonePass"
 (valueChecked)="viewData.resetFormData.check()"></change_pwd_phone>

 */

@Component({
  selector: 'change_pwd_phone',
  template: `
                 <div class="box disFlex align-center">
                  <label class="c-input-label">手机号</label>
                  <ng-content></ng-content>
                  <input type="text" readonly style="border-top-left-radius: 0; border-bottom-left-radius: 0;" [ngClass]="{'form-valid-error':active && !zmPass}"  placeholder="请输入手机号" class="c-input" [(ngModel)] = "zmValue" (mouseleave)="check()">
                 </div>
                 <div class="c-input-error">
                      <div *ngIf="!zmPass">
                          {{errorMsg}}
                      </div>
                 </div>         
            `,
  styleUrls: ['./input.scss'],

})

export class ChangePwdPhone {
  constructor() {
  }

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

  public async check() {
    this.active = true;
    let phone = "";
    if (!AppUtils.isNullOrWhiteSpace(this.zmValueTmp)) {
      phone = this.zmValueTmp;
    }
    if (AppUtils.isNullOrWhiteSpace(phone)) {
      this.zmPass = false;
      this.errorMsg = "手机号不能为空";
    } else {
      let regExp = new RegExp("^\\s*[1][1-9]\\d{9}$|^([6|9])\\d{7}$|^[0][9]\\d{8}$|^[6]([8|6])\\d{5}\\s*$");
      let b = regExp.test(phone);
      if (b == false) {
        this.zmPass = false;
        this.errorMsg = "手机号格式错误";
      } else {
        this.zmPass = true;
        this.errorMsg = "";
      }
    }

    //通知外部 value做了检查
    this.valueChecked.emit();
  }
}


