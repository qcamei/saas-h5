import {Output, Component, EventEmitter, OnInit, OnDestroy, Input, OnChanges} from "@angular/core";
import {AppUtils} from "../../../comModule/AppUtils";

/**
 * 折扣输入框公共组件
 * eg:
 <zm-input-discount [label]="'项目折扣'" [placeholder]="'请输入项目折扣'" [(zmValue)]="addFormData.prodDiscount" (onChange)=""></zm-input-discount>
 */
@Component({
  selector:'zm-input-discount',
  template: `
             <mat-form-field class="zmFullWidth" color="accent">
                 <mat-label>{{label}}</mat-label>
                 
                 <input matInput type="number" [placeholder]="placeholder" [(ngModel)] = "zmValue" [maxlength]="maxlength" (blur)="check()"  >
                 <span matSuffix>折</span>
            </mat-form-field>
            `,
  styles:[`
    
  `]
})
export class ZmInputDiscout {

  constructor(){
  }

  @Output() valueChecked:EventEmitter<any> = new EventEmitter();
  @Input() required = true;
  @Input() label="";
  @Input() placeholder="";
  @Input() maxlength = 10;
  @Input() disabled = false;
  @Output() onChange = new EventEmitter();

  errorMsg:string="";
  /**
   * zmvalue 双向绑定
   */
  private zmValueTmp:number = 0;
  @Output() zmValueChange = new EventEmitter();

  @Input()
  get zmValue() {
    return this.zmValueTmp;
  }
  set zmValue(val) {

    this.zmValueTmp = val;
    this.zmValueChange.emit(this.zmValueTmp);

  }

  check() {

    if(!this.zmValue || !AppUtils.isNumber(this.zmValue.toString())) {
      // this.formControl.setValue("0");
      this.zmValue = 0;
    }else{
      let numValue = Number(this.zmValue);
      if(numValue < 0 ){
        numValue = 0;
      }else if(numValue > 10){
        numValue = 10;
      }
      let valueTmp = AppUtils.roundPoint(numValue,1);

      this.zmValue = valueTmp;
      this.onChange.emit(this.zmValue);

    }

    return true;
  }


}
