import {Component, Input, Output, EventEmitter} from "@angular/core";
import {AppUtils} from "../../../../comModule/AppUtils";
import {BUserMgr} from "../../../../bsModule/buser/BUserMgr";
/**
 <zm_reg_input_phone [(zmValue)]="viewData.formData.phone" [(zmPass)]="viewData.formData.phonePass"  (valueChecked)="viewData.formData.check()" ></zm_reg_input_phone>

 */

@Component({
  selector: 'zm_reg_input_phone',
  template: `
                 <div class="box disFlex align-center">
                  <label class="c-input-label">手机号</label>
                  <ng-content></ng-content>
                  <input type="text" style="border-top-left-radius: 0; border-bottom-left-radius: 0;" [ngClass]="{'form-valid-error':active && !zmPass}"  placeholder="请输入手机号" class="c-input" [(ngModel)] = "zmValue" (mouseleave)="check()">
                 </div>
                 <div class="c-input-error">
                      <div *ngIf="!zmPass">
                          {{errorMsg}}
                      </div>
                 </div>         
            `,
  styleUrls: ['./regInput.scss'],

})

export class ZmRegInputPhone {
  constructor(private buserMgr: BUserMgr) {
  }

  @Input() areaCode:string;
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
      let regExp = this.getRegExp();
      let b = regExp.test(phone);
      if (b == false) {
        this.zmPass = false;
        this.errorMsg = "手机号格式错误";
      } else {
        let buser = await this.buserMgr.findByPhone(AppUtils.trimBlank(phone));
        if (!AppUtils.isNullObj(buser)) {
          this.zmPass = false;
          this.errorMsg = "手机号已注册，请直接登录";
        } else {
          this.zmPass = true;
          this.errorMsg = "";
        }

      }


    }

    //通知外部 value做了检查
    this.valueChecked.emit();
  }

  private getRegExp() {
    let regExp = null;
    switch (this.areaCode) {
      case "+61"://澳大利亚
        regExp = new RegExp("^\\s*\\d{9,10}\\s*$");
        break;
      case "+1"://加拿大 美国
        regExp = new RegExp("^\\s*\\d{10}\\s*$");
        break;
      case "+886"://台湾
        regExp = new RegExp("^\\s*\\d{10}\\s*$");
        break;
      case "+863"://澳门
        regExp = new RegExp("^\\s*\\d{8}\\s*$");
        break;
      case "+852"://香港
        regExp = new RegExp("^\\s*\\d{8}\\s*$");
        break;
      case "+64"://新西兰
        regExp = new RegExp("^\\s*\\d{5,10}\\s*$");
        break;
      default:
        regExp = new RegExp("^\\s*[1][1-9]\\d{9}\\s*$");
        break;
    }
    return regExp;
  }
}


