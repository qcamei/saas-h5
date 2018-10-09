import {Component, Input, Output, EventEmitter, OnInit} from "@angular/core";
import {AppUtils} from "../../../comModule/AppUtils";
/**
 * Created by sunbirdjob on 2018/2/23.
 * 必填文本输入框  maxlength="50"

 <zm-input-text [(zmValue)]="viewData.formData.name"  (valueChecked)="viewData.formData.check()"  [maxlength]="50"></zm-input-text>
 */

@Component({
  selector:'zm-input-period',
  template: `

        <div fxLayout="row" fxLayoutAlign="start center" fxLayoutGap="5px" class="zmFullWidth" >
              <mat-form-field color="accent">
                   <mat-label>{{label}}</mat-label>
                    <input matInput type="text" [placeholder]="placeholder" [(ngModel)] = "zmValue" (blur)="check()" required>
              </mat-form-field>
                
              <mat-form-field color="accent">      
                 <mat-select [(ngModel)]="zmUnit">
                    <mat-option  [value]="1">天</mat-option>
                    <mat-option  [value]="2">月</mat-option>
                    <mat-option  [value]="3">年</mat-option>
                 </mat-select>
              </mat-form-field>
       </div>

            `
})

export class ZmInputPeriod implements OnInit{

  @Input() required = false;
  @Input() label="有效日期";
  @Input() placeholder="请输入有效日期";
  @Input() disabled = false;

  errorMsg:string="";

  /**
   * zmUnit 双向绑定
   */
  private zmUnitTmp:number;
  @Output() zmUnitChange = new EventEmitter();

  @Input()
  get zmUnit() {
    return this.zmUnitTmp;
  }
  set zmUnit(val) {
    this.zmUnitTmp = val;
    this.zmUnitChange.emit(this.zmUnitTmp);
  }

  /**
   * zmvalue 双向绑定
   */
  private zmValueTmp:number;
  @Output() zmValueChange = new EventEmitter();

  @Input()
  get zmValue() {
    return this.zmValueTmp;
  }
  set zmValue(val) {
    this.zmValueTmp = val;
    this.zmValueChange.emit(this.zmValueTmp);
  }

  ngOnInit(){
   if(!this.zmUnit){
     this.zmUnit = 1;
   }

   if(!this.zmValue){
     this.zmValue = 0;
   }

  }

  check() {

    if(!this.zmValue || !AppUtils.isNumber(this.zmValue.toString())) {
      this.zmValue = 0;
    }else{
      let numValue = Number(this.zmValue);
      if(numValue < 0 ){
        numValue = 0;
      }else if(numValue > 999){
        numValue = 999;
      }
      this.zmValue = Math.floor(numValue);
    }

    return true;
  }

}
