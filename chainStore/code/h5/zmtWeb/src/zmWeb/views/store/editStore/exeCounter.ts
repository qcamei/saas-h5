// import {Component, Input, forwardRef, SimpleChanges} from '@angular/core';
// import {
//   ControlValueAccessor, NG_VALUE_ACCESSOR, ValidatorFn, AbstractControl, ValidationErrors,
//   NG_VALIDATORS, Validator
// } from '@angular/forms';
//
// export const EXE_COUNTER_VALUE_ACCESSOR: any = {
//   provide: NG_VALUE_ACCESSOR,
//   useExisting: forwardRef(() => CounterComponent),
//   multi: true
// }
//
// //定义验证器
// export const validateCounterRange: ValidatorFn = (control: AbstractControl):ValidationErrors => {
//   return (control.value > 10 || control.value < 0) ?
//     { 'rangeError': { current: control.value, max: 10, min: 0 } } : null;
// }
//
// //注册验证器
// export const EXE_COUNTER_VALIDATOR1 = {
//   provide: NG_VALIDATORS,
//   useValue: validateCounterRange,
//   multi: true
// }
//
// export function createCounterRangeValidator(maxValue: number, minValue: number) {
//   return (control: AbstractControl): ValidationErrors => {
//     return (control.value > +maxValue || control.value < +minValue) ?
//       { 'rangeError': { current: control.value, max: maxValue, min: minValue } }
//       : null;
//   }
// }
//
// export const EXE_COUNTER_VALIDATOR = {
//   provide: NG_VALIDATORS,
//   useExisting: forwardRef(() => CounterComponent),
//   multi: true
// }
//
//
// /**
//  * 页面
//  <form #form="ngForm">
//  <exe-counter name="counter1" #counter1="ngModel" [(ngModel)]="counter" [counterRangeMin]="0" [counterRangeMax]="5"></exe-counter>
//  </form>
//  <p *ngIf="counter1.invalid">{{counter1.errors | json}}</p>
//  <pre>{{ form.value | json }}</pre>
//  *
//  */
// @Component({
//   selector: 'exe-counter',
//   template: `
//       <p>当前值: {{ count }}</p>
//       <button (click)="increment()"> + </button>
//       <button (click)="decrement()"> - </button>
//     `,
//   providers: [EXE_COUNTER_VALUE_ACCESSOR,EXE_COUNTER_VALIDATOR],
// })
// export class CounterComponent implements ControlValueAccessor,Validator {
//
//   @Input() _count: number = 0;
//   @Input() counterRangeMin: number; // 设置数据有效范围的最大值
//   @Input() counterRangeMax: number; // 设置数据有效范围的最小值
//
//   private propagateChange = (_: any) => { };
//   private _validator: ValidatorFn;
//
//   get count() {
//     return this._count;
//   }
//
//   set count(value: number) {
//     this._count = value;
//     this.propagateChange(this._count);
//   }
//
//   writeValue(value: any) {
//     if (value !== undefined) {
//       this.count = value;
//     }
//   }
//
//   registerOnChange(fn: any) {
//     this.propagateChange = fn;
//   }
//
//   registerOnTouched(fn: any) { }
//
//   increment() {
//     this.count++;
//   }
//
//   decrement() {
//     this.count--;
//   }
//
//   registerOnValidatorChange(fn: () => void): void {
//
//   }
//
//   // 监听输入属性变化，调用内部的_createValidator()方法，创建RangeValidator
//   ngOnChanges(changes: SimpleChanges): void {
//     if ('counterRangeMin' in changes || 'counterRangeMax' in changes) {
//       this._createValidator();
//     }
//   }
//
//   // 动态创建RangeValidator
//   private _createValidator(): void {
//     this._validator = createCounterRangeValidator(this.counterRangeMax,
//       this.counterRangeMin);
//   }
//
//   // 执行控件验证
//   validate(c: AbstractControl): ValidationErrors | null {
//     return this.counterRangeMin == null || this.counterRangeMax == null ?
//       null : this._validator(c);
//   }
// }
//
