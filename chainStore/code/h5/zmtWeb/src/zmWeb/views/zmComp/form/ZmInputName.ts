import {Component, Input, Output, EventEmitter} from "@angular/core";
import {AppUtils} from "../../../comModule/AppUtils";
import {FormControl, Validators, ValidatorFn, AbstractControl} from "@angular/forms";
import {FormControlUtil} from "./FormControlUtil";
/**
 * Created by helen on 2018/2/28.
 * 电话号码输入框  支持港澳台
 *
 <zm-input-name label="项目名称" placeholder="请输入项目名称" maxlength="15"
 [(zmValue)]="viewData.productDetail.name" [(zmPass)]="viewData.productDetail.namePass"></zm-input-name>

 */

@Component({
  selector:'zm-input-name',
  template: `
            
            <zm-input-text [label]="label" [placeholder]="placeholder" [required]="required" [disabled]="disabled" [maxlength]="maxlength"
                            [(zmValue)]="zmValue" [(zmPass)]="zmPass" (valueChecked)="onValueCheck()"></zm-input-text>

            `,

})

export class ZmInputName{


  @Output() valueChecked:EventEmitter<any> = new EventEmitter();
  @Input() required = true;
  @Input() label="姓名";
  @Input() placeholder="请输入姓名";
  @Input() disabled:boolean = false;
  @Input() maxlength = 10;

 /**
   * zmvalue 双向绑定
   */
  @Output() zmValueChange = new EventEmitter();
  private valueTmp;
  @Input()
  get zmValue():boolean {
    return this.valueTmp;
  }
  set zmValue(val) {
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

  public onValueCheck(){
    // this.valueChecked.emit(null);
    this.check();
  }

  check(){
    this.valueTmp?this.zmPass = true:this.zmPass = false;
  }


}



