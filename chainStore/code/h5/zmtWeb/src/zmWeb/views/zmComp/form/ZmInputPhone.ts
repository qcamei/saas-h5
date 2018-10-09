import {Component, Input, Output, EventEmitter} from "@angular/core";

/**
 <zm-input-phone [(zmValue)]="viewData.formData.phone" [(zmPass)]="viewData.formData.phonePass"
 (valueChecked)="viewData.formData.check()" [required]="true"></zm-input-phone>

 */

@Component({
  selector:'zm-input-phone',
  template: `
              
             <zm-input-text [label]="label" [placeholder]="placeholder" [required]="required" [disabled]="disabled" [maxlength]="11"
                      [(zmValue)]="zmValue" [(zmPass)]="zmPass" [checkFun]="check.bind(this)"  (valueChecked)="onValueCheck()"></zm-input-text>

            `,

})

export class ZmInputPhone{


  @Output() valueChecked:EventEmitter<any> = new EventEmitter();
  @Input() required = true;
  @Input() label="手机号";
  @Input() placeholder="请输入手机号";
  @Input() disabled = false;

  /**
   * zmvalue 双向绑定
   */
  @Output() zmValueChange = new EventEmitter();
  private valueTmp;
  @Input()
  get zmValue():boolean {
    return this.valueTmp;
  }
  set zmValue(val:boolean) {
    this.valueTmp = val;
    this.zmValueChange.emit(this.valueTmp);
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

  public check(phone) {
    let errorMsg="";

    // let regExp = new RegExp("^\\s*[1][1-9]\\d{9}$|^([6|9])\\d{7}$|^[0][9]\\d{8}$|^[6]([8|6])\\d{5}\\s*$");
    let regExp = /(^[1][1-9]\d{9}$)|(^\d{5,10}$)/;

    let match = regExp.test(phone);

    if (!match) {
      this.zmPass = false;
      errorMsg = "手机号格式错误";
    }else{
      this.zmPass = true;
    }
    return errorMsg;
  }

  public onValueCheck(){
    this.valueChecked.emit(null);
  }
}

