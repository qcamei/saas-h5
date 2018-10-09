import {Component, Input, forwardRef, SimpleChanges, Output, EventEmitter, OnInit} from '@angular/core';
import {
  ControlValueAccessor, NG_VALUE_ACCESSOR, ValidatorFn, AbstractControl, ValidationErrors,
  NG_VALIDATORS, Validator
} from '@angular/forms';
import {AppUtils} from "../../../comModule/AppUtils";

const PRICE_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => ZmFormPrice),
  multi: true
}

const PRICE_VALIDATOR = {
  provide: NG_VALIDATORS,
  useExisting: forwardRef(() => ZmFormPrice),
  multi: true
}

function createValidator(minValue: number,maxValue: number) {
  return (control: AbstractControl): ValidationErrors => {
    return (control.value > +maxValue || control.value < +minValue) ?
      { 'error': { current: control.value, min: minValue, max: maxValue} }
      : null;
  }
}


/**
 * 页面
 <form #form="ngForm">
 <zm-form-price name="price" #price="ngModel" [(ngModel)]="zmValue" [label]="'售价'" [minValue]="0" [maxValue]="5"></zm-form-price>
 <mat-error *ngIf="price.invalid">
 {{price.errors | json}}
 </mat-error>
 </form>

 <form [formGroup]="ngForm">
 <zm-form-price formControlName="price" [label]="'售价'"></zm-form-price>
 <mat-error *ngIf="ngForm.get('price').errors">
 {{ngForm.get('price').errors | json}}
 </mat-error>
 </form>
 <pre>{{ ngForm.value | json }}</pre>
 <zm-btn-large [disabled]="ngForm.invalid" name="保存"></zm-btn-large>
 *
 */
@Component({
  selector: 'zm-form-price',
  template: `
            <mat-form-field class="zmFullWidth" color="accent">
                 <mat-label>{{label}}</mat-label>
                 <input matInput type="number" [placeholder]="placeholder" [(ngModel)]="zmValue" required *ngIf="required">
                 <input matInput type="number" [placeholder]="placeholder" [(ngModel)]="zmValue" *ngIf="!required">
                 <span matSuffix>￥</span>
            </mat-form-field>
    `,
  providers: [PRICE_VALUE_ACCESSOR,PRICE_VALIDATOR],
})
export class ZmFormPrice implements OnInit,ControlValueAccessor,Validator {

  @Input() label:string="";
  @Input() placeholder:string="";
  @Input() disabled:boolean=false;
  @Input() required:boolean=true;
  @Input() minValue:number=0;
  @Input() maxValue:number=99999999;
  @Output() zmValueChange = new EventEmitter();

  get zmValue() {
    return this.zmValueTmp;
  }

  set zmValue(val) {
    this.zmValueTmp = val;
    this.onChange(this.zmValueTmp);
    this.zmValueChange.emit(this.zmValueTmp);
  }

  private zmValueTmp:number;
  private onChange = (_: any) => {};
  private _validator: ValidatorFn;


  ngOnInit(): void {

    if((this.minValue || this.maxValue) && (this.minValue < this.maxValue)){
      this._createValidator();
    }
  }

  /*******************************表单绑定*****************************************/
  /**
   * 模板 => 视图
   * @param value
   */
  writeValue(value: any) {
    if (value) {
      this.zmValueTmp = value;
    }
  }

  /**
   * 视图 => 模板回调
   * @param fn
   */
  registerOnChange(fn: any) {
    this.onChange = fn;
  }

  /**
   * touch监听
   * @param fn
   */
  registerOnTouched(fn: any) {

  }

  /************************************验证*********************************************/
  /**
   * 创建Validator
   * @private
   */
  private _createValidator(): void {
    this._validator = createValidator(this.minValue,this.maxValue);
  }

  /**
   * 验证
   * @param control
   * @returns {ValidationErrors|null}
   */
  validate(control: AbstractControl): ValidationErrors | null {
    return this.required ? (!AppUtils.isNullObj(control.value)&&!AppUtils.isNullOrWhiteSpace(control.value) ? this._validator(control):{'error':this.label+'不能为空'}) : this._validator(control);
  }

}

