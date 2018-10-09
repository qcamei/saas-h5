import {Component, Input, Output, EventEmitter} from "@angular/core";
/**
 <zm-input-phone [(zmValue)]="viewData.formData.phone" [(zmPass)]="viewData.formData.phonePass"
 (valueChecked)="viewData.formData.check()" [required]="true"></zm-input-phone>

 */

@Component({
  selector:'zm-input-tel',
  template: `

            <zm-input-text [label]="label" [placeholder]="placeholder" [required]="required" [disabled]="disabled" [maxlength]="20" hint="格式:010-12345678"
                      [(zmValue)]="zmValue" [(zmPass)]="zmPass" [checkFun]="check.bind(this)" ></zm-input-text>

            `,

})

export class ZmInputTel{


  @Output() valueChecked:EventEmitter<any> = new EventEmitter();
  @Input() required = true;
  @Input() label="电话";
  @Input() placeholder="请输入电话号码";
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

  public check(value) {
    let errorMsg="";

    let regExp = new RegExp("^(0\\d{2,3}-\\d{7,8}(-\\d{3,5}){0,1})|(((13[0-9])|(15([0-3]|[5-9]))|(18[0,5-9]))\\d{8})$");
    let match = regExp.test(value);

    if (!match) {
      errorMsg = this.label+"格式错误,格式参考：010-12345678.";
    }
    return errorMsg;
  }
}

