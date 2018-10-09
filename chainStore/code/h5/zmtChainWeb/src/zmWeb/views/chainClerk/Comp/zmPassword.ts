import {Component, Input, Output, EventEmitter, OnInit} from "@angular/core";
import {FormControl} from "@angular/forms";
import {AppUtils} from "../../../comModule/AppUtils";
import {FormControlUtil} from "../../zmComp/form/FormControlUtil";
/**
 * Created by sunbirdjob on 2018/2/23.
 * 必填文本输入框  maxlength="50"

 <zm-password label="默认密码" [placeholder]="getPlaceholder('buserIds','请选择跟进人员')" [(zmValue)]="viewData.choosedClerkName"  (valueChecked)="onValueChecked()"></zm-password>
 */

@Component({
  selector: 'zm-password',
  template: `
            <mat-form-field class="zmFullWidth" color="accent" >
                 <mat-label>{{label}}</mat-label>
                 
                 <span matPrefix *ngIf="prefix">{{prefix}}</span>
                 
                 <input matInput type="password" required maxlength ="16" [placeholder]="placeholder"    [formControl]="formControl"  >
                 
                 <span matSuffix *ngIf="suffix">{{suffix}}</span>
               
                 <mat-error *ngIf="!zmPass">
                  {{errorMsg}}
                 </mat-error>
            </mat-form-field>

            `
})

export class ZmPassword implements OnInit {

  @Output() valueChecked: EventEmitter<any> = new EventEmitter();
  @Input() label = "";
  @Input() placeholder = "";
  @Input() disabled = false;
  @Input() prefix: string;
  @Input() suffix: string;

  errorMsg: string = "";

  formControl: FormControl;

  ngOnInit() {
    let validator = FormControlUtil.newValiator(this.check.bind(this), this.zmValueChange, this.valueChecked);
    this.formControl = new FormControl(
      {value: this.valueTmp, disabled: this.disabled},
      [
        validator()
      ]);
  }

  /**
   * zmvalue 双向绑定
   */
  @Output() zmValueChange = new EventEmitter();
  private valueTmp;

  @Input()
  set zmValue(val) {
    if (this.formControl && this.formControl.value != val) {
      this.formControl.setValue(val);
    } else {
      this.valueTmp = val;
    }
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

  public check(password) {

    if (AppUtils.isNullOrWhiteSpace(password)) {
      this.errorMsg = this.label + "不能为空 ";
    }else{
      if(password.match(/^\s*([\da-zA-Z]{6,16})\s*$/)){
        this.errorMsg = "";
      }else{
        this.errorMsg = "密码至少为6-16位数字或字母";
      }
    }
    this.zmPass = AppUtils.isNullOrWhiteSpace(this.errorMsg);
    return this.zmPass;
  }

}
