import {Component, Input, Output, EventEmitter, OnInit} from "@angular/core";
import {FormControl, ValidatorFn, AbstractControl} from "@angular/forms";
import {AppUtils} from "../../../comModule/AppUtils";
import {FormControlUtil} from "./FormControlUtil";
/**
 * Created by sunbirdjob on 2018/2/23.
 * 必填文本输入框  maxlength="50"

 <zm-input-float label="跟进人员" [placeholder]="getPlaceholder('buserIds','请选择跟进人员')" [(zmValue)]="viewData.choosedClerkName"  (valueChecked)="onValueChecked()"></zm-input-float>
 */

@Component({
  selector:'zm-input-float',
  template: `
            <mat-form-field class="zmFullWidth" color="accent">
                 <mat-label>{{label}}</mat-label>
                 
                 <span matPrefix *ngIf="prefix">{{prefix}}</span>
                 
                 <input matInput type="number" [placeholder]="placeholder"  [formControl]="formControl" required *ngIf="required">
                 <input matInput type="number" [placeholder]="placeholder"  [formControl]="formControl"  *ngIf="!required">
                 
                 <span matSuffix *ngIf="suffix">{{suffix}}</span>
                 <mat-hint *ngIf="hint">{{hint}}</mat-hint>
               
                 <mat-error *ngIf="!zmPass">
                  {{errorMsg}}
                 </mat-error>
            </mat-form-field>

            `
})

export class ZmInputFloat implements OnInit{

  @Output() valueChecked:EventEmitter<any> = new EventEmitter();
  @Input() required = false;
  @Input() label="";
  @Input() placeholder="";
  @Input() disabled = false;
  @Input() prefix:string;
  @Input() suffix:string;
  @Input() hint:string;
  @Input() checkFun;

  errorMsg:string="";

  formControl:FormControl;
  ngOnInit(){
    let validator = FormControlUtil.newValiator(this.check.bind(this), this.zmValueChange,this.valueChecked);
    this.formControl = new FormControl(
      {value:this.valueTmp,disabled: this.disabled},
      [
        validator()
      ]);
  }
  /**
   * zmvalue 双向绑定
   */
  @Output() zmValueChange = new EventEmitter();
  private valueTmp:number;
  @Input()
  set zmValue(val:number) {
    if(this.formControl && this.formControl.value != val){
      this.formControl.setValue(val);
    }else{
      this.valueTmp = val;
    }
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

  public check(name) {
    this.errorMsg = this.checkFun(name);
    this.zmPass = AppUtils.isNullOrWhiteSpace(this.errorMsg);
    return this.zmPass;
  }

}
